import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { Button } from "@mui/material";

Font.register({
  family: "ABeeZee",
  src: "http://fonts.gstatic.com/s/abeezee/v9/JYPhMn-3Xw-JGuyB-fEdNA.ttf",
});

Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Bold.ttf",
});
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    alignItems: "left", // left content horizontally
    paddingTop: 20,
    fontFamily: "ABeeZee",
    rowGap: ".7vh",
    paddingHorizontal: 30,
    overflow: "hidden",
  },
  section: {
    flexDirection: "row", // Layout in a row
    width: "100%", // 100% of page width
    alignItems: "center", // Center content horizontally
    justifyContent: "space-between", // Evenly space elements
  },

  alignItemCenter: {
    alignItems: "center",
  },
  // column: {
  //   width: "20%", // Each column takes up 30% of the section width
  // },

  box: {
    flexDirection: "row",
    alignContent: "flex-start",
    gap: "1vh",
    overflow: "hidden",
    fontSize: 9,
    alignItems: "center",
    // justifyContent: "space-around",
  },

  projectBox: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "flex-start",
    justifyContent: "space-between",
  },

  image: {
    width: 100,
    height: 100,
    // borderRadius: 25,
  },
  heading: {
    fontSize: 9,
    fontFamily: "Roboto",
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 4,
  },
  content: {
    fontSize: 9,
    alignContent: "flex-start",
  },
  name: {
    fontSize: 12,
    fontFamily: "Roboto",
    fontWeight: "bold",
    // alignContent: "flex-end",
    marginTop: "0vh",
  },
});

export default function Resume() {
  return (
    <div className="pd-1rem">
      <h2 style={{ paddingBottom: "3vh" }}>Resume</h2>
      <PDFDownloadLink document={<MyDocument />} fileName="resume.pdf">
        {({ blob, url, loading, error }) =>
          loading ? (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#176b87", marginBottom: "1vh" }}
            >
              Loading document...
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ backgroundColor: "#176b87", marginBottom: "1vh" }}
            >
              Download Resume
            </Button>
          )
        }
      </PDFDownloadLink>

      <div width="100%" height="700vh">
        <PDFViewer width="100%" height="700vh" showToolbar={false}>
          <MyDocument />
        </PDFViewer>
      </div>
    </div>
  );
}

// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {/* First column for image */}
        <View style={styles.column}>
          <Image src="/images/pic.jpg" style={styles.image} />
        </View>
        {/* Second column for address, phone, and email */}
        <View
          style={(styles.column, { paddingTop: "6vh", alignItems: "center" })}
        >
          <Text style={styles.heading}>
            D-17,Kalibillod Pithampur INDORE (M.P) 453001
          </Text>
          <Text style={styles.heading}>
            +918305928969, princevishwakarma1417@gmail.com
          </Text>
        </View>
        {/* Third column for name */}
        <View style={(styles.column, { alignContent: "flex-end" })}>
          <Text style={styles.name}>Prince Vishwakarma</Text>
        </View>
      </View>
      <View>
        <Text>__________________________________________________</Text>
      </View>
      {/* Career Objective */}
      <View style={{ fontSize: 9 }}>
        <Text style={styles.heading}>Career Objective :</Text>
        <Text>
          Seeking a challenging position where I can leverage my expertise in
          developing robust backend solutions and innovative software
          applications to contribute to society.
        </Text>
      </View>

      {/* Acedamic Information */}
      <View>
        <Text style={styles.heading}>Academic Record:</Text>
        <View style={{ marginLeft: "2vh", fontSize: 9 }}>
          {/* Professional qualification */}

          <Text style={styles.heading}>Professional Qualifications:</Text>
          <Text styles={styles.content}>
            &#8226; Pursuing Bachelor of Engineering from Acropolis Institute of
            Technology and Research, Indore affiliated to RGPV with
            specialization in Computer Science & Information Technology
            (2021-2025) (Current CGPA : 6.5)
          </Text>

          {/* Educational qualificatons */}

          <Text style={styles.heading}>Educational Qualifications:</Text>
          <Text styles={styles.content}>
            &#8226; Senior Secondary School Certificate(10+2) from Vivekanand
            Vidhya Vihar, Khargone (M.P) with 80% in 2020
          </Text>
          <Text>
            &#8226; High School Certificate(10th) from Sky Heights Academy,
            Betma (M.P) with 80% in 2018
          </Text>
        </View>
      </View>

      {/* Skills  */}
      <View style={styles.box}>
        <View>
          <Text style={styles.heading}>IT Skills / Core Skills : </Text>
        </View>

        <View style={styles.content}>
          <Text>
            NodeJs, ExpressJs, MongoDB, Javascript, C/C++, Data Structure,
            RestAPI, HTML, CSS
          </Text>
        </View>
      </View>

      {/* Internship */}
      <View>
        <Text style={styles.heading}>Internship : </Text>
        <View style={{ fontSize: 9, paddingLeft: "2vh" }}>
          {/* Organization */}
          <View style={styles.box}>
            <Text>Organization : </Text>
            <Text style={styles.heading}>OyeBusy Technologies</Text>
          </View>
          {/* Description */}
          <View style={styles.box}>
            <Text>Description : </Text>
            <Text>
              A B-To-B model company, where I designed and implemented the
              onboarding procedures for patterns.
            </Text>
          </View>

          {/* Location */}
          <View style={styles.box}>
            <Text>Location : </Text>
            <Text>Work From Home</Text>
          </View>

          {/* Duration */}
          <View style={styles.box}>
            <Text>Duration : </Text>
            <Text>2 Months (MAY 2022 - JULY 2022)</Text>
          </View>

          {/* Role/ Profile */}
          <View style={styles.box}>
            <Text>Role : </Text>
            <Text>Backend Developer</Text>
          </View>
        </View>
      </View>

      {/* Project */}
      <View>
        <Text style={styles.heading}> Projects : </Text>

        <View style={{ fontSize: 9, paddingLeft: "2vh" }}>
          {/* Name */}

          <View style={styles.box}>
            <Text>Name : </Text>
            <Text>PlacEase</Text>
          </View>
          {/* Project Link */}
          <View style={styles.box}>
            <Text>Project Link : </Text>
            <Text>https://github.com/17prince/placease</Text>
          </View>
          {/* Duration */}
          <View style={styles.box}>
            <Text>Duration : </Text>
            <Text>Nov 2023 - Present</Text>
          </View>

          {/* Role/ Profile */}
          <View style={styles.box}>
            <Text>Role : </Text>
            <Text>Backend Developer</Text>
          </View>
          {/* Description */}
          <View style={styles.box}>
            <Text>Description : </Text>
            <Text>
              A web platform to manage and ease the placement procedure for
              colleges and students.
            </Text>
          </View>
        </View>
      </View>

      {/* Strength  */}

      <View style={styles.box}>
        <Text style={styles.heading}>Strength : </Text>
        <Text>Adaptability, Positive Attitude and Collaboration</Text>
      </View>

      {/* Area of improvement */}
      <View style={styles.box}>
        <Text style={styles.heading}>Area Of Improvement : </Text>
        <Text>Work life Balance</Text>
      </View>

      {/* Hobbies */}
      <View style={styles.box}>
        <Text style={styles.heading}>Hobbies: </Text>
        <Text>Playing football, Programming</Text>
      </View>

      {/* Personal Details */}
      <View>
        <Text style={styles.heading}> Personal Details : </Text>

        <View style={{ fontSize: 9, paddingLeft: "2vh" }}>
          {/* DOB */}
          <View style={styles.box}>
            <Text>Date of Birth : </Text>
            <Text>14/06/2003</Text>
          </View>
          {/* Gender */}
          <View style={styles.box}>
            <Text>Gender : </Text>
            <Text>Male</Text>
          </View>
          {/* Nationality */}
          <View style={styles.box}>
            <Text>Nationality : </Text>
            <Text>Indian</Text>
          </View>

          {/* Marital status */}
          <View style={styles.box}>
            <Text>Marital Status : : </Text>
            <Text>Single</Text>
          </View>
          {/* Languages Known */}
          <View style={styles.box}>
            <Text>Languages known : </Text>
            <Text>Hindi and English</Text>
          </View>

          {/* Mother Tongue */}
          <View style={styles.box}>
            <Text>Mother Tongue : </Text>
            <Text>Hindi</Text>
          </View>

          {/* Father name */}
          <View style={styles.box}>
            <Text>Father’s Name :</Text>
            <Text>Rampal Vishwakarma</Text>
          </View>

          {/* Permanent Address */}
          <View style={styles.box}>
            <Text>Permanent Address: </Text>
            <Text>Prabhatam colony, kalibillod Pithampur, Indore M.P</Text>
          </View>
        </View>
      </View>

      {/* References */}
      <View style={styles.box}>
        <Text style={styles.heading}>References: </Text>
        <Text>
          Minor Project Reference: Prof. Nidhi Nigam, Acropolis Institute of
          Technology & Research
        </Text>
      </View>

      {/* Declaration */}
      <View style={styles.box}>
        <Text style={styles.heading}>Declaration: </Text>
        <Text>
          I hereby declare that the information furnished above is true to the
          best of my knowledge.
        </Text>
      </View>

      {/* Date */}
      <View style={styles.box}>
        <Text style={styles.heading}>Date: </Text>
        <Text>20/04/2024</Text>
      </View>

      {/* Place */}
      <View style={styles.box}>
        <Text style={styles.heading}>Place: </Text>
        <Text>Indore</Text>
      </View>

      {/* Name */}
      <View style={styles.box}>
        <Text style={styles.heading}>Name: </Text>
        <Text>Prince Vishwakarma</Text>
      </View>

      {/* Sign */}
      <View style={styles.box}>
        <Text style={styles.heading}>Sign: </Text>
        <Text></Text>
      </View>
    </Page>
  </Document>
);
