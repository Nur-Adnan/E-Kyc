import React, { useEffect, useState } from "react";
import axios from "axios";
import accountImage from "./assets/images/accounts.png";
import "./css/Account.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function Account() {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    getWalletAddress();
  }, []);

  const getWalletAddress = async () => {
    console.log("Account Page");
    try {
      const nidNumber = localStorage.getItem("nidNumber");
      console.log("NID Number before:", nidNumber);
      if (nidNumber !== "undefined") {
        console.log("NID Number: after", nidNumber);
        const response = await axios.post(
          `http://localhost:3001/getWalletAddress`,
          {
            nidNumber: nidNumber,
          }
        );
        setWalletAddress(response.data);
        console.log("User Wallet Address:", response);
      }
    } catch (error) {
      console.error("Error getting user address", error);
    }
  };

  return (
    <div className="bg-image min-h-screen flex items-center justify-center">
      <div className="container flex flex-col mx-auto bg-transparent rounded-lg pt-12 my-5">
        <div className="flex justify-between w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            {userRole === "Taxpayer" && (
              <div className="flex flex-col items-start xl:p-10">
                <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                  {t("account.accountInformation")}
                </h3>
                <div className="flex items-center">
                  <button className="font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    {t("account.yourWalletAddress")}
                  </button>
                  <div className="relative ml-4 flex items-center">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={walletAddress}
                      readOnly
                      className="p-2 border border-gray-300 rounded pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {userRole === "Organization" && (
              <div className="flex flex-col items-start xl:p-10">
                <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                  {t("account.welcomeToOrganizationAccount")}
                </h3>
                <div className="flex items-center">
                  <button className="font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    {t("account.organizationWalletAddress")}
                  </button>
                  <div className="relative ml-4 flex items-center">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={walletAddress}
                      readOnly
                      className="p-2 border border-gray-300 rounded pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {userRole === "Admin" && (
              <div className="flex flex-col items-start xl:p-10">
                <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                  {t("account.welcomeToAdminPanel")}
                </h3>
                <div className="flex items-center">
                  <button className="font-bold bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    {t("account.adminWalletAddress")}
                  </button>
                  <div className="relative ml-4 flex items-center">
                    <input
                      type={isVisible ? "text" : "password"}
                      value="0xC9bd96A68995487f4F4a9C90D7E90Ae95ce44Aa3"
                      readOnly
                      className="p-2 border border-gray-300 rounded pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleVisibility}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800"
                    >
                      {isVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center w-full lg:p-12">
            <img
              src={accountImage}
              alt="Account Illustration"
              className="w-full h-full rounded-lg animate-bounce"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
