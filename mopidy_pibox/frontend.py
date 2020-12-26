import pykka
import random
import logging
from random import shuffle

from mopidy import core

class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
	def __init__(self, config, core):
		super(PiboxFrontend, self).__init__()
		self.core = core
		self.config = config['pibox']
		self.pussycat_list = ['spotify:track:0asT0RDbe4Vrf6pxLHgpkn', 'spotify:track:2HkHE4EeZyx9AncSN042q3']
		self.uri = None
		self.session_active = False
		self.blacklist = []
		self.core.tracklist.set_consume(value=True)

	def on_receive(self, message):
		action = message.get('action')
		if action == 'UPDATE_SESSION_PLAYLIST':
			self.uri = message.get('payload')
			self.session_active = True
		elif action == 'UPDATE_BLACKLIST':
			self.blacklist = message.get('payload')
		elif action == 'END_SESSION':
			self.session_active = False

	def track_playback_ended(self, tl_track, time_position):
		logger = logging.getLogger(__name__)
		if (tl_track.track.uri in self.pussycat_list and self.core.tracklist.get_length().get() == 0):
			self.core.tracklist.add(uri=self.pussycat_list[0], at_position=0).get()
			logger.info("Meow")
			if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
				self.core.playback.play()

		if self.core.tracklist.get_length().get() == 0 and self.session_active:
			if self.config['offline']:
				playlist = self.core.library.browse(uri="local:directory?type=track").get()
			elif self.uri is None:
				playlist = self.core.playlists.get_items(self.config['default_playlist']).get()
			else:
				playlist = self.core.playlists.get_items(self.uri).get()
			shuffle(playlist)
			for ref in playlist:
				new_track_uri = ref.uri
				if not (self.played_already(new_track_uri, self.core)):
					self.core.tracklist.add(uris=[new_track_uri], at_position=0).get()
					logger.info("Auto-added " + ref.name + " to tracklist")
					if self.core.playback.get_state().get() == core.PlaybackState.STOPPED:
						self.core.playback.play()
					break

	def played_already(self, uri, core):
		history = self.core.history.get_history().get()
		played_tracks = []
		for tup in history:
			played_tracks.append(tup[1].uri)
		return (uri in played_tracks) or (uri in self.blacklist)
			
