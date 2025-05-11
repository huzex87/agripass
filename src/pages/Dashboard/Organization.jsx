import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Loader2,
  CircleCheck,
  SquarePen,
} from "lucide-react";
import cn from "../../Utilis/cn";

const Organization = () => {
  const { data, status, error, subdomain } = useLoaderData();

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const isError = status === "error";

  const orgName = subdomain || "Administrator";

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2
          className="animate-spin text-blue-500 dark:text-white"
          size={24}
        />
        <span className="ml-2 text-blue-500 dark:text-white">
          Loading dashboard...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="error-message dark:text-white">
          Error: {error.message || "Error loading dashboard"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold dark:text-white">{greeting()}</h1>
          <h4 className="dark:text-white">Welcome back {orgName}</h4>
        </div>

        {/* Display your data */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <Users />
              </div>
              <h2 className="text-lg font-semibold">Active Projects</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalActive || 0}</p>
            </div>
          </div>

          {/* Total completed projects */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <CircleCheck />
              </div>
              <h2 className="text-lg font-semibold">Completed Projects</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalCompleted || 0}</p>
            </div>
          </div>

          {/* Total draft projects */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold">Drafts</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalDraft || 0}</p>
            </div>
          </div>

          {/* Total draft projects */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold">Drafts</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalDraft || 0}</p>
            </div>
          </div>

          {/* Total draft projects */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold">Drafts</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalDraft || 0}</p>
            </div>
          </div>

          {/* Total draft projects */}
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
            <div className="flex gap-x-4 items-center mb-4">
              <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                <SquarePen />
              </div>
              <h2 className="text-lg font-semibold">Drafts</h2>
            </div>
            <div className="flex flex-col bg-white transition-colors dark:bg-blue-950 dark:text-white">
              <p className="text-3xl font-bold">{data.totalDraft || 0}</p>
            </div>
          </div>

          {/* Beneficiary */}
        </div>
      </div>
    </>
  );
};

export default Organization;
