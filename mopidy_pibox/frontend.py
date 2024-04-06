import pykka
import logging
from random import shuffle

from mopidy import core

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
        self.pibox = pykka.traversable(Pibox())
        self.logger = logging.getLogger(__name__)

        self.core.tracklist.set_consume(value=True)

    def start_session(self, skip_threshold, playlist, auto_start):
        self.pibox.start_session(skip_threshold, playlist)
        if auto_start:
            self.__queue_song_from_session_playlist()
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
            self.__queue_song_from_session_playlist()
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

    def add_vote_for_user_on_queued_track(self, user_fingerprint, track):
        vote_count = self.pibox.add_vote_for_user_on_track(user_fingerprint, track)
        if vote_count >= self.pibox.skip_threshold:
            self.core.tracklist.remove({"uri": [track.uri]})

            self.pibox.skip_queued_track(track)

    def end_session(self):
        self.core.playback.stop()
        self.core.tracklist.clear()

        self.pibox.end_session()

    def __queue_song_from_session_playlist(self):
        playlist = self.__get_session_playlist()
        shuffle(playlist)

        remaining_playlist = [ref for ref in playlist if self.__can_play(ref.uri)]
        self.__update_remaining_playlist_tracks(remaining_playlist)

        if len(remaining_playlist) == 0:
            self.logger.info("No more tracks to play")
            self.end_session()
            return

        next_track = remaining_playlist[0]

        self.core.tracklist.add(uris=[next_track.uri], at_position=0).get()
        self.logger.info("Pibox auto-added " + next_track.name + " to tracklist")

    def __get_session_playlist(self):
        if self.config["offline"]:
            return self.core.library.browse(uri="local:directory?type=track").get()
        else:
            return self.core.playlists.get_items(self.pibox.playlist["uri"]).get()

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

    def __start_playing(self):
        if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
            self.core.playback.play().get()

    def __should_play_whats_new_pussycat(self, tl_track):
        tracklist = self.core.tracklist.get_tracks().get()
        return tl_track.track.uri in self.pussycat_list and len(tracklist) == 0
