import ipywidgets as widgets
from traitlets import Unicode,CInt,Float
import json


@widgets.register('hello.Hello')
class HelloWorld(widgets.DOMWidget):
    """"""
    _view_name = Unicode('HelloView').tag(sync=True)
    _model_name = Unicode('HelloModel').tag(sync=True)
    _view_module = Unicode('nvd3-pie-widget').tag(sync=True)
    _model_module = Unicode('nvd3-pie-widget').tag(sync=True)
    value = Unicode('Hello World! from qiyang duan').tag(sync=True)


@widgets.register('nvd3.pie')
class NVD3PieWidget(widgets.DOMWidget):
    _view_name = Unicode('NVD3PieView').tag(sync=True)
    _view_module = Unicode('nvd3pie').tag(sync=True)
    value = CInt().tag(sync=True)
    json_data = Unicode().tag(sync=True)
    selected_json = Unicode().tag(sync=True)
    spinner_history_model = Unicode().tag(sync=True)

@widgets.register('nvd3.bar')
class NVD3BarWidget(widgets.DOMWidget):
    _view_name = Unicode('NVD3BarView').tag(sync=True)
    _view_module = Unicode('nvd3bar').tag(sync=True)
    json_data = Unicode().tag(sync=True)
    selected_json = Unicode().tag(sync=True)


@widgets.register('journey.sankey')
class D3SankeyWidget(widgets.DOMWidget):
    # the name of the requirejs module (no .js!)
    _view_module = Unicode(
        'd3sankeyview').tag(sync=True)
    # the name of the Backbone.View subclass to be used
    _view_name = Unicode(
        'D3SankeyView').tag(sync=True) 
    
    # the name of the CSS file to load with this widget
    _view_style = Unicode(
        'nbextensions/ipythond3sankey/css/widget_d3sankey').tag(sync=True)
    
    # the actual value: lists of nodes and links
    node_link_json = Unicode('{}').tag(sync=True)

    selected_json = Unicode().tag(sync=True)
    
    # margins & size
    margin_top = Float(1).tag(sync=True)
    margin_right = Float(1).tag(sync=True)
    margin_bottom = Float(6).tag(sync=True)
    margin_left = Float(1).tag(sync=True)
    width = Float(960).tag(sync=True)
    height = Float(500).tag(sync=True)
    
    unit = Unicode('').tag(sync=True)
    