from datetime import datetime


class PiboxSession(object):

    def __init__(self, skip_threshold):
        self.started = False
        self.start_time = None
        self.skip_threshold = skip_threshold
        self.playlist = None
        self.blacklist = ["spotify:track:0afhq8XCExXpqazXczTSve"]
        self.votes = {}
        self.has_voted = {}

    def start(self):
        self.started = True
        self.start_time = datetime.utcnow()

    def reset(self):
        self.started = False
        self.playlist = None
        self.blacklist = ["spotify:track:0afhq8XCExXpqazXczTSve"]
        self.votes = {}
        self.has_voted = {}
