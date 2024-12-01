import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, useToast } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai"; // Import React Icon

function EthereumAddressInput() {
  const { t } = useTranslation();
  const [verifier, setVerifier] = useState("");
  const [verifierList, setVerifierList] = useState([]);
  const nid = localStorage.getItem("nidNumber");
  const toast = useToast();

  useEffect(() => {
    // Fetch the list of verifiers on component mount
    const fetchVerifiers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/verifiers?nid=${nid}`
        );
        console.log(response.data.verifiers);
        setVerifierList(response.data.verifiers);
      } catch (error) {
        console.error("Error fetching verifiers:", error);
      }
    };

    fetchVerifiers();
  }, [nid, verifierList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/grantVerifier`,
        {
          verifier,
          nid,
        }
      );
      toast({
        title: t("Mykyc.kycApproved"),
        description: `Verifier: ${verifier}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setVerifier("");
      setVerifierList([...verifierList, verifier]);
    } catch (error) {
      console.error("Error submitting KYC Approved:", error);
      toast({
        title: t("Mykyc.error"),
        description: t("Mykyc.failedToApprove"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRevoke = async (verifierToRevoke) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/revokeVerifier`,
        {
          verifier: verifierToRevoke,
          nid,
        }
      );
      toast({
        title: t("Mykyc.kycRevoked"),
        description: `Verifier: ${verifierToRevoke}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setVerifierList(verifierList.filter((v) => v !== verifierToRevoke));
    } catch (error) {
      console.error("Error submitting KYC Revoke:", error);
      toast({
        title: t("Mykyc.error"),
        description: t("Mykyc.failedToRevoke"),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-center m-auto">
        <div className="mt-20 w-full px-20">
          <h3 className="mb-12 text-4xl font-extrabold text-[#202020] text-center mt-12">
            {t("Mykyc.verifierAddress")}
          </h3>
          <div className="mt-5"></div>
          <div className="flex gap-10">
            <div className="flex flex-row w-1/2 m-auto">
              <div className="flex-1 mt-5">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={verifier}
                    onChange={(e) => setVerifier(e.target.value)}
                    placeholder="Enter your Verifier address"
                    className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md"
                  />
                </form>
              </div>
              {/* Buttons aligned vertically */}
              <div className="flex flex-row gap-2 items-center justify-start ml-4 mt-7">
                <Button
                  type="submit"
                  colorScheme="green"
                  leftIcon={<CheckIcon />}
                  onClick={handleSubmit}
                >
                  {t("Mykyc.approve")}
                </Button>
                <Button
                  type="button"
                  colorScheme="red"
                  leftIcon={<CloseIcon />}
                  onClick={() => handleRevoke(verifier)}
                >
                  {t("Mykyc.revoke")}
                </Button>
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
                      <div className="flex items-center mb-3">
                        <hr className="h-0 border-b border-solid border-grey-500 grow" />
                        <h3 className="mb-4 mx-4 text-4xl font-extrabold text-dark-grey-900">
                          {t("Mykyc.givenAccessVerifiers")}
                        </h3>
                        <hr className="h-0 border-b border-solid border-grey-500 grow" />
                      </div>
                      <thead className="text-xs text-gray-950 uppercase">
                        <tr className="bg-blue-500 text-white">
                          <th
                            scope="col"
                            className="px-6 py-3 w-[6rem] bg-blue-600 text-left font-bold"
                          >
                            {t("Mykyc.slNo")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-48 text-left font-bold"
                          >
                            {t("Mykyc.orgName")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-48 bg-blue-600 text-left font-bold"
                          >
                            {t("Mykyc.orgID")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-[27rem] text-left font-bold"
                          >
                            {t("Mykyc.orgAddress")}
                          </th>
                          <th className="px-6 py-3 w-[5rem] bg-blue-600 text-left font-bold">
                            {t("Mykyc.action")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {verifierList.map((verifier, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-300 hover:bg-gray-100 transition-colors duration-300"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 w-[6rem] text-left font-semibold text-gray-900 bg-gray-100 rounded-l-lg"
                            >
                              {index + 1}
                            </th>
                            <td className="px-6 py-4 w-48 text-left text-gray-700">
                              {verifier.name}
                            </td>
                            <td className="px-6 py-4 w-48 text-left bg-gray-50 text-gray-700">
                              {verifier.orgId}
                            </td>
                            <td className="px-6 py-4 w-[27rem] text-left text-gray-700">
                              {verifier.verifier}
                            </td>
                            <td className="px-8 py-3 w-[5rem] text-center bg-gray-50">
                              <AiOutlineClose
                                onClick={() => handleRevoke(verifier.verifier)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-300 cursor-pointer"
                              />
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
        </div>
      </div>
    </div>
  );
}

export default EthereumAddressInput;
