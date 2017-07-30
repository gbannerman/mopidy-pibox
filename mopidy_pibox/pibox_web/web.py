from __future__ import absolute_import, unicode_literals

import os

import tornado.web

import spotify

from mopidy_spotify import backend, playback

class SearchHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        search_term = self.get_body_argument("query")
        search_result = self.core.library.search(any=[search_term], uris=['spotify:']).get()
        self.render("tracks.html", search_result=search_result, search_term=search_term)

class MainHandler(tornado.web.RequestHandler):
    def initialize(self):

    def get(self):
        self.render("search.html")

class AddTrackHandler(tornado.web.RequestHandler):
    def initialize(self):

    def get(self):
        uri = self.get_argument("uri", None)
        self.render("search.html", search_result=search_result)


# def play_song(core):
#     list_of_uris = []
#     uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
#     list_of_uris.append(uri)
#     list_of_uris.append(uri)
#     core.tracklist.add(list_of_uris)
#     core.playback.next()
#     core.playback.play()
