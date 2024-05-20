import { useState } from "react";
import Header from "../header/Header";
import { ListBox } from "../utils/ListBox";
import Students from "./Students";
import Groups2Icon from "@mui/icons-material/Groups2";
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import ManageJobs from "./ManageJobs";

const panelOptions = {
  "All Students": [<Groups2Icon />, <Students />],
  "Manage Jobs" : [<WorkHistoryIcon/>, <ManageJobs/>]
};

export default function AdminPanel() {
  const [activePanel, setActivePanel] = useState("All Students");
  return (
    <>
      <Header />
      <div className="flex-container gap-1rem">
        {/* Left */}
        <div className="flex-2 flex-center ">
          <div className="left-profile pd-top-1rem sticky-container sticky-content">
            <h3 className="text-center">{"Dashboard"}</h3>
            <ListBox
              items={panelOptions}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>
        </div>

        {/* main */}
        <div className="flex-8 pd-2rem bg-primary">
          {panelOptions[activePanel][1]}
        </div>
      </div>
    </>
  );
}
