import { Button, TextField, Box, InputLabel, Checkbox } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";

import cities from "../data/cities";
import axios from "axios";
import Loader from "../utils/Loader";
import TextArea from "../utils/TextArea";

export default function WorkExperience() {
  const [alertMessage, setAlertMessage] = useState({});
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);

  useEffect(function () {
    async function getProjects() {
      try {
        setLoading(true);

        const response = await axios(
          "http://localhost:2452/api/v1/students/experience",
          {
            withCredentials: true,
          }
        );
        setExperiences(response.data.data);
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
      <h2 className="pd-1rem">Work Experience</h2>
      {loading ? (
        <Loader />
      ) : (
        <>
          {experiences.map((val, i) => (
            <Work
              key={i}
              index={i}
              onSetExperience={setExperiences}
              experienceDetails={val}
              setAlertMessage={setAlertMessage}
            />
          ))}

          <AddExperienceButton onAddForm={setExperiences} />
        </>
      )}
    </>
  );
}

function Work({ index, experienceDetails, onSetExperience, setAlertMessage }) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [isOngoing, setIsOngoing] = useState(false);

  const [profile, setProfile] = useState(experienceDetails.profile);
  const [organization, setOrganization] = useState(
    experienceDetails.organization
  );
  const [location, setLocation] = useState(experienceDetails.location);
  const [startDate, setStartDate] = useState(experienceDetails.startDate);
  const [endDate, setEndDate] = useState(experienceDetails.endDate);
  const [description, setDescription] = useState(experienceDetails.description);

  function handleDeleteForm(e) {
    const pos = Number(e.target.attributes.pos.value);
    onSetExperience((cs) => cs.filter((_, i) => i !== pos));
  }

  return (
    <div key={index} className="pd-1rem ">
      <div className="pd-tb-1rem bg-white border-radius-1rem">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": {
              marginBottom: 2,
              width: "65ch",
            },
            "& .MuiInputLabel-root": { mt: 2 },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="flex-container flex-center flex-row gap-2rem">
            {/* Row-1 */}
            <div className="text-black-bold ">
              <InputLabel>Profile</InputLabel>
              <TextField
                hiddenLabel
                id="profile"
                variant="outlined"
                placeholder="eg. Software Engineer"
                required
                disabled={isDisabled}
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
              />
            </div>
          </div>

          {/* Row-2 */}
          <div className="flex-container flex-center flex-row gap-2rem">
            <div className="text-black-bold ">
              <InputLabel>Organization</InputLabel>
              <TextField
                hiddenLabel
                id="organization"
                variant="outlined"
                placeholder="eg. Google"
                required
                disabled={isDisabled}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
          </div>

          {/* Row-3 */}
          <div className="flex-container flex-center flex-row gap-2rem">
            <div className="text-black-bold ">
              <InputLabel>Location</InputLabel>
              <select
                id="location"
                placeholder="eg. Indore"
                style={{ width: "620px", padding: "18px 14px" }}
                disabled={isDisabled}
              >
                <option
                  value=""
                  disabled
                  selected
                  onSelect={(e) => setLocation(e.target.value)}
                >
                  {location || "eg. Bangalore"}
                </option>
                <option value="wfh">Work From Home</option>
                {cities.map((obj) => (
                  <option
                    value={obj.city}
                  >{`${obj.city}, ${obj.state}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row-5 */}
          <div className="flex-container flex-center flex-row gap-2rem">
            <div>
              <InputLabel>Start Month</InputLabel>
              <TextField
                id="startDate"
                variant="outlined"
                required
                disabled={isDisabled}
                type="date"
                sx={{
                  width: "240px !important",
                }}
                value={convertDateFormate(startDate)}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <InputLabel>End Month</InputLabel>
              <TextField
                id="branch"
                type={isOngoing ? "text" : "date"}
                variant="outlined"
                required
                disabled={isDisabled}
                sx={{
                  width: "240px !important",
                }}
                value={isOngoing ? "Present" : convertDateFormate(endDate)}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <InputLabel>Working</InputLabel>
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
              onClick={() => setIsDisabled(false)}
            >
              <EditIcon fontSize="16" sx={{ marginRight: "5px" }} /> Edit
            </Button>

            <Button variant="contained" sx={{ backgroundColor: "#176b87" }}>
              <SaveIcon fontSize="16" sx={{ marginRight: "5px" }} /> Save
            </Button>

            <Button
              variant="contained"
              sx={{ backgroundColor: "#176b87" }}
              pos={index}
              onClick={handleDeleteForm}
            >
              <DeleteIcon fontSize="16" sx={{ marginRight: "5px" }} /> Delete
            </Button>
          </div>
          <div className="flex-5"></div>
        </Box>
      </div>
    </div>
  );
}

function AddExperienceButton({ onAddForm }) {
  function handleAddForm() {
    onAddForm((cs) => [...cs, cs.length + 1]);
  }
  return (
    <div className="flex-container flex-center" onClick={handleAddForm}>
      <Button variant="contained" sx={{ backgroundColor: "#176b87" }}>
        <AddIcon fontSize="16" sx={{ marginRight: "5px" }} /> Add Experience
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
