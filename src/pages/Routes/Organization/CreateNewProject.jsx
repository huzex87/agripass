import React, { useState, useEffect } from "react";
import { newProjectSchema } from "../../../Utilis/NewProjectSchema";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../../Utilis/Api";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import TipTapToolbar from "../../../Utilis/TipTapToolbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

const CreateNewProject = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasCustomForm, setHasCustomForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subdomain = useParams().subdomain;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    control,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(newProjectSchema),
    defaultValues: {
      description: "",
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setValue("description", html);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  useEffect(() => {
    if (editor && !editor.getHTML().includes("<p>")) {
      editor.commands.setContent(
        "<p>Provide detailed information about your project, requirements, eligibility criteria, application process, and any other relevant details...</p>"
      );
    }
  }, [editor]);

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

      if (file.size > 5 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "Image size must be less than 5MB.",
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

      // Validate that description has actual content
      const textContent = editor?.getText() || "";
      if (textContent.trim().length === 0) {
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
      formData.append("hasCustomForm", hasCustomForm);

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
        if (hasCustomForm) {
          navigate(
            `/${subdomain}/projects/${response.data.projectId}/application-form`
          );
        } else {
          navigate(-1);
        }
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
        <h1 className="text-2xl mt-10 mx-2 md:mx-10 font-bold">
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
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <div className="border border-gray-300 rounded-lg">
                        <TipTapToolbar editor={editor} />
                        <div className="border border-gray-300 border-t-0 rounded-b-lg min-h-[250px]">
                          <EditorContent
                            editor={editor}
                            className="prose max-w-none p-4 focus-within:outline-none rounded-b-lg"
                            {...field}
                          />
                        </div>
                      </div>
                    )}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Use the toolbar above to format your text, create lists, add
                    links, and organize your content like a professional job
                    posting.
                  </p>
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
                      <option value="">Select Project Type</option>
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

                  {/* CUSTOM APPLICATION FORM TOGGLE - NEW SECTION */}
                  <fieldset className="fieldset mt-6">
                    <legend className="fieldset-legend text-lg">
                      Application Requirements
                    </legend>
                    <div className="form-control">
                      <label className="label cursor-pointer justify-start">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary mr-3"
                          checked={hasCustomForm}
                          onChange={(e) => setHasCustomForm(e.target.checked)}
                        />
                        <span className="label-text text-base">
                          Add custom application form for beneficiaries
                        </span>
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Enable this to create a custom form with specific
                        questions and requirements for applicants
                      </p>
                    </div>

                    {hasCustomForm && (
                      <div className="alert alert-info mt-3">
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current shrink-0 w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          <span className="ml-2">
                            After creating this project, you'll be redirected to
                            build your custom application form.
                          </span>
                        </div>
                      </div>
                    )}
                  </fieldset>
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap">
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
