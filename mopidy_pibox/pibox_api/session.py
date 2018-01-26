class PiboxSession(object):

    def __init__(self):
        self.blacklist = ['spotify:track:0afhq8XCExXpqazXczTSve']
        self.votes = {}
        self.has_voted = {}