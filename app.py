from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, leave_room, join_room
import asyncio

app = Flask(__name__)
socketio = SocketIO(app)

# Хранение данных о пользователях и комнатах в словарях
users = {}
rooms = set()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    if request.sid in users:
        username = users[request.sid]['username']
        room = users[request.sid]['room']
        emit('user_left', {'username': username, 'room': room}, room=room)
        print(f'{username} left the room {room}')
        del users[request.sid]

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']

    users[request.sid] = {'username': username, 'room': room}
    join_room(room)
    emit('user_joined', {'username': username, 'room': room}, room=room)
    print(f'{username} joined room {room}')

@socketio.on('leave')
def handle_leave():
    username = users.get(request.sid, {}).get('username')
    room = users.get(request.sid, {}).get('room')

    if username and room:
        leave_room(room)
        emit('user_left', {'username': username, 'room': room}, room=room)
        print(f'{username} left room {room}')

@socketio.on('message')
def handle_message(data):
    username = users[request.sid]['username']
    room = users[request.sid]['room']
    emit('message', {'username': username, 'message': data['message']}, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5333)
