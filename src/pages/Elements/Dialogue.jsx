import { LogOut } from "lucide-react";
import React from "react";

const Dialogue = ({ OpenModal, Logout }) => {
  return (
    <dialog id="my_modal_1" className="modal" onClick={OpenModal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Confirm!</h3>
        <p className="py-4">Are you sure you want to Logout?</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <div className="flex items-center gap-2">
              <button className="btn">Close</button>
              <button className="btn bg-red-600 text-white" onClick={Logout}>
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Dialogue;
