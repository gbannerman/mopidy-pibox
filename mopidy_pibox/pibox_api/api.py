from __future__ import absolute_import, unicode_literals

import os

import pykka

import tornado.web

import logging

from mopidy.core import PlaybackState
from mopidy_pibox import frontend


class VoteHandler(tornado.web.RequestHandler):
    def initialize(self, core, session):
        self.core = core
        self.session = session

    def post(self):
        logger = logging.getLogger(__name__)
        logger.info("Hit endpoint")
        logger.info(self.request)
        logger.info(self.request.body)
        uri = self.get_argument("uri")
        logger.info("got uri")
        usersWhoVoted = self.session.has_voted.get(uri, [])
        logger.info("got users who voted")

        fingerprint = self.get_argument("fingerprint")

        logger.info("uri: " + uri + " , fingerprint: " + fingerprint)

        if fingerprint in usersWhoVoted:
            self.set_status(400)
            response = { 'message': "User has already voted to skip this track" }
        else:
            usersWhoVoted.append(fingerprint)
            self.session.has_voted[uri] = usersWhoVoted
            vote_count = self.session.votes.get(uri, 0) + 1
            self.session.votes[uri] = vote_count
            if vote_count >= 2:
                self.core.tracklist.remove({'uri': [uri]})
                self.session.blacklist.append(uri)
            response = { 'uri': uri, 'votes': vote_count }
            self.set_status(200)
        self.write(response)

# class MainHandler(tornado.web.RequestHandler):
#     def initialize(self, core):
#         self.core = core

#     def get(self):
#         playing = self.core.playback.get_current_track().get()
#         if playing is not None:
#             image = self.core.library.get_images([playing.uri]).get()[playing.uri][0]
#         else:
#             image = None
#         queue = self.core.tracklist.slice(1, 4).get()
#         self.render("search.html", playing=playing, queue=queue, image=image)

# class AddTrackHandler(tornado.web.RequestHandler):
#     def initialize(self, core, session):
#         self.core = core
#         self.session = session

#     def get(self):
#         uri = self.get_argument("uri", None)
#         new_position = self.core.tracklist.length.get()
#         redirect_url = '/pibox/invalid/'
#         if not (self.played_already(uri, self.core) or self.in_tracklist(uri, self.core) or self.in_blacklist(self.session, uri)):
#             self.core.tracklist.add(uri=uri, at_position=new_position)
#             redirect_url = '/pibox/'
#         self.redirect(url=redirect_url)

#     def played_already(self, uri, core):
#         history = self.core.history.get_history().get()
#         played_tracks = []
#         for tup in history:
#             played_tracks.append(tup[1].uri)
#         return uri in played_tracks

#     def in_tracklist(self, uri, core):
#         length = len(self.core.tracklist.filter({'uri': [uri]}).get())
#         if length == 0:
#             return False
#         else:
#             return True

#     def in_blacklist(self, session, uri):
#         return uri in self.session.blacklist

# class StartHandler(tornado.web.RequestHandler):
#     def initialize(self, core, config):
#         self.config = config
#         self.core = core
#         self.application.settings['cookie_secret'] = self.config['pibox']['cookie_secret']
#         self.application.settings['login_url'] = '/login/'

#     def get(self):
#         if (self.core.playback.state.get() == PlaybackState.PLAYING):
#             self.core.playback.pause()
#         else:
#             self.core.tracklist.set_consume(True)
#             self.core.tracklist.set_repeat(False)
#             self.core.playback.play()
#         redirect_url = '/pibox/'
#         self.redirect(url=redirect_url)

# class HistoryHandler(tornado.web.RequestHandler):
#     def initialize(self, core, session):
#         self.core = core
#         self.session = session

#     def get(self):
#         history = self.core.history.get_history().get()
#         tracks_played = []
#         for tup in history:
#             tracks_played.append(tup[1].uri)
#         self.render("history.html", history=tracks_played)

# class VoteHandler(tornado.web.RequestHandler):
#     def initialize(self, core, session):
#         self.core = core
#         self.session = session

#     def get(self):
#         uri = self.get_argument("uri", None)
#         vote_count = self.session.votes.get(uri, 0) + 1
#         self.session.votes[uri] = vote_count
#         if vote_count >= 2:
#             self.core.tracklist.remove({'uri': [uri]})
#             self.session.blacklist.append(uri)
#         redirect_url = '/pibox/'
#         self.redirect(url=redirect_url)

# class PlaylistHandler(tornado.web.RequestHandler):
#     def initialize(self, core, session):
#         self.core = core
#         self.session = session

#     def get(self):
#         playlists = self.core.playlists.as_list().get()
#         self.render("playlists.html", playlists=playlists)

# class ChangePlaylistHandler(tornado.web.RequestHandler):
#     def initialize(self, core):
#         self.core = core

#     def get(self):
#         new_playlist = self.get_argument("uri", None)
#         actors = pykka.ActorRegistry.get_by_class(frontend.PiboxFrontend)
#         for actor_ref in actors:
#             actor_ref.tell({'playlist': new_playlist})
#         redirect_url = '/pibox/'
#         self.redirect(url=redirect_url)
        

# class PageHandler(tornado.web.RequestHandler):
#     def initialize(self, page):
#         self.page = page

#     def get(self):
#         self.render(self.page)

        