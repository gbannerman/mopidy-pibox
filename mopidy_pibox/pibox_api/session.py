class PiboxSession(object):

    def __init__(self, skip_threshold):
      self.skip_threshold = skip_threshold
      self.blacklist = ['spotify:track:0afhq8XCExXpqazXczTSve']
      self.votes = {}
      self.has_voted = {}