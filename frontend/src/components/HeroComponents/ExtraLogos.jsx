import React from "react";
// Import your e-KYC related icons/logos here
import {
  FiCheckCircle,
  FiShield,
  FiLock,
  FiUpload,
  FiUser,
} from "react-icons/fi";
import Title from "./Title";
import { useTranslation } from "react-i18next";

const ExtraLogos = () => {
  const { t } = useTranslation();
  const logos = [
    {
      _id: 2001,
      title: t("homePage.identity_verification"),
      icon: <FiCheckCircle size={32} />,
    },
    {
      _id: 2002,
      title: t("homePage.secure_authentication"),
      icon: <FiShield size={32} />,
    },
    {
      _id: 2003,
      title: t("homePage.document_upload"),
      icon: <FiUpload size={32} />,
    },
    {
      _id: 2004,
      title: t("homePage.user_authentication"),
      icon: <FiUser size={32} />,
    }, // Replaced with User Authentication
    {
      _id: 2005,
      title: t("homePage.data_encryption"),
      icon: <FiLock size={32} />,
    },
    // Add more relevant logos/icons as needed
  ];

  return (
    <div className="relative -mt-4 lg:col-span-7 lg:mt-0 xl:col-span-6">
      <Title title={t("homePage.services")} className="text-4xl" />
      <ul
        role="list"
        className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-8 lg:mx-0 lg:justify-start"
      >
        {logos.map(({ title, icon }) => (
          <li key={title} className="flex items-center justify-center">
            {icon}
            <span className="ml-2">{title}</span>{" "}
            {/* Display the title of the service */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExtraLogos;
