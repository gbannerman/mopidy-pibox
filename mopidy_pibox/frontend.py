import pykka
import logging
from random import sample, shuffle

from mopidy import core

from mopidy_pibox import Extension
from mopidy_pibox.pibox import Pibox

PUSSYCAT_LIST = [
    "spotify:track:0asT0RDbe4Vrf6pxLHgpkn",
    "spotify:track:2HkHE4EeZyx9AncSN042q3",
]


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
    def __init__(self, config, core, pussycat_list=PUSSYCAT_LIST):
        super(PiboxFrontend, self).__init__()
        self.core = core
        self.config = config["pibox"]
        self.pussycat_list = pussycat_list
        self.logger = logging.getLogger(__name__)

        data_dir = Extension.get_data_dir(config)
        self.pibox = pykka.traversable(Pibox(data_dir=data_dir))

        self.core.tracklist.set_consume(value=True)

    def start_session(self, skip_threshold, playlists, auto_start):
        self.pibox.start_session(skip_threshold, playlists)
        if auto_start:
            self.__queue_song_from_session_playlists()
            self.__start_playing()

    def track_playback_ended(self, tl_track, time_position):
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
        return [
            {
                "info": track,
                "votes": self.pibox.get_votes_for_track(track),
                "voted": self.pibox.has_user_voted_on_track(user_fingerprint, track),
            }
            for track in self.core.tracklist.get_tracks().get()
        ]

    def add_track_to_queue(self, track_uri):
        if track_uri in self.pibox.played_tracks:
            return (False, "ALREADY_PLAYED")

        if self.__is_queued(track_uri):
            return (False, "ALREADY_QUEUED")

        self.core.tracklist.add(uris=[track_uri]).get()
        self.pibox.manually_queued_tracks.append(track_uri)

        return (True, None)

    def add_vote_for_user_on_queued_track(self, user_fingerprint, track):
        vote_count = self.pibox.add_vote_for_user_on_track(user_fingerprint, track)
        self.logger.info(
            f"Vote added for {track.uri} by {user_fingerprint} ({vote_count}/{self.pibox.skip_threshold})"
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
            len(unqueued_suggestions) if len(unqueued_suggestions) < length else length
        )
        unplayed_tracks = [
            track
            for tracks in self.core.library.lookup(sample(unqueued_suggestions, size))
            .get()
            .values()
            for track in tracks
        ]

        return unplayed_tracks

    def __queue_song_from_session_playlists(self):
        self.logger.info("Pibox is trying to queue a song")

        playlist_items = self.__get_session_playlist_items()
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
        self.logger.info("Pibox auto-added " + next_track.name + " to tracklist")

    def __get_session_playlist_items(self):
        if self.config["offline"]:
            return self.core.library.browse(uri="local:directory?type=track").get()
        else:
            return [
                track
                for playlist in self.pibox.playlists
                for track in self.core.playlists.get_items(playlist["uri"]).get()
            ]

    def __update_played_tracks(self, tl_track):
        self.pibox.played_tracks.append(tl_track.track.uri)

    def __update_remaining_playlist_tracks(self, remaining_playlist):
        self.pibox.remaining_playlist_tracks = [
            track.uri for track in remaining_playlist
        ]

    def __can_play(self, uri):
        return (uri not in self.pibox.played_tracks) and (
            uri not in self.pibox.denylist
        )

    def __is_queued(self, uri):
        return self.core.tracklist.filter({"uri": [uri]}).get() != []

    def __start_playing(self):
        if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
            self.core.playback.play().get()
            self.logger.info("Pibox started playback")

    def __should_play_whats_new_pussycat(self, tl_track):
        tracklist = self.core.tracklist.get_tracks().get()
        return tl_track.track.uri in self.pussycat_list and len(tracklist) == 0
