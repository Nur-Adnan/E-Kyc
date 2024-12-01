import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logoImg from "../assets/images/kyc-logo.png";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Import i18next configuration
import {
  FiLogOut,
  FiClock,
  FiUserCheck,
  FiRefreshCcw,
  FiKey,
  FiUser,
  FiUpload,
  FiEye,
  FiList,
  FiShield,
  FiDatabase,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";

function Navbar() {
  const isUserSignedIn = !!localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isKycSubmitted = localStorage.getItem("access") === "true"; // TODO: ⚠️⚠️⚠️⚠️
  const { t } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(false); // Default state set to BN
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nidNumber");
    localStorage.removeItem("access");
    navigate("/login");
  };

  // Handle language switch
  const handleLanguageToggle = () => {
    const newLanguage = isEnglish ? "bn" : "en";
    i18n.changeLanguage(newLanguage);
    setIsEnglish(!isEnglish);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b backdrop-blur-lg bg-opacity-50 p-1 shadow-md shadow-gray-200/50">
      <div className="mx-auto max-w-[100rem] px-6 sm:px-6 lg:px-8">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start">
            <NavLink className="flex flex-shrink-0 items-center" to="/">
              <img className="block h-20 w-auto" src={logoImg} alt="Taxation" />
            </NavLink>
          </div>
          <div className="">
            <ul className="flex-shrink-0 flex px-2 py-3 items-center space-x-8">
              {isUserSignedIn && (
                <>
                  <NavLink
                    to="/account"
                    className={
                      ({ isActive }) =>
                        isActive
                          ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                          : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm" // Inactive state style without border or outline
                    }
                  >
                    <li className="flex items-center">
                      <FiUser className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                      {/* Icon with margin-right and blue color */}
                      {t("navBar.account")}
                    </li>
                  </NavLink>
                  {userRole === "Taxpayer" && (
                    <>
                      {!isKycSubmitted && (
                        <NavLink
                          to="/kyc"
                          className={({ isActive }) =>
                            isActive
                              ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm"
                              : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                          }
                        >
                          <li className="flex items-center">
                            <FiKey className="mr-2 h-5 w-5 text-[#2563EB]" />
                            {t("navBar.kyc")}
                          </li>
                        </NavLink>
                      )}
                      {/* {isKycSubmitted && ( */}
                      <>
                        <NavLink
                          to="/approved"
                          className={({ isActive }) =>
                            isActive
                              ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm"
                              : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                          }
                        >
                          <li className="flex items-center">
                            <FiRefreshCcw className="mr-2 h-5 w-5 text-[#2563EB]" />
                            {t("navBar.updateKyc")}
                          </li>
                        </NavLink>
                        <NavLink
                          to="/my"
                          className={({ isActive }) =>
                            isActive
                              ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm"
                              : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                          }
                        >
                          <li className="flex items-center">
                            <FiUserCheck className="mr-2 h-5 w-5 text-[#2563EB]" />
                            {t("navBar.myKyc")}
                          </li>
                        </NavLink>
                        <NavLink
                          to="/history"
                          className={({ isActive }) =>
                            isActive
                              ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm"
                              : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                          }
                        >
                          <li className="flex items-center">
                            <FiClock className="mr-2 h-5 w-5 text-[#2563EB]" />
                            {t("navBar.history")}
                          </li>
                        </NavLink>
                      </>
                      {/* )} */}
                    </>
                  )}
                  {userRole === "Admin" && (
                    <>
                      <NavLink
                        to="/uploadNID"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiUpload className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.uploadNID")}
                        </li>
                      </NavLink>
                      <NavLink
                        to="/verifier"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiEye className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.verifier")}
                        </li>
                      </NavLink>
                      <NavLink
                        to="/verifiedUserList"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiList className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.verifiedUserList")}
                        </li>
                      </NavLink>
                      <NavLink
                        to="/blockList"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiShield className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.blockList")}
                        </li>
                      </NavLink>
                    </>
                  )}
                  {/* TODO: Cooking */}
                  {userRole === "Organization" && (
                    <>
                      <NavLink
                        to="/ekyc"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiDatabase className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.ekyc")}
                        </li>
                      </NavLink>
                      <NavLink
                        to="/verifiedUserList"
                        className={({ isActive }) =>
                          isActive
                            ? "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#2563EB] transition-all duration-300 ease-in-out shadow-sm" // Active state style without border or outline
                            : "relative inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 font-semibold text-[#202020] hover:text-[#2563EB] transition-all duration-300 ease-in-out hover:bg-[#f1f5f9] shadow-sm"
                        }
                      >
                        <li className="flex items-center">
                          <FiList className="mr-2 h-5 w-5 text-[#2563EB]" />{" "}
                          {/* Icon with margin-right and blue color */}
                          {t("navBar.verifiedUserList")}
                        </li>
                      </NavLink>
                    </>
                  )}
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 bg-red-500 px-4 font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                    >
                      <FiLogOut className="mr-2 h-5 w-5" />
                      {t("navBar.logout")}
                    </button>
                  </li>
                  <li>
                    <label className="languageSwitcher relative inline-flex cursor-pointer select-none items-center">
                      <input
                        type="checkbox"
                        checked={isEnglish}
                        onChange={handleLanguageToggle}
                        className="sr-only"
                      />
                      <span className="label flex items-center text-sm font-medium text-black">
                        BN
                      </span>
                      <span
                        className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                          isEnglish ? "bg-blue-600" : "bg-[#CCCCCE]"
                        }`}
                      >
                        <span
                          className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                            isEnglish ? "translate-x-[28px]" : ""
                          }`}
                        ></span>
                      </span>
                      <span className="label flex items-center text-sm font-medium text-black">
                        EN
                      </span>
                    </label>
                  </li>
                </>
              )}
              {!isUserSignedIn && (
                <>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive
                        ? "relative inline-flex h-10 items-center justify-center rounded-md bg-[#0070f3] px-8 py-2 font-light text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] transition duration-200 ease-linear focus:outline-none"
                        : "relative inline-flex h-10 items-center justify-center rounded-md bg-white px-8 py-2 font-light text-[#0070f3] shadow-sm hover:bg-[rgba(0,118,255,0.1)] hover:text-[#0070f3] transition duration-200 ease-linear focus:outline-none"
                    }
                  >
                    <li className="flex items-center space-x-3">
                      <FiLogIn
                        className={
                          ({ isActive }) =>
                            isActive
                              ? "h-5 w-5 text-white" // Icon color when active
                              : "h-5 w-5 text-[#0070f3]" // Icon color when not active
                        }
                      />
                      <span
                        className={
                          ({ isActive }) =>
                            isActive
                              ? "text-white" // Text color when active
                              : "text-[#0070f3]" // Text color when not active
                        }
                      >
                        {t("navBar.login")}
                      </span>
                    </li>
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      isActive
                        ? "relative inline-flex h-10 items-center justify-center rounded-md bg-[#0070f3] px-8 py-2 font-light text-white shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] transition duration-200 ease-linear focus:outline-none"
                        : "relative inline-flex h-10 items-center justify-center rounded-md bg-white px-8 py-2 font-light text-[#202020] shadow-sm hover:bg-[rgba(0,118,255,0.1)] hover:text-[#0070f3] transition duration-200 ease-linear focus:outline-none"
                    }
                  >
                    <li className="flex items-center space-x-3">
                      <FiUserPlus
                        className={
                          ({ isActive }) =>
                            isActive
                              ? "h-5 w-5 text-white" // Icon color when active
                              : "h-5 w-5 text-[#0070f3]" // Icon color when not active
                        }
                      />
                      <span
                        className={
                          ({ isActive }) =>
                            isActive
                              ? "text-white" // Text color when active
                              : "text-[#0070f3]" // Text color when not active
                        }
                      >
                        {t("navBar.signup")}
                      </span>
                    </li>
                  </NavLink>
                  <label className="languageSwitcher relative inline-flex cursor-pointer select-none items-center">
                    <input
                      type="checkbox"
                      checked={isEnglish}
                      onChange={handleLanguageToggle}
                      className="sr-only"
                    />
                    <span className="label flex items-center text-sm font-medium text-black">
                      BN
                    </span>
                    <span
                      className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
                        isEnglish ? "bg-blue-600" : "bg-[#CCCCCE]"
                      }`}
                    >
                      <span
                        className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
                          isEnglish ? "translate-x-[28px]" : ""
                        }`}
                      ></span>
                    </span>
                    <span className="label flex items-center text-sm font-medium text-black">
                      EN
                    </span>
                  </label>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
