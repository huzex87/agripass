import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Outlet } from "react-router-dom";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Header } from "../Layouts/Header";
import { Sidebar } from "../Layouts/Sidebar";
import cn from "../../Utilis/cn";

const Organization = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const { subdomain } = useParams();
  const orgName = subdomain || "Administrator";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/disbursify/resources");
        setData(response?.data?.responseData || {});
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  return (
    <>
      <div>Organization</div>
    </>
  );
};

export default Organization;
