export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return "Invalid Date";
  }
};
