import React from "react";
import Container from "../components/HeroComponents/Container";
import Title from "../components/HeroComponents/Title";
import Button from "../components/HeroComponents/Button";
import { BsPlayCircle } from "react-icons/bs";
import ExtraLogos from "../components/HeroComponents/ExtraLogos";
import BackgroundDesign from "../components/HeroComponents/BackgroundDesign";
import PhoneFrame from "../components/HeroComponents/PhoneFrame";
import { useTranslation } from "react-i18next";
import "./css/Home.css";

function Home() {
  const { t } = useTranslation();
  return (
    <section
      id="home"
      className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36 mt-24"
    >
      {/* Bubble Animation */}
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>

      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20 area">
          {/* Right side */}
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <Title title={t("homePage.electronic_kyc")} className="text-4xl" />
            <p className="mt-6 text-lg text-gray-600">
              {t("homePage.welcome")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-4">
              <Button variant="outline" href="https://youtu.be/vviFia-Stqk">
                <BsPlayCircle className="text-xl" />
                <span className="ml-2.5">
                  {t("homePage.watch_ekyc_process")}
                </span>
              </Button>
            </div>
          </div>
          {/* Left side */}
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <BackgroundDesign className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
            <div className="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-bottom-20 lg:-top-10 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <PhoneFrame className="max-w-[366px] mx-auto"></PhoneFrame>
            </div>
          </div>
          <ExtraLogos />
        </div>
      </Container>
    </section>
  );
}

export default Home;
