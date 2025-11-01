import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../Utilis/Api";
import { toast } from "sonner";
import { getStatusBadge } from "../../../Utilis/Status";
import { MoveLeft, CircleEllipsis, Ellipsis } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import DOMPurify from "dompurify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NewModal from "../../Elements/NewModal";

const ProjectDetails = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectStatus, setProjectStatus] = useState("");
  const [error, setError] = useState(null);

  const { projectId, subdomain } = useParams();
  const navigate = useNavigate();

  // Create a read-only editor for displaying the description
  const descriptionEditor = useEditor({
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
        openOnClick: true, // Allow links to be clicked in read-only mode
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
    ],
    content: project?.description || "",
    editable: false, // Make it read-only
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none p-4",
      },
    },
  });

  // Update editor content when project data loads
  useEffect(() => {
    if (descriptionEditor && project?.description) {
      descriptionEditor.commands.setContent(project.description);
    }
  }, [descriptionEditor, project?.description]);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/disbursify/project_details/${projectId}`
        );
        setProject(response.data.project);
        setProjectStatus(response.data.project.status);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch project details", {
          description: error.response?.data?.error || "Server not responding",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId, navigate, projectStatus]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleDeleteProject = async () => {
    try {
      const response = await api.delete(
        `/disbursify/delete_project/${projectId}`
      );
      if (response.status === 200) {
        toast.success("Project deleted successfully");
        navigate(-1); // Navigate back to the previous page
      }
    } catch (error) {
      toast.error("Failed to delete project", {
        description: error.response?.data?.error || "Server not responding",
      });
    }
  };

  const suspendProject = async () => {
    try {
      const response = await api.put(
        `/disbursify/suspend_project/${projectId}`
      );
      if (response.status === 200) {
        toast.success("Project suspended successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error("Failed to suspend project", {
        description: error.response?.data?.error || "Server not responding",
      });
    }
  };

  const completeProject = async () => {
    try {
      const response = await api.put(
        `/disbursify/complete_project/${projectId}`
      );
      if (response.status === 200) {
        toast.success("Project marked as completed successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error("Failed to mark as completed", {
        description: error.response?.data?.error || "Server not responding",
      });
    }
  };
  const activateProject = async () => {
    try {
      const response = await api.put(
        `/disbursify/activate_project/${projectId}`
      );
      if (response.status === 200) {
        toast.success("Project activated successfully");
      }
      navigate(-1);
    } catch (error) {
      toast.error("Failed to activate project", {
        description: error.response?.data?.error || "Server not responding",
      });
    }
  };

  const handleOpenModal = () => {
    document.getElementById("deleteProjectModal").showModal();
  };
  const handleOpenSuspendModal = () => {
    document.getElementById("suspendProjectModal").showModal();
  };
  const handleOpenDeactivateModal = () => {
    document.getElementById("completeProject").showModal();
  };
  const handleOpenActivateModal = () => {
    document.getElementById("activateProjectModal").showModal();
  };
  const handleEditProject = () => {
    navigate(`/${subdomain}/projects/${projectId}/edit`);
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex gap-4 mb-4 px-4 py-2 cursor-pointer hover:text-blue-800 dark:hover:text-white"
          >
            <MoveLeft /> Back to Projects
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Tooltip>
                <TooltipTrigger className="cursor-pointer">
                  <CircleEllipsis className="w-8 h-10 text-gray-500 dark:text-gray-200" />
                </TooltipTrigger>
                <TooltipContent className="text-white">
                  Manage Project
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"bg-white dark:bg-gray-800"}>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className={" focus:bg-gray-100 dark:focus:bg-gray-700"}
                onClick={handleEditProject}
              >
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                className={" focus:bg-gray-100 dark:focus:bg-gray-700"}
                onClick={handleOpenModal}
              >
                Delete Project
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  className={" focus:bg-gray-100 dark:focus:bg-gray-700"}
                >
                  Manage Status
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    className={"bg-white dark:bg-gray-800"}
                  >
                    <DropdownMenuItem
                      className={" focus:bg-gray-200 dark:focus:bg-gray-700"}
                      onClick={handleOpenActivateModal}
                    >
                      Activate Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={" focus:bg-gray-200 dark:focus:bg-gray-700"}
                      onClick={handleOpenDeactivateModal}
                    >
                      Mark As Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={" focus:bg-gray-200 dark:focus:bg-gray-700"}
                      onClick={handleOpenSuspendModal}
                    >
                      Suspend Project
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Project DIsplay */}
        <div className="bg-none shadow-md rounded-lg p-6 dark:text-gray-200">
          <img
            src={project.imageURL || "https://via.placeholder.com/600x400"}
            alt="image"
            className="mb-4 rounded-lg shadow-md w-full h-95 object-cover"
          />
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div>
              <span>Project Status:</span> {getStatusBadge(projectStatus)}
            </div>
          </div>
          <div
            className="mb-4 prose prose-sm max-w-none dark:prose-invert prose-ul:list-disc prose-ol:list-decimal prose-li:ml-0"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(project.description),
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-semibold">Start Date:</span>{" "}
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <span className="font-semibold">End Date:</span>{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <NewModal
        title="Delete Project"
        description="Are you sure you want to proceed with deleting this project? This action cannot be undone."
        modalId="deleteProjectModal"
        onConfirm={handleDeleteProject}
        isDangerous={true}
        confirmButtonText="Delete Project"
      />
      <NewModal
        title="Suspend Project"
        description="Are you sure you want to suspend this project? This action can be reversed."
        modalId="suspendProjectModal"
        onConfirm={suspendProject}
        isDangerous={false}
        confirmButtonText="Suspend Project"
      />
      <NewModal
        title="Complete Project"
        description="Project will be marked as completed and will not be active anymore. Are you sure you want to proceed?"
        modalId="completeProject"
        onConfirm={completeProject}
        isDangerous={false}
        confirmButtonText="Complete Project"
      />
      <NewModal
        title="Activate Project"
        description="Are you sure you want to activate this project? This action can be reversed."
        modalId="activateProjectModal"
        onConfirm={activateProject}
        isDangerous={false}
        confirmButtonText="Activate Project"
      />
    </>
  );
};

export default ProjectDetails;
