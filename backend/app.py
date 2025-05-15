from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import tenseal as ts
import base64
import time
from cryptography.fernet import Fernet


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": [ "https://thankful-bush-048802f1e.6.azurestaticapps.net", "https://he-frontend-guf8fpesaxgtf7d0.ukwest-01.azurewebsites.net"], "methods": ["GET", "POST", "OPTIONS"]}})


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bmi_records.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# =================== TenSEAL Context ===================
def create_encryption_context():
    context = ts.context(
        scheme=ts.SCHEME_TYPE.BFV,
        poly_modulus_degree=8192,
        coeff_mod_bit_sizes=[60, 40, 40, 60],
        plain_modulus=1032193
    )
    context.generate_galois_keys()
    return context

ENCRYPTION_CONTEXT = create_encryption_context()

# =================== Helper Functions ===================
def encrypt_data(value):
    """Encrypt an integer using BFV and return a base64 string."""
    encrypted_val = ts.bfv_vector(ENCRYPTION_CONTEXT, [int(value)])
    return base64.b64encode(encrypted_val.serialize()).decode('utf-8')

def decrypt_data(encrypted_value):
    """Decrypt a base64-encoded encrypted value and return the integer."""
    try:
        encrypted_bytes = base64.b64decode(encrypted_value)
        encrypted_vector = ts.bfv_vector_from(ENCRYPTION_CONTEXT, encrypted_bytes)
        return encrypted_vector.decrypt()[0]
    except Exception as e:
        return str(e)

# =================== API ROUTES ===================
@app.route("/", methods=["GET"])
def home():
    return "<h2>Backend is Running - Flask + TenSEAL</h2><p>Use the API endpoints at <code>/api/encrypt_bmi</code>, <code>/api/decrypt_bmi</code>, and <code>/api/benchmark</code>.</p>"

@app.route("/api/encrypt_bmi", methods=["POST"])
def encrypt_bmi():
    try:
        data = request.json
        weight = int(data["weight"])
        height = int(data["height"])

        encrypted_weight = encrypt_data(weight)
        encrypted_height = encrypt_data(height)

        return jsonify({
            "encrypted_weight": encrypted_weight,
            "encrypted_height": encrypted_height
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/decrypt_bmi", methods=["POST"], strict_slashes=False)
def decrypt_bmi():
    try:
        data = request.json
        encrypted_weight = data["encrypted_weight"]
        encrypted_height = data["encrypted_height"]

        print("Incoming data:", data)  # Debug

        # Decrypt values
        weight = decrypt_data(encrypted_weight)
        height = decrypt_data(encrypted_height)

        print("Decrypted weight:", weight)
        print("Decrypted height:", height)

        # Make sure decryption worked
        if isinstance(weight, str) or isinstance(height, str):
            raise ValueError("Decryption failed. Encrypted values may be invalid or not base64.")

        # Compute BMI using decrypted values
        bmi = round(weight / ((height / 100) ** 2), 2)

        return jsonify({"decrypted_bmi": bmi}), 200

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": "Decryption failed. Please encrypt values first or check the input format."}), 400


@app.route("/api/benchmark", methods=["GET"])
def benchmark():
    results = {}

    # Homomorphic Encryption Benchmark
    start = time.time()
    encrypted_weight = encrypt_data(70)
    encrypted_height = encrypt_data(175)
    _ = decrypt_data(encrypted_weight)
    _ = decrypt_data(encrypted_height)
    results["Homomorphic Encryption"] = round(time.time() - start, 4)

    # AES Benchmark (Fernet Example)
    key = Fernet.generate_key()
    cipher = Fernet(key)
    start = time.time()
    token = cipher.encrypt(b"70")
    _ = cipher.decrypt(token)
    results["AES"] = round(time.time() - start, 4)

    return jsonify(results)

class BMIRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    weight = db.Column(db.Integer)
    height = db.Column(db.Integer)
    bmi = db.Column(db.Float)
    category = db.Column(db.String(50))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@app.route("/api/save_bmi", methods=["POST"])
def save_bmi():
    data = request.json
    name = data.get("name", "Anonymous")
    weight = int(data["weight"])
    height = int(data["height"])
    bmi = float(data["bmi"])
    category = data["category"]

    record = BMIRecord(name=name, weight=weight, height=height, bmi=bmi, category=category)
    db.session.add(record)
    db.session.commit()

    return jsonify({"message": "Record saved successfully!"}), 201

@app.route("/api/bmi_records", methods=["GET"])
def get_bmi_records():
    records = BMIRecord.query.order_by(BMIRecord.timestamp.desc()).all()
    return jsonify([
        {
            "name": r.name,
            "weight": r.weight,
            "height": r.height,
            "bmi": r.bmi,
            "category": r.category,
            "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        } for r in records
    ])


# =================== Start Server ===================
# =================== Start Server ===================
if __name__ == "__main__":
    # Ensure all tables (BMIRecord) are created before serving
    with app.app_context():
        db.create_all()

    app.run()


