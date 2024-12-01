import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { useTranslation } from "react-i18next";

const BlockListPage = () => {
  const { t } = useTranslation();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNidDataVisible, setIsNidDataVisible] = useState(false);
  const [nidInfo, setNidInfo] = useState(null);

  useEffect(() => {
    // Fetch the list of blocked users from the backend
    axios
      .get("http://localhost:3001/blocked-users")
      .then((response) => {
        const usersWithCountdown = response.data.map((user) => {
          const kycExpiryDate = moment(user.kycSubmissionDate).add(1, "years");
          const countdown = moment(kycExpiryDate).diff(moment(), "days");
          return { ...user, countdown };
        });
        setBlockedUsers(usersWithCountdown);
      })
      .catch((error) => {
        console.error("Error fetching blocked users:", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };
  const getNIDInfoByOrg = async (nidNumber) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/get-nid-info/${nidNumber}`
      );
      const nidInfo = response.data;
      setNidInfo(nidInfo);
      setIsNidDataVisible(true);
    } catch (error) {
      console.error("Error getting NID info:", error);
    }
  };

  const filteredUsers = searchTerm
    ? blockedUsers.filter(
        (user) =>
          user.nidNumber.includes(searchTerm) ||
          user.fullNameEnglish
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.fullNameBangla.includes(searchTerm) ||
          user.dateOfBirth.includes(searchTerm)
      )
    : blockedUsers;

  return (
    <div className="bg-white rounded-lg py-5">
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10">
              <table className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <h3 className="mb-4 mx-4 text-4xl font-extrabold text-dark-grey-900">
                    {t("blockedUsers.blockedUsers")}
                  </h3>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <div className="search-container flex justify-end items-center">
                  <input
                    type="text"
                    placeholder="Search by NID, Full Name, or Date of Birth"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input flex items-center w-1/2 px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                  />
                  <button
                    onClick={handleClear}
                    className="px-4 mb-7 h-14 flex items-center justify-center font-bold bg-red-500 text-white rounded-md"
                  >
                    {t("blockedUsers.clear")}
                  </button>
                </div>
                <thead className="text-xs text-gray-950 uppercase">
                  <tr className="bg-blue-500 text-white">
                    <th
                      scope="col"
                      className="px-6 py-3 w-48 bg-blue-600 text-left"
                    >
                      {t("blockedUsers.nidNumber")}
                    </th>
                    <th scope="col" className="px-6 py-3 w-64 text-left">
                      {t("blockedUsers.fullNameEnglish")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 w-64 bg-blue-600 text-left"
                    >
                      {t("blockedUsers.fullNameBangla")}
                    </th>
                    <th scope="col" className="px-6 py-3 w-48 text-left">
                      {t("blockedUsers.dateOfBirth")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.nidNumber}
                      className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 w-48 text-left font-semibold text-gray-900 bg-gray-100 rounded-l-lg"
                      >
                        {user.nidNumber}
                      </th>
                      <td className="px-6 py-4 w-64 text-left text-gray-700">
                        {user.fullNameEnglish}
                      </td>
                      <td className="px-6 py-4 w-64 text-left bg-gray-50 text-gray-700">
                        {user.fullNameBangla}
                      </td>
                      <td className="px-6 py-4 w-48 text-left text-gray-700">
                        {user.dateOfBirth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockListPage;
