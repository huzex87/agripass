import React from "react";
import { getStatus } from "../../Utilis/Status";
import { formatDate } from "../../Utilis/DateFormatter";

const ApplicationModal = ({
  modalId = "confirmation_modal",
  modalTitle = "Hello!",
  applicationInfo,
}) => {
  if (!applicationInfo) {
    return null;
  }
  return (
    <>
      <dialog id={modalId} className="modal">
        <div className="modal-box">
          <div className=" bg-gray-100 rounded-lg p-3">
            <div className="flex items-center justify-between mt-5 gap-5 ">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
              <div className="mx-auto text-left">
                <div className="flex-col items-center gap-2">
                  <h2 className="text-md md:text-2xl mb-2">{modalTitle}</h2>
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
                {formatDate(applicationInfo.createdAt)}{" "}
              </span>
            </p>
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
