import { Button, TextField, Box, InputLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../utils/Loader";
import ShowAlert from "../utils/ShowAlert";

export default function GeneralInformation() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [userData, setUserData] = useState(JSON.parse(localStorage.user));
  const [alertMessage, setAlertMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(
    function () {
      async function getUserData() {
        try {
          setLoading(true);

          setFirstName(userData.name.split(" ")[0]);
          setLastName(userData.name.split(" ")[1]);
          setDob(convertDateFormate(userData.dob));
          setPhone(userData.phone);
          setAddress(userData.address);

          setLoading(false);
        } catch (error) {
          console.log(error);
          setAlertMessage({
            type: "error",
            title: "Failed To Fetch Data",
            message: "An Error Occured while fetching data",
          });

          setTimeout(() => {
            setAlertMessage({});
          }, 2000);
        }
      }
      getUserData();
    },
    [userData]
  );

  // to handle the disabled input fields
  function handleEditButton() {
    setIsDisabled((cs) => !cs);
    const user = userData;

    setUserData(user);
    setFirstName(user.name.split(" ")[0]);
    setLastName(user.name.split(" ")[1]);
    setDob(convertDateFormate(user.dob));
    setPhone(user.phone);
    setAddress(user.address);
  }

  // to handle save button
  async function handleSaveButton() {
    let fields = {
      name: `${firstName} ${lastName}`,
      dob: new Date(dob).toISOString(),
      phone,
      address,
    };
    const changedFields = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== userData[key]) {
        changedFields[key] = value;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      setAlertMessage({
        type: "info",
        title: "No Changes",
        message: "Nothing to save, please make changes and try again !",
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 3000);

      return;
    }
    console.log(changedFields);

    try {
      setLoading(true);
      const response = await axios({
        method: "patch",
        withCredentials: true,
        url: "http://localhost:2452/api/v1/students/updateme",
        data: changedFields,
      });

      console.log(response);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      setUserData(JSON.parse(localStorage.user));

      setLoading(false);
      setIsDisabled(true);
      setAlertMessage({
        type: "success",
        title: "Updated",
        message: "Your information is updated successfully",
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        title: "Failed To Update Information",
        message:
          "An Error Occured while updating your information, please try again !",
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
    }
  }

  return (
    <>
      {Object.keys(alertMessage).length !== 0 ? (
        <ShowAlert
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
        />
      ) : (
        ""
      )}
      <div className="pd-1rem ">
        <h2>General Information</h2>
        {loading ? (
          <Loader />
        ) : (
          <div className="pd-tb-1rem bg-white border-radius-1rem">
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  marginBottom: 2,
                  width: "33ch",
                },
                "& .MuiInputLabel-root": { mt: 2 },
              }}
              noValidate
              autoComplete="off"
            >
              <div className="flex-container flex-center flex-row gap-2rem">
                {/* Row-1 */}
                <div className="text-black-bold ">
                  <InputLabel>First name</InputLabel>
                  <TextField
                    hiddenLabel
                    id="name"
                    variant="outlined"
                    placeholder="Mike"
                    required
                    disabled={isDisabled}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <InputLabel>Last Name</InputLabel>
                  <TextField
                    hiddenLabel
                    id="name"
                    variant="outlined"
                    placeholder="Jonas"
                    required
                    disabled={isDisabled}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              {/* Row-2 */}
              <div className="flex-container flex-center flex-row gap-2rem">
                <div>
                  <InputLabel>Email</InputLabel>
                  <TextField
                    id="name"
                    variant="outlined"
                    required
                    disabled
                    type={"email"}
                    placeholder={userData.email}
                  />
                </div>
                <div>
                  <InputLabel>DOB</InputLabel>
                  <TextField
                    id="name"
                    variant="outlined"
                    required
                    disabled={isDisabled}
                    type={isDisabled ? "text" : "date"}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              {/* Row-3 */}
              <div className="flex-container flex-center flex-row gap-2rem">
                <div>
                  <InputLabel>Phone</InputLabel>
                  <TextField
                    id="name"
                    variant="outlined"
                    required
                    disabled={isDisabled}
                    placeholder={"+915479621458"}
                    value={phone.startsWith("+91") ? phone : `+91${phone}`}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <InputLabel>Address</InputLabel>
                  <TextField
                    id="name"
                    variant="outlined"
                    required
                    disabled={isDisabled}
                    placeholder="eg: Vijay Nagar, Indore"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              {/* Row-4 */}
              <div className="flex-container flex-center flex-row pd-tb-1rem gap-2rem">
                <div className="flex-container flex-5 flex-center gap-2rem">
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#176b87" }}
                    onClick={handleEditButton}
                  >
                    <EditIcon fontSize="16" sx={{ marginRight: "5px" }} />{" "}
                    {isDisabled ? "Edit" : "Cancel"}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#176b87" }}
                    disabled={isDisabled}
                    onClick={handleSaveButton}
                  >
                    <SaveIcon fontSize="16" sx={{ marginRight: "5px" }} /> Save
                  </Button>
                </div>
                <div className="flex-5"></div>
              </div>
            </Box>
          </div>
        )}
      </div>
    </>
  );
}

function convertDateFormate(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-based
  const year = date.getFullYear();

  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate; // Output: "2003-06-14"
}
