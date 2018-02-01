import pykka
import random
import logging
from random import shuffle

from mopidy import core

class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
	def __init__(self, config, core):
		super(PiboxFrontend, self).__init__()
		self.core = core
		self.config = config
		self.pussycat_list = ['spotify:track:0asT0RDbe4Vrf6pxLHgpkn', 'spotify:track:2HkHE4EeZyx9AncSN042q3']

	def on_receive(self, message):
		self.uri = message.get('playlist')

	def track_playback_ended(self, tl_track, time_position):

		logger = logging.getLogger(__name__)
		if (tl_track.track.uri in self.pussycat_list and self.core.tracklist.get_length().get() == 0):
			self.core.tracklist.add(uri=self.pussycat_list[0], at_position=0).get()
			logger.info("Meow")
			if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
				self.core.playback.play()

		if self.core.tracklist.get_length().get() == 0:
			playlist = self.core.playlists.get_items(self.config['pibox']['default_playlist']).get()
			shuffle(playlist)
			for ref in playlist:
				new_track_uri = ref.uri
				if not (self.played_already(new_track_uri, self.core)):
					self.core.tracklist.add(uri=new_track_uri, at_position=0).get()
					logger.info("Auto-added " + ref.name + " to tracklist")
					if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
						self.core.playback.play()
					break

	def played_already(self, uri, core):
		history = self.core.history.get_history().get()
		played_tracks = []
		for tup in history:
			played_tracks.append(tup[1].uri)
		return uri in played_tracks
			
