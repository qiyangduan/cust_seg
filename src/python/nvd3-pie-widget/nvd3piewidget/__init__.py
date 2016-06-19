from ._version import version_info, __version__

from .journey_widget import *
from .spark_sankey_journey import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'nvd3-pie-widget',
        'require': 'nvd3-pie-widget/extension'
    }]
