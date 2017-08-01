class PiboxSession(object):

	def __init__(self, history):
		self.history = history

	def add_track_to_history(self, uri):
		self.history.append(uri)
		