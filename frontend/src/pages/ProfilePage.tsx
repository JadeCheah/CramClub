import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import './ProfilePage.css';
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
// import { RootState } from '../redux/store';

const ProfilePage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [profile, setProfile] = useState<{
        username: string;
        joined: string;
    }>({
        username: 'Loading...',
        joined: 'Loading...',
    });

    useEffect(() => {
        const fetchProfile = async() => {
            try {
                const response = await axiosInstance.get('/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile({
                    username: response.data.username,
                    joined: response.data.joined,
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
                navigate('/'); //handle unauthorized access or errors
            }
        };
        if (token) {
            fetchProfile();
        } else {
            navigate('/');
        }
    }, [token, navigate]);
    
    const handleLogout = () => {
        dispatch(logout());
        alert("You have been logged out."); // Debug message
        navigate('/');
    }

    return (
        <div className="profile-container">
            <Paper className='profile-card' elevation={3}>
                <Avatar alt={profile.username} src="" className="profile-avatar" sx={{ width: 150, height: 150 }} />
                <div className="profile-details">
                    <Typography variant='h5'>{profile.username}</Typography>
                    {/*<Typography variant='body1' color='textSecondary'>
                        johnDoe@example.com
                    </Typography>}*/}
                    <Typography variant='body2' color="textSecondary">
                        Joined: {profile.joined}
                    </Typography>
                </div>
                <hr className='profile-divider' />
                <div className='profile-actions'>
                    <Button variant='contained' color="primary">
                        Edit Profile
                    </Button>
                    <Button onClick={handleLogout} variant="outlined" color="error">
                        Log Out
                    </Button>
                </div>
            </Paper>
        </div>
    );
};

export default ProfilePage;