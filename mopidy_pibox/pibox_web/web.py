from __future__ import absolute_import, unicode_literals

import os

import tornado.web

import spotify

from mopidy_spotify import backend, playback

class MyRequestHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
        self.core.tracklist.add(uri)
        self.core.tracklist.add(uri)
        self.core.playback.next()
        self.core.playback.play()
        self.write(
            'Hello, world! length: %s, state: %s' %
            (self.core.tracklist.length.get(),
            self.core.playback.state.get()) )

# def play_song(core):
#     list_of_uris = []
#     uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
#     list_of_uris.append(uri)
#     list_of_uris.append(uri)
#     core.tracklist.add(list_of_uris)
#     core.playback.next()
#     core.playback.play()
