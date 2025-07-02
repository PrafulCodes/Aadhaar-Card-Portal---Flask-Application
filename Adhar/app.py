from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# MySQL Config
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '#',
    'database': 'Aadhar Card'
}

# Route to serve index.html
@app.route('/')
def home():
    return render_template('index.html')

# ✅ New route to serve developer.html
@app.route('/developer')
def developer():
    return render_template('developer.html')

# Route to store signup data
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({'message': 'Missing data'}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
        cursor.execute(sql, (name, email))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': 'User added successfully'})

    except mysql.connector.Error as err:
        return jsonify({'message': f'Error: {err}'}), 500

if __name__ == '__main__':
    app.run(debug=True)