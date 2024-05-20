import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App";
import AuthForm from "./AuthForm";
import CompanyList from "./CompanyList";
import Inbox from "./Inbox";
import Profile from "./Profile";
import AdminPanel from "./admin/AdminPanel";
// import DataTable from "./admin/DataTable";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthForm />,
  },
  {
    path: "/companies",
    element: <CompanyList />,
  },
  {
    path: "/inbox",
    element: <Inbox />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/admin/students",
    element: <AdminPanel />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
