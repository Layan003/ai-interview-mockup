import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Question({
  question,
  index,
  indexCounter,
  checkUserAnswerLength,
  setCurrentQuestion,
  loadingAnswer,
}) {
  const navigate = useNavigate();
  useEffect(() => {
    if (indexCounter === index) {
      setCurrentQuestion(question);
    }
  }, [question, indexCounter]);

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <h2 className="bg-primary rounded-t-lg text-white font-semibold p-2 questions-container my-1.5">
        Question {index + 1}
      </h2>
      {indexCounter === index && (
        <div className="mb-6 p-3">
          <p className="mb-6">{question.text}</p>

          <div className=" flex justify-end gap-3 p-2">
            {loadingAnswer ? (
              <button
                disabled
                className="flex items-center gap-2 rounded-lg bg-secondary text-white hover:bg-primary-hover hover:transition px-4 py-2"
              >
                <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>

                <p>Next</p>
              </button>
            ) : index === 4 ? (
              <button
                onClick={checkUserAnswerLength}
                className="px-3 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition"
              >
                End Interview
              </button>
            ) : (
              <button
                onClick={checkUserAnswerLength}
                className="px-3 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
