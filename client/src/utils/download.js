import api from "./Api";
import { toast } from "sonner";

// Downloads a CSV (or any blob) from an authenticated API endpoint and saves it
// to disk. Uses the shared axios instance so the Bearer token / refresh flow is
// applied — a plain <a href> couldn't send the Authorization header.
export const downloadCsv = async (url, filename) => {
  try {
    const res = await api.get(url, { responseType: "blob" });
    const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (err) {
    toast.error("Export failed", {
      description: err.response?.data?.error || "Could not generate the file. Please try again.",
    });
    return false;
  }
};
