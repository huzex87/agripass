import React from "react";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Logic to navigate back to the previous page
    navigate(-1);
  };
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleGoBack}
          className="bg-blue-800 text-white p-3 rounded-2xl"
        >
          Go Back
        </button>
        CreateProject
      </div>
    </>
  );
};

export default CreateProject;
