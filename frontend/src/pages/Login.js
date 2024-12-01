import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPhone, FaEye, FaShieldAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./css/Login.css";

function Login() {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(Math.floor(Math.random() * 10) + 1);
  const [userCaptcha, setUserCaptcha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (parseInt(userCaptcha) !== captcha + 3) {
      Swal.fire({
        title: "Error",
        text: "Captcha does not match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        {
          phoneNumber,
          password,
        }
      );
      console.log(response.data);
      const { token, role, nid, access, message } = response.data;
      Swal.fire({
        title: "Success",
        text: `${message} ${role}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      setPhoneNumber("");
      setPassword("");
      setUserCaptcha("");
      setCaptcha(Math.floor(Math.random() * 10) + 1);
      navigate("/account");
      window.location.reload();
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("phoneNumber", phoneNumber);
      localStorage.setItem("access", access);
      localStorage.setItem("nidNumber", nid); // Save the NID number in local storage
    } catch (error) {
      console.log("Login Error", error);
      Swal.fire({
        title: "Error",
        text: "Login failed",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div class="bg-image font-[sans-serif]">
        <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4">
          <div class="max-w-md w-full">
            <div class="p-8 rounded-2xl bg-white shadow">
              <h2 class="text-gray-800 text-center text-2xl font-bold">
                {t("signinPage.sign_in")}
              </h2>
              <form class="mt-8 space-y-4" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="phone"
                    className="text-gray-800 text-sm mb-2 block"
                  >
                    {t("signinPage.phone_number")}
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
                    {t("signinPage.password")}
                  </label>
                  <div class="relative flex items-center">
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaEye className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">
                    {t("signinPage.captcha_label", { captcha })}
                  </label>
                  <div class="relative flex items-center">
                    <input
                      className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                      type="text"
                      placeholder="Captcha"
                      value={userCaptcha}
                      onChange={(e) => setUserCaptcha(e.target.value)}
                    />
                    <FaShieldAlt className="w-4 h-4 absolute right-4" />
                  </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      for="remember-me"
                      class="ml-3 block text-sm text-gray-800"
                    >
                      {t("signinPage.remember_me")}
                    </label>
                  </div>
                  <div class="text-sm">
                    <Link
                      to=""
                      class="text-blue-600 hover:underline font-semibold"
                    >
                      {t("signinPage.forgot_password")}
                    </Link>
                  </div>
                </div>
                <div class="!mt-8">
                  <button
                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    type="submit"
                  >
                    {t("signinPage.sign_in_button")}
                  </button>
                </div>
                <p class="text-gray-800 text-sm !mt-8 text-center">
                  {t("signinPage.no_account")}
                  <Link
                    to=""
                    class="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold"
                  >
                    {t("signinPage.register_here")}
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

export default Login;
