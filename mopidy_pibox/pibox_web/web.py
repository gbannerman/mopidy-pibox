from __future__ import absolute_import, unicode_literals

import os

import tornado.web

from mopidy import audio, backend as backend_api, models, ext

import spotify

from mopidy_spotify import backend, playback

class MyRequestHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        self.write(
            'Hello, world! This is Mopidy %s' %
            self.core.get_version().get())
        play_song()

def play_song():
    list_of_tracks = []
    uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
    list_of_uris.append(uri)
    self.core.tracklist.add(list_of_uris)
    self.core.playback.next()
