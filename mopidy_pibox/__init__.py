from __future__ import unicode_literals

import logging
import os
import tornado.web

from mopidy import config, ext

from pibox_web import web, session

__version__ = '0.1.1'

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)

def my_app_factory(config, core):

    path = os.path.join( os.path.dirname(__file__), 'static')
    
    return [
        (r"/images/(.*)", tornado.web.StaticFileHandler, {
            'path': config['local-images']['image_dir']
        }),
        (r'/http/([^/]*)', handlers.HttpHandler, {
            'core': core,
            'config': config
        }),
        (r'/ws/?', handlers.WebsocketHandler, { 
            'core': core,
            'config': config
        }),
        (r'/(.*)', tornado.web.StaticFileHandler, {
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
        schema['cookie_secret'] = config.Secret()
        return schema

    def setup(self, registry):

        registry.add('http:app', {
            'name': self.ext_name,
            'factory': my_app_factory,
        })
