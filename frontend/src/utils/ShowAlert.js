import { Alert, AlertTitle } from "@mui/material";
// import { useState } from "react";

// type: {
//   success,
//   warning,
//   error,
//   info
// }

function ShowAlert({ title, message = '', type = "success" }) {
  const alterStyle = {
    display: "flex",
    position: "fixed",
    top: "0",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: "2",
    justifyContent: "center",
    alignItems: "center",
    widht: "70%",
  };
  return (
    <Alert severity={type} variant="filled" sx={alterStyle}>
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}

export default ShowAlert;
