from __future__ import absolute_import, unicode_literals

import os
import pykka
import json

import tornado.web

import logging

from mopidy.models import ModelJSONEncoder
from mopidy_pibox import frontend
from . import socket
from .session import PiboxSession


class TracklistHandler(tornado.web.RequestHandler):

    def initialize(self, core, session):
        self.core = core
        self.session = session
        self.logger = logging.getLogger(__name__)

    def get(self):
        fingerprint = self.request.headers['pibox-fingerprint']
        tracklist = []
        for track in self.core.tracklist.get_tracks().get():
            has_voted = fingerprint in self.session.has_voted.get(track.uri, [])
            tracklist.append({'info': track, 'votes': self.session.votes.get(track.uri, 0), 'voted': has_voted})
        self.set_header('Content-Type', 'application/json')
        self.write(json.dumps({'tracklist': tracklist}, cls=ModelJSONEncoder))


class VoteHandler(tornado.web.RequestHandler):
    def initialize(self, core, session):
        self.core = core
        self.session = session
        self.logger = logging.getLogger(__name__)

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        fingerprint = self.request.headers['pibox-fingerprint']
        uri = data["uri"]
        users_who_voted = self.session.has_voted.get(uri, [])

        if fingerprint in users_who_voted:
            self.set_status(400)
            response = { 
                'code': '15',
                'title': 'Voted Already',
                'message': 'User has already used their 1 vote to skip on this track'
            }
            self.write(response)
        else:
            users_who_voted.append(fingerprint)
            self.session.has_voted[uri] = users_who_voted
            vote_count = self.session.votes.get(uri, 0) + 1
            self.session.votes[uri] = vote_count
            tl_tracks = self.core.tracklist.filter({'uri': [uri]}).get()
            tracklist_index = self.core.tracklist.index(tl_tracks[0]).get()
            socket.PiboxWebSocket.send('NEW_VOTE', {'votes': vote_count, 'threshold': self.session.skip_threshold, 'uri': uri, 'tracklistIndex': tracklist_index})
            if vote_count >= self.session.skip_threshold:
                self.core.tracklist.remove({'uri': [uri]})
                del self.session.votes[uri]
                del self.session.has_voted[uri]
                self.session.blacklist.append(uri)
                actors = pykka.ActorRegistry.get_by_class(frontend.PiboxFrontend)
                for actor_ref in actors:
                    actor_ref.tell({'action': 'UPDATE_BLACKLIST', 'payload': self.session.blacklist})
            self.set_status(200)


class SessionHandler(tornado.web.RequestHandler):
    def initialize(self, core, session):
        self.core = core
        self.session = session
        self.logger = logging.getLogger(__name__)

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        skip_threshold = data["skipThreshold"]
        playlist = data["playlist"]

        actors = pykka.ActorRegistry.get_by_class(frontend.PiboxFrontend)
        for actor_ref in actors:
            actor_ref.tell({'action': 'UPDATE_SESSION_PLAYLIST', 'payload': playlist})

        self.session.playlist = playlist
        self.logger.debug(type(skip_threshold)) 
        self.session.skip_threshold = int(skip_threshold)
        self.logger.debug(type(self.session.skip_threshold))
        self.session.start()
        socket.PiboxWebSocket.send('SESSION_STARTED', { 'started': self.session.started, 'startTime': self.session.start_time, 'skipThreshold': self.session.skip_threshold, 'playlist': self.session.playlist })
        self.set_status(200)

    def get(self):
        response = { 'started': self.session.started, 'startTime': self.session.start_time, 'skipThreshold': self.session.skip_threshold, 'playlist': self.session.playlist }
        self.write(response)
    
    def delete(self):
        self.core.playback.stop()
        self.core.tracklist.clear()
        
        actors = pykka.ActorRegistry.get_by_class(frontend.PiboxFrontend)
        for actor_ref in actors:
            actor_ref.tell({'action': 'END_SESSION'})

        self.session.reset()
        socket.PiboxWebSocket.send('SESSION_ENDED', {})
        self.set_status(200)


