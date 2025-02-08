import random
import unittest

from mopidy import core, models
import pykka
from mopidy_pibox.frontend import PiboxFrontend
from tests import dummy_audio, dummy_backend


def config():
    return {
        "core": {"max_tracklist_length": 5, "data_dir": "/tmp"},
        "pibox": {
            "enabled": True,
            "offline": False,
            "default_playlists": ["dummy:playlist2"],
        },
    }


class TestPiboxFrontend(unittest.TestCase):
    def setUp(self):
        random.seed(0)
        self.audio = dummy_audio.create_proxy()
        self.backend = dummy_backend.create_proxy(audio=self.audio)
        self.core = core.Core.start(config(), backends=[self.backend]).proxy()
        self.frontend = PiboxFrontend(config=config(), core=self.core)

        self.frontend.pussycat_list = [
            "dummy:pussycat1",
            "dummy:pussycat2",
        ]

        tracks = [
            models.Track(uri="dummy:a", length=40000, name="Dummy Track A"),
            models.Track(uri="dummy:b", length=40000, name="Dummy Track B"),
            models.Track(uri="dummy:c", length=40000, name="Dummy Track C"),
            models.Track(uri="dummy:d", length=40000, name="Dummy Track D"),
            models.Track(
                uri="dummy:pussycat1", length=40000, name="What's New Pussycat?"
            ),
            models.Track(
                uri="dummy:pussycat2", length=40000, name="What's New Pussycat? (Live)"
            ),
        ]

        self.backend.library.dummy_library = tracks
        self.backend.playlists.set_dummy_playlists(
            [
                models.Playlist(name="name", uri="dummy:playlist1", tracks=tracks[:3]),
                models.Playlist(
                    name="name2", uri="dummy:playlist2", tracks=[tracks[3]]
                ),
            ]
        )

    def tearDown(self):
        pykka.ActorRegistry.stop_all()

    def test_start_session_plays_song_from_session_playlist_if_autostart_enabled(self):
        self.__start_session(auto_start=True)

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_start_session_doesnt_play_music_if_autostart_disabled(self):
        self.__start_session()

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track is None
        assert playback_state == core.PlaybackState.STOPPED

    def test_when_track_ends_plays_song_from_session_playlist_if_no_songs_in_queue(
        self,
    ):
        self.__start_session()

        self.__play_track("Dummy Track Z", "dummy:z")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_when_track_ends_skips_songs_which_have_already_been_played(self):
        self.__start_session()

        self.__play_track("Dummy Track A", "dummy:a")
        self.__play_track("Dummy Track Z", "dummy:z")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:b"
        assert playback_state == core.PlaybackState.PLAYING

    def test_when_track_ends_plays_song_from_non_exhausted_session_playlists(self):
        self.__start_session()

        self.__play_track("Dummy Track A", "dummy:a")
        self.__play_track("Dummy Track B", "dummy:b")
        self.__play_track("Dummy Track C", "dummy:c")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:d"
        assert playback_state == core.PlaybackState.PLAYING

    def test_add_track_to_queue_is_unsuccessful_if_already_played(self):
        self.__start_session()
        self.__play_track("Dummy Track A", "dummy:a")

        (success, error) = self.frontend.add_track_to_queue("dummy:a")

        assert success is False
        assert error == "ALREADY_PLAYED"

    def test_add_track_to_queue_is_unsuccessful_if_already_queued(self):
        self.__start_session()
        self.core.tracklist.add(uris=["dummy:a"])

        (success, error) = self.frontend.add_track_to_queue("dummy:a")

        assert success is False
        assert error == "ALREADY_QUEUED"

    def test_add_track_to_queue_adds_manually_queued_track_to_queue(self):
        self.__start_session()

        (success, error) = self.frontend.add_track_to_queue("dummy:a")
        queued_tracks = self.core.tracklist.get_tracks().get()

        assert success is True
        assert error is None

        assert len(queued_tracks) == 1
        assert queued_tracks[0].uri == "dummy:a"

        assert "dummy:a" in self.frontend.pibox.manually_queued_tracks

    def test_add_vote_for_user_on_queued_track_removes_track_if_skip_threshold_reached(
        self,
    ):
        self.__start_session()

        self.core.tracklist.add(uris=["dummy:a"])
        queued_tracks = self.core.tracklist.get_tracks().get()

        self.frontend.add_vote_for_user_on_queued_track(
            user_fingerprint="dummy", track=queued_tracks[0]
        )

        updated_queued_tracks = self.core.tracklist.get_tracks().get()

        assert len(updated_queued_tracks) == 0

    def test_add_vote_for_user_on_queued_track_adds_track_to_denylist(
        self,
    ):
        self.__start_session()

        self.core.tracklist.add(uris=["dummy:a"])
        queued_tracks = self.core.tracklist.get_tracks().get()

        self.frontend.add_vote_for_user_on_queued_track(
            user_fingerprint="dummy", track=queued_tracks[0]
        )

        assert "dummy:a" in self.frontend.pibox.denylist

    def test_when_track_ends_skips_songs_that_are_on_denylist(self):
        self.__start_session()

        self.frontend.pibox.denylist = ["dummy:a"]

        self.__play_track("Dummy Track Z", "dummy:z")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_when_track_ends_resets_session_when_playlist_exhausted(self):
        self.__start_session()

        self.__play_track("Dummy Track A", "dummy:a")
        self.__play_track("Dummy Track B", "dummy:b")
        self.__play_track("Dummy Track C", "dummy:c")
        self.__play_track("Dummy Track D", "dummy:d")

        assert self.frontend.pibox.started is False
        assert self.frontend.pibox.played_tracks == []

    def test_when_track_ends_plays_whats_new_pussycat_if_last_song_was_whats_new_pussycat_and_nothing_in_queue(
        self,
    ):
        self.__start_session()

        self.__play_track("What's New Pussycat?", "dummy:pussycat1")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:pussycat1"
        assert playback_state == core.PlaybackState.PLAYING

    def test_when_track_ends_does_not_play_whats_new_pussycat_if_last_song_was_whats_new_pussycat_and_songs_in_queue(
        self,
    ):
        self.__start_session()

        self.core.tracklist.add(uris=["dummy:a", "dummy:pussycat1", "dummy:c"])
        self.__play_track("Dummy Track A", "dummy:a")
        self.__play_track("What's New Pussycat?", "dummy:pussycat1")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_get_suggestions_skips_queued_tracks(self):
        self.__start_session()
        self.frontend.pibox.queued_history = ["dummy:a", "dummy:b"]
        self.core.tracklist.add(uris=["dummy:a"])

        suggestions = self.frontend.get_suggestions(3)

        assert len(suggestions) == 1
        assert suggestions[0].uri == "dummy:b"

    def test_get_suggestions_limits_suggestions_to_requested_number(self):
        self.__start_session()
        self.frontend.pibox.queued_history = ["dummy:a", "dummy:b", "dummy:c"]

        suggestions = self.frontend.get_suggestions(1)

        assert len(suggestions) == 1

    def test_get_queued_tracks_returns_tracklist_with_current_users_votes(self):
        self.__start_session(skip_threshold=3)

        self.core.tracklist.add(uris=["dummy:a", "dummy:b"])
        queued_tracks = self.core.tracklist.get_tracks().get()

        self.frontend.add_vote_for_user_on_queued_track(
            user_fingerprint="dummy", track=queued_tracks[0]
        )

        tracklist = self.frontend.get_queued_tracks("dummy")

        assert len(tracklist) == 2
        assert tracklist[0]["info"].uri == "dummy:a"
        assert tracklist[0]["votes"] == 1
        assert tracklist[0]["voted"] is True
        assert tracklist[1]["info"].uri == "dummy:b"
        assert tracklist[1]["votes"] == 0
        assert tracklist[1]["voted"] is False

    def test_get_queued_tracks_returns_tracklist_with_other_users_votes(self):
        self.__start_session(skip_threshold=3)

        self.core.tracklist.add(uris=["dummy:a", "dummy:b"])
        queued_tracks = self.core.tracklist.get_tracks().get()

        self.frontend.add_vote_for_user_on_queued_track(
            user_fingerprint="dummy", track=queued_tracks[0]
        )

        tracklist = self.frontend.get_queued_tracks("dummy2")

        assert len(tracklist) == 2
        assert tracklist[0]["info"].uri == "dummy:a"
        assert tracklist[0]["votes"] == 1
        assert tracklist[0]["voted"] is False
        assert tracklist[1]["info"].uri == "dummy:b"
        assert tracklist[1]["votes"] == 0
        assert tracklist[1]["voted"] is False

    def __start_session(self, auto_start=False, skip_threshold=1):
        self.frontend.start_session(
            skip_threshold=skip_threshold,
            playlists=[
                {"name": "Dummy Playlist", "uri": "dummy:playlist1"},
                {"name": "Dummy Playlist 2", "uri": "dummy:playlist2"},
            ],
            auto_start=auto_start,
        )

    def __play_track(self, name, uri):
        track = models.Track(name=name, uri=uri, length=40000)

        self.core.tracklist.remove({"uri": [uri]}).get()
        self.core.playback.stop().get()

        tracklist_length = self.core.tracklist.get_length().get()
        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        if tracklist_length > 0:
            self.core.playback.play().get()
