from __future__ import unicode_literals

import logging
import os

from mopidy import config, ext

from pibox_web import web

__version__ = '0.1.1'

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)

def my_app_factory(config, core):

    path = os.path.join(os.path.dirname(__file__), 'pibox_web/style')

    return [
        (r'/', web.MainHandler),
        (r'/results/', web.SearchHandler, {'core': core}),
        (r'/add/', web.AddTrackHandler, {'core': core}),
        (r"/style/(.*)", web.StaticFileHandler, {"path": path}),
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
        return schema

    def setup(self, registry):

        # from .frontend import PiboxFrontend
        # registry.add('frontend', PiboxFrontend)

        # TODO: Edit or remove entirely
        registry.add('http:app', {
            'name': self.ext_name,
            'factory': my_app_factory,
            ''
        })
