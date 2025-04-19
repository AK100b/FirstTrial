import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const questions = [
  {
    question: "What symptoms are you experiencing?",
    options: ["Fever", "Cough", "Headache", "Stomach Pain"]
  },
  {
    question: "How long have you had these symptoms?",
    options: ["Less than a day", "1-3 days", "4-7 days", "More than a week"]
  },
  {
    question: "On a scale of 1-10, how severe are they?",
    options: ["1-3 (Mild)", "4-6 (Moderate)", "7-9 (Severe)", "10 (Extreme)"]
  }
];

export default function HealthApp() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setStep(1);
  };

  const handleOptionSelect = async (option) => {
    const updatedAnswers = [...answers, option];
    setAnswers(updatedAnswers);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Send answers to backend server
      setLoading(true);
      try {
        const res = await fetch("https://your-backend-server.com/api/diagnose", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers: updatedAnswers }),
        });
        const data = await res.json();
        setResponse(data);
      } catch (error) {
        setResponse({ error: "Failed to fetch diagnosis." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4">
          {step === 0 && (
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-semibold">Welcome to HealthMate</h1>
              <p>Please share your symptoms to help us guide you better.</p>
              <Button onClick={handleStart}>Start</Button>
            </div>
          )}

          {step > 0 && step <= questions.length && (
            <div className="space-y-4">
              <p className="font-medium">{questions[step - 1].question}</p>
              <div className="space-y-2">
                {questions[step - 1].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {loading && <p>Analyzing your responses...</p>}

          {response && (
            <div className="space-y-2">
              {response.error ? (
                <p className="text-red-500">{response.error}</p>
              ) : (
                <>
                  <p className="font-semibold text-lg">Suggested Diagnosis:</p>
                  <p>{response.diagnosis}</p>
                  <p className="font-semibold text-lg mt-2">Recommended Specialist:</p>
                  <p>{response.specialist}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
