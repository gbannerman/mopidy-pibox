from __future__ import absolute_import, unicode_literals

import os

import tornado.web

from mopidy import ext

class MyRequestHandler(tornado.web.RequestHandler):
    def initialize(self, core):
        self.core = core

    def get(self):
        self.write(
            'Hello, world! This is Mopidy %s' %
            self.core.get_version().get())
