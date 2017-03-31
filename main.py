import flask

app = flask.Flask('mdbrowser')

@app.route('/')
def index():
    return flask.render_template('index.html')

@app.route('/browse/<path:at>')
def browse(at):
    return 'Files, dam'

@app.route('/render/<path:file>')
def render(file):
    return 'Nice stuff here'
