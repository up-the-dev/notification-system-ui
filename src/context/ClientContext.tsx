import React, { createContext, useContext, useState, ReactNode } from "react";

interface Project {
  project_id: string;
  name: string;
  api_key: string;
  created_at: string;
  purposes?: Purpose[];
}

interface Purpose {
  ID: string;
  Name: string;
  Description: string;
  CreatedAt: string;
  IsActive: boolean;
}

interface Client {
  client_id: string;
  name: string;
  description: string;
  projects: Project[];
}

interface ClientContextType {
  client: Client | null;
  setClient: (client: Client) => void;
  addProject: (project: Project) => void;
  addPurpose: (projectId: string, purpose: Purpose) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<Client | null>(null);

  const addProject = (project: Project) => {
    if (client) {
      setClient({
        ...client,
        projects: [...client.projects, project],
      });
    }
  };

  const addPurpose = (projectId: string, purpose: Purpose) => {
    if (client) {
      setClient({
        ...client,
        projects: client.projects.map((project) =>
          project.project_id === projectId
            ? { ...project, purposes: [...(project.purposes || []), purpose] }
            : project
        ),
      });
    }
  };

  return (
    <ClientContext.Provider
      value={{ client, setClient, addProject, addPurpose }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};
