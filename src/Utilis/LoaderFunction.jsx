// import stat from "daisyui/components/stat";
import api from "../Utilis/Api";
import { queryOptions } from "@tanstack/react-query";

// export async function dashboardLoader({ params }) {
//   try {
//     const [projectsData, resources, beneficiary] = await Promise.all([
//       api.get("/disbursify/resources"),
//       api.get("/disbursify/disbursements"),
//       api.get("/disbursify/beneficiaries"),
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

// export async function activeprojects() {
//   try {
//     const projects = await api.get("/disbursify/resources");
//     return {
//       status: "success",
//       data: projects?.data?.projects || [],
//     };
//   } catch (error) {
//     return {
//       status: "error",
//       error: error.response?.data?.error || "Failed to load active projects",
//     };
//   }
// }

const fetchResources = async () => {
  const response = await api.get("/disbursify/resources");
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
