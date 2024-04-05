from __future__ import unicode_literals

from mopidy_pibox import Extension


def test_get_default_config():
    ext = Extension()

    config = ext.get_default_config()

    assert "[pibox]" in config
    assert "enabled = true" in config
    assert "default_playlist = spotify:playlist:79inBfAlnfUB7i5kRthmWL" in config
    assert "default_skip_threshold = 3" in config
    assert "offline = false" in config


def test_get_config_schema():
    ext = Extension()

    schema = ext.get_config_schema()

    assert "enabled" in schema
    assert "default_playlist" in schema
    assert "offline" in schema
