
import json
import logging

import pykka
import tornado.web
from mopidy.config import Config
from mopidy.core import CoreProxy
from mopidy.models import Track

from . import socket


class PiboxHandler(tornado.web.RequestHandler):
    def initialize(self, core: CoreProxy) -> None:
        self.core = core
        self.logger = logging.getLogger(__name__)

    def _get_body(self):
        return tornado.escape.json_decode(self.request.body)

    def _get_user_fingerprint(self):
        return self.request.headers["X-Pibox-Fingerprint"]


class TracklistHandler(PiboxHandler):
    def initialize(self, core: CoreProxy) -> None:
        super().initialize(core)

    def post(self):
        frontend = _get_frontend_proxy()

        data = self._get_body()
        fingerprint = self._get_user_fingerprint()
        track_uri = data["track"]
        (_success, error) = frontend.add_track_to_queue(track_uri).get()
        tracklist = frontend.get_queued_tracks(fingerprint).get()
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"tracklist": tracklist, "error": error}))

    def get(self):
        frontend = _get_frontend_proxy()

        fingerprint = self._get_user_fingerprint()
        tracklist = frontend.get_queued_tracks(fingerprint).get()
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"tracklist": tracklist}))


class VoteHandler(PiboxHandler):
    def initialize(self, core: CoreProxy) -> None:
        super().initialize(core)

    def post(self):
        frontend = _get_frontend_proxy()

        data = self._get_body()
        fingerprint = self._get_user_fingerprint()
        track = Track(uri=data["uri"])

        if frontend.pibox.has_user_voted_on_track(fingerprint, track).get():
            self.set_status(400)
            response = {
                "code": "15",
                "title": "Voted Already",
                "message": "User has already used their 1 vote to skip on this track",
            }
            self.write(response)
        else:
            frontend.add_vote_for_user_on_queued_track(fingerprint, track)

            socket.PiboxWebSocket.send(
                "VOTE_ADDED",
                {},
            )

            self.set_status(200)


class SessionHandler(PiboxHandler):
    def initialize(self, core: CoreProxy) -> None:
        super().initialize(core)

    def post(self):
        frontend = _get_frontend_proxy()

        data = self._get_body()
        skip_threshold = data["skipThreshold"]
        playlists = data.get("playlists", [])
        auto_start = data.get("autoStart", True)
        shuffle = data.get("shuffle", True)

        frontend.start_session(int(skip_threshold), playlists, auto_start, shuffle)
        session = frontend.pibox.to_json().get()

        socket.PiboxWebSocket.send(
            "SESSION_STARTED",
            session,
        )
        self.set_status(200)

    def get(self):
        frontend = _get_frontend_proxy()

        session = frontend.pibox.to_json().get()
        self.write(session)

    def delete(self):
        frontend = _get_frontend_proxy()

        frontend.end_session().get()
        socket.PiboxWebSocket.send("SESSION_ENDED", {})
        self.set_status(200)


class SuggestionsHandler(PiboxHandler):
    def initialize(self, core: CoreProxy) -> None:
        super().initialize(core)

    def get(self):
        frontend = _get_frontend_proxy()

        suggestions = frontend.get_suggestions(3).get()
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps({"suggestions": suggestions}))


class ConfigHandler(tornado.web.RequestHandler):
    def initialize(self, config: Config) -> None:
        self.config = config
        self.logger = logging.getLogger(__name__)

    def get(self):
        pibox_config = self.config.get("pibox")
        self.write(
            {
                "offline": pibox_config.get("offline"),
                "defaultPlaylists": list(pibox_config.get("default_playlists")),
                "defaultSkipThreshold": pibox_config.get("default_skip_threshold"),
            }
        )


def _get_frontend_proxy():
    # Deferred to avoid a circular import with mopidy_pibox.frontend.
    from mopidy_pibox.frontend import PiboxFrontend  # noqa: PLC0415

    return pykka.ActorRegistry.get_by_class(PiboxFrontend)[0].proxy()
