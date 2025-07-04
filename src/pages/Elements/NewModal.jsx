import React from "react";

const NewModal = ({
  // Modal content props
  title = "Confirm Action",
  description = "Are you sure you want to proceed?",

  // Button props
  triggerButtonText = "Open Modal",
  triggerButtonClass = "btn",
  confirmButtonText = "Confirm",
  confirmButtonClass = "btn btn-primary",
  cancelButtonText = "Cancel",
  cancelButtonClass = "btn btn-ghost",
  // Action handlers
  onConfirm,
  onCancel,
  // Modal customization
  modalId = "confirmation_modal",
  modalClass = "modal",
  modalBoxClass = "modal-box",
  showCloseButton = true,
  openModal,

  // Danger/warning styling
  isDangerous = false,
}) => {
  const handleConfirm = () => {
    document.getElementById(modalId).close();
    // Then execute the confirm action if provided
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    // Close the modal first
    document.getElementById(modalId).close();
    // Then execute the cancel action if provided
    if (onCancel) {
      onCancel();
    }
  };

  // Apply danger styling if needed
  const dangerClasses = isDangerous
    ? {
        title: "text-error font-bold text-lg",
        confirmButton: `btn btn-error ${
          confirmButtonClass.includes("btn-") ? "" : "text-white"
        }`,
        description: "py-4 text-base-content",
      }
    : {
        title: "font-bold text-lg",
        confirmButton: confirmButtonClass,
        description: "py-4",
      };
  return (
    <div>
      {/* <button className={triggerButtonClass} onClick={openModal}>
        {triggerButtonText}
      </button> */}
      <dialog id={modalId} className={modalClass}>
        <div className={modalBoxClass}>
          {showCloseButton && (
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          )}
          <h3 className={dangerClasses.title}> {title} </h3>
          <p className={dangerClasses.description}> {description} </p>

          <div className="modal-action">
            <button className={cancelButtonClass} onClick={handleCancel}>
              {cancelButtonText}
            </button>

            <button
              className={dangerClasses.confirmButton}
              onClick={handleConfirm}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default NewModal;
