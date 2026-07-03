import React, { useState } from "react";
import api from "../../../../utils/Api";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Loader2, Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchActiveProjectInfo } from "../../../../utils/loaderFunction";
import { formatDate } from "../../../../utils/dateFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import Header from "../Components/Header";
import { addOfflineRegistration } from "../../../../utils/offlineQueue";
import FarmBoundaryPicker from "../../../../components/ui/FarmBoundaryPicker";
import BiometricCapture from "../../../../components/ui/BiometricCapture";

const ProjectInfo = () => {
  const { projectId } = useParams();
  const [formData, setFormData] = useState({});
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["activeProjectInfo", projectId],
    queryFn: () => fetchActiveProjectInfo(projectId),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
        <span className="ml-2 text-lg text-gray-700">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">
          Error: {error.message || "Failed to load project details"}
        </p>
      </div>
    );
  }

  const project = data?.project;

  const handleInputChange = (fieldId, value) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const applicationData = { email, ...formData };

    if (!navigator.onLine) {
      try {
        await addOfflineRegistration(projectId, applicationData);
        setSubmitSuccess(true);
        setEmail("");
        setFormData({});
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } catch (err) {
        setSubmitError("Failed to queue registration locally.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const response = await api.post(
        `/api/v1/submit/${projectId}`,
        applicationData
      );
      if (response.data.success) {
        setSubmitSuccess(true);
        setEmail("");
        setFormData({});

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        setSubmitError(
          error.response.data.message || "Failed to submit application"
        );
      } else {
        setSubmitError("Network error. Please try again later.");
      }
      setTimeout(() => {
        setSubmitError("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              placeholder={field.placeholder}
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              required={field.required}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                required={field.required}
                checked={formData[field.id] || false}
                onChange={(e) => handleInputChange(field.id, e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600"
              />
              <span className="text-sm">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </span>
            </label>
          </div>
        );

      case "radio":
        return (
          <div key={field.id} className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  required={field.required}
                  checked={formData[field.id] === option}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );

      case "boundary":
      case "plots":
      case "farmPlot":
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <FarmBoundaryPicker
              value={formData[field.id]}
              onChange={(val) => handleInputChange(field.id, val)}
            />
          </div>
        );

      case "biometrics":
        return (
          <div key={field.id} className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <BiometricCapture
              onChange={(val) => handleInputChange(field.id, val)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative mb-8">
          <img
            src={project.imageURL}
            alt={project.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
            <h1 className="text-4xl font-bold text-white">{project.name}</h1>
            <p className="text-white/90 mt-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(project.description),
                  }}
                />
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium capitalize">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{project.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="font-medium">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form Sidebar */}
          <div className="lg:col-span-1">
            {project.hasCustomForm && project.customForm.isActive ? (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>{project.customForm.title}</CardTitle>
                  {project.customForm.description && (
                    <p className="text-sm text-gray-600">
                      {project.customForm.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {submitSuccess && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium">
                          Application Submitted!
                        </p>
                        <p className="text-green-700 text-sm">
                          We'll review your application soon.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {submitError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
                      <p className="text-red-800 text-sm">{submitError}</p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Dynamic Custom Fields */}
                    {project.customForm.fields
                      .sort((a, b) => a.order - b.order)
                      .map((field) => renderFormField(field))}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      Submit Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-center text-gray-600">
                    Application form is not available at this time.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectInfo;
