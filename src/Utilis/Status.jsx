export const getStatusBadge = (status) => {
  const colors = {
    active: "badge badge-success",
    inactive: "badge badge-neutral",
    suspended: "badge badge-warning",
    failed: "badge badge-error",
    completed: "badge badge-accent",
    pending: "badge badge-warning",
    approved: "badge badge-success",
    rejected: "badge badge-error",
    draft: "badge badge-info",
  };
  return <span className={colors[status]}>{status} </span>;
};

export const getStatus = (status) => {
  const statusMap = {
    active: "status status-success",
    inactive: "status status-neutral",
    suspended: "status status-warning",
    failed: "status status-error",
    completed: "status status-accent",
    pending: "status status-warning",
    approved: "status status-success",
    rejected: "status status-error",
  };
  return <span className={`${statusMap[status]} status-lg`}></span>;
};

// AUTHENTICATION TOKEN - IN MEMORY
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => {
  return accessToken;
};
export const clearAccessToken = () => {
  accessToken = null;
};
