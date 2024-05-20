import React from "react";
import Divider from "@mui/material/Divider";

export function ListBox({ items, activePanel, setActivePanel }) {
  return (
    <>
      <Divider />
      {Object.keys(items).map((item) => (
        <ListItem
          key={item}
          listIcon={items[item][0]}
          listText={item}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />
      ))}
    </>
  );
}

function ListItem({ listIcon, listText, activePanel, setActivePanel }) {
  return (
    <div
      className={`${
        activePanel === listText ? "item-selected" : ""
      } flex-container gap-1rem  list`}
      key={listText}
      onClick={() => setActivePanel(listText)}
    >
      <div>{listIcon}</div>
      <div>{listText}</div>
    </div>
  );
}
