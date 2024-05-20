import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ShowAlert from "./utils/ShowAlert";

import {
  Button,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";

function AuthForm() {
  const [isLoginDisplay, setIsLogin] = useState(true);

  return (
    <>
      {isLoginDisplay ? (
        <Login showSignup={setIsLogin} />
      ) : (
        <SignUp showLogin={setIsLogin} />
      )}
    </>
  );
}

function SignUp({ showLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({});

  async function handleSignUp() {
    // Check if email or password is empty
    if (!email || !password || !name || !confirmPassword) {
      setAlertMessage({
        message: "Please do not left any field empty",
        title: "Empty Field",
        type: "warning",
      });
      setTimeout(() => {
        setAlertMessage("");
      }, 2000);
      return;
    }

    // Validate email format
    if (!email.includes("@acropolis.in")) {
      setAlertMessage({
        message: "Please enter a valid email ending with '@acropolis.in'",
        title: "Invalid Input",
        type: "warning",
      });
      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:2452/api/v1/students/signup",
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );
      // console.log(response.data);
      const { token } = response.data;

      // Save the token in a cookie
      Cookies.set("jwt", token);

      const { student } = response.data.data;
      // Save student data in local storage
      localStorage.setItem("user", JSON.stringify(student));
      setAlertMessage({ message: "Account Created!" });

      setTimeout(() => {
        setAlertMessage({});
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        title: "Error",
        type: "error",
        message: error.response.data.error.message,
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 3000);
    }
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  return (
    <div className="flex-container signup-body">
      {Object.keys(alertMessage).length === 0 ? (
        ""
      ) : (
        <ShowAlert
          message={alertMessage.message}
          title={alertMessage.title}
          type={alertMessage.type}
        />
      )}
      <div className="flex-6 flex-center">
        <img src="/images/signArt.png" alt="sign-Art" className="art-img" />
      </div>

      <div className="flex-4 flex-center">
        <div className="grid-container signup-box">
          <div className="signup-logo">
            <img src="/images/logowhite.png" alt="logo" />
          </div>
          <h2>Placement starts here 🚀</h2>
          <p className="text-gray">Make your palcement easy and success !</p>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "43ch" },
            }}
            noValidate
            autoComplete="off"
            style={{ marginTop: "20px" }}
          >
            <TextField
              id="name"
              label="Name"
              variant="outlined"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              // error
              id="pass"
              label="Password"
              type="password"
              variant="outlined"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // helperText="Incorrect Password."
            />
            <TextField
              id="confirmpass"
              label="Confirm Password"
              type={"password"}
              variant="outlined"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormControlLabel
              value="end"
              control={<Checkbox />}
              label="I agree to privacy policy and terms"
              labelPlacement="end"
              required={true}
            />

            <Button
              variant="contained"
              sx={{ width: "80% !important", backgroundColor: "#176b87" }}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </Box>
          <p className="text-gray text-center">
            Already have an account ?
            <Button variant="text" onClick={() => showLogin((cs) => !cs)}>
              Login Instead
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Login({ showSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState({});

  const handleLogin = async () => {
    // Check if email or password is empty
    if (!email || !password) {
      setAlertMessage({
        message: "Email and password are required",
        title: "Empty Field",
        type: "warning",
      });
      setTimeout(() => {
        setAlertMessage("");
      }, 2000);
      return;
    }

    // Validate email format
    if (!email.includes("@acropolis.in")) {
      setAlertMessage({
        message: "Please enter a valid email ending with '@acropolis.in'",
        title: "Invalid Input",
        type: "warning",
      });
      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:2452/api/v1/students/login",
        {
          email,
          password,
        }
      );
      // console.log(response.data);
      const { token } = response.data;

      // Save the token in a cookie
      Cookies.set("jwt", token);

      const { student } = response.data.data;
      // Save student data in local storage
      localStorage.setItem("user", JSON.stringify(student));

      setAlertMessage({ message: "Successfully Logged In !" });

      setTimeout(() => {
        setAlertMessage({});
        window.location.href = "/profile";
      }, 2000);
    } catch (error) {
      // console.log(error);
      setAlertMessage({
        title: "Error",
        type: "error",
        message: error.response.data.message,
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 3000);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex-container signup-body">
      {Object.keys(alertMessage).length === 0 ? (
        ""
      ) : (
        <ShowAlert
          message={alertMessage.message}
          title={alertMessage.title}
          type={alertMessage.type}
        />
      )}
      <div className="flex-6 flex-center">
        <img src="/images/loginArt.png" alt="login-Art" className="art-img" />
      </div>

      <div className="flex-4 flex-center">
        <div className="grid-container signup-box">
          <div className="signup-logo">
            <img src="/images/logowhite.png" alt="logo" />
          </div>
          <h2>Welcome to PlacEase 🚀</h2>
          <p className="text-gray">
            Please log-in to your account and get placed soon
          </p>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "43ch" },
            }}
            noValidate
            autoComplete="off"
            style={{ marginTop: "20px" }}
          >
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              // error
              id="pass"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              // helperText="Incorrect Password."
            />
            <Stack spacing={14} direction="row">
              <FormControlLabel
                value="end"
                control={<Checkbox />}
                label="Remember Me"
                labelPlacement="end"
              />
              <Button variant="text" size="small" sx={{ fontWeight: "bold" }}>
                Forgot Password ?
              </Button>
            </Stack>

            <Button
              variant="contained"
              sx={{ width: "80% !important", backgroundColor: "#176b87" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>
          <p className="text-gray text-center">
            New on our platfrom ?
            <Button variant="text" onClick={() => showSignup((cs) => !cs)}>
              Create an account
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
