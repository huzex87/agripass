import React from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Button1 = ({ label, to, variant = "contained", onCLick, sx = {} }) => {
  return (
    <>
      <Button
        component={to ? Link : "button"}
        to={to}
        variant={variant}
        onClick={onCLick}
        sx={{
          borderColor: "#FD8A2E",
          color: "white",
          "&:hover": {
            // backgroundColor: "#ff9900",
            color: "white",
          },
          ...sx,
        }}
      >
        {label}
      </Button>
    </>
  );
};

export default Button1;
