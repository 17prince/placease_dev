import { Button, TextField, Box, InputLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../utils/Loader";
import ShowAlert from "../utils/ShowAlert";

export default function AcademicInformation() {
  const [isDisabled, setIsDisabled] = useState(true);
  const [userData, setUserData] = useState(JSON.parse(localStorage.user));
  const [alertMessage, setAlertMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const [enrollment, setEnrollment] = useState("");
  const [scholar, setscholar] = useState("");
  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [classSection, setClassSection] = useState("");
  const [currentCGPA, setCurrentCGPA] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [currentSem, setCurrentSem] = useState("");

  useEffect(
    function () {
      function getUserData() {
        try {
          setLoading(true);

          setEnrollment(userData.enrollment);
          setscholar(userData.scholarNo);
          setCourse(userData.course);
          setBranch(userData.branch);
          setCurrentCGPA(userData.currentCGPA);
          setClassSection(userData.class);
          setBatchYear(userData.batchYear);
          setCurrentSem(userData.semester);

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

    setEnrollment(user.enrollment);
    setscholar(user.scholarNo);
    setCourse(user.course);
    setBranch(user.branch);
    setClassSection(user.class);
    setBatchYear(user.batchYear);
    setCurrentCGPA(user.currentCGPA);
    setCurrentSem(user.semester);
  }

  // to handle save button
  async function handleSaveButton() {
    let fields = {
      enrollment,
      scholarNo: scholar,
      course,
      branch,
      class: classSection,
      batchYear,
      currentCGPA,
      semester: currentSem,
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
      setLoading(<i class="fas fa-treasure-chest    "></i>);
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
        <h2>Academic Information</h2>
        {loading ? (
          <Loader />
        ) : (
          <>
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
                    <InputLabel>Enrollment</InputLabel>
                    <TextField
                      hiddenLabel
                      id="enrollment"
                      variant="outlined"
                      placeholder="0827CI24586"
                      required
                      disabled={isDisabled}
                      value={enrollment}
                      onChange={(e) => setEnrollment(e.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Scholar Number</InputLabel>
                    <TextField
                      hiddenLabel
                      id="scholar"
                      variant="outlined"
                      placeholder="AITR-2322"
                      required
                      disabled={isDisabled}
                      value={scholar}
                      onChange={(e) => setscholar(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row-2 */}
                <div className="flex-container flex-center flex-row gap-2rem">
                  <div>
                    <InputLabel>Course</InputLabel>
                    <TextField
                      id="course"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder={"BTECH"}
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Branch</InputLabel>
                    <TextField
                      id="branch"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder="CSIT-CI"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row-3 */}
                <div className="flex-container flex-center flex-row gap-2rem">
                  <div>
                    <InputLabel>Class</InputLabel>
                    <TextField
                      id="class"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder={"CSIT-3"}
                      value={classSection}
                      onChange={(e) => setClassSection(e.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Current CGPA</InputLabel>
                    <TextField
                      id="year"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder="3"
                      value={currentCGPA}
                      onChange={(e) => setCurrentCGPA(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row-4 */}
                <div className="flex-container flex-center flex-row gap-2rem">
                  <div>
                    <InputLabel>Batch Year</InputLabel>
                    <TextField
                      id="batchYear"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder={"2021-2025"}
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <InputLabel>Current Semester</InputLabel>
                    <TextField
                      id="semester"
                      variant="outlined"
                      required
                      disabled={isDisabled}
                      placeholder="6"
                      value={currentSem}
                      onChange={(e) => setCurrentSem(e.target.value)}
                    />
                  </div>
                </div>

                {/* Row-5 */}
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
                      <SaveIcon fontSize="16" sx={{ marginRight: "5px" }} />{" "}
                      Save
                    </Button>
                  </div>
                  <div className="flex-5"></div>
                </div>
              </Box>
            </div>
          </>
        )}
      </div>
    </>
  );
}
