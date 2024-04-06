import random
import unittest

from mopidy import core, models
import pykka
from mopidy_pibox.frontend import PiboxFrontend
from tests import dummy_audio, dummy_backend


def config():
    return {
        "core": {"max_tracklist_length": 5},
        "pibox": {
            "enabled": True,
            "offline": False,
            "default_playlist": "dummy:playlist2",
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
            models.Track(
                uri="dummy:pussycat1", length=40000, name="What's New Pussycat?"
            ),
            models.Track(
                uri="dummy:pussycat2", length=40000, name="What's New Pussycat? (Live)"
            ),
        ]

        self.backend.library.dummy_library = tracks
        self.backend.playlists.set_dummy_playlists(
            [models.Playlist(name="name", uri="dummy:playlist1", tracks=tracks[:3])]
        )

    def tearDown(self):
        pykka.ActorRegistry.stop_all()

    def test_start_session_plays_song_from_session_playlist_if_autostart_enabled(self):
        self.__start_session(auto_start=True)

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:a"
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

        assert current_track.uri == "dummy:a"
        assert playback_state == core.PlaybackState.PLAYING

    def test_when_track_ends_skips_songs_which_have_already_been_played(self):
        self.__start_session()

        self.__play_track("Dummy Track A", "dummy:a")
        self.__play_track("Dummy Track Z", "dummy:z")

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

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

    def __start_session(self, auto_start=False):
        self.frontend.start_session(
            skip_threshold=1,
            playlist={"name": "Dummy Playlist", "uri": "dummy:playlist1"},
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
