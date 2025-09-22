import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import signedNdaAPI from "../../api/signedNdaApi/signedNdaAPI";

interface Props {
  fetchNdaDocs: () => Promise<void>;
  editData: { _id: string; fileUrl: string } | null;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
}

export default function SignedNdaView({
  fetchNdaDocs,
  editData,
  setEditData,
}: Props) {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (editData) {
      setShowModal(true);
    }
  }, [editData]);

  const resetForm = () => {
    setFile(null);
    setFileError("");
    setEditData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !editData) {
      Swal.fire({
        icon: "error",
        title: "Please select a file",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setLoading(true);
    try {
      let cleanFileUrl = editData?.fileUrl || "";

      if (file) {
        const res = await signedNdaAPI.GetUploadUrl({
          name: file.name,
          fileType: "pdf",
          type: "document",
        });

        const signedUrl = res.data.signedUrl;

        await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        cleanFileUrl = signedUrl.split("?")[0];
      }

      if (editData) {
        await signedNdaAPI.UpdateNDA(editData._id, { fileUrl: cleanFileUrl });
        Swal.fire({
          icon: "success",
          title: "NDA updated successfully",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await signedNdaAPI.CreateNDA({ fileUrl: cleanFileUrl });
        Swal.fire({
          icon: "success",
          title: "NDA created successfully",
          toast: true,
          position: "top-right",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }

      fetchNdaDocs();
      setShowModal(false);
      resetForm();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-4 relative">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <button
          className="flex items-center gap-2 bg-[#16968F] text-white px-6 py-3 rounded-xl hover:bg-emerald-700 cursor-pointer"
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
        >
          {/*  <img
            src="/icons/jobs-icon.svg"
            alt="Jobs Icon"
            width={20}
            height={20}
          /> */}
          Add NDA Form
        </button>

        <div className="relative flex-1">
          <img
            src="/icons/search-icon.svg"
            alt="Search Icon"
            width={16}
            height={16}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Nda Form"
            className="w-full border border-gray-300 rounded-md py-3 pl-10 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6">
            <button
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <img
                src="/icons/cross-icon.svg"
                alt="Close"
                width={15}
                height={15}
              />
            </button>

            <h2 className="text-xl font-normal mb-6">
              {editData ? "Update NDA" : "Add NDA"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className={`w-full border ${
                    fileError ? "border-red-500" : "border-gray-300"
                  } rounded-md px-4 py-3`}
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0]);
                      setFileError("");
                    }
                  }}
                />

                {editData && !file && (
                  <p className="text-gray-600 text-sm mt-2">
                    Current file:{" "}
                    <a
                      href={editData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-[18px] p-2"
                    >
                      {editData.fileUrl.split("/").pop()}
                    </a>
                  </p>
                )}

                {file && (
                  <p className="text-green-600 text-sm mt-2">
                    Selected new file: {file.name}
                  </p>
                )}

                {fileError && (
                  <p className="text-red-600 text-sm mt-1">{fileError}</p>
                )}
              </div>

              <div className="flex justify-left gap-6 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 text-white px-10 py-2 rounded-md 
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#16968F] hover:bg-emerald-700"
                    }`}
                >
                  {loading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>{editData ? "Update" : "Add"}</>
                  )}
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-8 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
