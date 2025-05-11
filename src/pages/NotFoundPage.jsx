import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../constants/motion";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-svh">
      <h1 className="font-bold text-8xl">404</h1>
      <h3 className="text-4xl">Not Found</h3>
      <p>The page you are looking for does not exist</p>
      <div className="flex gap-4 bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition-colors cursor-pointer group">
        <Link to="/">Go back to Homepage</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
