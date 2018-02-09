class PiboxSession(object):

  def __init__(self, skip_threshold):
    self.started = False
    self.skip_threshold = skip_threshold
    self.playlist = None
    self.blacklist = ['spotify:track:0afhq8XCExXpqazXczTSve']
    self.votes = {}
    self.has_voted = {}