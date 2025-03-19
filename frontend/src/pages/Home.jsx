import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import NewInterview from "../components/newInterview";
import api from "../api";

export default function Home() {
  const { isAuthorized, userData, logout } = useAuth();
  const [newInterviewPopUp, setNewInterviewPopUp] = useState(false);
  const navigate = useNavigate();
  const [oldInterviews, setOldInterview] = useState([]);
  
  useEffect(() => {
    const fetchOldInterviews = async () =>{
    
      const res = await api.get('interview/')
      console.log(res.data);
      setOldInterview(res.data)
    }
    fetchOldInterviews();
  }, [])


  return (
    <>
    <Navbar />
    <div className="py-2 px-10">
      <div onClick={()  => setNewInterviewPopUp(true)} className="text-center w-[80%] md:w-[40%] my-6 mx-auto p-10 rounded-lg shadow-lg bg-primary font-bold hover:scale-103 hover:transition hover:bg-primary-hover">
        <p className="text-white md:text-xl">+ Create New Interview</p>
      </div>

      <div>
      {oldInterviews.length>0&&(<h2 className="font-bold mb-4 md:text-xl">Interviews history:</h2>)}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {oldInterviews.map((interview) => {
            return ( <div key={interview.id} className="bg-secondary rounded-lg shadow-md p-4 hover:bg-primary transition-all ">
              <h1 className="font-semibold mb-3">{interview.job_position} - {interview.job_experience} years of experience</h1>
              <div className="flex justify-between items-center">
              <p className="text-sm">{new Date(interview.created_at).toISOString().split("T")[0]}</p>
              <p onClick={() => navigate(`interview/${interview.id}/feedback/`)} className="text-right underline hover:text-primary-hover">see details</p>
            </div> </div>)
          })}
        </div>
      </div>
    </div>
    {newInterviewPopUp&&(<NewInterview setNewInterviewPopUp={setNewInterviewPopUp}/>)}
    </>
  );
}
