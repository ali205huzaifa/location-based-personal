"use client";

import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type JobDetail = {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  currentSalary: string;
  expectedSalary: string;
  noticePeriod: string;
  portfolio: string;
  cv: string;
  reason: string;
  comments: {
    by: string;
    comment: string;
  }[];
};

const mockJobDetails: Record<string, JobDetail> = {
  "1": {
    name: "Kamran Syed",
    location: "Rawalpindi",
    email: "kamransyed@gmail.com",
    phone: "+92031546185",
    linkedin: "https://www.linkedin.com/in/kamran-sa/",
    currentSalary: "20,000 PKR",
    expectedSalary: "45,000 PKR",
    noticePeriod: "15 Days",
    portfolio: "www.behance.net/kamransyed152",
    cv: "Muhammad Kamran Syed Updated CV.pdf",
    reason: "Lorem ipsum dolor sit amet consectetur...",
    comments: [
      {
        by: "Saba",
        comment: "Traveling Problem , will discuss it in office meeting.",
      },
      { by: "Aman", comment: "Lorem ipsum dolor sit amet consectetur..." },
    ],
  },
};

export default function JobDetail() {
  const { id } = useParams();
  const job = mockJobDetails[id as string];
  const navigate = useNavigate();

  if (!job) return <p className="p-6">Job not found</p>;

  return (
    <div className="p-6">
      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="flex justify-between items-start flex-wrap">
          <div className="flex items-start gap-3 flex-wrap">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-black mt-10"
            >
              <img
                src="/icons/back-icon.svg"
                alt="Redirect"
                width={6}
                height={6}
              />
            </button>

            <div>
              <p className="text-sm text-blue-600 font-medium">
                App development
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-Regular text-[30px] mt-2">
                  Flutter Developer
                </h1>
                <span className="text-sm text-gray-500 mt-4">#154234</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2 sm:mt-0">
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <span className="urbanist mr-1">Posted by :</span>
              <span className="inline-flex items-center gap-2 font-medium">
                <img
                  src="/icons/jobposter-icon.svg"
                  alt="user"
                  width={12}
                  height={12}
                />
                <span className="urbanist">Aman yar</span>
              </span>
            </div>

            <button className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 flex items-center gap-2">
              <img
                src="/icons/editjob-icon.svg"
                alt="edit"
                width={12}
                height={12}
              />
              Edit this Job
            </button>
          </div>
        </div>

        <div className="flex justify-between flex-wrap items-center mt-3 text-sm text-gray-700">
          <div className="flex flex-wrap gap-x-3 gap-y-1 ml-5">
            <span>Full-time</span>
            <span>|</span>
            <span>1-3 Yrs Experience</span>
            <span>|</span>
            <span>Hybrid</span>
            <span>|</span>
            <span>02 Positions</span>
            <span>|</span>
            <span>Islamabad</span>
            <span>|</span>
            <span>Both genders</span>
          </div>
          <div className="text-green-600 font-medium">Active</div>
        </div>
      </div>
    </div>
  );
}
