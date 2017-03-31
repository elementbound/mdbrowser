import flask
import json
from pathlib import Path

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
    data = []
    for drive in drives:
        d = {
            'path': drive+'/',
            'name': drive,
            'depth': 0,
            'flags': {'drive': True}
        }

        data.append(d)

    return json.dumps(data)

@app.route('/list/<path:path>')
def browse(path):
    # TODO: use Path instead of os.path
    import os

    path = Path(path)
    #files = os.listdir(path)
    data = []

    for file in path.iterdir():
        # Skip file if we have no permission
        try:
            file.is_dir()
        except PermissionError:
            continue

        flags = {}
        depth = len(file.parts)-1

        if file.is_dir():
            flags['directory'] = True

        if file.suffix == '.md':
            flags['markdown'] = True

        fdata = {
            'path': str(file),
            'name': file.name,
            'depth': depth,
            'flags': flags
        }

        data.append(fdata)

    return json.dumps(data)

@app.route('/render/<path:file>')
def render(file):
    import markdown

    file = Path(file)
    try:
        if not file.is_file():
            return 'Error'

    except PermissionError:
        return 'Permission denied'

    text = file.read_text()
    html = markdown.markdown(text, output_format="html5")

    return flask.Markup(html)

@app.route('/js/<path:path>')
def serve_js(path):
    return flask.send_from_directory('js', path)

@app.route('/css/<path:path>')
def serve_css(path):
    return flask.send_from_directory('css', path)

@app.route('/fonts/<path:path>')
def serve_font(path):
    return flask.send_from_directory('fonts', path)
