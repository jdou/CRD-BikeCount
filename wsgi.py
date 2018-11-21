from flask import Flask, render_template,jsonify,json,g
import sqlite3
application = Flask(__name__)

DATABASE = 'static/counts.sqlite'

def get_db(row=True):
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        if row==True:
            db.row_factory=sqlite3.Row
    return db

@application.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@application.route("/")
def index():
    return render_template("index.html")

@application.route("/chart/<int:countID>")
def chart(countID):

    return render_template("chart.html",countID=countID)    

@application.route("/table/<int:countID>")
def table(countID):
    counts=get_db().execute('''SELECT countID,onStreet,location,xStreet,
                            strftime('%Y-%m-%d',countStart) as countDate,
                            strftime('%H:%M',countStart) as countTime, heading, totalCount 
                            FROM counts WHERE countID=? ORDER BY countStart''',(countID,)).fetchall()
    return render_template("table.html",counts=counts)         

@application.route("/data/v1.0/<int:countID>", methods=['GET'])
def data(countID):
    counts=get_db().execute('SELECT * FROM counts WHERE countID=?',(countID,)).fetchall()
    return jsonify([dict(ix) for ix in counts])

if __name__ == "__main__":
    application.run()