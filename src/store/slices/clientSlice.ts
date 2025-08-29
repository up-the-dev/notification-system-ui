/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Purpose {
  ID: string;
  Name: string;
  Description: string;
  CreatedAt: string;
  IsActive: boolean;
}

export interface Plan {
  ID: string;
  Name: string;
  Description: string;
  Channel: string;
  Quota: number;
  Price: number;
  Duration: number;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Membership {
  ID: string;
  ClientID: string;
  PlanID: string;
  QuotaUsed: number;
  QuotaTotal: number;
  ValidTill: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
  Plan: Plan;
  Client: any;
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
  memberships: Membership[];
  membershipLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clientData: null,
  memberships: [],
  membershipLoading: false,
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
    setMemberships: (state, action: PayloadAction<Membership[]>) => {
      state.memberships = action.payload;
      state.membershipLoading = false;
      state.error = null;
    },
    setMembershipLoading: (state, action: PayloadAction<boolean>) => {
      state.membershipLoading = action.payload;
    },
    addMembership: (state, action: PayloadAction<Membership>) => {
      state.memberships.push(action.payload);
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
  setMemberships,
  setMembershipLoading,
  addMembership,
} = clientSlice.actions;

export default clientSlice.reducer;
