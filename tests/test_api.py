import json
from datetime import UTC, datetime
from pathlib import Path
from unittest import mock

import pykka
import tornado.testing
import tornado.web
from mopidy.models import Track

from mopidy_pibox import get_http_handlers
from mopidy_pibox.frontend import PiboxFrontend
from mopidy_pibox.pibox import Pibox


def _mock_actor_return_value(fn: mock.Mock, value: object):
    fn.return_value.get.return_value = value


def _config():
    return {
        "core": {"max_tracklist_length": 5},
        "pibox": {
            "enabled": True,
            "offline": False,
            "default_playlists": [
                "dummy:user:someuser:playlist1",
                "dummy:user:someuser:playlist2",
            ],
            "default_skip_threshold": 10,
            "disable_analytics": False,
        },
    }


class TestPiboxHandlerBase(tornado.testing.AsyncHTTPTestCase):
    # Workaround for https://github.com/pytest-dev/pytest/issues/12263.
    def runTest(self):  # noqa: N802
        pass

    def _patch_frontend_registry(self):
        self.frontend = mock.Mock(spec=PiboxFrontend)
        self.frontend.pibox = mock.Mock(spec=Pibox)

        patcher = mock.patch.object(pykka.ActorRegistry, "get_by_class")
        mock_get_by_class = patcher.start()
        self.addCleanup(patcher.stop)

        mock_actor_ref = mock.Mock()
        mock_actor_ref.proxy.return_value = self.frontend
        mock_get_by_class.return_value = [mock_actor_ref]

    def get_app(self):
        self.core = mock.Mock()
        self.config = _config()
        self._patch_frontend_registry()
        static_directory_path = str(Path(__file__).parent / "fixtures")
        return tornado.web.Application(
            get_http_handlers(self.core, self.config, static_directory_path)
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

        assert response.code == 200
        assert body["tracklist"] == queued_tracks

    def test_post(self):
        fingerprint = "fingerprint"
        queued_tracks = [
            {"uri": "dummy:track1", "votes": 0, "voted": False},
            {"uri": "dummy:track2", "votes": 1, "voted": True},
        ]
        _mock_actor_return_value(self.frontend.get_queued_tracks, queued_tracks)
        _mock_actor_return_value(self.frontend.add_track_to_queue, (True, None))

        response = self.fetch(
            "/api/tracklist",
            method="POST",
            headers={"X-Pibox-Fingerprint": fingerprint},
            body=json.dumps({"track": "dummy:track1"}),
        )
        body = json.loads(response.body)

        self.frontend.add_track_to_queue.assert_called_once_with("dummy:track1")
        assert body["tracklist"] == queued_tracks


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

        assert response.code == 200

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

        assert response.code == 400

        self.frontend.add_vote_for_user_on_queued_track.assert_not_called()


class TestSessionHandler(TestPiboxHandlerBase):
    def test_get(self):
        start_time = datetime.now(UTC).isoformat()
        _mock_actor_return_value(
            self.frontend.pibox.to_json,
            {
                "started": True,
                "startTime": start_time,
                "skipThreshold": 3,
                "playlists": [
                    {"name": "test", "uri": "dummy:playlist1"},
                    {"name": "test2", "uri": "dummy:playlist2"},
                ],
                "playedTracks": ["dummy:track1", "dummy:track2"],
                "remainingPlaylistTracks": ["dummy:track3", "dummy:track4"],
            },
        )

        response = self.fetch("/api/session")
        body = json.loads(response.body)

        assert response.code == 200

        assert body["started"] is True
        assert body["startTime"] == start_time
        assert body["skipThreshold"] == 3
        assert body["playlists"] == [
            {"name": "test", "uri": "dummy:playlist1"},
            {"name": "test2", "uri": "dummy:playlist2"},
        ]
        assert body["playedTracks"] == ["dummy:track1", "dummy:track2"]
        assert body["remainingPlaylistTracks"] == ["dummy:track3", "dummy:track4"]

    def test_post(self):
        skip_threshold = 3
        playlists = [
            {"name": "test", "uri": "dummy:playlist1"},
            {"name": "test2", "uri": "dummy:playlist2"},
        ]
        auto_start = False
        shuffle = False

        response = self.fetch(
            "/api/session",
            method="POST",
            body=json.dumps(
                {
                    "skipThreshold": skip_threshold,
                    "playlists": playlists,
                    "autoStart": auto_start,
                    "shuffle": shuffle,
                }
            ),
        )

        assert response.code == 200

        self.frontend.start_session.assert_called_once_with(
            skip_threshold, playlists, auto_start, shuffle
        )

    def test_delete(self):
        response = self.fetch("/api/session", method="DELETE")

        assert response.code == 200
        self.frontend.end_session.assert_called_once()


class TestConfigHandler(TestPiboxHandlerBase):
    def test_get(self):
        response = self.fetch("/config")
        body = json.loads(response.body)

        assert response.code == 200

        assert body["offline"] is False
        assert body["defaultPlaylists"] == [
            "dummy:user:someuser:playlist1",
            "dummy:user:someuser:playlist2",
        ]
        assert body["defaultSkipThreshold"] == 10


class TestSuggestionsHandler(TestPiboxHandlerBase):
    def test_get(self):
        suggestions = [{"uri": "dummy:track1"}, {"uri": "dummy:track2"}]
        _mock_actor_return_value(self.frontend.get_suggestions, suggestions)

        response = self.fetch("/api/suggestions")
        body = json.loads(response.body)

        assert response.code == 200
        assert body["suggestions"] == suggestions


class TestClientRoutingHandler(TestPiboxHandlerBase):
    def test_get_root(self):
        response = self.fetch("/")

        assert response.code == 200
        assert b"<!doctype html>" in response.body

    def test_get_invalid_route(self):
        response = self.fetch("/foo/bar/baz")

        assert response.code == 200
        assert b"<!doctype html>" in response.body

    def test_includes_analytics_if_not_disabled(self):
        response = self.fetch("/")

        assert response.code == 200
        assert b"goatcounter" in response.body

    def test_does_not_include_analytics_if_static_file(self):
        response = self.fetch("/favicon.ico")

        assert response.code == 200
        assert b"goatcounter" not in response.body


class TestClientRoutingHandlerAnalyticsDisabled(TestPiboxHandlerBase):
    def get_app(self):
        self.core = mock.Mock()
        self.config = _config()
        self.config["pibox"]["disable_analytics"] = True
        self._patch_frontend_registry()
        static_directory_path = str(Path(__file__).parent / "fixtures")
        return tornado.web.Application(
            get_http_handlers(self.core, self.config, static_directory_path)
        )

    def test_does_not_include_analytics_if_disabled(self):
        response = self.fetch("/")

        assert response.code == 200
        assert b"goatcounter" not in response.body
