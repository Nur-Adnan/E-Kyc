import React, { useState } from "react";
import { create } from "ipfs-http-client";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const ipfs = create({ url: "http://127.0.0.1:5001" });

function ImageUpload() {
  const { t } = useTranslation();
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const nid = localStorage.getItem("nidNumber");

  const storeKYCData = async (ipfsHash) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/submitKYC`,
        {
          ipfsHash,
          nid,
        }
      );
      console.log("KYC Data Submitted Successfully:", response.data);
      console.log("KYC User NID Number:", nid);
      return response.data.hash;
    } catch (error) {
      console.error("Error submitting KYC data:", error);
    }
  };

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  async function uploadFilesAsDirectory(files) {
    try {
      const directoryName = `images-${nid}`;
      const filesToAdd = files.map((file, index) => {
        return {
          path: `${directoryName}/image${index + 1}.jpg`,
          content: file,
        };
      });

      const addedFiles = [];
      for await (const result of ipfs.addAll(filesToAdd, {
        wrapWithDirectory: true,
      })) {
        addedFiles.push(result);
      }

      const directory = addedFiles[addedFiles.length - 1];
      if (directory.cid) {
        const response = await storeKYCData(directory.cid.toString());
        if (response) {
          Swal.fire({
            title: "Success",
            text: t("ipfs.imagesUploaded"),
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: t("ipfs.failedUpload"),
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        console.log(directory.cid.toString());
      }
      return `http://127.0.0.1:8080/ipfs/${directory.cid}`;
    } catch (error) {
      console.error("Error uploading directory to IPFS:", error);
      return null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!frontImage || !backImage) {
      Swal.fire({
        title: "Error",
        text: t("ipfs.bothImagesRequired"),
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const frontFile = await fetch(frontImage).then((r) => r.blob());
    const backFile = await fetch(backImage).then((r) => r.blob());

    await uploadFilesAsDirectory([frontFile, backFile]);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white py-5 px-6 container mx-auto flex items-center justify-center rounded-lg shadow-lg">
        <div className="flex w-full max-w-3xl xl:gap-14 lg:justify-between md:gap-5 items-center">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex flex-col w-full h-full text-center bg-transparent rounded-3xl p-6">
              <h3 className="mb-12 text-4xl font-extrabold text-[#202020]">
                {t("ipfs.uploadNID")}
              </h3>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center justify-center mb-8">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#e3f2fd] text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue-200 cursor-pointer hover:bg-[#007bff] hover:text-white transition-all ease-in-out duration-500 mb-8">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal font-semibold w-96">
                      {t("ipfs.selectFrontImage")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setFrontImage)}
                    />
                  </label>
                  {frontImage && (
                    <img
                      src={frontImage}
                      alt="Front Side"
                      className="mt-4 w-32 h-32 object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="flex flex-col items-center justify-center mb-8">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#e3f2fd] text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue-200 cursor-pointer hover:bg-[#007bff] hover:text-white transition-all ease-in-out duration-500 mb-8">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1L10.6 2.82a.86.86 0 00-.6-.25h-6A.94.94 0 003 3.5v13a.94.94 0 001 1h12a.94.94 0 001-1v-6a.86.86 0 00-.25-.6zM10 3l6 6h-4a2 2 0 01-2-2V3zm-1 9a2 2 0 11-2 2 2 2 0 012-2zm-1 5v-1a4 4 0 018 0v1a.94.94 0 01-1 1h-6a.94.94 0 01-1-1z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal font-semibold w-96">
                      {t("ipfs.selectBackImage")}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setBackImage)}
                    />
                  </label>
                  {backImage && (
                    <img
                      src={backImage}
                      alt="Back Side"
                      className="mt-4 w-32 h-32 object-cover rounded-md"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 mb-5 text-m font-bold bg-[#007bff] text-[#ffffff] hover:bg-[#0056b3] hover:text-[#ffffff] transition duration-300 md:w-96 rounded-2xl border-transparent border-2 hover:border-[#0056b3]"
                >
                  {t("ipfs.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ImageUpload;
