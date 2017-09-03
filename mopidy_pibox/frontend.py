import pykka
import random
import logging

from mopidy import core

class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
	def __init__(self, config, core):
		super(PiboxFrontend, self).__init__()
		self.core = core
		self.config = config
		self.uri = 'spotify:user:gavinbannerman:playlist:79inBfAlnfUB7i5kRthmWL'

	def on_receive(self, message):
		self.uri = message.get('playlist')

	def track_playback_ended(self, tl_track, time_position):

		logger = logging.getLogger(__name__)
		if self.core.tracklist.get_length().get() == 0:
			logger.info("NO SONGS IN TRACKLIST")
			playlist = self.core.playlists.get_items(self.uri).get()
			logger.info(len(playlist.length))
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

		#comment
			
