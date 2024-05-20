import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import { JobCard } from "../CompanyList";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import cities from "../data/cities";

export default function ManageJobs() {
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState({});

  useEffect(function () {
    async function getJobDetails() {
      try {
        setLoading(true);
        const response = await axios("http://localhost:2452/api/v1/companies", {
          withCredentials: true,
        });

        setJobDetails(response.data.jobs);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setAlertMessage({
          type: "error",
          title: "Failed To Fetch Jobs",
          message: "An Error Occured while fetching jobs",
        });

        setTimeout(() => {
          setAlertMessage({});
        }, 2000);
      }
    }
    getJobDetails();
  }, []);

  return (
    <>
      <CompanyFormDialog />
      <div className="flex-container gap-1rem flex-column">
        {jobDetails.map((job) => (
          <JobCard jobInfo={job} />
        ))}
      </div>
    </>
  );
}

function CompanyFormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        className="btn"
        sx={{ backgroundColor: "#176b87", margin: "1rem" }}
        onClick={handleClickOpen}
      >
        Create New Job
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Create Job</DialogTitle>
        <DialogContent>
          <DialogContentText>Create a new job</DialogContentText>
          {/* Job title */}
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="email"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
          />

          {/* Job Location */}
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={cities}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Location" />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
