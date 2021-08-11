import sqlite3
import csv
 
conn = sqlite3.connect('static/counts.sqlite')
 
cur = conn.cursor()
cur.execute("DROP TABLE IF EXISTS counts") 
cur.execute("""CREATE TABLE counts(
    ID INTEGER PRIMARY KEY AUTOINCREMENT,
    countID INTEGER,
    onStreet TEXT,
    location TEXT,
    xStreet TEXT,
    countDirection TEXT,
    heading TEXT,
    countStart TEXT,
    totalCount INTEGER
    )""")
 
with open('static/BikeCountsHourly.csv', "r") as csv_file:
    reader = csv.reader(csv_file)
    #Skip the header 
    next(reader)
    cur.executemany("""INSERT INTO counts (
            countID,
            onStreet,
            location,
            xStreet,
            countDirection,
            heading,
            countStart,
            totalCount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);""", reader)
cur.execute("CREATE INDEX countID_idx on counts(countID);")
conn.commit()
conn.close()
