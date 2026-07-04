import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../utils/Api";

const ApplicationForm = () => {
  const { projectId, subdomain } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [formTitle, setFormTitle] = useState("Application Form");
  const [formDescription, setFormDescription] = useState(
    "Please fill out this form to apply for this project."
  );

  //FIELDS CONFIGURATION STATES
  const [fields, setFields] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [""],
  });

  // Field types configuration
  const fieldTypes = [
    { value: "text", label: "Text Input", icon: "📝" },
    { value: "textarea", label: "Textarea", icon: "📄" },
    { value: "select", label: "Select Dropdown", icon: "📋" },
    { value: "radio", label: "Radio Buttons", icon: "🔘" },
    { value: "checkbox", label: "Checkboxes", icon: "☑️" },
    { value: "number", label: "Number Input", icon: "🔢" },
    { value: "email", label: "Email Input", icon: "📧" },
    { value: "file", label: "File Upload", icon: "📎" },
  ];

  useEffect(() => {
    const loadProject = async () => {
      try {
        const response = await api.get(
          `/api/v1/project_details/${projectId}`
        );
        setProject(response.data.project);

        // Load existing form data if available
        if (response.data.project?.customForm) {
          setFormTitle(
            response.data.project.customForm.title || "Application Form"
          );
          setFormDescription(
            response.data.project.customForm.description ||
              "Please fill out this form to apply for this project."
          );
          setFields(response.data.project.customForm.fields || []);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("Failed to load project");
        navigate(-1);
      }
    };
    if (projectId) {
      loadProject();
    }
  }, [projectId, navigate]);

  const addField = () => {
    if (!newField.label.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    // Add validation for options
    if (["select", "radio", "checkbox"].includes(newField.type)) {
      const validOptions = newField.options.filter((opt) => opt.trim() !== "");
      if (validOptions.length === 0) {
        toast.error("Please add at least one option");
        return;
      }
    }

    // Check for duplicate email fields
    if (newField.type === "email" && fields.some((f) => f.type === "email")) {
      toast.error("You can only have one email field");
      return;
    }

    const field = {
      id: Date.now().toString(),
      type: newField.type,
      label: newField.label,
      placeholder: newField.placeholder,
      required: newField.required,
      options: ["select", "radio", "checkbox"].includes(newField.type)
        ? newField.options.filter((opt) => opt.trim() !== "")
        : [],
      order: fields.length,
    };
    setFields([...fields, field]);

    // Reset new field form
    setNewField({
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [""],
    });
    setShowAddField(false);
    toast.success("Field added successfully!");
  };

  // Remove field
  const removeField = (fieldId) => {
    setFields(fields.filter((field) => field.id !== fieldId));
    toast.success("Field removed");
  };

  // Move field up/down
  const moveField = (index, direction) => {
    if (direction === "up" && index > 0) {
      const newFields = [...fields];
      [newFields[index], newFields[index - 1]] = [
        newFields[index - 1],
        newFields[index],
      ];
      setFields(newFields);
    } else if (direction === "down" && index < fields.length - 1) {
      const newFields = [...fields];
      [newFields[index], newFields[index + 1]] = [
        newFields[index + 1],
        newFields[index],
      ];
      setFields(newFields);
    }
  };

  // Handle options change for select/radio/checkbox
  const handleOptionsChange = (index, value) => {
    const newOptions = [...newField.options];
    newOptions[index] = value;
    setNewField({ ...newField, options: newOptions });
  };

  // Add new option
  const addOption = () => {
    setNewField({ ...newField, options: [...newField.options, ""] });
  };

  // Remove option
  const removeOption = (index) => {
    if (newField.options.length > 1) {
      const newOptions = newField.options.filter((_, i) => i !== index);
      setNewField({ ...newField, options: newOptions });
    }
  };

  // Save form
  const saveForm = async () => {
    try {
      setLoading(true);

      if (fields.length === 0) {
        toast.error("Please add at least one field to the form");
        return;
      }

      const formData = {
        title: formTitle,
        description: formDescription,
        fields: fields,
        isActive: true,
      };

      await api.put(`/api/v1/project/${projectId}/form`, formData);
      toast.success("Application form saved successfully!");
      navigate(`/${subdomain}/projects`);
    } catch (error) {
      console.error("Error saving form:", error);
      toast.error("Failed to save form");
    } finally {
      setLoading(false);
    }
  };

  // Preview field component
  const PreviewField = ({ field }) => {
    const baseClass = "input w-full";

    switch (field.type) {
      case "text":
      case "email":
      case "number":
        return (
          <input
            type={field.type}
            className={baseClass}
            placeholder={field.placeholder}
            disabled
          />
        );
      case "textarea":
        return (
          <textarea
            className="textarea w-full"
            placeholder={field.placeholder}
            disabled
          />
        );
      case "select":
        return (
          <select className="select w-full" disabled>
            <option value="">Choose an option</option>
            {field.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "radio":
        return (
          <div className="space-y-2">
            {field.options.map((option, i) => (
              <label key={i} className="label cursor-pointer justify-start">
                <input
                  type="radio"
                  className="radio radio-primary mr-2"
                  disabled
                />
                <span className="label-text">{option}</span>
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2">
            {field.options.map((option, i) => (
              <label key={i} className="label cursor-pointer justify-start">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary mr-2"
                  disabled
                />
                <span className="label-text">{option}</span>
              </label>
            ))}
          </div>
        );
      case "file":
        return (
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            disabled
          />
        );
      default:
        return null;
    }
  };

  if (!project) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Build Application Form</h1>
            <p className="text-gray-600">Project: {project.name}</p>
          </div>

          {/* Form Settings */}
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">Form Settings</h2>

              <div className="form-control mb-3 ">
                <label className="label mb-2">
                  <span className="label-text font-bold">Form Title</span>
                </label>
                <br />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter form title"
                />
              </div>

              <div className="form-control">
                <label className="label mb-2">
                  <span className="label-text font-bold">Form Description</span>
                </label>{" "}
                <br />
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Enter form description"
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Form Fields ({fields.length})</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddField(true)}
                >
                  + Add Field
                </button>
              </div>

              {/* Existing Fields */}
              {fields.length > 0 ? (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 bg-base-200"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="badge badge-outline">
                              {
                                fieldTypes.find((t) => t.value === field.type)
                                  ?.icon
                              }{" "}
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="badge badge-error">
                                Required
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold">{field.label}</h3>
                          {field.placeholder && (
                            <p className="text-sm text-gray-600">
                              {field.placeholder}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => moveField(index, "up")}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => moveField(index, "down")}
                            disabled={index === fields.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => removeField(field.id)}
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <PreviewField field={field} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No fields added yet. Click "Add Field" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Add Field Modal */}
          {showAddField && (
            <div className="modal modal-open">
              <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Add New Field</h3>

                {/* Field Type */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Field Type</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value })
                    }
                  >
                    {fieldTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Field Label */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Field Label *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                    placeholder="Enter field label"
                  />
                </div>

                {/* Field Placeholder */}
                {!["radio", "checkbox", "file"].includes(newField.type) && (
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Placeholder</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={newField.placeholder}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          placeholder: e.target.value,
                        })
                      }
                      placeholder="Enter placeholder text"
                    />
                  </div>
                )}

                {/* Options for select, radio, checkbox */}
                {["select", "radio", "checkbox"].includes(newField.type) && (
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Options</span>
                    </label>
                    {newField.options.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          className="input input-bordered flex-1"
                          value={option}
                          onChange={(e) =>
                            handleOptionsChange(index, e.target.value)
                          }
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => removeOption(index)}
                          disabled={newField.options.length === 1}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={addOption}
                    >
                      + Add Option
                    </button>
                  </div>
                )}

                {/* Required Toggle */}
                <div className="form-control mb-4">
                  <label className="label cursor-pointer justify-start">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary mr-2"
                      checked={newField.required}
                      onChange={(e) =>
                        setNewField({ ...newField, required: e.target.checked })
                      }
                    />
                    <span className="label-text">Required field</span>
                  </label>
                </div>

                {/* Modal Actions */}
                <div className="modal-action">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowAddField(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={addField}>
                    Add Field
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save/Cancel Actions */}
          <div className="flex justify-between items-center">
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={saveForm}
              disabled={loading || fields.length === 0}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                "Save Application Form"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationForm;
