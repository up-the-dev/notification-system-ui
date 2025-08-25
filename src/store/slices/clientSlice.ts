import { createSlice, PayloadInterface } from '@reduxjs/toolkit';

interface Project {
  ID: string;
  ClientID: string;
  APIKey: string | null;
  SenderId: string;
  MetaData: any;
  Name: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ClientData {
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

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setClientData: (state, action: PayloadInterface<ClientData>) => {
      state.clientData = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadInterface<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadInterface<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearClientData: (state) => {
      state.clientData = null;
      state.loading = false;
      state.error = null;
    },
    addProject: (state, action: PayloadInterface<Project>) => {
      if (state.clientData) {
        state.clientData.Projects.push(action.payload);
      }
    },
  },
});

export const { setClientData, setLoading, setError, clearClientData, addProject } = clientSlice.actions;
export default clientSlice.reducer;