from flask import Flask, render_template, request, jsonify, session
import sqlite3
import random

app = Flask(__name__)

app.secret_key = "railway_secret_key"

# DATABASE CONNECTION
def connect_db():
    conn = sqlite3.connect("railway.db")
    conn.row_factory = sqlite3.Row
    return conn

# CREATE TABLES
conn = connect_db()
cur = conn.cursor()

# USERS TABLE
cur.execute("""
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
""")

# TICKETS TABLE
cur.execute("""
CREATE TABLE IF NOT EXISTS tickets(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
train TEXT,
source TEXT,
destination TEXT,
classType TEXT,
people INTEGER DEFAULT 1,
fare INTEGER DEFAULT 0,
pnr TEXT,
status TEXT
)
""")

# ADD NEW COLUMNS IF OLD DATABASE EXISTS
try:
    cur.execute("ALTER TABLE tickets ADD COLUMN people INTEGER DEFAULT 1")
except:
    pass

try:
    cur.execute("ALTER TABLE tickets ADD COLUMN fare INTEGER DEFAULT 0")
except:
    pass

# COMPLAINTS TABLE
cur.execute("""
CREATE TABLE IF NOT EXISTS complaints(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT,
message TEXT
)
""")

conn.commit()
conn.close()

# HOME PAGE
@app.route("/")
def home():
    return render_template("index.html")

# EXTRA PAGE
@app.route("/extra")
def extra():
    return render_template("index2.html")

# REGISTER
@app.route("/register", methods=["POST"])
def register():

    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users(username,password) VALUES(?,?)",
            (data["username"], data["password"])
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message":"Registration Successful"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message":"Username already exists"
        })

    finally:
        conn.close()

# LOGIN
@app.route("/login", methods=["POST"])
def login():

    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM users WHERE username=?",
        (data["username"],)
    )

    existing_user = cur.fetchone()

    if not existing_user:

        conn.close()

        return jsonify({
            "success": False,
            "message":"Please register first"
        })

    cur.execute(
        "SELECT * FROM users WHERE username=? AND password=?",
        (data["username"], data["password"])
    )

    user = cur.fetchone()

    conn.close()

    if user:

        session["username"] = data["username"]

        return jsonify({
            "success": True,
            "message":"Login Successful"
        })

    else:

        return jsonify({
            "success": False,
            "message":"Wrong Password"
        })

# BOOK TICKET
@app.route("/book", methods=["POST"])
def book():

    data = request.json

    pnr = "PNR" + str(random.randint(100000,999999))

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO tickets
    (
        username,
        train,
        source,
        destination,
        classType,
        people,
        fare,
        pnr,
        status
    )
    VALUES(?,?,?,?,?,?,?,?,?)
    """, (
        data["username"],
        data["train"],
        data["source"],
        data["destination"],
        data["classType"],
        data["people"],
        data["fare"],
        pnr,
        "Confirmed"
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Ticket Booked",
        "pnr": pnr
    })

# GET TICKETS
@app.route("/tickets/<username>")
def tickets(username):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM tickets WHERE username=?",
        (username,)
    )

    rows = cur.fetchall()

    conn.close()

    tickets = [dict(row) for row in rows]

    return jsonify(tickets)

# CANCEL TICKET
@app.route("/cancel/<pnr>", methods=["POST"])
def cancel(pnr):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "UPDATE tickets SET status='Cancelled' WHERE pnr=?",
        (pnr,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message":"Ticket Cancelled"
    })

# PNR STATUS
@app.route("/pnr/<pnr>")
def pnr_status(pnr):

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT * FROM tickets WHERE pnr=?",
        (pnr,)
    )

    row = cur.fetchone()

    conn.close()

    if row:
        return jsonify(dict(row))
    else:
        return jsonify({
            "message":"PNR Not Found"
        })

# HELP SUPPORT
@app.route("/support", methods=["POST"])
def support():

    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute(
        "INSERT INTO complaints(username,message) VALUES(?,?)",
        (data["username"], data["message"])
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message":"Support request submitted"
    })

# LOGOUT
@app.route("/logout")
def logout():

    session.pop("username", None)

    return jsonify({
        "message":"Logged out"
    })

if __name__ == "__main__":
    app.run(debug=True)