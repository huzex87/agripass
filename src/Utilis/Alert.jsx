import React from "react";
import { Alert } from "@mui/material";

const Alert = ({ message = "" }) => {
  return (
    <>
      <Alert severity="success"> {message} </Alert>
    </>
  );
};

export default Alert;
