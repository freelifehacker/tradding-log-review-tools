from flask import Flask
from flask_socketio import SocketIO
# from livereload import Server

app = Flask(__name__)

# if __name__ == '__main__':
#     live_server = Server(app.wsgi_app)
#     live_server.watch('**/*.*')
#     live_server.serve(open_url_delay=True)
#     app.run()

# app.config['SECRET_KEY'] = 'secret!'
# socketio = SocketIO(app)

# if __name__ == '__main__':
#   socketio.run(app)

@app.route("/hi")
def hi():
  return "Hello ss a ssWorld!"

# @socketio.on('json')
# def handle_json(json):
#   print('received json: xxx')