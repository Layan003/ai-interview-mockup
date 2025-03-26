import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Question from "../components/Question";
import { useAuth } from "../context/AuthContext";
import Webcam from "react-webcam";
import { Navigate } from "react-router-dom";
import useSpeechToText from "react-hook-speech-to-text";
import PopUp from "../components/PopUp";
import { chatSession } from "../geminiAPI";
import { useRef } from "react";

export default function Interview() {
  const inputRef = useRef(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState();
  const [questions, setQuestions] = useState([]);
  const [indexCounter, setIndexCounter] = useState(0);
  const { isAuthorized, userData } = useAuth();
  const [userAnswer, setUserAnswer] = useState("");
  const [openPopUp, setOpenPopUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const navigate = useNavigate();
  const [editAnswer, setEditAnswer] = useState("");
  const [isEditAnswer, setIsEditAnswer] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // useEffect(() => {
  // if (error) return <p>Web Speech API is not available in this browser</p>;

  // }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`interview/${id}/`);

        setInterviewDetails(res.data[0].interview);
        setQuestions(res.data);
        setCurrentQuestion(res.data[0]);
        console.log("interview creator:", res.data[0].interview.user);
        console.log("user id:", userData.id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  useEffect(() => {
    if (indexCounter > 0) {
      setUserAnswer("");
      setEditAnswer("");
      setIsEditAnswer(false);
    }
  }, [indexCounter]);

  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer((prev) => prev + results[results.length - 1].transcript);
    }
  }, [results]);

  useEffect(() => {
    console.log(userAnswer);
    console.log(currentQuestion);
  }, [userAnswer]);

  const onClose = () => {
    setOpenPopUp(false);
  };

  const proceed = () => {
    setOpenPopUp(false);
    handleAnswerSubmit();
  };

  const checkUserAnswerLength = () => {
    if (userAnswer.length < 10) {
      setOpenPopUp(true);
    } else {
      setLoadingAnswer(true);
      handleAnswerSubmit();
    }
  };

  const sendAnswer = async (txt) => {
    if (txt.feedback != "" || txt.rating != "") {
      const data = {
        user_answer: userAnswer, //
        feedback: txt.feedback,
        rating: txt.rating,
        question_id: currentQuestion.id, //
      };
      try {
        const res = await api.patch(`interview/${id}/`, data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setUserAnswer("");
        setEditAnswer("");
        setIsEditAnswer(false);
      }
    }
  };

  const handleAnswerSubmit = async () => {
    setLoadingAnswer(true);

    console.log("Current Question:", currentQuestion.text);
    try {
      const inputPrompt =
        "Question: " +
        currentQuestion.text +
        ", User Answer: " +
        userAnswer +
        ", Depends on question and user answer for the given interview question. " +
        "Please give us rating out of 10 for answer and feedback as area of improvement if any in just 3 tp 5 lines to improve it in JSON format with rating field and feedback field. Note that this is a speech-to-text answer, so if any words seem unclear or out of place, try to determine their intended meaning";
      const res = chatSession.sendMessage(inputPrompt);

      let text = (await res).response.text().replace("```json", "");
      let search = "```";
      let lastIndex = text.lastIndexOf(search);

      if (lastIndex !== -1) {
        text =
          text.substring(0, lastIndex) +
          text.substring(lastIndex + search.length);
      }
      let txt = JSON.parse(text);

      await sendAnswer(txt);
    } catch (error) {
      console.error(error);
    } finally {
      setUserAnswer("");
      setEditAnswer("");
      setIsEditAnswer(false);
      setLoadingAnswer(false);
      setIndexCounter((prev) => prev + 1);
      if (indexCounter == 4) {
        return navigate(`/interview/${id}/feedback/`);
      }
    }
  };

  useEffect(() => {
    if (editAnswer && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(editAnswer.length, editAnswer.length);
      setUserAnswer(editAnswer);
    }
  }, [isEditAnswer]);

  useEffect(() => {
    setEditAnswer(userAnswer);
  }, [userAnswer]);

  // useEffect(() => {
  //   setUserAnswer(editAnswer);
  // }, [editAnswer]);

  const handleEditAnswer = () => {
    setIsEditAnswer(false);
    setUserAnswer(editAnswer);
  };

  return (
    <>
      <Navbar />
      <div className="py-6 px-15 flex flex-col md:flex-row md:justify-center lg:w-[70%] lg:m-auto gap-4 md:gap-8">
        <div>
          <div className="my-2 w-[350px] h-[250px] bg-black m-auto rounded-md shadow-lg overflow-hidden">
            <Webcam mirrored={true} classID="rounded-md" />
          </div>
          {isRecording ? (
            <div
              onClick={stopSpeechToText}
              className="mx-auto mt-5 flex gap-3 items-center bg-white text-black w-fit px-4 py-2 rounded-lg shadow-lg hover:cursor-pointer"
            >
              <div className="bg-white fade-animation rounded-full w-fit p-0.5 shadow-md border-1 border-gray-300">
                <img src="/mic_red.svg" width={22} />
              </div>
              <p
                className="fade-animation font-semibold"
                style={{ color: "#BD4C31" }}
              >
                Pause recording
              </p>
            </div>
          ) : (
            <div
              onClick={startSpeechToText}
              className="mx-auto mt-5 flex gap-3 items-center bg-white text-black w-fit px-4 py-2 rounded-lg shadow-lg hover:cursor-pointer"
            >
              <div className="bg-white rounded-full w-fit p-0.5 shadow-md border-1 border-gray-300">
                <img src="/mic_black.svg" width={22} />
              </div>
              <p className="font-semibold">start recording</p>
            </div>
          )}
          <div className="bg-amber-100 border border-amber-400 rounded-lg p-2 w-fit my-3 mx-auto flex items-center gap-3">
            <img src="/lightbulb.svg" alt="" width={20} />
            <p className="text-amber-700 text-sm">Ensure that microphone access is enabled</p>
          </div>
          {userAnswer && (
            <div className="bg-white p-3 rounded-lg shadow-md flex justify-between items-start my-5  max-w-[550px]">
              <div className="flex-5/6">
                {isEditAnswer ? (
                  <div>
                    <textarea
                      className="border-1 border-gray-500 rounded-lg p-2 min-h-[100px] w-[100%] "
                      type="text"
                      value={editAnswer}
                      ref={inputRef}
                      onChange={(e) => setEditAnswer(e.target.value)}
                    ></textarea>
                  </div>
                ) : (
                  <div>{userAnswer}</div>
                )}
              </div>
              <div className="flex-1/6 justify-end flex gap-4">
                {isEditAnswer ? (
                  <img
                    src="/check.svg"
                    alt="edit icon"
                    width={18}
                    onClick={handleEditAnswer}
                    className="hover:cursor-pointer hover:opacity-50"
                  />
                ) : (
                  <img
                    src="/edit.svg"
                    alt="edit icon"
                    width={18}
                    onClick={() => setIsEditAnswer(true)}
                    className="hover:cursor-pointer hover:opacity-50"
                  />
                )}
                <img
                  src="/refresh.svg"
                  width={18}
                  alt="refresh icon"
                  className="hover:cursor-pointer hover:opacity-50"
                  onClick={() => setUserAnswer("")}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex-3/4  ">
          {loading ? (
            <Loading />
          ) : (
            questions.map((question, index) => {
              return (
                <Question
                  key={index}
                  question={question}
                  index={index}
                  indexCounter={indexCounter}
                  setIndexCounter={setIndexCounter}
                  setCurrentQuestion={setCurrentQuestion}
                  checkUserAnswerLength={checkUserAnswerLength}
                  setLoadingAnswer={setLoadingAnswer}
                  loadingAnswer={loadingAnswer}
                  interviewId={id}
                />
              );
            })
          )}
        </div>
      </div>
      {openPopUp && <PopUp onClose={onClose} proceed={proceed} />}
    </>
  );
}
