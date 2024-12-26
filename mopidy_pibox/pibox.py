from datetime import datetime, timezone
import json
import logging


class Pibox:
    def __init__(self, data_dir):
        super().__init__()
        self.data_dir = data_dir
        self.queued_history = []
        self.__initialise()

        self.logger = logging.getLogger(__name__)

    def start_session(self, skip_threshold, playlists):
        self.started = True
        self.start_time = datetime.now(timezone.utc)

        self.skip_threshold = skip_threshold
        self.playlists = playlists

        playlist_names = ",".join([playlist["name"] for playlist in playlists])
        self.queued_history = self.__load_queued_history()
        self.logger.info(
            f"Started Pibox session with skip threshold {skip_threshold} and {len(playlists)} playlists: {playlist_names}"
        )

    def get_votes_for_track(self, track):
        return self.votes.get(track.uri, 0)

    def has_user_voted_on_track(self, user_fingerprint, track):
        return user_fingerprint in self.has_voted.get(track.uri, [])

    def add_vote_for_user_on_track(self, user_fingerprint, track):
        users_who_voted = self.has_voted.get(track.uri, [])
        users_who_voted.append(user_fingerprint)
        self.has_voted[track.uri] = users_who_voted

        vote_count = self.votes.get(track.uri, 0) + 1
        self.votes[track.uri] = vote_count

        return vote_count

    def skip_queued_track(self, track):
        del self.votes[track.uri]
        del self.has_voted[track.uri]

        self.denylist.append(track.uri)

    def get_suggestions(self):
        unplayed_queue_history = [
            uri for uri in self.queued_history if uri not in self.played_tracks
        ]

        return unplayed_queue_history

    def end_session(self):
        self.__save_queued_history()
        self.__initialise()

        self.logger.info("Ended Pibox session")

    def to_json(self):
        return {
            "started": self.started,
            "startTime": (self.start_time.isoformat() if self.start_time else None),
            "skipThreshold": self.skip_threshold,
            "playlists": self.playlists,
            "playedTracks": self.played_tracks,
            "remainingPlaylistTracks": self.remaining_playlist_tracks,
        }

    def __load_queued_history(self):
        try:
            with open(self.data_dir.joinpath("pibox-queue-history.json")) as f:
                history = json.load(f)
                return history
        except FileNotFoundError:
            return []

    def __save_queued_history(self):
        existing_suggestions = self.queued_history
        new_suggestions = existing_suggestions + self.manually_queued_tracks
        with open(self.data_dir.joinpath("pibox-queue-history.json"), "w+") as f:
            json.dump(new_suggestions, f)

    def __initialise(self):
        self.started = False
        self.start_time = None
        self.skip_threshold = 1
        self.playlists = []
        self.denylist = ["spotify:track:0afhq8XCExXpqazXczTSve"]
        self.played_tracks = []
        self.manually_queued_tracks = []
        self.remaining_playlist_tracks = []
        self.votes = {}
        self.has_voted = {}
