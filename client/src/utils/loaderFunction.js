// import stat from "daisyui/components/stat";
import api from "../utils/Api";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// export async function dashboardLoader({ params }) {
//   try {
//     const [projectsData, resources, beneficiary] = await Promise.all([
//       api.get("/api/v1/resources"),
//       api.get("/api/v1/disbursements"),
//       api.get("/api/v1/beneficiaries"),
//     ]);

//     return {
//       status: "success",
//       subdomain: params.subdomain,
//       projects: projectsData.data?.responseData || {},
//       disbursements: resources.data?.responseData || {},
//       beneficiaries: beneficiary.data || [],
//     };
//   } catch (error) {
//     if (error.response?.status === 401) {
//       window.location.href = "/login";
//       return null;
//     }
//     return {
//       status: "error",
//       error: error.response?.data?.error || "Failed to load organization data",
//       projects: {},
//       disbursements: {},
//     };
//   }
// }

const fetchResources = async () => {
  const response = await api.get("/api/v1/resources");
  return response.data;
};

const fetchActiveProjects = async () => {
  const response = await api.get("/api/v1/beneficiary/projects");
  return response.data;
};

export const fetchActiveProjectInfo = async (projectId) => {
  const response = await api.get(
    `/api/v1/beneficiary/project/${projectId}`
  );
  return response.data;
};

export function dashboardLoaderFunction() {
  return queryOptions({
    queryKey: ["dashboard"],
    queryFn: fetchResources,
    refetchOnWindowFocus: false,
    retry: false,
  });
}

// Beneficiary Active Projects Loader Function
export function activeProjectsLoaderFunction() {
  return queryOptions({
    queryKey: ["activeProjects"],
    queryFn: fetchActiveProjects,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
