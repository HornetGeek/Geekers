import os

from flask import Flask , render_template, request, session , redirect, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_session import Session

app = Flask(__name__)

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

chaneels = []

users = {}

chaneel = ""

@app.route("/", methods=['POST','GET'])
def index():

    return render_template("index.html")

@app.route("/create", methods=['post', 'get'])
def create():
    name = request.form.get("name")
    global chaneel
    chaneel = request.form.get("chaneel")
    
    session["name"] = name
    session["CurentChaneel"] = chaneel

    chaneels.append(chaneel)
    users[session.get('name')] = chaneel
    

    return redirect('/chat/' + chaneel)

@app.route("/chat/<chaneel>", methods=["post", "get"])
def chat(chaneel):
    session["CurentChaneel"] = chaneel
    if session.get('name') == None:
        
        users['none'] = session.get('CurentChaneel')
        return render_template("chat.html", name='none',chaneel=chaneel , users=users)
    else:
        return render_template("chat.html", name=session['name'], chaneel=session['CurentChaneel'], users=users)

@socketio.on("joined")
def joined():

    room = session.get("CurentChaneel")
    join_room(room)
    
    emit("status", {'user':session.get('name'), 'chaneel':room, "msg":session.get('name')+' has entred the chaneel'},room=room)

@socketio.on("user online")
def online():

    room = session.get("CurentChaneel")
    name = session.get('name')
    
    emit("online", {"users":users, 'name':name, 'chaneel':chaneel}, room=room)


@socketio.on("submit massage")
def massage(massage):

    room = session.get("CurentChaneel")
    
    emit("announce massage", {'massage':massage, 'user': session.get('name')},room=room)


@socketio.on("left")
def left():
    room = session.get('CurentChaneel')
    leave_room(room)
    del users[session.get("name")]
    emit('online')
    emit("status", {"user":session.get('name'), "msg":'has left the chaneel'}, room=room)


if __name__ == '__main__':
    socketio.run(app, debug=True)   