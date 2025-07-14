import React, { useState } from "react";
import { newProjectSchema } from "../../../Utilis/NewProjectSchema";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../../Utilis/Api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateNewProject = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({ resolver: yupResolver(newProjectSchema) });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("image", {
          type: "manual",
          message: "Please select a valid image file.",
        });
        setSelectedImage(null);
        setImagePreview(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "Image size must be less than 10MB.",
        });
        setSelectedImage(null);
        setImagePreview(null);
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
      setImagePreview(null);
      clearErrors("image");
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      clearErrors("image");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("type", data.type);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);

      if (data.budget) {
        formData.append("amount", data.budget);
      }
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await api.post("/disbursify/create_project", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        toast.success("Project created successfully!");
        // navigate(`/disbursify/project_details/${response.data.projectId}`);
      }
    } catch (error) {
      console.error("Error during project creation:", error);
      let errorMessage = "An error occurred. Please try again later.";
      if (error && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error("Project creation failed", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-2xl mt-10 mx-2 md:mx-10">
          Create A New Project Disbursement
        </h1>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full mt-5 mx-2 md:mx-10">
            <form action="" onSubmit={handleSubmit(onSubmit)} className="">
              <div className="">
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
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </fieldset>

                {/* PROJECT DESCRIPTION */}
                <fieldset className="fieldset mt-4">
                  <legend className="fieldset-legend text-lg">
                    Project Description
                    <span className="text-red-600 text-lg">*</span>
                  </legend>
                  <textarea
                    className="textarea h-24 w-full"
                    placeholder="Your project description here"
                    {...register("description")}
                  ></textarea>
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
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
                      <p className="text-sm text-gray-600">Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="mt-2 rounded-lg object-cover"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  {errors.image && (
                    <p className="text-sm text-red-500">
                      {errors.image.message}
                    </p>
                  )}
                </fieldset>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PROJECT TYPE */}
                  <fieldset className="fieldset mt-4">
                    <legend className="fieldset-legend text-lg">
                      Project Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </legend>
                    <select
                      // defaultValue="loan"
                      className="select w-full"
                      {...register("type")}
                    >
                      <option value="loan">Loan</option>
                      <option value="grant">Grant</option>
                      <option value="subsidy">Subsidy</option>
                      <option value="palliative">Palliative</option>
                    </select>
                    {errors.type && (
                      <p className="text-sm text-red-500">
                        {errors.type.message}
                      </p>
                    )}
                  </fieldset>

                  {/* PROJECT BUDGET */}
                  <fieldset className="fieldset mt-4">
                    <legend className="fieldset-legend text-lg">
                      {" "}
                      Enter Amount Budget for this project{" "}
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
                    <input
                      type="date"
                      className="input w-full"
                      {...register("startDate")}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">
                        {errors.startDate.message}
                      </p>
                    )}
                  </fieldset>

                  {/* PROJECT END DATE */}
                  <fieldset className="fieldset mt-4">
                    <legend className="fieldset-legend text-lg">
                      End Date
                      <span className="text-red-600 text-lg">*</span>
                    </legend>
                    <input
                      type="date"
                      className="input w-full"
                      {...register("endDate")}
                    />
                  </fieldset>
                  {errors.endDate && (
                    <p className="text-sm text-red-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-2xs bg-blue-700 text-white hover:bg-blue-800 cursor-pointer mt-5"
                >
                  {" "}
                  {loading ? (
                    <>
                      <span className="loading loading-infinity loading-lg"></span>
                      Creating Project...
                    </>
                  ) : (
                    "Create Project"
                  )}{" "}
                </button>
                <button
                  className="btn w-2xs bg-gray-600 text-white hover:bg-gray-800 cursor-pointer mt-5"
                  onClick={() => navigate(-1)}
                >
                  Go Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewProject;
