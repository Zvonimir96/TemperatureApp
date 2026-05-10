#!/usr/bin/env python3
"""Generate mock data for development testing."""
import sqlite3
import random
from datetime import datetime, timedelta

DB = "readings.db"
con = sqlite3.connect(DB)

# Keep existing real data, add mock for previous days
existing = con.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
print(f"Existing: {existing} rows")

base = datetime(2026, 4, 15, 0, 0)
rows = []
for day_offset in range(6):  # Apr 15-20 (21 already has real data)
    day = base + timedelta(days=day_offset)
    base_temp = random.uniform(18, 26)
    base_humi = random.uniform(45, 65)
    for h in range(0, 24):
        for m in (0, 15, 30, 45):
            ts = day.replace(hour=h, minute=m)
            temp = round(base_temp + 4 * (-(h - 14) ** 2 / 50 + 1) + random.uniform(-0.5, 0.5), 1)
            humi = round(base_humi - 3 * (-(h - 14) ** 2 / 50 + 1) + random.uniform(-1, 1), 1)
            humi = max(0, min(100, humi))
            rows.append((ts.strftime("%Y-%m-%dT%H:%M:%S"), temp, humi))

con.executemany("INSERT INTO readings (timestamp, temperature, humidity) VALUES (?, ?, ?)", rows)
con.commit()
total = con.execute("SELECT COUNT(*) FROM readings").fetchone()[0]
print(f"Added {len(rows)} mock rows. Total: {total}")
con.close()
