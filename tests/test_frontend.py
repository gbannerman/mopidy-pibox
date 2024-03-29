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


class TestPiboxFrontendBase(unittest.TestCase):
    def setUp(self):
        random.seed(0)
        self.audio = dummy_audio.create_proxy()
        self.backend = dummy_backend.create_proxy(audio=self.audio)
        self.core = core.Core.start(config(), backends=[self.backend]).proxy()
        self.frontend = PiboxFrontend(config=config(), core=self.core)
        self.frontend.session_active = True
        self.frontend.uri = "dummy:playlist1"

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


class TrackPlaybackEndedTestCase(TestPiboxFrontendBase):
    def test_plays_whats_new_pussycat_if_last_song_was_whats_new_pussycat_and_nothing_in_queue(
        self,
    ):
        self.frontend.pussycat_list = [
            "dummy:pussycat1",
            "dummy:pussycat2",
        ]

        self.core.tracklist.add(uris=["dummy:a", "dummy:pussycat1"])
        self.core.playback.play().get()
        self.core.playback.next().get()
        self.core.playback.next().get()

        track = models.Track(uri="dummy:pussycat1", length=40000)

        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:pussycat1"
        assert playback_state == core.PlaybackState.PLAYING

    def test_does_not_play_whats_new_pussycat_if_last_song_was_whats_new_pussycat_and_songs_in_queue(
        self,
    ):
        self.frontend.pussycat_list = [
            "dummy:pussycat1",
            "dummy:pussycat2",
        ]

        self.core.tracklist.add(uris=["dummy:a", "dummy:pussycat1", "dummy:c"])
        self.core.playback.play().get()
        self.core.playback.next().get()
        self.core.playback.next().get()

        track = models.Track(uri="dummy:pussycat1", length=40000)

        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_plays_song_from_session_playlist_if_no_songs_in_queue(self):
        track = models.Track(uri="dummy:z", length=40000)

        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:a"
        assert playback_state == core.PlaybackState.PLAYING

    def test_skips_songs_which_have_already_been_played(self):
        self.core.tracklist.add(uris=["dummy:a"])
        self.core.playback.play().get()
        self.core.playback.next().get()

        track = models.Track(uri="dummy:z", length=40000)

        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:c"
        assert playback_state == core.PlaybackState.PLAYING

    def test_marks_session_as_inactive_when_playlist_exhausted(self):
        self.core.tracklist.add(uris=["dummy:a", "dummy:b", "dummy:c"])
        self.core.playback.play().get()
        self.core.playback.next().get()
        self.core.playback.next().get()
        self.core.playback.next().get()

        track = models.Track(uri="dummy:c", length=40000)

        self.frontend.track_playback_ended(
            tl_track=models.TlTrack(tlid=1, track=track), time_position=None
        )

        assert self.frontend.session_active is False


class OnReceiveTestCase(TestPiboxFrontendBase):
    def test_updates_uri_on_update_session_playlist_action(self):
        self.frontend.uri = None

        self.frontend.on_receive(
            {"action": "UPDATE_SESSION_PLAYLIST", "payload": "dummy:playlist2"}
        )

        assert self.frontend.uri == "dummy:playlist2"

    def test_marks_session_as_active_on_start_session_action(self):
        self.frontend.session_active = False

        self.frontend.on_receive({"action": "START_SESSION"})

        assert self.frontend.session_active is True

    def test_starts_playing_music_from_session_playlist_if_autostart_enabled_in_start_session_action(
        self,
    ):
        self.frontend.session_active = False

        self.frontend.on_receive({"action": "START_SESSION", "payload": True})

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track.uri == "dummy:a"
        assert playback_state == core.PlaybackState.PLAYING

    def test_does_not_start_playing_music_from_session_playlist_if_autostart_disabled_in_start_session_action(
        self,
    ):
        self.frontend.session_active = False

        self.frontend.on_receive({"action": "START_SESSION", "payload": False})

        current_track = self.core.playback.get_current_track().get()
        playback_state = self.core.playback.get_state().get()

        assert current_track is None
        assert playback_state == core.PlaybackState.STOPPED

    def test_marks_session_as_inactive_on_end_session_action(self):
        self.frontend.session_active = True

        self.frontend.on_receive({"action": "END_SESSION"})

        assert self.frontend.session_active is False
