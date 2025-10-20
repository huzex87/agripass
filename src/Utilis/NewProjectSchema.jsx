import * as yup from "yup";

export const newProjectSchema = yup.object().shape({
  name: yup.string().required("Project Name is required"),
  description: yup
    .string()
    .required("Project Description is required")
    .test(
      "has-content",
      "Description must contain actual content",
      function (value) {
        if (!value) return false;
        // Remove HTML tags and check if there's actual text content
        const textContent = value.replace(/<[^>]*>/g, "").trim();
        return textContent.length > 0;
      }
    ),
  type: yup
    .string()
    .oneOf(["loan", "grant", "subsidy", "palliative"], "Invalid Project Type")
    .required("Project Type is required"),
  budget: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .typeError("Budget must be a number")
    .positive("Budget must be a positive number")
    .nullable()
    .optional(),
  startDate: yup.required("Project Start Date is required"),
  endDate: yup.required("Project End Date is required"),
  // projectManager removed for now
});
