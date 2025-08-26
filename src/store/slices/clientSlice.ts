/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Purpose {
  ID: string;
  Name: string;
  Description: string;
  CreatedAt: string;
  IsActive: boolean;
}

export interface Project {
  ID: string; // backend id
  ClientID: string;
  APIKey: string | null; // always normalized to string
  SenderId: string;
  MetaData: any;
  Name: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  purposes: Purpose[]; // <-- lowercase for UI components
}

export interface ClientData {
  ID: string;
  Name: string;
  Description: string;
  Projects: Project[];
  APIKeys: any;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ClientState {
  clientData: ClientData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clientData: null,
  loading: false,
  error: null,
};

// helper to normalize any incoming project to ensure .purposes exists (lowercase)
// and APIKey is extracted as string
const withPurposes = (p: any): Project => ({
  ID: p.ID,
  ClientID: p.ClientID,
  APIKey:
    typeof p.APIKey === "object" ? p.APIKey?.Key ?? null : p.APIKey ?? null,
  SenderId: p.SenderId,
  MetaData: p.MetaData ?? null,
  Name: p.Name,
  IsActive: p.IsActive ?? true,
  CreatedAt: p.CreatedAt,
  UpdatedAt: p.UpdatedAt ?? p.CreatedAt,
  purposes: (p.purposes ?? p.Purposes ?? []) as Purpose[],
});

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClientData: (
      state,
      action: PayloadAction<
        ClientData | (Omit<ClientData, "Projects"> & { Projects: any[] })
      >
    ) => {
      const payload = action.payload as any;
      state.clientData = {
        ...payload,
        Projects: (payload.Projects || []).map(withPurposes),
      };
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearClientData: (state) => {
      state.clientData = null;
      state.loading = false;
      state.error = null;
    },
    addProject: (state, action: PayloadAction<Project | any>) => {
      if (!state.clientData) return;
      const normalized = withPurposes(action.payload);
      state.clientData.Projects.push(normalized);
    },
    addPurpose: (
      state,
      action: PayloadAction<{ projectId: string; purpose: Purpose }>
    ) => {
      if (!state.clientData) return;
      const proj = state.clientData.Projects.find(
        (p) => p.ID === action.payload.projectId
      );
      if (proj) {
        proj.purposes = proj.purposes ?? [];
        proj.purposes.push(action.payload.purpose);
      }
    },
  },
});

export const {
  setClientData,
  setLoading,
  setError,
  clearClientData,
  addProject,
  addPurpose,
} = clientSlice.actions;

export default clientSlice.reducer;
