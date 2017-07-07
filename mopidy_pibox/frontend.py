import pykka

from mopidy import core


class PiboxFrontend(pykka.ThreadingActor, core.CoreListener):
    def __init__(self, config, core):
        super(PiboxFrontend, self).__init__()
        self.core = core

    def add_track(self):
        list_of_tracks = []
        uri = 'spotify:track:0Lx6O1tC3CPF1giLJIt5Jv'
        list_of_uris.append(uri)
        self.core.tracklist.add(list_of_uris)
        self.core.playback.next()
        
