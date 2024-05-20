import axios from "axios";
import { useEffect, useState } from "react";
import Header from "./header/Header";
import { Button } from "@mui/material";
import { convert } from "html-to-text";
import Loader from "./utils/Loader";
import ShowAlert from "./utils/ShowAlert";

const Inbox = () => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [alertMessage, setAlertMessage] = useState({});
  const [isOAuthDone, setIsOAuthDone] = useState(true);

  useEffect(
    function () {
      async function isTokenExist() {
        const ack = await axios("http://localhost:2452/api/v1/auth", {
          withCredentials: true,
        });

        if (ack.data.status === "success")
          setIsOAuthDone(ack.data.isTokenExist);
      }
      isTokenExist();
    },
    [isOAuthDone]
  );

  const handleAuth = () => {
    window.location.href = `http://localhost:2452/api/v1/auth/oauth-url`;
  };

  const handleFetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios(
        "http://localhost:2452/api/v1/auth/fetch-emails",
        {
          withCredentials: true,
        }
      );

      // Formatting email response
      const newEmails = response.data.emails.map((email) => {
        const obj = {};

        obj["messageId"] = email.messageId;

        // extract headers information [from , to , subject ,date]
        email.headers.forEach((key) => {
          obj[key.name] = key.value;
        });

        obj["body"] = email.body;
        obj["snippet"] = email.snippet;
        obj["plainBody"] =
          obj.body.size && obj.body.size > 0 ? undefined : convert(obj.body);
        obj["parts"] = email.parts;

        return obj;
      });
      // console.log(newEmails);

      // Set emails
      setEmails(newEmails);
      setLoading(false);
    } catch (error) {
      setAlertMessage({
        title: "Failed : Fetching Emails",
        type: "error",
        message: error.response.data,
      });

      setTimeout(() => {
        setAlertMessage({});
      }, 2000);
      // console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <h1>Gmail Inbox</h1>
      <div className="flex-center gap-1rem pd-2rem">
        {Object.keys(alertMessage).length !== 0 ? (
          <ShowAlert
            type={alertMessage.type}
            title={alertMessage.title}
            message={alertMessage.message}
          />
        ) : (
          ""
        )}
        {!emails.length && !loading ? (
          <AuthAndFetch
            handleAuth={handleAuth}
            handleFetchEmails={handleFetchEmails}
            oauth={isOAuthDone}
          />
        ) : loading ? (
          <Loader />
        ) : (
          <EmailContainer emailArray={emails} />
        )}
      </div>
    </>
  );
};

function AuthAndFetch({ handleAuth, handleFetchEmails, oauth }) {
  return (
    <div className="flex-container gap-2rem flex-center ">
      {!oauth && (
        <Button
          variant="contained"
          sx={{ backgroundColor: "#176b87" }}
          onClick={handleAuth}
        >
          Authenticate with Gmail
        </Button>
      )}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#176b87" }}
        onClick={handleFetchEmails}
      >
        Fetch Emails
      </Button>
    </div>
  );
}

function EmailContainer({ emailArray }) {
  return (
    <div className="flex-container">
      <div className="flex-2"></div>
      <div className="grid-container flex-8">
        {emailArray.map((email) => (
          <EmailList email={email} key={email.messageId} />
        ))}
      </div>
    </div>
  );
}

function EmailList({ email }) {
  return (
    <div className="grid-container email-list" key={email.messageId}>
      <div id="from">{email.From.split(/[<@]/)[0]}</div>
      <div id="subject">
        <b>{email.Subject} :-</b>
        <span className="text-gray">{email.snippet}</span>
      </div>
      <div id={"date"}>
        {formatDateOrTime(new Date(email.Date)).split(",")[0]}
      </div>
    </div>
  );
}

function formatDateOrTime(inputDate) {
  const currentDate = new Date();
  const oneDayInMillis = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

  // Calculate the difference in milliseconds between the current date and the input date
  const timeDifference = currentDate - inputDate;

  // Check if the time difference is less than one day
  if (timeDifference < oneDayInMillis) {
    // If the difference is less than one day, return the time
    const hours = inputDate.getHours().toString().padStart(2, "0");
    const minutes = inputDate.getMinutes().toString().padStart(2, "0");
    // const seconds = inputDate.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
    // If the difference is one day or more, return the date
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const year = inputDate.getFullYear();
    const monthName = months[inputDate.getMonth()];
    const day = inputDate.getDate().toString().padStart(2, "0");
    return `${monthName} ${day}, ${year}`;
  }
}

export default Inbox;
