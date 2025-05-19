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
