# pibox
![badge](https://img.shields.io/pypi/v/Mopidy-Pibox.svg?style=flat)

**pibox** is a Mopidy HTTP client that allows multiple users to search spotify and queue songs, via a clean and simple interface.

## Installation

### Requirements
- [Mopidy](https://docs.mopidy.com/en/latest/installation/)
- [Mopidy-Spotify](https://github.com/mopidy/mopidy-spotify)

### Installation
1. Install pibox
```
sudo pip install Mopidy-Pibox
```
2. Start Mopidy
```
mopidy
```
3. Open your Mopidy URL (e.g. `http://localhost:6680`) and click *Pibox*

## Configuration

Before starting Mopidy, you must add configuration for
Mopidy-Pibox to your Mopidy configuration file::

    [pibox]
    enabled = true
    default_playlist = spotify:user:gavinbannerman:playlist:79inBfAlnfUB7i5kRthmWL


## Project Resources

- [Issue tracker](https://github.com/gavinbannerman/mopidy-pibox/issues)
- [Changelog](https://github.com/gbannerman/mopidy-pibox/releases)


Credits
=======

- Original author: [Gavin Bannerman](https://github.com/gavinbannerman)
- [Contributors](https://github.com/gavinbannerman/mopidy-pibox/graphs/contributors)
