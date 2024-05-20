import Header from "./header/Header";
import cities from "./data/cities";
import { Button, Slider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DateRangeIcon from "@mui/icons-material/DateRange";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import CustomSelectInput from "./utils/CustomSelectInput";
import CustomTextInput from "./utils/CustomTextInput";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "./utils/Loader";
import ShowAlert from "./utils/ShowAlert";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function CompanyList() {
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
      <Header />
      {/* <div className="flex-container pd-1rem">
        <h2>Visited Companies</h2>
      </div> */}
      {Object.keys(alertMessage).length !== 0 ? (
        <ShowAlert
          type={alertMessage.type}
          title={alertMessage.title}
          message={alertMessage.message}
        />
      ) : (
        ""
      )}
      <div className="grid-container company-container gap-1rem">
        <div className="filter-section sticky-container sticky-content">
          <div className="flex-container flex-column gap-2rem">
            <div className="grid-container flex-center">
              <JobItems
                labelIcon={
                  <>
                    <FilterAltIcon />
                    <span>FILTER</span>{" "}
                  </>
                }
              />
            </div>
            <ComboBox />
            {/* <CustomSelectInput
              label={"Location"}
              optionList={cities}
              defaultMessage={"eg. Indore"}
            /> */}
            <div>
              Salary Upto (In LPA)
              <Slider max={20} min={1} valueLabelDisplay="auto" />
            </div>

            <CustomTextInput
              placeholder={"eg. Software Engineer"}
              label={"Role"}
            />

            <CustomTextInput placeholder={"eg. 2023"} label={"Visited In"} />

            <Button
              variant="contained"
              className="btn"
              sx={{ backgroundColor: "#176b87" }}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="grid-container gap-2rem pd-2rem">
          {loading ? (
            <Loader />
          ) : (
            jobDetails.map((job) => <JobCard jobInfo={job} />)
          )}
        </div>
      </div>
    </>
  );
}

export function JobCard({ jobInfo }) {
  const user = localStorage.getItem("user");
  return (
    <>
      <div className="card">
        <h2 id="job-title">{jobInfo.jobTitle}</h2>
        <h4 id="company-name" className="text-gray">
          {jobInfo.companyName}
        </h4>
        <div
          id="job-location"
          className="flex-container flex-column gap-2rem pd-top-1rem"
        >
          <div className="flex-container pd-0 gap-02rem">
            <LocationOnIcon sx={{ fontSize: 16 }} />
            <span style={{ fontSize: 15 }}>{jobInfo.location}</span>
          </div>
          <div className="flex-container flex-row gap-3rem">
            <JobItems
              id={"batch"}
              labelIcon={
                <>
                  <SchoolIcon sx={{ fontSize: 16 }} />
                  <span style={{ fontSize: 14 }}>BATCH</span>
                </>
              }
              value={jobInfo.batch}
            />
            <JobItems
              id={"salary"}
              labelIcon={
                <>
                  <CurrencyRupeeIcon sx={{ fontSize: 16 }} />
                  <span style={{ fontSize: 14 }}>SALARY</span>
                </>
              }
              value={`₹ ${jobInfo.salary}`}
            />

            <JobItems
              id={"role"}
              labelIcon={
                <>
                  <ContactMailIcon sx={{ fontSize: 16 }} />
                  <span style={{ fontSize: 14 }}>ROLE</span>
                </>
              }
              value={jobInfo.role}
            />

            <JobItems
              id={"visited"}
              labelIcon={
                <>
                  <DateRangeIcon sx={{ fontSize: 16 }} />
                  <span style={{ fontSize: 14 }}>VISITED IN</span>
                </>
              }
              value={jobInfo.visitedIn}
            />
          </div>
        </div>
        <div className="flex-container border-top gap-1rem  pd-tb-1rem">
          <Button
            variant="contained"
            className="btn"
            sx={{ backgroundColor: "#176b87" }}
            LinkComponent={"a"}
            href={`/company/${jobInfo._id}`}
          >
            view details
          </Button>
          {user && user.role === "Students" && (
            <Button
              variant="contained"
              className="btn"
              sx={{ backgroundColor: "#176b87" }}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function JobItems({ id, labelIcon, value }) {
  return (
    <div
      id={id}
      className="flex-container flex-column gap-02rem pd-bottom-1rem"
    >
      <div className="text-gray flex-container gap-02rem">{labelIcon}</div>
      <div className="font-sz-14px ">
        <p className="pd-0">{value}</p>
      </div>
    </div>
  );
}

function ComboBox() {
  return (
    <Autocomplete
      // disablePortal
      autoComplete={true}
      autoHighlight={true}
      autoSelect={true}
      id="combo-box-demo"
      options={cities}
      sx={{ width: 290 }}
      renderInput={(params) => <TextField {...params} label="City" />}
    />
  );
}
