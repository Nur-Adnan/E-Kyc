import { useState, useEffect } from "react";
import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import ShowKycDetails from "../../components/ShowKycDetails";
import { useTranslation } from "react-i18next";

function Verified() {
  const { t } = useTranslation();
  const [walletAddress, setWalletAddress] = useState("");
  const userRole = localStorage.getItem("role");
  const orgId = localStorage.getItem("nidNumber");
  const toast = useToast();
  const [citizenAddr, setCitizenAddr] = useState("");
  const [nid, setNid] = useState("");
  const [citizensAddr, setCitizensAddr] = useState([]);
  const [isAddr, setIsAddr] = useState(false);
  const [isNID, setIsNID] = useState(false);
  const [isClicked, setIsClicked] = useState(false); // to change table state
  const [kycData, setKycData] = useState(null); // to store fetched data

  const handleUsingAddr = async () => {
    try {
      if (!citizenAddr) {
        return toast({
          title: "Error",
          description: "Please enter address.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      setIsAddr(true);
      setIsClicked(true);
      const response = await axios.post(
        "http://localhost:3001/orgKycDataByAddress",
        {
          orgId,
          citizenAddr,
        }
      );
      const kycData = response.data.kycData;
      console.log(kycData);
      setKycData(kycData);
      if (kycData) {
        setCitizenAddr("");
        setIsAddr(false);
        toast({
          title: "Success",
          description: "We've got the details.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      setIsAddr(false);
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleUsingNID = async () => {
    try {
      if (!nid)
        return toast({
          title: "Error",
          description: "Please enter NID.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setIsNID(true);
      setIsClicked(true);
      const response = await axios.post(
        "http://localhost:3001/orgKycDataByNid",
        {
          orgId,
          nid,
        }
      );
      const kycData = response.data.kycData;
      console.log(kycData);
      setKycData(kycData);
      if (kycData) {
        setCitizenAddr("");
        setIsAddr(false);
        toast({
          title: "Success",
          description: "We've got the details.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      setIsNID(false);
      // show toast
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

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

  useEffect(() => {
    const fetchVerifiers = async () => {
      try {
        await getWalletAddress();
        console.log(walletAddress);
        const res = await axios.post(
          "http://localhost:3001/orgGrantAccess",
          {
            orgAddress: walletAddress,
          }
        );
        console.log(res.data);
        setCitizensAddr(res.data.citizens);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVerifiers();
  }, [walletAddress]);

  return (
    <div className="mt-20 w-full px-20">
      <h3 className="mb-12 text-4xl font-extrabold text-[#202020] text-center mt-28">
        {t("ekycDetails.ekycDetails")}
      </h3>
      <div className="flex gap-10">
        <div className="flex flex-row w-1/2 m-auto">
          <div className="flex-1 mt-5">
            <div className="flex flex-col">
              {isClicked ? (
                <>
                  {/* TODO: citizenAddr passing as null ⚠️ */}
                  {kycData && citizenAddr != null && (
                    <ShowKycDetails
                      kycData={kycData}
                      citizenAddr={citizenAddr}
                    />
                  )}
                </>
              ) : (
                <>
                  <label className="text-3xl text-[#202020] font-medium">
                    {t("ekycDetails.citizenWalletAddress")}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Citizen address"
                    className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md"
                    value={citizenAddr}
                    onChange={(e) => setCitizenAddr(e.target.value)}
                  />
                  <Button
                    onClick={handleUsingAddr}
                    className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
                    isLoading={isAddr}
                    loadingText="Submitting"
                    colorScheme="green"
                    variant="solid"
                  >
                    {t("ekycDetails.getDetails")}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 mt-5 ml-5">
            <div className="flex flex-col">
              <label className="text-3xl text-[#202020] font-medium">
                {t("ekycDetails.citizenNID")}
              </label>
              <input
                type="text"
                placeholder="Enter Citizen NID No"
                className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
              />
              <Button
                onClick={handleUsingNID}
                className="w-full mt-2 p-2 bg-red-500 text-white rounded-md"
                isLoading={isNID}
                loadingText="Submitting"
                colorScheme="blue"
                variant="solid"
              >
                {t("ekycDetails.getDetails")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-lg">
        <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12">
          <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
            <div className="flex items-center justify-center w-full lg:p-12">
              <div className="flex items-center xl:p-10">
                <table className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                  <thead className="text-xs text-gray-950 uppercase">
                    <tr className="bg-blue-500 text-white">
                      <th
                        scope="col"
                        className="px-6 py-3 w-64 bg-blue-600 text-left font-bold"
                      >
                        {t("ekycDetails.serialNo")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 w-64 text-left font-bold"
                      >
                        {t("ekycDetails.citizenName")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 w-[16rem] bg-blue-600 text-left font-bold"
                      >
                        {t("ekycDetails.nidNo")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 w-[26rem] text-left font-bold"
                      >
                        {t("ekycDetails.walletAddress")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {citizensAddr.length > 0 ? (
                      citizensAddr.map((citizen, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                        >
                          <th
                            scope="row"
                            className="px-6 py-4 w-64 text-left font-semibold text-gray-900 bg-gray-100 rounded-l-lg"
                          >
                            {index + 1}
                          </th>
                          <td className="px-6 py-4 w-64 text-left text-gray-700">
                            {citizen.name}
                          </td>
                          <td className="px-6 py-4 w-64 text-left bg-gray-50 text-gray-700">
                            {citizen.nid}
                          </td>
                          <td className="px-6 py-4 w-auto text-left text-gray-700">
                            {citizen.address}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-700 bg-gray-200"
                        >
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Verified;
