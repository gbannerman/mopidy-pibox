from __future__ import absolute_import, unicode_literals

import os

import tornado.web

import spotify

from mopidy.core import PlaybackState

class SearchHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def post(self):
        query = self.get_body_argument("query")
        search_terms = query.split()
        search_result = self.core.library.search({'any': search_terms}, uris=['spotify:']).get()
        self.render("tracks.html", search_result=search_result, search_term=query)

class MainHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        playing = self.core.playback.get_current_track().get()
        if playing is not None:
            image = self.core.library.get_images([playing.uri]).get()[playing.uri][0]
        else:
            image = None
        queue = self.core.tracklist.slice(1, 4).get()
        self.render("search.html", playing=playing, queue=queue, image=image)

class AddTrackHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        uri = self.get_argument("uri", None)
        new_position = self.core.tracklist.length.get()
        self.core.tracklist.set_consume(True)
        self.core.tracklist.set_repeat(False)
        redirect_url = '/goooooogle/'
        if not (played_already(uri) or in_tracklist(uri)):
            self.core.tracklist.add(uri=uri, at_position=new_position)
            redirect_url = '/pibox/'
        self.redirect(url=redirect_url)

    def played_already(self, uri):
        history = self.core.history.get_history().get()
        played_tracks = []
        for tup in history:
            played_tracks.append(tup[1].uri)
        return uri in played_tracks

    def in_tracklist(self, uri):
        length = self.core.tracklist.filter({'uri': [uri]}).get()
        if length == 0:
            return False
        else:
            return True


class StartHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        if (self.core.playback.state.get() == PlaybackState.PLAYING):
            self.core.playback.pause()
        else:
            self.core.playback.play()
        redirect_url = '/pibox/'
        self.redirect(url=redirect_url)

class HistoryHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        history = self.core.history.get_history().get()
        tracks_played = []
        for tup in history:
            tracks_played.append(tup[1].uri)
        self.render("history.html", history=tracks_played)
