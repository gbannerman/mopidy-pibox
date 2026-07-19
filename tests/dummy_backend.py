"""A dummy backend for use in tests.

This backend implements the backend API in the simplest way possible.  It is
used in tests of the frontends.
"""

from collections.abc import Iterable
from typing import Any

import pykka
from mopidy import backend
from mopidy.audio import AudioProxy
from mopidy.config import Config
from mopidy.models import Playlist, Ref, SearchResult, Track
from mopidy.types import DistinctField, DurationMs, Query, SearchField, Uri


def create_proxy(config: Config | None = None, audio: AudioProxy | None = None):
    return DummyBackend.start(config=config, audio=audio).proxy()


class DummyBackend(pykka.ThreadingActor, backend.Backend):
    def __init__(self, config: Config, audio: AudioProxy | None):
        super().__init__()

        self.library = DummyLibraryProvider(backend=self)
        if audio:
            self.playback = backend.PlaybackProvider(audio=audio, backend=self)
        else:
            self.playback = DummyPlaybackProvider(audio=audio, backend=self)
        self.playlists = DummyPlaylistsProvider(backend=self)

        self.uri_schemes = ["dummy"]


class DummyLibraryProvider(backend.LibraryProvider):
    root_directory = Ref.directory(uri="dummy:/", name="dummy")

    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self.dummy_library = []
        self.dummy_get_distinct_result = {}
        self.dummy_get_images_result = {}
        self.dummy_browse_result = {}
        self.dummy_find_exact_result = SearchResult()
        self.dummy_search_result = SearchResult()

    def browse(self, path: Uri):
        return self.dummy_browse_result.get(path, [])

    def get_distinct(
        self, field: DistinctField, query: Query[SearchField] | None = None
    ):
        return self.dummy_get_distinct_result.get(field, set())

    def get_images(self, uris: Iterable[Uri]):
        return self.dummy_get_images_result

    def lookup(self, uri: Uri):
        uri = Ref.track(uri=uri).uri
        return [t for t in self.dummy_library if uri == t.uri]

    def refresh(self, uri: Uri | None = None):
        pass

    def search(
        self,
        query: Query[SearchField] | None = None,
        uris: Iterable[Uri] | None = None,
        exact: bool = False,
    ):
        if exact:  # TODO: remove uses of dummy_find_exact_result
            return self.dummy_find_exact_result
        return self.dummy_search_result


class DummyPlaybackProvider(backend.PlaybackProvider):
    def __init__(self, *args: Any, **kwargs: Any):
        super().__init__(*args, **kwargs)
        self._uri = None
        self._time_position = 0

    def pause(self):
        return True

    def play(self):
        return self._uri and self._uri != "dummy:error"

    def change_track(self, track: Track):
        """Pass a track with URI 'dummy:error' to force failure"""
        self._uri = track.uri
        self._time_position = 0
        return True

    def prepare_change(self):
        pass

    def resume(self):
        return True

    def seek(self, time_position: DurationMs):
        self._time_position = time_position
        return True

    def stop(self):
        self._uri = None
        return True

    def get_time_position(self):
        return self._time_position


class DummyPlaylistsProvider(backend.PlaylistsProvider):
    def __init__(self, backend: backend.Backend):
        super().__init__(backend)
        self._playlists = []
        self._allow_save = True

    def set_dummy_playlists(self, playlists: list[Playlist]):
        """For tests using the dummy provider through an actor proxy."""
        self._playlists = playlists

    def set_allow_save(self, enabled: bool):
        self._allow_save = enabled

    def as_list(self):
        return [Ref.playlist(uri=pl.uri, name=pl.name) for pl in self._playlists]

    def get_items(self, uri: Uri):
        playlist = self.lookup(uri)
        if playlist is None:
            return None
        return [Ref.track(uri=t.uri, name=t.name) for t in playlist.tracks]

    def lookup(self, uri: Uri):
        uri = Ref.playlist(uri=uri).uri
        for playlist in self._playlists:
            if playlist.uri == uri:
                return playlist
        return None

    def refresh(self):
        pass

    def create(self, name: str):
        playlist = Playlist(name=name, uri=f"dummy:{name}")
        self._playlists.append(playlist)
        return playlist

    def delete(self, uri: Uri):
        playlist = self.lookup(uri)
        if playlist:
            self._playlists.remove(playlist)

    def save(self, playlist: Playlist):
        if not self._allow_save:
            return None

        old_playlist = self.lookup(playlist.uri)

        if old_playlist is not None:
            index = self._playlists.index(old_playlist)
            self._playlists[index] = playlist
        else:
            self._playlists.append(playlist)

        return playlist
