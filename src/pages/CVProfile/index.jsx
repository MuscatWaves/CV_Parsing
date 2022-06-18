import React from "react";
// import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { removeUnderScore } from "../../utilities";
import "./cvprofile.css";

const CVprofile = () => {
  const test = {
    name: "MOHAMED HANEEFA.A.W",
    image: "https://cv.omanjobs.om/files/images/pic-1655296444.png",
    email: "haneefa.85@gmail.com",
    job: "Landscape Designer",
    skills: [
      "Auto Cad 2d",
      "Sketch up 3d",
      "Photoshop Cs-5",
      "Enscape 3.1",
      "MS Word",
      "MS Excel",
      "Internet Sourcing",
    ],
    personal_detail: {
      gender: "Male",
      mobile: 97987878787,
      dob: "11 May 1988",
      nationality: "Indian",
      country: "India",
      passport_no: "P3392902",
      address:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore reprehenderit eaque placeat vero dolorum nobis excepturi maiores quasi quaerat iusto?",
      language: "Fluency in English, Hindi, Malayalam and Tamil",
    },
    work_experience: [
      {
        name: "AL REEF PROJECT L.L.C",
        job: "Landscape Designer",
        from: "2018",
        to: "present",
        info: `Create detailed designs with computer-aided design (CAD) software
      as per client’s requirement.
      Calculate dimensions, weight limitations and requirements in materials
      Describe production methods step-by-step (including equipment and software
      types to be used)
      Design diagrams, maps and layouts to illustrate workflow
      Prepare and review rough sketches and review them along with the engineering
      team
      Identify potential operational issues and redesign products to improve
      functionality
      Ensure final designs comply with regulations and quality standards
      Create manuals that describe existing products’ operation, features and
      maintenance
      Responding to customer’s quires regarding drawings.
      Assisting in drawing problem by recommending solutions.
      Receiving and sending CAD files across the internet.
      Visiting site to take necessary collect village maps for Land Acquisition and prepare drawings as persite requirements.
      
      Detailed Project Experience:

Project : Miscellaneous Streetscape Works
Location : Abu Dhabi
Client : Abu Dhabi Future Energy Company PJSC (MASDAR)
Position : AutoCAD Draughtsman

Project : Roof Repair and Waterproofing Works at AAW and DBM
Location : Abu Dhabi
Client : HCT
Position : AutoCAD Draughtsman

Project : Replacement of Chemical Dosing Pumps in DWC
Location : Abu Dhabi
Client : HCT
Position : AutoCAD Draughtsman

Project : G.H.Q.UAE ARMED FORCES DMW
Location : Abu Dhabi
Client : Al Dhafra Air Base
Position : AutoCAD Draughtsman

Project : UAEU CAR PARKINGS CMHS CAMPUS
Location : Al Ain
Client : United Arab EmiratesUniversity
Position : AutoCAD Draughtsman

Project : AUTOMATION OF IRRIGATIONSYSTEM
Location : Abu Dhabi
Client : Ministry Of Presidential Affairs
Position : AutoCAD Draughtsman

Project : PRESIDENTIAL PALACE ENHANCEMENT WORK
Location : Abu Dhabi
Client : Ministry Of Presidential Affairs(Qsar Al Watan)
Position : AutoCAD Draughtsman

Project : NORTH AL MARYAH ISLAND SPORTS ACTIVATION PRECINCT
Location : Abu Dhabi
Client : Mubadala Investment Company
Position : AutoCAD Draughtsman

Project : Miscellaneous Streetscape Works in Masdar City
Location : Abu Dhabi
Client : Abu Dhabi Future Energy Company PJSC (MASDAR)
Position : AutoCAD Draughtsman

Project : Agricultural Maintenance Works for Al Dhafra Airbase Camp
Location : Abu Dhabi
Client : Command of Military Works (CMW)
Position : AutoCAD Draughts

Project : Residential Building G+1
Location : Abu Dhabi
Client : Command of Military Works (CMW)
Position : AutoCAD Draughts

Project : New chilled Water Piping System
Location : Abu Dhabi
Client : Ministry Of Presidential Affairs(Al Mushrif Palace)
Position : AutoCAD Draughtsman`,
      },
      {
        name: "AYOON SOHAR",
        location: "Oman",
        job: "CAD Draughtsman",
        from: "2016",
        to: "2018",
        info: `Landscape and interior Layout plan drawing in Auto Cad.
        Preparation of Landscape drawing.
        Quantity takes off from drawings.
        Visiting sites and factory to help supervisors to monitor the progress.`,
      },
      {
        name: "FUTURA INTRIORS PVT. LTD",
        location: "Oman",
        job: "CAD Operator",
        from: "2010",
        to: "2015",
        info: `Drawing Survey Interior design as per client Requirement in Auto Cad.
        Interior layout plan, Drawing in Auto Cad 2d & 3d in sketch up
        Making various types format & inter data in MS. Excel end writing latter in MS. Word.
        Maintaining all documents and drawings.`,
      },
    ],
    education: [
      {
        name: "Draughtsman (CIVIL) (National Council for Vocational Training certificate)",
        inst: "CSI ITC",
        location: "Kaliyakkavilai, Tamilnadu. India",
        year: 2010,
      },
      {
        name: "Higher Secondary",
        inst: "S.S.P.G.Higher Secondary School",
        location: "Edalakudy, TamilNadu. India",
        year: 2005,
      },
      {
        name: "High School",
        inst: "S.S.P.G Higher Secondary School",
        location: "Edalakudy, TamilNadu. India",
        year: 2003,
      },
    ],
  };

  // const value = useParams();

  return (
    <div className="cvprofile">
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"CV Profile Search"}
        third_page={"CV profile"}
        second_path={"/searchcv"}
      />
      <div className="cvprofile-body">
        <div className="cvprofile-header">
          <div className="cvprofile-header-first-part">
            <img className={"cvprofile-picture"} src={test.image} alt="test" />
            <div className="text-orange bolder large-text">{test.name}</div>
            <div className="text-grey medium-text bold">{test.job}</div>
          </div>
          <div className="cvprofile-header-second-part">
            {Object.keys(test.personal_detail).map((keyName, i) => (
              <div>
                <div className="bolder">{removeUnderScore(keyName)}</div>
                <div className="text-grey">{test.personal_detail[keyName]}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="cvprofile-header-2">
          <div className="cvprofile-skills">
            <div className="bolder medium-text">Candidate Skills</div>
            <div className="cvprofile-skills-chain">
              {test.skills.map((skill) => (
                <div className="cvprofile-each-skill bolder">{skill}</div>
              ))}
            </div>
          </div>
          <div className="cvprofile-skills">
            <div className="bolder medium-text">Work Experience</div>
            <div>
              {test.work_experience.map((experience) => (
                <div>
                  <div>{experience.name}</div>
                  <div>{experience.job}</div>
                  <div>{experience.from}</div>
                  <div>{experience.to}</div>
                  <div>{experience.info}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVprofile;
