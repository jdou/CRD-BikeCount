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
 
with open('static/BikeCountsHourly.csv', "rb") as csv_file:
    reader = csv.reader(csv_file)
    #Skip the header 
    next(reader)
    for row in reader:
        to_db = [
        unicode(row[0], "utf8"), 
        unicode(row[1], "utf8"),
        unicode(row[2], "utf8"),
        unicode(row[3], "utf8"),
        unicode(row[4], "utf8"),
        unicode(row[5], "utf8"),
        unicode(row[6], "utf8"),
        row[7]
       
        ]
        cur.execute("""INSERT INTO counts (
            countID,
            onStreet,
            location,
            xStreet,
            countDirection,
            heading,
            countStart,
            totalCount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);""", to_db)
cur.execute("CREATE INDEX countID_idx on counts(countID);")
conn.commit()
conn.close()
