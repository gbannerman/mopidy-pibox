****************************
Mopidy-Pibox
****************************

.. image:: https://img.shields.io/pypi/v/Mopidy-Pibox.svg?style=flat
    :target: https://pypi.python.org/pypi/Mopidy-Pibox/
    :alt: Latest PyPI version

.. image:: https://circleci.com/gh/gbannerman/mopidy-pibox/tree/master.svg?style=shield
    :target: https://circleci.com/gh/gbannerman/mopidy-pibox/tree/master
    :alt: CircleCI status


**pibox** is a Mopidy HTTP client that allows multiple users to search spotify and queue songs, via a clean and simple interface.


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
    default_playlist = spotify:user:gavinbannerman:playlist:79inBfAlnfUB7i5kRthmWL


Project resources
=================

- `Source code <https://github.com/gavinbannerman/mopidy-pibox>`_
- `Issue tracker <https://github.com/gavinbannerman/mopidy-pibox/issues>`_


Credits
=======

- Original author: `Gavin Bannerman <https://github.com/gavinbannerman>`_
