import Header from "./header/Header";
import React, { useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SchoolIcon from "@mui/icons-material/School";
import TerminalIcon from "@mui/icons-material/Terminal";
import WorkIcon from "@mui/icons-material/Work";
import ArticleIcon from "@mui/icons-material/Article";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "./utils/Avatar";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import GeneralInformation from "./profilePages/GeneralInformation";
import AcademicInformation from "./profilePages/AcademicInformation";
import ProjectSkills from "./profilePages/ProjectSkills";
import WorkExperience from "./profilePages/WorkExperience";
import Resume from "./profilePages/Resume";
import { ListBox } from "./utils/ListBox";

const profileItems = {
  "General Information": [<AccountCircleIcon />, <GeneralInformation />],
  "Academic Information": [<SchoolIcon />, <AcademicInformation />],
  "Projects & Skills": [<TerminalIcon />, <ProjectSkills />],
  "Work Experience": [<WorkIcon />, <WorkExperience />],
  Resume: [<ArticleIcon />, <Resume />],
};

const settingItems = {
  Settings: [<SettingsIcon />],
};

export default function Profile() {
  const [activePanel, setActivePanel] = useState("General Information");

  return (
    <>
      <Header />
      <div className="flex-container gap-1rem">
        {/* Left */}
        <div className="flex-2 flex-center ">
          <div className="left-profile pd-top-1rem sticky-container sticky-content">
            <h3 className="text-center">{"Profile"}</h3>
            <ListBox
              items={profileItems}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
            <h3 className="text-center">{"Account Settings"}</h3>
            <ListBox
              items={settingItems}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

        {/* Center */}
        <div className="flex-5 bg-primary">{profileItems[activePanel][1]}</div>

        {/* Right */}
        <div className="profile-card-flex flex-center pd-1rem bg-primary sticky-container sticky-content">
          <ProfileCard />
        </div>
      </div>
    </>
  );
}

function ProfileCard() {
  return (
    <div className="flex-container flex-column card bg-white ">
      <div className="border-radius-1rem">
        <img src="/images/profile-bg.png" alt="cover-img" />
        <div className="flex-center pd-1rem" style={{ marginTop: "-70px" }}>
          <Avatar width={100} height={100} />
        </div>
      </div>
      <div className="flex-container flex-center flex-column">
        <h3 className="pd-tb-1rem">{JSON.parse(localStorage.user).name}</h3>
        <p className="text-center">
          Nodejs | Express | MongoDB | Javascript | DataStructure
        </p>
      </div>
      <div className="flex-container flex-center pd-1rem gap-1rem">
        <Button variant="contained" sx={{ backgroundColor: "#176b87" }}>
          <EditIcon fontSize="16" sx={{ marginRight: "5px" }} /> Edit
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#176b87" }}>
          <ShareIcon fontSize="16" sx={{ marginRight: "5px" }} /> Share
        </Button>
      </div>
    </div>
  );
}
