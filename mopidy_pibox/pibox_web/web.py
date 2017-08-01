from __future__ import absolute_import, unicode_literals

import os

import tornado.web

import spotify

from mopidy.core import PlaybackState

class SearchHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def post(self):
        search_term = self.get_body_argument("query")
        search_result = self.core.library.search(any=[search_term], uris=['spotify:']).get()
        self.render("tracks.html", search_result=search_result, search_term=search_term)

class MainHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        playing = self.core.playback.get_current_track().get()
        if playing is not None:
            artists = list(playing.artists)
            artist = artists[len(artists)-1].name
        else:
            artist = 'EMPTY'
        queue = self.core.tracklist.slice(1, 4).get()
        self.render("search.html", playing=playing, queue=queue, artist=artist)

class AddTrackHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        uri = self.get_argument("uri", None)
        new_position = self.core.tracklist.length.get()
        self.core.tracklist.set_consume(True)
        self.core.tracklist.set_repeat(False)
        self.core.tracklist.add(uri=uri, at_position=new_position)
        redirect_url = '/pibox/'
        self.redirect(url=redirect_url)

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


# def play_song(core):
#     list_of_uris = []
#     uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
#     list_of_uris.append(uri)
#     list_of_uris.append(uri)
#     core.tracklist.add(list_of_uris)
#     core.playback.next()
#     core.playback.play()
