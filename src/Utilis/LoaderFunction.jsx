import api from "../Utilis/Api";

export async function dashboardLoader({ params }) {
  try {
    const [projectsData, resources, beneficiary] = await Promise.all([
      api.get("/disbursify/resources"),
      api.get("/disbursify/disbursements"),
      api.get("/disbursify/beneficiaries"),
    ]);

    console.log(projectsData);
    console.log(resources);
    console.log(beneficiary);

    return {
      status: "success",
      subdomain: params.subdomain,
      projects: projectsData.data?.responseData || {},
      disbursements: resources.data?.responseData || {},
      beneficiaries: beneficiary.data || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = "/login";
      return null;
    }
    return {
      status: "error",
      error: error.response?.data?.error || "Failed to load organization data",
      projects: {},
      disbursements: {},
    };
  }
}
