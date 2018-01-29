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
        self.logger = logging.getLogger(__name__)

    def post(self):
        data = tornado.escape.json_decode(self.request.body)
        fingerprint = data["fingerprint"]
        uri = data["uri"]
        usersWhoVoted = self.session.has_voted.get(uri, [])

        if fingerprint in usersWhoVoted:
            self.set_status(400)
            response = { 
                'code': '15',
                'title': 'Voted Already',
                'message': 'User has already used their 1 vote to skip on this track'
            }
        else:
            usersWhoVoted.append(fingerprint)
            self.session.has_voted[uri] = usersWhoVoted
            vote_count = self.session.votes.get(uri, 0) + 1
            self.session.votes[uri] = vote_count
            if vote_count >= self.session.skip_threshold:
                self.core.tracklist.remove({'uri': [uri]})
                self.session.blacklist.append(uri)
            response = { 'uri': uri, 'votes': vote_count }
            self.set_status(200)
        self.write(response)