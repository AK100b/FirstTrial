# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Sample decision tree
questions = [
    {
        "question": "What symptoms are you experiencing?",
        "options": ["Fever", "Cough", "Headache", "Other"]
    },
    {
        "question": "How long have you had this symptom?",
        "options": ["1-2 days", "3-5 days", "More than a week", "Other"]
    },
    {
        "question": "Are you experiencing any of the following?",
        "options": ["Fatigue", "Nausea", "Shortness of breath", "Other"]
    }
]

@app.route('/next-question', methods=['POST'])
def next_question():
    data = request.get_json()
    answers = data.get('answers', [])

    if len(answers) < len(questions):
        q = questions[len(answers)]
        return jsonify({
            "question": q["question"],
            "options": q["options"]
        })
    else:
        # Simple logic to mock a diagnosis
        return jsonify({
            "diagnosis": "You may have a mild viral infection.",
            "specialist": "General Physician"
        })

if __name__ == '__main__':
    app.run(debug=True)
