from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# load model
model = joblib.load("model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body found"}), 400

    # required keys expected by backend
    if "test_score" not in data or "project_score" not in data:
        return jsonify({"error": "Missing required fields: test_score, project_score"}), 400

    test_score = data["test_score"]
    project_score = data["project_score"]

    # make sure inputs are numbers
    try:
        test_score = float(test_score)
        project_score = float(project_score)
    except Exception:
        return jsonify({"error": "test_score and project_score must be numeric"}), 400

    # predict
    pred = model.predict([[test_score, project_score]])[0]

    # return a simple JSON key the backend expects
    return jsonify({"predicted_skill": str(pred)}), 200

if __name__ == "__main__":
    app.run(port=5002, debug=True)
