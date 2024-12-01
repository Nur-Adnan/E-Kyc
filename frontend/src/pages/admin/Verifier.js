import { useState, useEffect } from "react";
import {
  Button,
  useToast,
  Divider,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Verifier() {
  const { t } = useTranslation();
  const toast = useToast();
  const [verifier, setVerifier] = useState("");
  const [verifiers, setVerifiers] = useState([]);
  const [isAddingVerifier, setIsAddingVerifier] = useState(false);
  const [isDeletingVerifier, setIsDeletingVerifier] = useState(false);

  const handleAddVerifier = async () => {
    try {
      if (!verifier)
        return toast({
          title: "Error",
          description: "Please enter verifier address.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setIsAddingVerifier(true);
      const res = await axios.post(
        "http://localhost:3001/addVerifier",
        {
          verifier,
        }
      );
      console.log(res.data);
      if (res.data.status) {
        setVerifier("");
        setIsAddingVerifier(false);
        toast({
          title: "Verifier added.",
          description: "We've added verifier.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      setIsAddingVerifier(false);
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleDeleteVerifier = async () => {
    try {
      if (!verifier)
        return toast({
          title: "Error",
          description: "Please enter verifier address.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setIsDeletingVerifier(true);
      const res = await axios.post(
        "http://localhost:3001/removeVerifier",
        {
          verifier,
        }
      );
      console.log(res.data);
      if (res.data.status) {
        setIsDeletingVerifier(false);
        setVerifier("");
        toast({
          title: "Verifier removed.",
          description: "We've removed verifier.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      setIsDeletingVerifier(false);
      toast({
        title: "Error",
        description: "Something went wrong.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchVerifiers = async () => {
      try {
        const res = await axios.post(
          "http://localhost:3001/getAllVerifiers"
        );
        console.log(res.data);
        setVerifiers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVerifiers();
  }, []);

  return (
    <div>
      <div className="flex justify-center m-auto">
        <div className="mt-20 w-full px-20">
          <h3 className="mb-12 text-4xl font-extrabold text-[#202020] text-center mt-12">
            {t("verifier.verifier")}
          </h3>
          <div className="mt-5"></div>
          <div className="flex gap-10">
            <div className="flex flex-row w-1/2 m-auto">
              <div className="flex-1 mt-5">
                <div className="flex flex-col">
                  <label className="text-3xl text-[#202020] font-medium">
                    {t("verifier.addVerifier")}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Verifier address"
                    className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md"
                    value={verifier}
                    onChange={(e) => setVerifier(e.target.value)}
                  />
                  <Button
                    onClick={handleAddVerifier}
                    className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md"
                    isLoading={isAddingVerifier}
                    loadingText="Submitting"
                    colorScheme="blue"
                    variant="solid"
                  >
                    {t("verifier.addVerifier")}
                  </Button>
                </div>
              </div>

              <div className="flex-1 mt-5 ml-5">
                <div className="flex flex-col">
                  <label className="text-3xl text-[#202020] font-medium">
                    {t("verifier.deleteVerifier")}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Verifier address"
                    className="w-full mt-2 p-2 border-2 border-gray-300 rounded-md"
                    value={verifier}
                    onChange={(e) => setVerifier(e.target.value)}
                  />
                  <Button
                    onClick={handleDeleteVerifier}
                    className="w-full mt-2 p-2 bg-red-500 text-white rounded-md"
                    isLoading={isDeletingVerifier}
                    loadingText="Submitting"
                    colorScheme="red"
                    variant="solid"
                  >
                    {t("verifier.deleteVerifier")}
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
                            className="px-6 py-3 w-48 bg-blue-600 text-left font-bold"
                          >
                            {t("verifier.serialNo")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-64 text-left font-bold"
                          >
                            {t("verifier.organizationName")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-[426px] bg-blue-600 text-left font-bold"
                          >
                            {t("verifier.organizationAddress")}
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 w-52 text-left font-bold"
                            isNumeric
                          >
                            {t("verifier.addedOn")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {verifiers.map((verifier, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <th
                              scope="row"
                              className="px-6 py-4 w-48 text-left font-medium text-gray-900 whitespace-nowrap bg-gray-200"
                            >
                              {index + 1}
                            </th>
                            <td className="px-6 py-4 w-64 text-left">
                              {verifier.orgName}
                            </td>
                            <td className="px-6 py-4 w-64 text-left bg-gray-200">
                              {verifier.address}
                            </td>
                            <td className="px-6 py-4 w-60 text-left" isNumeric>
                              {new Date(verifier.addedOn).toLocaleString()}
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

export default Verifier;
