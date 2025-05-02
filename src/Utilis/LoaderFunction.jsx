import api from "../Utilis/Api";

export async function dashboardLoader({ params }) {
  try {
    const response = await api.get("/disbursify/resources");
    return {
      status: "success",
      data: response?.data?.responseData || {},
      subdomain: params.subdomain,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = "/login";
      return null;
    }
    return {
      status: "error",
      error: error.response?.data?.error || "Failed to load organization data",
      data: {},
    };
  }
}
