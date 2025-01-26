import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, signup } from '../redux/authSlice';
import { RootState, AppDispatch } from '../redux/store';
import { TextField, Button, Typography, Box } from '@mui/material';

const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [signupSuccess, setSignupSuccess] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate(); //initialise navigate

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            const outcomeAction = await dispatch(login(formData));
            if (login.fulfilled.match(outcomeAction)) {
                navigate('/threads');
            }
        } else {
            const outcomeAction = await dispatch(signup(formData));
            if (signup.fulfilled.match(outcomeAction)) {
                setSignupSuccess(true);
                setIsLogin(true);
            }
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 8,
                p: 3,
                backgroundColor: '#E9E3B4',
                border: '1px solid #3E6990',
                borderRadius: 3,
                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    color: '#381D2A',
                    textAlign: 'center',
                    fontWeight: 'bold',
                }}
            >
                {isLogin ? 'Login' : 'Sign Up'}
            </Typography>
            {signupSuccess && (
                <Typography color="success" variant="body2" gutterBottom>
                    Signup successful! Please log in.
                </Typography>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    name="username"
                    label="Username"
                    type="text"
                    fullWidth
                    margin="normal"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#3E6990' },
                            '&:hover fieldset': { borderColor: '#F39B6D' },
                            '&.Mui-focused fieldset': { borderColor: '#3E6990' },
                        },
                        '& .MuiInputLabel-root': { color: '#381D2A' },
                    }}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#3E6990' },
                            '&:hover fieldset': { borderColor: '#F39B6D' },
                            '&.Mui-focused fieldset': { borderColor: '#3E6990' },
                        },
                        '& .MuiInputLabel-root': { color: '#381D2A' },
                    }}
                />
                {error && (
                    <Typography color="error" variant="body2" gutterBottom>
                        {error}
                    </Typography>
                )}
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth disabled={isLoading}
                    sx={{
                        backgroundColor: '#3E6990',
                        color: '#E9E3B4',
                        '&:hover': {
                            backgroundColor: '#F39B6D',
                            color: '#381D2A',
                        },
                        mt: 2,
                        fontWeight: 'bold',
                    }}
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>
            </form>
            <Box textAlign="center" mt={2}>
                <Button 
                    onClick={() => setIsLogin(!isLogin)} 
                    size="small"
                    sx={{
                        color: '#3E6990',
                        textTransform: 'none',
                        '&:hover': { color: '#F39B6D' },
                    }}
                >
                    {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
                </Button>
            </Box>
        </Box>
    );

};

export default AuthScreen;