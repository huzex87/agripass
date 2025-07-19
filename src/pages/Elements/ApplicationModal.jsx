import React, { useState } from "react";
import { getStatus } from "../../Utilis/Status";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import api from "../../Utilis/Api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

dayjs.extend(relativeTime);

const ApplicationModal = ({
  modalId = "confirmation_modal",
  modalTitle = "Hello!",
  applicationInfo,
}) => {
  const [error, setError] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!applicationInfo) {
    return null;
  }

  const handleApproveApplication = async () => {
    try {
      const response = await api.put(
        `/disbursify/approve_application/${applicationInfo._id}`
      );
      if (response.status === 200) {
        toast.success("Application approved successfully!");
        document.getElementById(modalId).close();
        setTimeout(function () {
          location.reload(true);
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "Failed to approve application.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleRejectApplication = async () => {
    try {
      const response = await api.put(
        `/disbursify/reject/${applicationInfo._id}`
      );
      if (response.status === 200) {
        toast.success("Application rejected successfully!");
        document.getElementById(modalId).close();
        setTimeout(function () {
          location.reload(true);
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "Failed to approve application.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleVerificationToken = async () => {
    try {
      const response = await api.put(
        `/disbursify/generate_token/${applicationInfo.beneficiaryId._id}`
      );
      setGeneratedToken(response.data.updatedDisbursement.verificationToken);
      toast.success("Verification Token Generated Successfully");
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "Failed to approve application.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    } finally {
      setTokenLoading(false);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      const response = await api.delete(
        `/disbursify/delete_application/${applicationInfo._id}`
      );

      if (response.status === 200) {
        const message =
          response.data.message || "Application deleted successfully";
        toast.success(message);
        document.getElementById(modalId).close();
        setTimeout(function () {
          location.reload(true);
        }, 2000);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data) {
        const errorMessage =
          error.response.data.error || "Failed to delete application.";
        setError(errorMessage);
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          {error && (
            <div role="alert" className="alert alert-error alert-soft mb-4">
              <span className="font-medium">Error! {error} </span>
            </div>
          )}
          <div className=" bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mt-5 gap-5 ">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <div className="mx-auto text-left">
                <div className="flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-md md:text-2xl mb-2">{modalTitle}</h2>
                    <div className="tooltip" data-tip="Delete Application">
                      <Trash2
                        onClick={handleDeleteApplication}
                        size={20}
                        className="cursor-pointer hover:w-4"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <h1>Status:</h1>
                    <span>{getStatus(applicationInfo.status)}</span>
                    <span className="font-semibold">
                      {applicationInfo.status}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mt-5 justify-between items-center ">
            <div>
              <p className="text-xl font-semibold mt-5">
                {applicationInfo.beneficiaryId.personalDetails.firstName}-
                {applicationInfo.beneficiaryId.personalDetails.lastName}
              </p>
              <p className="text-lg  ">
                {applicationInfo.beneficiaryId.personalDetails.email}{" "}
              </p>
            </div>
            <h2>
              Gender:
              <span className="ml-2 font-medium">
                {applicationInfo.beneficiaryId.personalDetails.gender}
              </span>
            </h2>
          </div>

          <div className="mt-5">
            <p>
              Identification Type:{" "}
              <span className="font-medium">
                {applicationInfo.beneficiaryId.identification.idType}{" "}
              </span>
            </p>
          </div>

          <div className="mt-3">
            <p>
              Date Applied:{" "}
              <span className="font-medium">
                {dayjs(applicationInfo.createdAt).fromNow()}{" "}
              </span>
            </p>
          </div>

          <div className="mt-5">
            <h3>Project Applied For:</h3>
            <p className="font-medium text-lg">
              {" "}
              {applicationInfo.projectId.name}{" "}
            </p>
          </div>

          {/* Token Section - Only show if approved */}
          {applicationInfo.status === "approved" && (
            <>
              <div className="mt-5 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
                  Verification Token
                </h3>

                {!generatedToken ? (
                  <div className="flex items-center gap-3">
                    <button
                      className="btn btn-outline btn-success btn-sm"
                      onClick={handleVerificationToken}
                      disabled={tokenLoading}
                    >
                      {tokenLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Generating...
                        </>
                      ) : (
                        "Generate Token"
                      )}
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Click to generate a 7-day verification token for
                      <span className="ml-2 font-bold">
                        {
                          applicationInfo.beneficiaryId.personalDetails
                            .firstName
                        }
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border font-mono text-sm flex-1">
                        {generatedToken}
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => copyToClipboard(generatedToken)}
                      >
                        {copied ? "Token Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      ✓ Token generated successfully. Valid for 7 days.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-5 flex items-center gap-2">
            {applicationInfo.status !== "approved" ? (
              <button
                className="btn btn-soft btn-error"
                onClick={handleRejectApplication}
              >
                Reject Application
              </button>
            ) : (
              ""
            )}
            <button
              className="btn btn-soft btn-success"
              onClick={handleApproveApplication}
            >
              Approve Application
            </button>
          </div>

          <div className="modal-action">
            {/* A button to close the modal, if needed */}
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ApplicationModal;
