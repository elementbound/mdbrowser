# Markdown Browser #

...is a tool written in Python to preview markdown files, running on the client's machine as
a server.

Currently it is geared towards Windows ( enumerates drives by default ), this should be easily
fixed.

## Dependencies ##

 * [Python](https://www.python.org/) 3.x ( tested with 3.5.2 )
 * [Flask](http://flask.pocoo.org/)
 * [Python-Markdown](http://pythonhosted.org/Markdown/index.html)

After installing Python, you can simply get all the dependencies from the command line:

``pip install flask markdown``

## Running ##

### Simple way ###

A small snippet of code at the end of `main.py` is included to simplify running the application.
Open up a terminal and type

``py main.py run [debug]``

The script will do the same as the section below does. Add the debug keyword to run in debug mode. 

### Manually ###

Start a terminal in the project's directory and set an environment variable for Flask to know
what to run:

``set FLASK_APP=main.py``

Or under Linux:

``export FLASK_APP=main.py``

Optionally, if you want to work on the source, debug mode could be useful:

``set FLASK_DEBUG=true``

Now, run the application:

``flask run``

Open [localhost:5000](http://localhost:5000/) in your browser and read some markdown.
