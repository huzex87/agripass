import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../Utilis/Api";
import { toast } from "sonner";
import { getStatusBadge } from "../../../Utilis/Status";
import { MoveLeft } from "lucide-react";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/disbursify/project_details/${projectId}`
        );
        setProject(response.data.project);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch project details", {
          description: error.response?.data?.error || "Server not responding",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page in history
          className="flex gap-4 mb-4 px-4 py-2 cursor-pointer hover:text-blue-800"
        >
          <MoveLeft /> Back to Projects
        </button>

        {/* Project DIsplay */}
        <div className="bg-white shadow-md rounded-lg p-6 dark:bg-base-100 dark:text-gray-200">
          <img
            src="https://cdn.punchng.com/wp-content/uploads/2024/08/18200218/SM-1200x630.jpg"
            alt="image"
            className="mb-4 rounded-lg shadow-md w-full h-95 object-cover"
          />
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div>
              <span>Project Status:</span> {getStatusBadge(project.status)}
            </div>
          </div>
          <p className="mb-4">{project.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
