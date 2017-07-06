from __future__ import unicode_literals

import logging
import os

from mopidy import config, ext

from pibox_web import MyRequestHandler

__version__ = '0.1.0'

# TODO: If you need to log, use loggers named after the current Python module
logger = logging.getLogger(__name__)


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

    def my_app_factory(config, core)
        return [
        ('/', MyRequestHandler, {'core': core})
        ]

    def setup(self, registry):

        # TODO: Edit or remove entirely
        registry.add('http:app', {
            'name': self.ext_name,
            'factory': my_app_factory,
        })
