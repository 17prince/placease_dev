import * as React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import DataTable from "./DataTable";
import Loader from "../utils/Loader";

export default function Students() {
  const [queries, setQueris] = useState({ limit: 20 });
  const [totalResults, setTotalResults] = useState("");
  return (
    <>
      <div>
        <h2 className="pd-1rem">All Students</h2>
      </div>

      <ShowTable queries={queries} setTotalResults={setTotalResults} />
    </>
  );
}

function ShowTable({ queries, setTotalResults }) {
  const [students, setStudents] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(
    function () {
      async function getAllStudents() {
        try {
          setLoading(true);

          const res = await axios(
            `http://localhost:2452/api/v1/students/showallstudents?${objectToQuery(
              queries
            )}`,
            {
              withCredentials: true,
            }
          );

          console.log(res.data);

          setStudents(res.data.data);
          setTotalResults(res.data.totalResults);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
      setTimeout(() => {
        getAllStudents();
      }, 1000);
    },
    [queries, setTotalResults]
  );

  return (
    <>
      {loading ? <Loader /> : <>{students && <DataTable data={students} />}</>}
    </>
  );
}

function objectToQuery(queries) {
  let queryString = "";
  Object.keys(queries).forEach((key) => {
    queryString += `${key}=${queries[key]}&`;
  });

  return queryString;
}
