import pykka

from mopidy import core


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
	def __init__(self, config, core):
		super(PiboxFrontend, self).__init__()
		self.core = core

	def track_playback_ended(self, tl_track, time_position):
		if self.core.tracklist.get_length().get() == 0:
			# add track from playlist


