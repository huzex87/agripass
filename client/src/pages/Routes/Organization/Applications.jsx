import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "../../../utils/Api";
import { formatDate } from "../../../utils/dateFormatter";
import ApplicationModal from "../../Elements/ApplicationModal";
import { useQuery } from "@tanstack/react-query";

const Applications = () => {
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading: loading } = useQuery({
    queryKey: ["applications", status, currentPage, searchTerm],
    queryFn: async () => {
      const config = {
        params: {
          page: currentPage,
          status,
          limit: 10,
          ...(searchTerm && { searchTerm }),
        },
      };
      const response = await api.get(`/api/v1/applications`, config);
      return response.data;
    }
  });

  const applications = data?.applications || [];
  const totalPages = data?.totalPage || 1;
  const total = data?.total || 0;

  const openModal = (application) => {
    setSelectedApplication(application);
    document.getElementById("applicationId").showModal();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages, 5);
      }
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    return pageNumbers;
  };
  return (
    <>
      <div className="text-2xl font-bold mt-5">Beneficiary Applications</div>
      <div className="mb-4 mt-10 flex items-center gap-2 justify-between ">
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
          <option value="">All Status</option>
        </select>

        <label className="input mx-auto">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </label>
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
                  <th>Email Address</th>
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
                    <td>{items.beneficiaryId.personalDetails.email} </td>
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
          <p className="text-gray-500 dark:text-white">No application found</p>
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="join">
            <button
              className={`join-item btn ${
                currentPage === 1 ? "btn-disabled" : ""
              }`}
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              «
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                className={`join-item btn ${
                  currentPage === pageNum ? "btn-active" : ""
                }`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button
              className={`join-item btn ${
                currentPage === totalPages ? "btn-disabled" : ""
              }`}
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              »
            </button>
          </div>
        </div>
      )}
      {/* Pagination Info */}
      {!loading && totalPages > 1 && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({total} total items)
          </p>
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
