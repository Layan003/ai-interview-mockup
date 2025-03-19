import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Feedback() {
  const { id } = useParams();
  const [interviewDetails, setInterviewDetails] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRating, setTotalRating] = useState(0);
  const { isAuthorized } = useAuth();

  // if (!isAuthorized) {
  //   return <Navigate to='/login'/>
  // }

  useEffect(() => {
    const total = questions.reduce((sum, q) => sum + Number(q.rating), 0);
    setTotalRating(total / 5);
  }, [questions]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(`interview/${id}/`);
        console.log(res.data);
        setInterviewDetails(res.data[0].interview);
        setQuestions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="py-4 px-10 md:flex md:gap-5 md:w-[95%] md:mx-auto">
        <div className="flex flex-col gap-1 md:w-1/3 bg-gray-100 h-fit rounded-lg md:mt-4 p-2 shadow-lg">
          <h1 className="font-bold text-xl mb-2">Interview details</h1>
          <h3 className="text-lg ">
            <span className="font-semibold">Job position:</span>{' '}
            {interviewDetails.job_position}
          </h3>
          <h3 className="text-lg ">
            <span className="font-semibold">Job Description:</span>{' '}
            {interviewDetails.job_description}
          </h3>
          <h3 className="text-lg ">
            <span className="font-semibold">Years of Experience:</span>{' '}
            {interviewDetails.job_experience}
          </h3>
        </div>
        <div className="md:w-2/3">
          {totalRating <= 3 && (
            <div className="bg-red-200 p-2 rounded-lg w-fit shadow-md border-2 border-red-300 mt-4">
              <p className="font-semibold">
                Overall Rating:{' '}
                <span className="font-bold">{totalRating}/10</span>
              </p>
            </div>
          )}
          {totalRating >= 4 && totalRating <= 7 && (
            <div className="bg-yellow-200 p-2 rounded-lg w-fit shadow-md border-2 border-yellow-300 mt-4">
              <p className="font-semibold">
                Overall Rating:{' '}
                <span className="font-bold">{totalRating}/10</span>
              </p>
            </div>
          )}
          {totalRating >= 8 && (
            <div className="bg-green-200 p-2 rounded-lg w-fit shadow-md border-2 border-green-300 mt-4">
              <p className="font-semibold">
                Overall Rating:{' '}
                <span className="font-bold">{totalRating}/10</span>
              </p>
            </div>
          )}

          {questions.map((question, index) => {
            return (
              <div key={index} className="flex flex-col gap-1 my-5">
                <div className="bg-gray-100 rounded-lg p-2 shadow-md border-1 border-gray-300">
                  <p>
                    <span className="font-semibold block mb-1">
                      Question{index + 1}{' '}
                    </span>
                    {question.text}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-lg p-2 border-1 border-blue-300 shadow-md">
                  <p>
                    <span className="font-semibold">Your answer:</span>{' '}
                    {question.user_answer}
                  </p>
                </div>
                <div className="bg-green-100 rounded-lg p-2 border-1 border-green-300 shadow-md">
                  <p>
                    <span className="font-semibold">AI Feedback:</span>{' '}
                    {question.feedback}
                  </p>
                </div>
                {question.rating <= 3 && (
                  <div className="bg-red-200 rounded-lg p-2 border-1 border-red-300 shadow-md w-fit">
                    <p>
                      <span className="font-semibold">Rating:</span>{' '}
                      {question.rating}/10
                    </p>
                  </div>
                )}
                {question.rating >= 4 && question.rating <= 7 && (
                  <div className="bg-yellow-200 rounded-lg p-2 border-1 border-yellow-300 shadow-md w-fit">
                    <p>
                      <span className="font-semibold">Rating:</span>{' '}
                      {question.rating}/10
                    </p>
                  </div>
                )}
                {question.rating >= 8 && (
                  <div className="bg-green-200 rounded-lg p-2 border-1 border-green-300 shadow-md w-fit">
                    <p>
                      <span className="font-semibold">Rating:</span>{' '}
                      {question.rating}/10
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}
