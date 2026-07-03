import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../utils/Api";
import { getStatusBadge } from "../../../utils/Status";
import { toast } from "sonner";
import { formatDate } from "../../../utils/dateFormatter";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import DOMPurify from "dompurify";
import { useQuery } from "@tanstack/react-query";

const Projects = () => {
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const subdomain = useParams().subdomain;

  // New state for offline status
  const [offline, setOffline] = useState(!navigator.onLine);

  // User Offline Check
  useEffect(() => {
    const handleOnline = () => {
      setOffline(false);
      toast.success("Connection Restored", {
        description: "Your Internet connection is restored. Fetching data...",
      });
    };

    const handleOffline = () => {
      setOffline(true);
      toast.error("Internet Error", {
        description:
          "You are currently offline. Please check your internet connection.",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const { data, isLoading: loading } = useQuery({
    queryKey: ["projects", status, currentPage],
    queryFn: async () => {
      const config = {
        params: {
          page: currentPage,
          limit: 10,
          status,
        },
      };
      const response = await api.get("/api/v1/projects", config);
      return response.data;
    },
    enabled: !offline,
  });

  const projectData = data?.projects || [];
  const totalPages = data?.totalPage || 1;
  const total = data?.total || 0;

  const handleProjectClick = (projectId) => {
    navigate(`/${subdomain}/project/${projectId}`);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <>
      <div className="text-2xl font-bold">Projects</div>

      {/* Status Filter */}
      <div className="mb-4 mt-5 flex items-center gap-2 ">
        <h2>Filter By:</h2>
        <select
          className="select select-bordered w-full max-w-xs"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="suspended">Suspended</option>
          {/* <option value="draft">Pending</option> */}
          <option value="">All Status</option>
        </select>

        {/* Create New Project Button */}
        <div className="ml-auto">
          <Link to={`/${subdomain}/newProject`} className="btn">
            {" "}
            <Plus /> New Project
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Projects Data Display */}
      {!loading && (
        <div className="container mx-auto p-6 mb-6">
          {projectData.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
                Showing {projectData.length} of {total} projects
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectData.map((project, index) => (
                  <div
                    key={project.id || index}
                    onClick={() => handleProjectClick(project._id)}
                    className="card bg-none shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <figure>
                      <img
                        src={project.imageURL}
                        alt="image"
                        className="h-70 object-cover w-full"
                      />
                    </figure>
                    <div className="card-body">
                      <div className="flex items-center gap-4 justify-between">
                        <h2 className="card-title lg:text-3xl">
                          {project.name || `Project ${index + 1}`}
                        </h2>
                        {/* {getStatusBadge(project.status)} */}
                      </div>
                      <div className="line-clamp-3" />

                      <div
                        className="line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: project.description
                            ? DOMPurify.sanitize(project.description)
                            : "No description available",
                        }}
                      />
                      <div className="mt-3 flex gap-2 ">
                        <span className="font-medium">Created On:</span>{" "}
                        <h4> {formatDate(project.createdAt)}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-white">No projects found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className={`join-item btn ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              «
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`join-item btn ${
                  currentPage === pageNum ? "btn-active" : ""
                }`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className={`join-item btn ${
                currentPage === totalPages ? "btn-disabled" : ""
              }`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Pagination Info */}
      {!loading && totalPages > 1 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({total} total items)
          </p>
        </div>
      )}
    </>
  );
};

export default Projects;
