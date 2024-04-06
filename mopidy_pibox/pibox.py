from datetime import datetime, timezone
import logging


class Pibox:
    def __init__(self):
        super().__init__()
        self.started = False
        self.start_time = None
        self.skip_threshold = 1
        self.playlist = None
        self.denylist = ["spotify:track:0afhq8XCExXpqazXczTSve"]
        self.played_tracks = []
        self.remaining_playlist_tracks = []
        self.votes = {}
        self.has_voted = {}

        self.logger = logging.getLogger(__name__)

    def start_session(self, skip_threshold, playlist):
        self.started = True
        self.start_time = datetime.now(timezone.utc)

        self.skip_threshold = skip_threshold
        self.playlist = playlist

        playlist_name = playlist["name"]
        self.logger.info(
            f"Started Pibox session with skip threshold {skip_threshold} and playlist {playlist_name}"
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

    def end_session(self):
        self.started = False
        self.start_time = None
        self.skip_threshold = 1
        self.playlist = None
        self.denylist = ["spotify:track:0afhq8XCExXpqazXczTSve"]
        self.played_tracks = []
        self.remaining_playlist_tracks = []
        self.votes = {}
        self.has_voted = {}

        self.logger.info("Ended Pibox session")

    def to_json(self):
        return {
            "started": self.started,
            "startTime": (self.start_time.isoformat() if self.start_time else None),
            "skipThreshold": self.skip_threshold,
            "playlist": self.playlist,
            "playedTracks": self.played_tracks,
            "remainingPlaylistTracks": self.remaining_playlist_tracks,
        }
