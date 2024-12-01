import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUserShield, FaIdCard, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Kyc() {
  const { t } = useTranslation();
  const [nidNumber, setNidNumber] = useState("");
  const [fullNameEnglish, setFullNameEnglish] = useState("");
  const [fullNameBangla, setFullNameBangla] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3001/kyc", {
        nidNumber,
        fullNameEnglish,
        fullNameBangla,
        dateOfBirth,
      })

      .then((response) => {
        // Handle the success response
        Swal.fire({
          title: t("kyc.success"),
          text: response.data.message,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setNidNumber("");
        setFullNameEnglish("");
        setFullNameBangla("");
        setDateOfBirth("");
        // const access = response.data.access;
        // localStorage.setItem("access", access); // TODO: ⚠️⚠️⚠️⚠️⚠️
        localStorage.setItem("nidNumber", nidNumber);
        navigate(`/user/${nidNumber}`);
      })
      .catch((error) => {
        // Handle the error response
        console.log("Unable to submit data. Error: ", error.response.data);
        Swal.fire({
          title: "Error",
          text: t("kyc.unableToSubmit"),
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <div class="bg-gray-50 font-[sans-serif]">
      <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4 mt-16">
        <div class="max-w-xl w-full">
          <div class="p-8 rounded-2xl bg-white shadow">
            <div className="text-center">
              <h2 className="text-gray-800 text-2xl font-bold flex items-center justify-center">
                <FaUserShield className="text-blue-500 mr-2" /> {t("kyc.kyc")}
              </h2>
            </div>
            <form class="mt-8 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label for="nid" className="text-gray-800 text-sm mb-2 block">
                  {t("kyc.nidNumber")}
                </label>
                <div class="relative flex items-center">
                  <input
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    type="text"
                    id="nid"
                    placeholder="NID Number"
                    value={nidNumber}
                    onChange={(e) => setNidNumber(e.target.value)}
                  />
                  <FaIdCard className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <div>
                <label
                  for="english"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  {t("kyc.fullNameEnglish")}
                </label>
                <div class="relative flex items-center">
                  <input
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    type="text"
                    id="english"
                    placeholder="Full Name (English)"
                    value={fullNameEnglish}
                    onChange={(e) => setFullNameEnglish(e.target.value)}
                  />
                  <FaUser className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <div>
                <label
                  for="bangla"
                  className="text-gray-800 text-sm mb-2 block"
                >
                  {t("kyc.fullNameBangla")}
                </label>
                <div class="relative flex items-center">
                  <input
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    type="text"
                    id="bangla"
                    placeholder="Full Name (Bangla)"
                    value={fullNameBangla}
                    onChange={(e) => setFullNameBangla(e.target.value)}
                  />
                  <FaUser className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <div>
                <label for="dob" className="text-gray-800 text-sm mb-2 block">
                  {t("kyc.dateOfBirth")}
                </label>
                <div class="relative flex items-center">
                  <input
                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                    type="text"
                    id="dob"
                    placeholder="Date of Birth (dd mm yyyy)"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                  <FaCalendarAlt className="w-4 h-4 absolute right-4" />
                </div>
              </div>
              <button
                className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mb-3"
                type="submit"
              >
                {t("kyc.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kyc;
