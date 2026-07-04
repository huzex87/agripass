import React, { useState, useEffect, Suspense, lazy } from "react";
import { newProjectSchema } from "../../../utils/schemas/projectSchema";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../../utils/Api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const RichTextEditor = lazy(() =>
  import("../Organization/components/RichTextEditor")
);

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const EditProject = () => {
  const { projectId, subdomain } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(newProjectSchema),
    defaultValues: {
      description: "",
    },
  });

  useEffect(() => {
    const loadProject = async () => {
      setLoadingProject(true);
      setLoadError(false);
      try {
        const response = await api.get(`/api/v1/project_details/${projectId}`);
        const project = response.data.project;
        reset({
          name: project.name || "",
          description: project.description || "",
          type: project.type || "",
          budget: project.budget?.amount ?? "",
          startDate: toDateInputValue(project.startDate),
          endDate: toDateInputValue(project.endDate),
        });
        if (project.imageURL) {
          setImagePreview(project.imageURL);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project");
        setLoadError(true);
      } finally {
        setLoadingProject(false);
      }
    };
    if (projectId) {
      loadProject();
    }
  }, [projectId, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("image", {
          type: "manual",
          message: "Please select a valid image file.",
        });
        setSelectedImage(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "Image size must be less than 5MB.",
        });
        setSelectedImage(null);
        return;
      }
      setSelectedImage(file);
      clearErrors("image");
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      clearErrors("image");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      clearErrors("image");

      if (!data.description || data.description.trim().length === 0) {
        setError("description", {
          type: "manual",
          message: "Please provide a meaningful project description.",
        });
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);

      if (data.budget !== null && data.budget !== undefined && data.budget !== "") {
        formData.append("amount", data.budget);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await api.put(`/api/v1/project/${projectId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Project updated successfully!");
      navigate(`/${subdomain}/project/${projectId}`);
    } catch (error) {
      console.error("Error updating project:", error);
      const errorMessage =
        error.response?.data?.error || "An error occurred. Please try again later.";
      toast.error("Project update failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-4 dark:text-gray-200">
        <p>Failed to load project.</p>
        <button
          onClick={() => navigate(-1)}
          className="btn px-4 py-2 bg-gray-600 text-white hover:bg-gray-800 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl mt-10 mx-2 md:mx-10 font-bold">Edit Project</h1>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full mt-5 mx-2 md:mx-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              {/* PROJECT NAME */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-lg">
                  Project Name <span className="text-red-600 text-lg">*</span>
                </legend>
                <input
                  type="text"
                  className="input input-lg w-full"
                  placeholder="Type here"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </fieldset>

              {/* PROJECT DESCRIPTION */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-lg">
                  Project Description
                  <span className="text-red-600 text-lg">*</span>
                </legend>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center min-h-[300px] border border-gray-300 rounded-lg">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                      }
                    >
                      <RichTextEditor
                        value={field.value}
                        onChange={(html) => {
                          field.onChange(html);
                          setValue("description", html);
                        }}
                        error={errors.description?.message}
                      />
                    </Suspense>
                  )}
                />
              </fieldset>

              {/* PROJECT IMAGE */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-lg">
                  Project Image (Optional)
                </legend>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      {selectedImage ? "New Image Preview:" : "Current Image:"}
                    </p>
                    <img
                      src={imagePreview}
                      alt="Project"
                      className="mt-2 rounded-lg object-cover"
                      style={{ maxWidth: "200px", maxHeight: "200px" }}
                    />
                  </div>
                )}
                {errors.image && (
                  <p className="text-sm text-red-500">{errors.image.message}</p>
                )}
              </fieldset>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PROJECT TYPE */}
                <fieldset className="fieldset mt-4">
                  <legend className="fieldset-legend text-lg">
                    Project Type <span className="text-red-600 text-lg">*</span>
                  </legend>
                  <select className="select w-full" {...register("type")}>
                    <option value="">Select Project Type</option>
                    <option value="loan">Loan</option>
                    <option value="grant">Grant</option>
                    <option value="subsidy">Subsidy</option>
                    <option value="palliative">Palliative</option>
                  </select>
                  {errors.type && (
                    <p className="text-sm text-red-500">{errors.type.message}</p>
                  )}
                </fieldset>

                {/* PROJECT BUDGET */}
                <fieldset className="fieldset mt-4">
                  <legend className="fieldset-legend text-lg">
                    Enter Amount Budget for this project
                  </legend>
                  <input
                    type="number"
                    className="input w-full"
                    placeholder="Enter Amount Here"
                    {...register("budget")}
                  />
                  <p className="label">Optional</p>
                </fieldset>

                {/* PROJECT START DATE */}
                <fieldset className="fieldset mt-4">
                  <legend className="fieldset-legend text-lg">
                    Start Date
                    <span className="text-red-600 text-lg">*</span>
                  </legend>
                  <input type="date" className="input w-full" {...register("startDate")} />
                  {errors.startDate && (
                    <p className="text-sm text-red-500">{errors.startDate.message}</p>
                  )}
                </fieldset>

                {/* PROJECT END DATE */}
                <fieldset className="fieldset mt-4">
                  <legend className="fieldset-legend text-lg">
                    End Date
                    <span className="text-red-600 text-lg">*</span>
                  </legend>
                  <input type="date" className="input w-full" {...register("endDate")} />
                </fieldset>
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between flex-wrap">
              <button
                type="submit"
                disabled={loading}
                className="btn w-2xs bg-blue-700 text-white hover:bg-blue-800 cursor-pointer mt-5"
              >
                {loading ? (
                  <>
                    <span className="loading loading-infinity loading-lg"></span>
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                className="btn w-2xs bg-gray-600 text-white hover:bg-gray-800 cursor-pointer mt-5"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
