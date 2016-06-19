nvd3-pie-widget
===============================

first try to wrap up nvd3 pie chart into jupyter notebook widget

Installation
------------

To install use pip:

    $ pip install nvd3piewidget
    $ jupyter nbextension enable --py --sys-prefix nvd3piewidget


For a development installation (requires npm),

    $ git clone https://github.com/qiyangduan/nvd3-pie-widget.git
    $ cd nvd3piewidget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --user nvd3piewidget
    $ jupyter nbextension enable --py --user nvd3piewidget
