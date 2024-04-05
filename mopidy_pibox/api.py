from __future__ import absolute_import, unicode_literals

import json

from mopidy import config
import tornado.web

import logging

from mopidy.models import ModelJSONEncoder, Track
from . import socket


class PiboxHandler(tornado.web.RequestHandler):
    def initialize(self, core, frontend):
        self.core = core
        self.frontend = frontend
        self.logger = logging.getLogger(__name__)

    def _get_body(self):
        return tornado.escape.json_decode(self.request.body)

    def _get_user_fingerprint(self):
        return self.request.headers["X-Pibox-Fingerprint"]


class TracklistHandler(PiboxHandler):
    def initialize(self, core, frontend):
        super(TracklistHandler, self).initialize(core, frontend)

    def get(self):
        fingerprint = self._get_user_fingerprint()
        tracklist = self.frontend.get_queued_tracks(fingerprint).get()
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"tracklist": tracklist}, cls=ModelJSONEncoder))


class VoteHandler(PiboxHandler):
    def initialize(self, core, frontend):
        super(VoteHandler, self).initialize(core, frontend)

    def post(self):
        data = self._get_body()
        fingerprint = self._get_user_fingerprint()
        track = Track(uri=data["uri"])

        if self.frontend.pibox.has_user_voted_on_track(fingerprint, track).get():
            self.set_status(400)
            response = {
                "code": "15",
                "title": "Voted Already",
                "message": "User has already used their 1 vote to skip on this track",
            }
            self.write(response)
        else:
            self.frontend.add_vote_for_user_on_queued_track(fingerprint, track)

            self.set_status(200)


class SessionHandler(PiboxHandler):
    def initialize(self, core, frontend):
        super(SessionHandler, self).initialize(core, frontend)

    def post(self):
        data = self._get_body()
        skip_threshold = data["skipThreshold"]
        playlist = data["playlist"]
        auto_start = data.get("autoStart", True)

        self.frontend.start_session(skip_threshold, playlist, auto_start)
        session = self.frontend.pibox.to_json().get()

        socket.PiboxWebSocket.send(
            "SESSION_STARTED",
            session,
        )
        self.set_status(200)

    def get(self):
        session = self.frontend.pibox.to_json().get()
        self.write(session)

    def delete(self):
        self.frontend.end_session().get()
        socket.PiboxWebSocket.send("SESSION_ENDED", {})
        self.set_status(200)


class ConfigHandler(tornado.web.RequestHandler):
    def initialize(self, config: config.Proxy):
        self.config = config
        self.logger = logging.getLogger(__name__)

    def get(self):
        pibox_config = self.config.get("pibox")
        self.write(
            {
                "offline": pibox_config.get("offline"),
                "defaultPlaylist": pibox_config.get("default_playlist"),
                "defaultSkipThreshold": pibox_config.get("default_skip_threshold"),
            }
        )
