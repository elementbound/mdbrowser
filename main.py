import flask

def get_drives():
    import string
    import os.path

    return [d+':' for d in string.ascii_uppercase if os.path.exists(d+':')]

app = flask.Flask('mdbrowser')

@app.route('/')
def index():
    b = flask.Markup(browse(''))
    return flask.render_template('index.html', browse_content=b)

@app.route('/browse/<path:at>')
def browse(at):
    drives = get_drives()
    return flask.render_template('browse.html', drives=drives)

@app.route('/render/<path:file>')
def render(file):
    return 'Nice stuff here'

@app.route('/js/<path:path>')
def serve_js(path):
    return flask.send_from_directory('js', path)

@app.route('/css/<path:path>')
def serve_css(path):
    return flask.send_from_directory('css', path)
