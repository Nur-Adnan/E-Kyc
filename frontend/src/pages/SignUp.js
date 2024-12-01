import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { FaUser, FaPhone, FaLock, FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import "./css/SignUp.css";

var firebaseConfig = {
  apiKey: "AIzaSyAFOJG_KOoUOWmRwb2pUF0HTc11BqcW6RA",
  authDomain: "e-kyc-e8749.firebaseapp.com",
  projectId: "e-kyc-e8749",
  storageBucket: "e-kyc-e8749.appspot.com",
  messagingSenderId: "710748579175",
  appId: "1:710748579175:web:4113fbccd3a91660ccfbc2",
};

firebase.initializeApp(firebaseConfig);
// Create a reference to the Firebase auth service
const auth = firebase.auth();

function SignUp() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [role, setRole] = useState("Taxpayer");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("http://localhost:3001/register").then((res) => {
      // console.log(res.data)
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: t("signupPage.signUpPasswordMismatch"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    // Proceed with full name verification only if the role is 'taxpayer'
    if (role === "Taxpayer") {
      try {
        const response = await axios.get(
          "http://localhost:3001/people"
        );
        const peopleData = response.data;
        const userFullName = fullName;
        const matchingPerson = peopleData.find(
          (person) =>
            person.fullNameEnglish === userFullName ||
            person.fullNameBangla === userFullName
        );

        if (!matchingPerson) {
          Swal.fire({
            title: "Error",
            text: t("signupPage.signUpFullNameMismatch"),
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }
      } catch (error) {
        console.error("Error fetching people data:", error);
        Swal.fire({
          title: "Error",
          text: t("signupPage.fetchNIDError"),
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // Use the auth service to send a verification code to the user's phone number
    const phoneNumberWithCountryCode = "+880" + phoneNumber;
    const recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    auth
      .signInWithPhoneNumber(phoneNumberWithCountryCode, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);

        Swal.fire({
          title: t("signupPage.enterVerificationCode"),
          input: "text",
          inputPlaceholder: t("signupPage.verificationCodePrompt"),
          inputAttributes: {
            autocapitalize: "off",
          },
          showCancelButton: true,
          confirmButtonText: "Verify",
          showLoaderOnConfirm: true,
          preConfirm: (code) => {
            setVerificationCode(code);

            return axios
              .post("http://localhost:3001/register", {
                fullName,
                phoneNumber,
                password,
                role,
              })
              .then((response) => {
                console.log("User registered successfully:", response.data);
              })
              .catch((error) => {
                console.error("Error registering user:", error);
                Swal.showValidationMessage(`Request failed: ${error}`);
              });
          },
          allowOutsideClick: () => !Swal.isLoading(),
        });
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: t("signupPage.signUpVerificationError"),
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  const handleVerify = (event) => {
    event.preventDefault();
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    auth
      .signInWithCredential(credential)
      .then((userCredential) => {
        Swal.fire({
          title: "Success",
          text: t("signupPage.signUpVerificationSuccess"),
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        setFullName("");
        setPhoneNumber("");
        setPassword("");
        setConfirmPassword("");
        setVerificationCode("");
        setVerificationId("");
        fetchUsers();
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: t("signupPage.verificationFailed"),
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <>
      <div class="bg-image font-[sans-serif]">
        <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4 mt-16">
          <div class="max-w-md w-full">
            <div class="p-8 rounded-2xl bg-white shadow">
              <h2 class="text-gray-800 text-center text-2xl font-bold">
                {t("signupPage.signUpTitle")}
              </h2>
              <form class="mt-8 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="fullName"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signupPage.signUpFullNameLabel")}
                  </label>
                  <div class="relative flex items-center">
                    {/* Icon positioned absolutely */}
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="text"
                      id="fullName"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <FaUser className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signupPage.signUpPhoneLabel")}
                  </label>
                  <div class="relative flex items-center">
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="text"
                      id="phone"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <FaPhone className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signupPage.signUpPasswordLabel")}
                  </label>
                  <div class="relative flex items-center">
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="password"
                      id="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signupPage.signUpConfirmPasswordLabel")}
                  </label>
                  <div class="relative flex items-center">
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <FaLock className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signupPage.signUpRoleLabel")}
                  </label>
                  <div class="relative flex items-center">
                    <select
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option
                        value="Taxpayer"
                        className="mb-2 text-sm text-start text-[#202020] font-medium "
                      >
                        {t("signupPage.signUpTaxpayer")}
                      </option>
                      <option
                        value="Organization"
                        className="mb-2 text-sm text-start text-[#202020] font-medium"
                      >
                        {t("signupPage.signUpOrganization")}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center">
                    <input
                      id="policy"
                      name="policy"
                      type="checkbox"
                      class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      for="policy"
                      class="ml-2 block text-sm text-gray-800"
                    >
                      {t("signupPage.signUpTermsPolicy")}
                    </label>
                  </div>
                </div>
                <div class="!mt-8">
                  <button
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none mb-3"
                    type="submit"
                  >
                    {t("signupPage.signUpSendVerification")}
                  </button>
                  <div className="flex items-center mb-3">
                    <hr className="h-0 border-b border-solid border-grey-500 grow" />
                    <p className="mx-4 text-[#202020] font-medium">
                      {t("signupPage.signUpVerificationCode")}
                    </p>
                    <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  </div>
                  <div class="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Verification Code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md mb-3"
                    />
                    <FaKey className="w-4 h-4 absolute right-4 top-4" />
                  </div>
                  <button
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none "
                    onClick={handleVerify}
                  >
                    {t("signupPage.signUpVerifySignUp")}
                  </button>
                  <div id="recaptcha-container"></div>
                </div>
                <p class="text-gray-800 text-sm !mt-8 text-center">
                  {t("signupPage.signUpHasAccount")}
                  <Link
                    to=""
                    class="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    {t("signupPage.signUpLoginHere")}
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
