from app import create_app
from flask_cors import CORS

app = create_app()

# Enable CORS for the entire app
CORS(app, resources={r"/api/*": {"origins": "*"}})

if __name__ == "__main__":
    app.run(debug=True)
