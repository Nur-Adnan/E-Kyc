import React, { useState, useEffect } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import Swal from "sweetalert2";
import DisplayNidInfo from "../components/DisplayNidInfo";
import { useTranslation } from "react-i18next";

const VerifiedUserListPage = () => {
  const { t } = useTranslation();
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role");
  const orgId = localStorage.getItem("nidNumber"); //only for org
  const [isNidDataVisible, setIsNidDataVisible] = useState(false);
  const [nidInfo, setNidInfo] = useState(null);

  const url =
    role === "Organization"
      ? `http://localhost:3001/org-verified-users?orgId=${orgId}`
      : "http://localhost:3001/verified-users";

  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get(url);
        const usersWithExpiryDate = response.data.map((user) => {
          const storedExpiryDate = localStorage.getItem(user.nidNumber);
          let kycExpiryDate;

          if (storedExpiryDate) {
            kycExpiryDate = new Date(storedExpiryDate);
          } else if (user.kycSubmissionDate) {
            const submissionDate = new Date(user.kycSubmissionDate);
            if (!isNaN(submissionDate.getTime())) {
              kycExpiryDate = new Date(
                submissionDate.getTime() + 365 * 24 * 60 * 60 * 1000
              );
              localStorage.setItem(user.nidNumber, kycExpiryDate.toISOString());
            } else {
              console.error(`Invalid date for user: ${user.nidNumber}`);
              kycExpiryDate = null; // Mark expiry date as invalid
            }
          } else {
            console.error(
              `Missing submission date for user: ${user.nidNumber}`
            );
            kycExpiryDate = null;
          }

          return {
            ...user,
            kycExpiryDate,
            isBlocked: user.blocked || false,
          };
        });
        setVerifiedUsers(usersWithExpiryDate);
      } catch (error) {
        console.error("Error fetching verified users:", error);
      }
    };

    fetchVerifiedUsers();

    const intervalId = setInterval(() => {
      setVerifiedUsers((prevUsers) =>
        prevUsers.map((user) => {
          const storedExpiryDate = localStorage.getItem(user.nidNumber);
          const kycExpiryDate = storedExpiryDate
            ? new Date(storedExpiryDate)
            : user.kycExpiryDate;

          return {
            ...user,
            kycExpiryDate,
          };
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [url]);

  const renderer = ({ days, hours, completed }) => {
    if (completed) {
      return <span className="text-red-600">Expired</span>;
    } else {
      const years = Math.floor(days / 365);
      const remainingDays = days % 365;
      const months = Math.floor(remainingDays / 30);
      const dayCount = remainingDays % 30;

      return (
        <span>
          {years > 0 && `${years}y-`}
          {months > 0 && `${months}mo-`}
          {dayCount}d-{hours}h
        </span>
      );
    }
  };

  const handleBlockUser = (nidNumber) => {
    axios
      .post("http://localhost:3001/block-user", { nidNumber })
      .then(() => {
        Swal.fire("Blocked!", "The user has been blocked.", "success");
        setVerifiedUsers(
          verifiedUsers.map((user) => {
            if (user.nidNumber === nidNumber) {
              return { ...user, isBlocked: true };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        Swal.fire("Error!", "There was an issue blocking the user.", "error");
        console.error("Error blocking user:", error);
      });
  };

  const handleUnblockUser = (nidNumber) => {
    axios
      .post("http://localhost:3001/unblock-user", { nidNumber })
      .then(() => {
        Swal.fire("Unblocked!", "The user has been unblocked.", "success");
        setVerifiedUsers(
          verifiedUsers.map((user) => {
            if (user.nidNumber === nidNumber) {
              return { ...user, isBlocked: false };
            }
            return user;
          })
        );
      })
      .catch((error) => {
        Swal.fire("Error!", "There was an issue unblocking the user.", "error");
        console.error("Error unblocking user:", error);
      });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  const filteredUsers = searchTerm
    ? verifiedUsers.filter(
        (user) =>
          user.nidNumber.includes(searchTerm) ||
          user.fullNameEnglish
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user.fullNameBangla.includes(searchTerm) ||
          user.dateOfBirth.includes(searchTerm)
      )
    : verifiedUsers;

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

  return (
    <div className="bg-cover bg-center min-h-screen">
      <div className="bg-transparent py-5">
        <div className="container mx-auto bg-transparent p-5 my-5 ">
          <div className="flex justify-center mb-5">
            <div className="text-center">
              <div className="flex items-center mb-3 mt-12">
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
                <h3 className="mb-4 mx-4 text-4xl font-extrabold text-dark-grey-900">
                  {t("verifiedUserList.verifiedUserList")}
                </h3>
                <hr className="h-0 border-b border-solid border-grey-500 grow" />
              </div>
              <div className="search-container flex justify-end items-center ml-[600px]">
                <input
                  type="text"
                  placeholder="Search by NID, Full Name, or Date of Birth"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input flex items-center w-[32rem] px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl border-2 border-gray-300"
                />
                <button
                  onClick={handleClear}
                  className="px-4 mb-7 h-14 flex items-center justify-center font-bold bg-red-500 text-white rounded-md"
                >
                  {t("verifiedUserList.clear")}
                </button>
              </div>
            </div>
          </div>
          {isNidDataVisible ? (
            <>
              <DisplayNidInfo nidInfo={nidInfo} />
            </>
          ) : (
            <div className="overflow-x-auto ml-28">
              <table className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                <thead className="text-xs text-gray-950 uppercase">
                  <tr className="bg-blue-500 text-white">
                    <th
                      scope="col"
                      className="px-6 py-4 w-[203px] bg-blue-600 text-left font-bold"
                    >
                      {t("verifiedUserList.nidNumber")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 w-64 text-left font-bold"
                    >
                      {t("verifiedUserList.fullNameEnglish")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 w-64 bg-blue-600 text-left font-bold"
                    >
                      {t("verifiedUserList.fullNameBangla")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 w-48 text-left font-bold"
                    >
                      {t("verifiedUserList.dateOfBirth")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 w-52 bg-blue-600 text-left font-bold"
                    >
                      {t("verifiedUserList.expiredTime")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 w-48 text-left font-bold"
                    >
                      {t("verifiedUserList.status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {/* user print */}
                  {filteredUsers.map((user) => {
                    const isValidExpiryDate =
                      user.kycExpiryDate &&
                      !isNaN(new Date(user.kycExpiryDate).getTime());
                    return (
                      <tr
                        key={user._id}
                        className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 w-[203px] text-left font-bold bg-gray-100 rounded-l-lg cursor-pointer hover:bg-gray-200 transition-colors underline text-blue-500"
                          onClick={() => getNIDInfoByOrg(user.nidNumber)}
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
                        <td className="px-6 py-4 w-52 text-left bg-gray-50 text-gray-700">
                          <Countdown
                            date={user.kycExpiryDate}
                            renderer={renderer}
                          />
                        </td>
                        <td className="px-6 py-4 w-48 text-left uppercase font-semibold">
                          {user.isBlocked ? (
                            <button
                              className="text-red-600 bg-red-100 hover:bg-red-200 px-4 py-1 rounded-lg transition-colors duration-300"
                              onClick={() => handleUnblockUser(user.nidNumber)}
                            >
                              Blocked
                            </button>
                          ) : (
                            <button
                              className="text-green-600 bg-green-100 hover:bg-green-200 px-4 py-1 rounded-lg transition-colors duration-300"
                              onClick={() => handleBlockUser(user.nidNumber)}
                            >
                              Active
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifiedUserListPage;
