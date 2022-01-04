from __future__ import unicode_literals

import logging
import os

from mopidy import config, ext
from .pibox_api import api, session, socket
from .routing import ClientRoutingHandler

__version__ = '0.8.4'

def my_app_factory(config, core):

    this_session = session.PiboxSession(2)

    path = os.path.join( os.path.dirname(__file__), 'static')
    
    return [
        (r'/ws/?', socket.PiboxWebSocket),
        (r'/api/tracklist/?', api.TracklistHandler, {'core': core, 'session': this_session}),
        (r'/api/vote/?', api.VoteHandler, {'core': core, 'session': this_session}),
        (r'/api/session/?', api.SessionHandler, {'core': core, 'session': this_session}),
        (r'/(.*)', routing.ClientRoutingHandler, {
            'path': path,
            'default_filename': 'index.html'
        }),
    ]


class Extension(ext.Extension):

    dist_name = 'Mopidy-Pibox'
    ext_name = 'pibox'
    version = __version__

    def get_default_config(self):
        conf_file = os.path.join(os.path.dirname(__file__), 'ext.conf')
        return config.read(conf_file)

    def get_config_schema(self):
        schema = super(Extension, self).get_config_schema()
        schema['default_playlist'] = config.String()
        schema['offline'] = config.Boolean(optional=True)
        return schema

    def setup(self, registry):

        from .frontend import PiboxFrontend

        registry.add('frontend', PiboxFrontend)
        registry.add('http:app', {
            'name': self.ext_name,
            'factory': my_app_factory,
        })
