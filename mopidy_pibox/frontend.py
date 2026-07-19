import logging
from random import sample, shuffle

import pykka
from mopidy import core
from mopidy.config import Config
from mopidy.models import TlTrack, Track
from mopidy.types import PlaybackState, Uri

from mopidy_pibox import Extension
from mopidy_pibox.pibox import Pibox

PUSSYCAT_LIST = [
    "spotify:track:0asT0RDbe4Vrf6pxLHgpkn",
    "spotify:track:2HkHE4EeZyx9AncSN042q3",
]


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
    def __init__(
        self, config: Config, core: core.CoreProxy, pussycat_list=PUSSYCAT_LIST
    ):
        super().__init__()
        self.core = core
        self.config = config["pibox"]
        self.pussycat_list = pussycat_list
        self.logger = logging.getLogger(__name__)

        data_dir = Extension.get_data_dir(config)
        self.pibox = pykka.traversable(Pibox(data_dir=data_dir))

        self.core.tracklist.set_consume(value=True)

    def start_session(self, skip_threshold, playlists, auto_start, shuffle):
        self.pibox.start_session(skip_threshold, playlists, shuffle)
        if auto_start:
            self.__queue_song_from_session_playlists()
            self.__start_playing()

    def track_playback_ended(self, tl_track: TlTrack, time_position):  # noqa: ARG002
        if not self.pibox.started:
            return

        self.__update_played_tracks(tl_track)

        if self.__should_play_whats_new_pussycat(tl_track):
            self.core.tracklist.add(uris=[self.pussycat_list[0]], at_position=0).get()
            self.logger.info("Meow")
            self.__start_playing()
        elif self.core.tracklist.get_length().get() == 0:
            self.__queue_song_from_session_playlists()
            self.__start_playing()

    def get_queued_tracks(self, user_fingerprint):
        tracks = self.core.tracklist.get_tracks().get()
        return [
            {
                "info": track.model_dump(mode="json"),
                "votes": self.pibox.get_votes_for_track(track),
                "voted": self.pibox.has_user_voted_on_track(user_fingerprint, track),
            }
            for track in tracks
        ]

    def add_track_to_queue(self, track_uri):
        if track_uri in self.pibox.played_tracks:
            return (False, "ALREADY_PLAYED")

        if self.__is_queued(track_uri):
            return (False, "ALREADY_QUEUED")

        self.core.tracklist.add(uris=[track_uri]).get()
        self.pibox.manually_queued_tracks.append(track_uri)

        return (True, None)

    def add_vote_for_user_on_queued_track(self, user_fingerprint, track: Track):
        vote_count = self.pibox.add_vote_for_user_on_track(user_fingerprint, track)
        self.logger.info(
            f"Vote added for {track.uri} by {user_fingerprint} "
            f"({vote_count}/{self.pibox.skip_threshold})"
        )
        if vote_count >= self.pibox.skip_threshold:
            self.logger.info(f"Skipping {track.uri} due to votes")
            self.core.tracklist.remove({"uri": [track.uri]}).get()

            self.logger.info("Track removed from tracklist")
            self.pibox.skip_queued_track(track)

    def end_session(self):
        self.core.playback.stop()
        self.core.tracklist.clear()

        self.pibox.end_session()

    def get_suggestions(self, length):
        suggestions = self.pibox.get_suggestions()

        unqueued_suggestions = [
            track for track in suggestions if not self.__is_queued(track)
        ]
        size = (
            min(length, len(unqueued_suggestions))
        )
        return [
            track.model_dump(mode="json")
            for tracks in self.core.library.lookup(sample(unqueued_suggestions, size))
            .get()
            .values()
            for track in tracks
        ]

    def __queue_song_from_session_playlists(self):
        self.logger.info("Pibox is trying to queue a song")

        playlist_items = self.__get_session_playlist_items()

        if self.pibox.shuffle:
            shuffle(playlist_items)

        seen = set()

        remaining_playlist = [
            ref
            for ref in playlist_items
            if (
                self.__can_play(ref.uri)
                and ref.uri not in seen
                and not seen.add(ref.uri)
            )
        ]
        self.__update_remaining_playlist_tracks(remaining_playlist)

        if len(remaining_playlist) == 0:
            self.logger.info("No more tracks to play")
            self.end_session()
            return

        next_track = remaining_playlist[0]

        self.core.tracklist.add(uris=[next_track.uri], at_position=0).get()
        self.logger.info("Pibox auto-added %s to tracklist", next_track.name)

    def __get_session_playlist_items(self):
        if self.config["offline"]:
            return self.core.library.browse(uri="local:directory?type=track").get()
        return [
            track
            for playlist in self.pibox.playlists
            for track in self.core.playlists.get_items(playlist["uri"]).get()
        ]

    def __update_played_tracks(self, tl_track: TlTrack):
        self.pibox.played_tracks.append(tl_track.track.uri)

    def __update_remaining_playlist_tracks(self, remaining_playlist):
        self.pibox.remaining_playlist_tracks = [
            track.uri for track in remaining_playlist
        ]

    def __can_play(self, uri: Uri):
        return (uri not in self.pibox.played_tracks) and (
            uri not in self.pibox.denylist
        )

    def __is_queued(self, uri: Uri):
        return self.core.tracklist.filter({"uri": [uri]}).get() != []

    def __start_playing(self):
        playback_state = self.core.playback.get_state().get()
        self.logger.info(f"Pibox sees playback is {playback_state}")
        if playback_state == PlaybackState.STOPPED:
            self.core.playback.play().get()
            self.logger.info("Pibox started playback")

    def __should_play_whats_new_pussycat(self, tl_track: TlTrack):
        tracklist = self.core.tracklist.get_tracks().get()
        return tl_track.track.uri in self.pussycat_list and len(tracklist) == 0
