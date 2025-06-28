import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../Utilis/Api";

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [projectData, setProjectData] = useState([]);

  const fetchProjects = async (page = 1, status) => {
    const config = { params: page, limit: 10, status };
    try {
      const response = await api.get("/projects", config);
      const { projects, currentPage, totalPage, total } = response.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects(status, page);
  }, [status, page]);

  return (
    <>
      <div className="text-2xl font-bold">Active Projects</div>
    </>
  );
};

export default Projects;
