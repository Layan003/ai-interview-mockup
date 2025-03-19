import React, { useEffect, useState } from "react";
import api from "../api";
import { chatSession } from "../geminiAPI";
import { useNavigate } from "react-router-dom";

export default function NewInterview({ setNewInterviewPopUp }) {
  const navigate = useNavigate();
  const [interviewDetails, setInterviewDetails] = useState({
    job_position: "",
    job_description: "",
    job_experience: "",
    json_response: "",
  });
  const [loading, setLoading] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterviewDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (interviewDetails.json_response != "") {
      const sendInterviewDetails = async () => {
        console.log(
          "Updated interviewDetails.json_response:",
          interviewDetails.json_response
        );
        try {
          const res = await api.post("/interview/", interviewDetails);
          console.log(res.data);
          navigate(`interview/${res.data.id}/`);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          setNewInterviewPopUp(false);
          Object.entries(interviewDetails).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
          });
        }
      };
      sendInterviewDetails();
    } else {
      console.log("Json Response is empty");
    }
  }, [interviewDetails.json_response]);

  const handleSubmit = async () => {
    setLoading(true);
    const inputPrompt = `Job Position: ${interviewDetails.job_position}, Job Description: ${interviewDetails.job_description}, Job Experience: ${interviewDetails.job_experience}, depends on Job position, Job Description & Years of Experience give us 5 Interview question along with Answers in JSON format, give us question and answer field on JSON.`;
    const res = await chatSession.sendMessage(inputPrompt);

    let text = res.response.text().replace("```json", "");
    let search = "```";
    let lastIndex = text.lastIndexOf(search);

    if (lastIndex !== -1) {
      text =
        text.substring(0, lastIndex) +
        text.substring(lastIndex + search.length);
    }
    const jsonResponse = JSON.parse(text);
    console.log(jsonResponse);
    setInterviewDetails((prev) => ({
      ...prev,
      json_response: JSON.stringify(jsonResponse),
    }));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
      <div className="rounded-lg bg-white p-6 shadow-lg w-[90%] md:w-[60%] lg:w-[40%]">
        <div className="w-auto ">
          <div className="mb-5">
            <h1 className="md:text-2xl font-bold">
              Tell us more about Job you are interviewing
            </h1>
            <p className="text-sm md:text-xl">
              Add Details about job position, your skills and Year of experience
            </p>
          </div>
          <div className="mb-3">
            <p className="md:text-xl">Job Position / Role name</p>
            <input
              type="text"
              value={interviewDetails.job_position}
              onChange={handleChange}
              name="job_position"
              placeholder="Ex. Software Engineering"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-[100%] shadow-sm"
            />
          </div>
          <div className="mb-3">
            <p className="md:text-xl">Job Description / Tech Stack in Short</p>
            <textarea
              name="job_description"
              id=""
              value={interviewDetails.job_description}
              onChange={handleChange}
              placeholder="Ex. React, Angular, MySql etc"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-[100%] shadow-sm"
            ></textarea>
          </div>
          <div className="mb-3">
            <p className="md:text-xl">No of Year Experience</p>
            <input
              type="number"
              name="job_experience"
              value={interviewDetails.job_experience}
              onChange={handleChange}
              placeholder="Ex. 5"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-[100%] shadow-sm"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setNewInterviewPopUp(false)}
            className="rounded-lg bg-gray-200 hover:bg-gray-300 text-black px-4 py-2"
          >
            Close
          </button>
          {loading ? (
            <button
              disabled
              className="flex items-center gap-2 rounded-lg bg-secondary text-white hover:bg-primary-hover hover:transition px-4 py-2"
            >
              <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>

              <p>Generating Questions</p>
            </button>
          ) : (
            <button
              onClick={() => handleSubmit()}
              className=" rounded-lg bg-primary text-white hover:bg-primary-hover hover:transition px-4 py-2"
            >
              Generate Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
