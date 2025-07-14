import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../Utilis/Api";
import { formatDate } from "../../../Utilis/DateFormatter";
import ApplicationModal from "../../Elements/ApplicationModal";

const Applications = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [applications, setApplications] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const navigate = useNavigate();
  const subdomain = useParams().subdomain;

  const fetchApplications = async (pageNumber = 1, currentStatus = status) => {
    setLoading(true);

    const config = {
      params: {
        page: pageNumber,
        status: currentStatus,
        limit: 10,
      },
    };
    try {
      const response = await api.get(`/disbursify/applications`, config);
      const { applications, currentPage, totalPage, total } = response.data;
      setApplications(applications || []);
      setCurrentPage(currentPage);
      setTotalPages(totalPage);
      setTotal(total);
    } catch (error) {
      toast.error("Failed to fetch applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(currentPage, status);
  }, [status, currentPage]);

  const openModal = (application) => {
    setSelectedApplication(application);
    document.getElementById("applicationId").showModal();
  };

  return (
    <>
      <div className="text-2xl font-bold mt-5">Beneficiary Applications</div>
      <div className="mb-4 mt-10 flex items-center gap-2 ">
        <h2>Filter By:</h2>
        <select
          className="select select-bordered w-full max-w-xs"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
          <option value="">All Status</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Applications List */}
      {!loading && applications.length > 0 ? (
        <div className="mt-10">
          <p className="mb-4">
            {" "}
            Showing {applications.length} of {total} Applications
          </p>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Gender</th>
                  <th>Email Address</th>
                  <th>Identification Type</th>
                  <th>Application Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((items, index) => (
                  <tr key={items._id || index}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{items.beneficiaryId.personalDetails.firstName} </td>
                    <td>{items.beneficiaryId.personalDetails.lastName} </td>
                    <td>{items.beneficiaryId.personalDetails.gender} </td>
                    <td>{items.beneficiaryId.personalDetails.email} </td>
                    <td>{items.beneficiaryId.identification.idType} </td>
                    <td>{items.status} </td>
                    <td>{formatDate(items.createdAt)} </td>
                    <td>
                      <button className="btn" onClick={() => openModal(items)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-white">No projects found</p>
        </div>
      )}
      <ApplicationModal
        modalId="applicationId"
        modalTitle="Application Details"
        applicationInfo={selectedApplication}
      />
    </>
  );
};

export default Applications;
