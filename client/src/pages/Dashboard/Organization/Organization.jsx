import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigation, useParams } from "react-router-dom";
import { Users, Loader2, CircleCheck, SquarePen } from "lucide-react";
import cn from "../../../utils/cn";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadge } from "../../../utils/Status";
import { dashboardLoaderFunction } from "../../../utils/loaderFunction";

const Organization = () => {
  const { data, status, error, isPending, isError } = useQuery(
    dashboardLoaderFunction()
  );
  const { subdomain } = useParams();
  const orgName = subdomain || "Administrator";

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        <span className="ml-2 text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  const greeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning!";
    } else if (currentHour < 18) {
      return "Good Afternoon!";
    } else {
      return "Good Evening!";
    }
  };

  // Safe destructuring
  const responseData = data?.responseData || {};

  const activeProjects = responseData.activeProjects || [];
  const completedProjects = responseData.completedProjects || [];
  const draftProjects = responseData.draftProjects || [];

  const totalActive = responseData.totalActive || 0;
  const totalCompleted = responseData.totalCompleted || 0;
  const totalDraft = responseData.totalDraft || 0;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {greeting()}
          </h1>
          <h4 className="text-black dark:text-white">Welcome back {orgName}</h4>
        </div>

        {/* Display your data */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <div className="rounded-lg bg-lime-100 p-6 shadow-md dark:bg-gray-900">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-lime-200 p-2 text-green-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <Users />
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Active Projects
              </h2>
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">
              {totalActive}
            </p>
          </div>
          {/* Total completed projects */}
          <div className="rounded-lg bg-emerald-50 p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-emerald-300/20 p-2 text-emerald-400 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <CircleCheck />
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Completed Projects
              </h2>
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">
              {totalCompleted}
            </p>
          </div>
          {/* Total draft approved disbursement */}
          <div className="rounded-lg bg-green-100 p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-green-400/20 p-2 text-green-600 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Approved Disbursement
              </h2>
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">{0}</p>
          </div>
          {/* Total completed disbursement */}
          <div className="rounded-lg bg-amber-100 p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-amber-300 p-2 text-amber-600 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Total Disbursed
              </h2>
            </div>
            <p className="text-3xl font-bold text-black dark:text-white">{0}</p>
          </div>

        </div>

        {/* Beneficiary */}
        <div className="grid grid-cols-1 lg:grid-cols-7 rounded-lg bg-blue-50 p-6 shadow-md dark:bg-gray-900 dark:text-white">
          {/* Table */}
          <div className="col-span-1 lg:col-span-4">
            <h2 className="text-xl font-semibold mb-4 dark:text-white text-black">
              Recent Beneficiaries
            </h2>
            {/* {beneficiaries && beneficiaries.length > 0 ? (
              <Table className="table table-zebra w-full">
                <TableHeader className={"bg-gray-100 dark:bg-gray-800"}>
                  <TableRow>
                    <TableHead>First Name</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead> Gender</TableHead>
                    <TableHead> Email Address</TableHead>
                    <TableHead> Date</TableHead>
                    <TableHead> Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary._id}>
                      <TableCell>
                        {beneficiary.beneficiaryId.personalDetails.firstName ||
                          "N/A"}{" "}
                      </TableCell>
                      <TableCell>
                        {beneficiary.beneficiaryId.personalDetails.lastName ||
                          "N/A"}{" "}
                      </TableCell>
                      <TableCell>
                        {beneficiary.beneficiaryId.personalDetails.gender ||
                          "N/A"}{" "}
                      </TableCell>
                      <TableCell>
                        {beneficiary.beneficiaryId.personalDetails.email ||
                          "N/A"}{" "}
                      </TableCell>
                      <TableCell>
                        {beneficiary.createdAt
                          ? new Date(beneficiary.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(beneficiary.beneficiaryId.status) ||
                          "N/A"}{" "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-950 dark:text-gray-400">
                No recent beneficiaries sign up
              </p>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Organization;
