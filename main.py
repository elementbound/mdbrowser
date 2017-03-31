import flask
import json

def get_drives():
    import string
    import os.path

    return [d+':' for d in string.ascii_uppercase if os.path.exists(d+':')]

app = flask.Flask('mdbrowser')

@app.route('/')
def index():
    b = flask.Markup(browse(''))
    return flask.render_template('index.html', browse_content=b)

@app.route('/list/')
def browse_root():
    drives = get_drives()
    data = [{'path': drive+'/', 'name': drive, 'flags': {'drive': True}} for drive in drives]
    return json.dumps(data)

@app.route('/list/<path:path>')
def browse(path):
    import os
    path = os.path.normpath(path)
    files = os.listdir(path)
    data = []

    for file in files:
        fullpath = os.path.join(path, file)
        # fullpath = os.path.normpath(fullpath)

        flags = {}
        if os.path.isdir(fullpath):
            flags['directory'] = True

        fdata = {
            'path': fullpath,
            'name': file,
            'flags': flags
        }

        data.append(fdata)

    return json.dumps(data)

@app.route('/render/<path:file>')
def render(file):
    return 'Nice stuff here'

@app.route('/js/<path:path>')
def serve_js(path):
    return flask.send_from_directory('js', path)

@app.route('/css/<path:path>')
def serve_css(path):
    return flask.send_from_directory('css', path)

@app.route('/fonts/<path:path>')
def serve_font(path):
    return flask.send_from_directory('fonts', path)
