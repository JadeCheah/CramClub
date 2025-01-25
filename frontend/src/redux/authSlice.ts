import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

// This slice handles signup and login state 
interface AuthState {
    user: string | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: localStorage.getItem('user') || null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
}

// Async thunk for login 
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/login', credentials);
            return response.data; // expecting { username, token }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

//Async thunk for signup 
export const signup = createAsyncThunk(
    'auth/signup',
    async (userData: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('signup', userData);
            return response.data; // expects a success message
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Signup failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null; // Clear errors on logout
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            console.log("User logged out, state and localStorage cleared."); //debug message
        },
    },
    extraReducers: (builder) => {
        builder
            //login 
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<{ username: string; token: string }>) => {
                state.isLoading = false;
                state.user = action.payload.username;
                state.token = action.payload.token;

                localStorage.setItem('user', action.payload.username);
                localStorage.setItem('token', action.payload.token);
                console.log("Login successful: user and token saved to localStorage.");
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.isLoading = false;
                console.error("Login failed:", action.payload);
            })
            // Handle signup states
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
                console.log("Signup successful.");
            })
            .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                console.error("Signup failed:", action.payload);
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

