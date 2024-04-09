.. image:: https://raw.githubusercontent.com/gbannerman/mopidy-pibox/update-readme/docs/screenshots/pibox-header.png

****************************
Mopidy-Pibox
****************************

.. image:: https://img.shields.io/pypi/v/Mopidy-Pibox.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Pibox/
    :alt: Latest PyPI version

.. image:: https://github.com/gbannerman/mopidy-pibox/actions/workflows/ci.yml/badge.svg?branch=main
    :target: https://github.com/gbannerman/mopidy-pibox/releases
    :alt: GitHub Actions


**pibox** is a Mopidy HTTP client that allows multiple users to search for and queue songs as a group, via a clean and simple interface.

Features
========
- Search for and queue songs using any Mopidy backend
- Vote to skip queued tracks
- Plays from a predefined playlist if no tracks are queued
- Prevents tracks from being queued again after they have been played or skipped
- Admins controls to pause/resume playback or skip current track
- Display view for showing on a TV or monitor
- Can be used offline without an internet connection using Mopidy-Local_

.. image:: https://raw.githubusercontent.com/gbannerman/mopidy-pibox/update-readme/docs/screenshots/pibox-mobile.png

.. _Mopidy-Local: https://mopidy.com/ext/local/


Requirements
============
- Mopidy_
- A backend for Mopidy such as Mopidy-Spotify_ or Mopidy-SoundCloud_

.. _Mopidy: https://docs.mopidy.com/en/latest/installation/
.. _Mopidy-Spotify: https://mopidy.com/ext/spotify/
.. _Mopidy-SoundCloud: https://mopidy.com/ext/soundcloud/

Installation
============

1. Install by running::

    pip install Mopidy-Pibox

2. Start Mopidy::
		
		mopidy

3. Open your Mopidy URL (e.g. `http://localhost:6680`) and click *Pibox*


Configuration
=============

Before starting Mopidy, you must add configuration for
Mopidy-Pibox to your Mopidy configuration file::

    [pibox]
    enabled = true
    default_playlist = spotify:playlist:79inBfAlnfUB7i5kRthmWL
    default_skip_threshold = 3
    offline = false

The following configuration values are available:

- ``pibox/enabled``: If the pibox extension should be enabled or not.
  Defaults to ``true``.

- ``pibox/default_playlist``: The default playlist URI to play from when starting a new session. Defaults to `a Spotify playlist of great party songs <https://open.spotify.com/playlist/79inBfAlnfUB7i5kRthmWL?si=e8a5da23f91048c2>`_. Save it to your Spotify library!

- ``pibox/default_skip_threshold``: The default number of votes required to skip a track. Defaults to 3.

- ``pibox/offline``: If the extension should be used offline. Defaults to false.


Project resources
=================

- `Source code <https://github.com/gavinbannerman/mopidy-pibox>`_
- `Issue tracker <https://github.com/gavinbannerman/mopidy-pibox/issues>`_


Credits
=======

- Original author: `Gavin Bannerman <https://github.com/gavinbannerman>`_
