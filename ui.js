import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function HealthApp() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const fetchNextQuestion = async (updatedAnswers) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/next-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: updatedAnswers }),
      });
      const data = await res.json();

      if (data.question && data.options) {
        setQuestion(data.question);
        setOptions(data.options);
        setStep(step + 1);
      } else if (data.diagnosis) {
        setResponse(data);
      }
    } catch (error) {
      setResponse({ error: "Failed to fetch question." });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    fetchNextQuestion([]);
  };

  const handleOptionSelect = (option) => {
    if (option === "Other") {
      setShowInput(true);
    } else {
      const updatedAnswers = [...answers, option];
      setAnswers(updatedAnswers);
      setShowInput(false);
      fetchNextQuestion(updatedAnswers);
    }
  };

  const handleSubmit = () => {
    if (input) {
      const updatedAnswers = [...answers, input];
      setAnswers(updatedAnswers);
      setInput("");
      setShowInput(false);
      fetchNextQuestion(updatedAnswers);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-green-100 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div className="text-center space-y-4">
                <h1 className="text-2xl font-semibold">Welcome to HealthMate</h1>
                <p>Please share your symptoms to help us guide you better.</p>
                <Button onClick={handleStart}>Start</Button>
              </div>
            )}

            {step > 0 && question && (
              <div className="space-y-4">
                <p className="font-medium">{question}</p>
                <div className="space-y-2">
                  {options.map((option, index) => (
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

                {showInput && (
                  <div className="space-y-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Please specify"
                    />
                    <Button onClick={handleSubmit} disabled={!input}>Submit</Button>
                  </div>
                )}
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
      </motion.div>
    </div>
  );
}
