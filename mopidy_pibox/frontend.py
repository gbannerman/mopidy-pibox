import pykka
import random

from mopidy import core


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
	def __init__(self, config, core):
		super(PiboxFrontend, self).__init__()
		self.core = core
		self.config = config
		self.uri = 'spotify:user:gavinbannerman:playlist:1KSdLBbLJbTx0XYrWBVnrs'

	def on_receive(self, message):
		self.uri = message.get('playlist')

	def track_playback_ended(self, tl_track, time_position):
		if self.core.tracklist.get_length().get() == 0:
			new_track_uri = random.choice(self.core.playlists.get_items(self.uri).get()).uri
			self.core.tracklist.add(uri=new_track_uri, at_position=0).get()
			if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
				self.core.playback.play()
