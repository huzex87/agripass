import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { activeProjectsLoaderFunction } from "../../../../utils/loaderFunction";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import DOMPurify from "dompurify";
import { formatDate } from "../../../../utils/dateFormatter";
import { Loader2 } from "lucide-react";

const Projects = () => {
  const { data, isPending, isError, error } = useQuery(
    activeProjectsLoaderFunction()
  );
  const navigate = useNavigate();
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
          Error: {error.message || "Failed to load available projects"}
        </p>
      </div>
    );
  }
  return (
    <>
      <div className="mt-5 text-lg xl:text-4xl font-bold text-center">
        AVAILABLE PROJECTS
      </div>
      <div className="mt-5 mb-5 px-4">
        {data.activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.activeProjects.map((project) => (
              <Card
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="max-w-sm mx-auto shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <img
                    src={project.imageURL}
                    alt={project.name}
                    className="h-48 object-cover w-full rounded-t-lg"
                  />
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: project.description
                        ? DOMPurify.sanitize(project.description)
                        : "No description available.",
                    }}
                  ></div>
                </CardContent>
                <CardFooter>
                  <div>
                    <span className="font-medium">Created On:</span>{" "}
                    {formatDate(project.createdAt)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No projects available.</p>
        )}
      </div>
    </>
  );
};

export default Projects;
