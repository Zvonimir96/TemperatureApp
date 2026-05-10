#!/usr/bin/env python3
"""Flask API for temperature/humidity readings."""
import sqlite3
from pathlib import Path
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
DB = Path(__file__).parent / "readings.db"


def query(sql, params=()):
    con = sqlite3.connect(DB)
    con.row_factory = sqlite3.Row
    rows = con.execute(sql, params).fetchall()
    con.close()
    return [dict(r) for r in rows]


@app.route("/api/days")
def days():
    rows = query(
        "SELECT substr(timestamp,1,10) AS date,"
        " round(avg(temperature),1) AS avg_temp,"
        " round(avg(humidity),1) AS avg_humi,"
        " count(*) AS count"
        " FROM readings GROUP BY date ORDER BY date"
    )
    return jsonify(rows)


@app.route("/api/readings")
def readings():
    date = request.args.get("date")
    if not date:
        return jsonify({"error": "date parameter required"}), 400
    rows = query(
        "SELECT timestamp, temperature, humidity FROM readings"
        " WHERE timestamp LIKE ? ORDER BY timestamp",
        (date + "%",),
    )
    return jsonify(rows)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
