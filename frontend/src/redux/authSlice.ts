import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from 'axios';

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
            const response = await axios.post('http://localhost:8080/login', credentials);
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
            const response = await axios.post('http://localhost:8080/signup', userData);
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

                // Debugging logs
                console.log('Saving user to localStorage:', action.payload.username);
                console.log('Saving token to localStorage:', action.payload.token);
                localStorage.setItem('user', action.payload.username);
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            //signup
            .addCase(signup.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

