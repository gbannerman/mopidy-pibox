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

    path = os.path.join(os.path.dirname(__file__), 'pibox_web/style')
    this_session = session.PiboxSession()
    settings = {
    "cookie_secret": "__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
    "login_url": "/login",
}

    return [
        (r'/', web.MainHandler, {'core': core}),
        (r'/results/', web.SearchHandler, {'core': core}),
        (r'/add/', web.AddTrackHandler, {'core': core, 'session': this_session}),
        (r"/style/(.*)", tornado.web.StaticFileHandler, {"path": path}),
        (r"/start/", web.StartHandler, {'core': core}),
        (r"/history/", web.HistoryHandler, {'core': core}),
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
