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
    spot_backend = backend.SpotifyBackend()
    
    playback_prov = spot_backend.playback
    
    uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
    track = models.Track(uri=uri)
    playback_prov.change_track(track)
