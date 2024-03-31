import pykka
import logging
from random import shuffle

from mopidy import core


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
    def __init__(self, config, core):
        super(PiboxFrontend, self).__init__()
        self.core = core
        self.config = config["pibox"]
        self.pussycat_list = [
            "spotify:track:0asT0RDbe4Vrf6pxLHgpkn",
            "spotify:track:2HkHE4EeZyx9AncSN042q3",
        ]
        self.uri = None
        self.session_active = False
        self.denylist = []
        self.played_tracks = []
        self.logger = logging.getLogger(__name__)

        self.core.tracklist.set_consume(value=True)

    def on_receive(self, message):
        action = message.get("action")
        if action == "UPDATE_SESSION_PLAYLIST":
            self.uri = message.get("payload")
        elif action == "START_SESSION":
            auto_start = message.get("payload")
            if not self.session_active:
                self.session_active = True
                if auto_start:
                    self.__queue_song_from_session_playlist()
                    self.__start_playing()
        elif action == "UPDATE_DENYLIST":
            self.denylist = message.get("payload")
        elif action == "END_SESSION":
            self.__end_session()

    def track_playback_ended(self, tl_track, time_position):
        self.__update_played_tracks()

        if self.__should_play_whats_new_pussycat(tl_track):
            self.core.tracklist.add(uris=[self.pussycat_list[0]], at_position=0).get()
            self.logger.info("Meow")
            self.__start_playing()
        elif self.core.tracklist.get_length().get() == 0 and self.session_active:
            self.__queue_song_from_session_playlist()
            self.__start_playing()

    def __queue_song_from_session_playlist(self):
        playlist = self.__get_session_playlist()
        shuffle(playlist)

        remaining_playlist = [ref for ref in playlist if self.__can_play(ref.uri)]

        if len(remaining_playlist) == 0:
            self.logger.info("No more tracks to play")
            self.__end_session()
            return

        next_track = remaining_playlist[0]

        self.core.tracklist.add(uris=[next_track.uri], at_position=0).get()
        self.logger.info("Auto-added " + next_track.name + " to tracklist")

    def __get_session_playlist(self):
        if self.config["offline"]:
            return self.core.library.browse(uri="local:directory?type=track").get()
        else:
            return self.core.playlists.get_items(self.uri).get()

    def __update_played_tracks(self):
        history = self.core.history.get_history().get()
        played_tracks = []
        for tup in history:
            played_tracks.append(tup[1].uri)
        self.played_tracks = played_tracks

    def __can_play(self, uri):
        return (uri not in self.played_tracks) and (uri not in self.denylist)

    def __start_playing(self):
        if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
            self.core.playback.play().get()

    def __should_play_whats_new_pussycat(self, tl_track):
        return (
            tl_track.track.uri in self.pussycat_list
            and self.core.tracklist.get_length().get() == 0
        )

    def __end_session(self):
        self.core.tracklist.clear().get()
        self.session_active = False
        self.denylist = []
        self.played_tracks = []
        self.uri = None
        self.logger.info("Session ended")
