import React from "react";
// import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import { removeUnderScore } from "../../utilities";
import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Menu, message } from "antd";
import {
  FaUserCheck,
  FaFileDownload,
  FaClipboard,
  FaWhatsapp,
  FaUserEdit,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FcShare } from "react-icons/fc";
import "./cvprofile.css";

const CVprofile = () => {
  const menu = (
    <Menu
      items={[
        {
          label: "Download Oman Jobs CV",
          key: "1",
          icon: <FaUserCheck />,
          onClick: () => {
            message.success("Downloading Oman Jobs CV");
          },
        },
        {
          label: "Download Original CV",
          key: "2",
          icon: <FaFileDownload />,
          onClick: () => {
            message.success("Downloading Original CV");
          },
        },
        {
          label: "Share in",
          key: "3",
          children: [
            {
              key: "3-1",
              label: "Clipboard",
              icon: <FaClipboard />,
            },
            {
              key: "3-2",
              label: "Whatsapp",
              icon: <FaWhatsapp />,
            },
            {
              key: "3-3",
              label: "Gmail",
              icon: <SiGmail />,
            },
          ],
          icon: <FcShare />,
        },
        {
          label: "Edit",
          key: "4",
          icon: <FaUserEdit />,
        },
      ]}
    />
  );

  const test = {
    name: "MOHAMED HANEEFA.A.W",
    image: "https://cv.omanjobs.om/files/images/pic-1655296444.png",
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
      email: "haneefa.85@gmail.com",
      gender: "Male",
      mobile: 97987878787,
      dob: "11 May 1988",
      nationality: "Indian",
      country: "India",
      address:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempore reprehenderit eaque placeat vero dolorum nobis excepturi maiores quasi quaerat iusto?",
      language: "Fluency in English, Hindi, Malayalam and Tamil",
      passport_no: "P3392902",
    },
    work_experience: [
      {
        name: "AL REEF PROJECT L.L.C",
        job: "Landscape Designer",
        from: "2018",
        to: "present",
        info: `
        • Site survey.\n
        • Creating new AutoCAD layout.\n
        • Landscape Design 2D & 3D Works.\n
        • Photoshop works.\n
        • 3D Designs in Real-time Landscape & Sketch Up.\n
        • Rendering.\n
        • Excel & word works.\n
        • Monthly Progress report landscape & Irrigation\n
        • Other works.\n`,
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

  return (
    <div className="cvprofile">
      <Header />
      <Navigation
        previous_page={"Dashboard"}
        previous_path={"/Dashboard"}
        current_page={"Search CV"}
        third_page={"CV profile"}
        second_path={"/searchcv"}
      />
      <div className="cvprofile-body">
        <div className="cvprofile-header-first-part slide-in-left-animation">
          <img className={"cvprofile-picture"} src={test.image} alt="test" />
          <div className="text-orange bolder large-text">{test.name}</div>
          <div className="text-grey medium-text bold">{test.job}</div>
          <div className="flex-small-gap">
            <a
              className="each-skill"
              href="https://www.w3schools.com"
              rel="noreferrer"
              target={"_blank"}
            >
              Work Portfolio Video
            </a>
            <a
              className="each-skill"
              href="https://www.w3schools.com"
              rel="noreferrer"
              target={"_blank"}
            >
              Interview
            </a>
          </div>
        </div>
        <div className="cvprofile-header-second-part long-box slide-in-right-animation">
          <div className="bolder large-text text-orange grid-gather4 small-padding-bottom">
            Personal Details
          </div>
          {Object.keys(test.personal_detail).map((keyName, i) => (
            <div>
              <div className="bolder medium-text">
                {removeUnderScore(keyName)}
              </div>
              <div className="text-grey">{test.personal_detail[keyName]}</div>
            </div>
          ))}
        </div>
        <div className="experiences-list">
          <Dropdown overlay={menu}>
            <Button className="button-primary zoom-in-animation">
              <Space>
                More Options
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
          <div className="cvprofile-skills slide-in-left-animation">
            <div className="bolder large-text text-black">Soft Skills</div>
            <div className="cvprofile-skills-chain">
              {test.skills.map((skill) => (
                <div className="cvprofile-each-skill bolder">{skill}</div>
              ))}
            </div>
          </div>
          <div className="cvprofile-skills slide-in-left-animation">
            <div className="bolder large-text text-black">Education</div>
            <div className="cvprofile-skills-chain">
              {test.education.map((each_education) => (
                <div className="each-experience">
                  <div className="text-orange bolder medium-text">
                    {each_education.name}
                  </div>
                  <div className="medium-text bolder text-black">
                    {each_education.inst}
                  </div>
                  <div className="bolder small-text text-light-grey">
                    {each_education.year}
                  </div>
                  <div className="bold text-grey">
                    {each_education.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cvprofile-skills long-box slide-in-right-animation">
          <div className="bolder large-text text-black">Work Experience</div>
          <div className="experiences-list">
            {test.work_experience.map((experience) => (
              <div className="each-experience">
                <div className="text-orange bolder medium-text">
                  {experience.name}
                </div>
                <div className="medium-text bolder text-black">
                  {experience.job}
                </div>
                <div className="flex-small-gap bolder small-text text-light-grey">
                  <div>{experience.from}</div>
                  <div>-</div>
                  <div>{removeUnderScore(experience.to)}</div>
                </div>
                <div>
                  {experience.info.split("\n").map((str) => (
                    <div className="bold text-grey medium-text">{str}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid-gather">Attachment Section</div>
      </div>
      <div className="copyright">@ 2022 Copyright Powered by Oman Jobs</div>
    </div>
  );
};

export default CVprofile;