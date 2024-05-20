import { Button, TextField, Box, InputLabel, Checkbox } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import axios from "axios";
import TextArea from "../utils/TextArea";
import AlertDialogSlide from "../utils/AlertDialog";
import ShowAlert from "../utils/ShowAlert";
import Loader from "../utils/Loader";

export default function ProjectSkills() {
  const [alertMessage, setAlertMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(function () {
    async function getProjects() {
      try {
        setLoading(true);

        const response = await axios(
          "http://localhost:2452/api/v1/students/projects",
          {
            withCredentials: true,
          }
        );
        setProjects(response.data.data);
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
    getProjects();
  }, []);

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
      <h2 className="pd-1rem">Projects & Skills</h2>

      {loading ? (
        <Loader />
      ) : (
        <>
          {projects.map((val, i) => (
            <Project
              key={i}
              index={i}
              onSetProjects={setProjects}
              projectDetails={val}
              setAlertMessage={setAlertMessage}
            />
          ))}

          <AddProjectButton onAddForm={setProjects} />
        </>
      )}
    </>
  );
}

function Project({ index, onSetProjects, projectDetails, setAlertMessage }) {
  const [project, setProject] = useState(projectDetails);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isOngoing, setIsOngoing] = useState(
    project.endDate === "Present" ? true : false
  );

  const [title, setTitle] = useState(project.title);
  const [projectLink, setProjectLink] = useState(project.projectLink);
  const [startDate, setStartDate] = useState(project.startDate);
  const [endDate, setEndDate] = useState(project.endDate);
  const [description, setDescription] = useState(project.description);



  async function handleDeleteForm(e) {
    const pos = Number(e.target.attributes.index.value);

    if (project._id) {
      console.log(project._id);
      try {
        await axios({
          method: "delete",
          url: `http://localhost:2452/api/v1/students/projects/${project._id}`,
          withCredentials: true,
        });

        setAlertMessage({
          type: "success",
          title: "Deleted",
          message: "Your project is deleted successfully",
        });

        setTimeout(() => {
          setAlertMessage({});
        }, 2000);
      } catch (error) {
        console.log(error);
        setAlertMessage({
          type: "error",
          title: "Failed To delete project",
          message:
            "An Error Occured while deleting your project, please try again !",
        });

        setTimeout(() => {
          setAlertMessage({});
        }, 2000);
      }
    }

    onSetProjects((cs) => cs.filter((_, i) => i !== pos));
  }

  // to handle the disabled input fields
  function handleEditButton() {
    setIsDisabled((cs) => !cs);
    console.log(project.endDate);
    setTitle(project.title);
    setProjectLink(project.projectLink);
    setStartDate(project.startDate);
    setEndDate(project.endDate);
    setDescription(project.description);
  }

  // to handle save button
  async function handleSaveButton() {
    console.log(endDate);
    const fields = {
      title,
      projectLink,
      startDate: new Date(startDate).toISOString(),
      endDate:
        endDate === "Present" ? "Present" : new Date(endDate).toISOString(),
      description,
    };

    // For update project when save button is clicked
    if (project._id) {
      // Check if the changes are made to any fields
      const changedFields = {};
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== project[key]) {
          changedFields[key] = value;
        }
      });

      // if no changes are made, show alert message
      if (Object.keys(changedFields).length === 0) {
        setAlertMessage({
          type: "info",
          title: "No Changes",
          message: "Nothing to save, please make changes and try again !",
        });

        // clear alter message
        setTimeout(() => {
          setAlertMessage({});
        }, 3000);

        return;
      }

      // if there are some changes made then, update those changes
      try {
        // Update request
        const response = await axios({
          method: "patch",
          url: `http://localhost:2452/api/v1/students/projects/${project._id}`,
          data: changedFields,
          withCredentials: true,
        });

        onSetProjects((cs) => {
          const updatedProject = cs.filter((obj) => obj?._id !== project._id);

          console.log(updatedProject);

          updatedProject.push(response.data.data);

          return updatedProject;
        });
        setIsDisabled(true);

        setAlertMessage({
          type: "success",
          title: "Project Updated",
          message: "Your project is updated successfully !",
        });

        setTimeout(() => {
          setAlertMessage({});
        }, 3000);
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

    // For create new project when save button is clicked
    try {
      const response = axios({
        method: "post",
        url: "http://localhost:2452/api/v1/students/projects",
        data: fields,
        withCredentials: true,
      });

      console.log(response);

      onSetProjects((cs) => [...cs, response.data.data]);
      setIsDisabled(true);

      setAlertMessage({
        type: "success",
        title: "Created",
        message: "Your new project is created successfully",
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        title: "Failed To Create Project",
        message:
          "An Error Occured while creating your project, please try again !",
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
    }
  }

  return (
    <>
      <div key={index} className="pd-1rem ">
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
                <InputLabel>Title</InputLabel>
                <TextField
                  hiddenLabel
                  id="title"
                  variant="outlined"
                  placeholder="eg. NoteHub"
                  required
                  disabled={isDisabled}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <InputLabel>Project Link</InputLabel>
                <TextField
                  hiddenLabel
                  id="projectLink"
                  variant="outlined"
                  placeholder={"eg. https://github.com/17prince/notehub"}
                  required
                  disabled={isDisabled}
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                />
              </div>
            </div>

            {/* Row-2 */}
            <div className="flex-container flex-center flex-row gap-2rem">
              <div>
                <InputLabel>Start Month</InputLabel>
                <TextField
                  id="startDate"
                  sx={{
                    width: "290px !important",
                  }}
                  variant="outlined"
                  required
                  disabled={isDisabled}
                  type="date"
                  value={convertDateFormate(startDate)}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <InputLabel>End Month</InputLabel>
                <TextField
                  id="endDate"
                  type={isOngoing ? "text" : "date"}
                  variant="outlined"
                  required
                  disabled={isDisabled}
                  sx={{
                    width: "250px !important",
                  }}
                  value={isOngoing ? "Present" : convertDateFormate(endDate)}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              <div>
                <InputLabel>Ongoing</InputLabel>
                <Checkbox
                  id="ongoing"
                  variant="outlined"
                  required
                  disabled={isDisabled}
                  checked={isOngoing}
                  onChange={() => setIsOngoing((cs) => !cs)}
                />
              </div>
            </div>

            {/* Row-3 */}
            <div className="flex-container flex-center flex-row gap-2rem">
              <div>
                <InputLabel>Description</InputLabel>
                <TextArea
                  value={description}
                  disabled={isDisabled}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            {/* Row-5 */}
            <div className="flex-container flex-center flex-row pd-tb-1rem gap-2rem">
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
                onClick={handleSaveButton}
              >
                <SaveIcon fontSize="16" sx={{ marginRight: "5px" }} /> Save
              </Button>

              <AlertDialogSlide
                mssgButton={
                  <>
                    <DeleteIcon fontSize="16" sx={{ marginRight: "5px" }} />{" "}
                    Delete
                  </>
                }
                index={index}
                btn1Text={"NO"}
                btn2Text={"YES"}
                dialogTitle={"DELETE PROJECT ?"}
                dialogText={"Are you sure, you want to delete this project ?"}
                onClickYes={handleDeleteForm}
              />
              {/* <Button
                variant="contained"
                sx={{ backgroundColor: "#176b87" }}
                pos={index}
                onClick={handleDeleteForm}
              >
                <DeleteIcon fontSize="16" sx={{ marginRight: "5px" }} /> Delete
              </Button> */}
            </div>
            <div className="flex-5"></div>
          </Box>
        </div>
      </div>
    </>
  );
}

function AddProjectButton({ onAddForm }) {
  function handleAddForm() {
    onAddForm((cs) => [...cs, {}]);
  }
  return (
    <div className="flex-container flex-center" onClick={handleAddForm}>
      <Button variant="contained" sx={{ backgroundColor: "#176b87" }}>
        <AddIcon fontSize="16" sx={{ marginRight: "5px" }} /> Add Project
      </Button>
    </div>
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
