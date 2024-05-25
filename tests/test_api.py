from datetime import datetime
import json
import os
from unittest import mock
import tornado.testing
import tornado.web

from mopidy.models import Track

from mopidy_pibox import get_http_handlers
from mopidy_pibox.frontend import PiboxFrontend
from mopidy_pibox.pibox import Pibox


def _mock_actor_return_value(fn, value):
    fn.return_value.get.return_value = value


def _config():
    return {
        "core": {"max_tracklist_length": 5},
        "pibox": {
            "enabled": True,
            "offline": False,
            "default_playlist": "dummy:user:someuser:playlist1",
            "default_skip_threshold": 10,
        },
    }


class TestPiboxHandlerBase(tornado.testing.AsyncHTTPTestCase):
    # Workaround for https://github.com/pytest-dev/pytest/issues/12263.
    def runTest(self):
        pass

    def get_app(self):
        self.core = mock.Mock()
        self.frontend = mock.Mock(spec=PiboxFrontend)
        self.frontend.pibox = mock.Mock(spec=Pibox)
        config = _config()
        static_directory_path = os.path.join(os.path.dirname(__file__), "fixtures")
        return tornado.web.Application(
            get_http_handlers(self.core, config, self.frontend, static_directory_path)
        )


class TestTracklistHandler(TestPiboxHandlerBase):
    def test_get(self):
        fingerprint = "fingerprint"
        queued_tracks = [
            {"uri": "dummy:track1", "votes": 0, "voted": False},
            {"uri": "dummy:track2", "votes": 1, "voted": True},
        ]
        _mock_actor_return_value(self.frontend.get_queued_tracks, queued_tracks)

        response = self.fetch(
            "/api/tracklist", headers={"X-Pibox-Fingerprint": fingerprint}
        )
        body = json.loads(response.body)

        self.assertEqual(response.code, 200)
        self.assertEqual(body["tracklist"], queued_tracks)


class TestVoteHandler(TestPiboxHandlerBase):
    def test_post_ok_if_not_yet_voted(self):
        _mock_actor_return_value(self.frontend.pibox.has_user_voted_on_track, False)

        fingerprint = "fingerprint"

        response = self.fetch(
            "/api/vote",
            method="POST",
            headers={"X-Pibox-Fingerprint": fingerprint},
            body=json.dumps({"uri": "dummy:track1"}),
        )

        self.assertEqual(response.code, 200)

        self.frontend.add_vote_for_user_on_queued_track.assert_called_once_with(
            fingerprint, Track(uri="dummy:track1")
        )

    def test_post_returns_bad_request_if_already_voted(self):
        _mock_actor_return_value(self.frontend.pibox.has_user_voted_on_track, True)

        response = self.fetch(
            "/api/vote",
            method="POST",
            headers={"X-Pibox-Fingerprint": "fingerprint"},
            body=json.dumps({"uri": "dummy:track1"}),
        )

        self.assertEqual(response.code, 400)

        self.frontend.add_vote_for_user_on_queued_track.assert_not_called()


class TestSessionHandler(TestPiboxHandlerBase):
    def test_get(self):
        start_time = datetime.now().isoformat()
        _mock_actor_return_value(
            self.frontend.pibox.to_json,
            {
                "started": True,
                "startTime": start_time,
                "skipThreshold": 3,
                "playlist": {"name": "test", "uri": "dummy:playlist1"},
                "playedTracks": ["dummy:track1", "dummy:track2"],
                "remainingPlaylistTracks": ["dummy:track3", "dummy:track4"],
            },
        )

        response = self.fetch("/api/session")
        body = json.loads(response.body)

        self.assertEqual(response.code, 200)

        self.assertEqual(body["started"], True)
        self.assertEqual(body["startTime"], start_time)
        self.assertEqual(body["skipThreshold"], 3)
        self.assertEqual(body["playlist"], {"name": "test", "uri": "dummy:playlist1"})
        self.assertEqual(body["playedTracks"], ["dummy:track1", "dummy:track2"])
        self.assertEqual(
            body["remainingPlaylistTracks"], ["dummy:track3", "dummy:track4"]
        )

    def test_post(self):
        skip_threshold = 3
        playlist = {"name": "test", "uri": "dummy:playlist1"}
        auto_start = False

        response = self.fetch(
            "/api/session",
            method="POST",
            body=json.dumps(
                {
                    "skipThreshold": skip_threshold,
                    "playlist": playlist,
                    "autoStart": auto_start,
                }
            ),
        )

        self.assertEqual(response.code, 200)

        self.frontend.start_session.assert_called_once_with(
            skip_threshold, playlist, auto_start
        )


class TestConfigHandler(TestPiboxHandlerBase):
    def test_get(self):
        response = self.fetch("/config")
        body = json.loads(response.body)

        self.assertEqual(response.code, 200)

        self.assertEqual(body["offline"], False)
        self.assertEqual(body["defaultPlaylist"], "dummy:user:someuser:playlist1")
        self.assertEqual(body["defaultSkipThreshold"], 10)


class TestClientRoutingHandler(TestPiboxHandlerBase):
    def test_get_root(self):
        response = self.fetch("/")

        self.assertEqual(response.code, 200)
        self.assertIn(b"<!doctype html>", response.body)

    def test_get_invalid_route(self):
        response = self.fetch("/foo/bar/baz")

        self.assertEqual(response.code, 200)
        self.assertIn(b"<!doctype html>", response.body)
