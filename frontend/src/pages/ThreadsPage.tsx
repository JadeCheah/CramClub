import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadList from "../components/ThreadList";
import './ThreadsPage.css';
import axiosInstance from "../utils/axiosInstance";

interface Thread {
    id: number;
    title: string;
    content: string;
}

const ThreadsPage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const navigate = useNavigate();

    //fetch all threads from backend 
    const fetchAllThreads = async () => {
        try {
            const response = await axiosInstance.get<{ threads: Thread[] }>("/threads/");
            console.log("Fetched threads:", response.data.threads); // Debug log
            setThreads(response.data.threads);
            setIsFiltering(false);
        } catch (error) {
            console.error("Failed to fetch threads", error);
        }
    };

    // Fetch thread by tag
    const fetchThreadByTag = async (tagName: string) => {
        try {
            console.log("Filtering thread by tag:", tagName); // Debug log
            const response = await axiosInstance.get(`/threads/?tag=${tagName}`);
            console.log("Fetched thread by tag:", response.data.threads); // Debug log
            setThreads(response.data.threads);
            setIsFiltering(true); // Mark as filtering
        } catch (error) {
            console.error("Failed to filter threads by tag:", error);
        }
    };

    //Delete a thread 
    const deleteThread = async (id: number) => {
        try {
            await axiosInstance.delete(`/threads/${id}`);
            fetchAllThreads();
        } catch (error) {
            console.error("Failed to delete thread: ", error);
        }
    };

    useEffect(() => {
        fetchAllThreads();
    }, []);

    return (
        <div className="thread-page">
            <h1>All Threads</h1>
            <div className="utility-buttons">
                {isFiltering && (
                    <button className="back-arrow" onClick={fetchAllThreads}>
                        ←
                    </button>
                )}
                <button
                    className="add-post-button"
                    onClick={() => navigate("/add-post")} // Navigate to ThreadFormPage
                >
                    Add New Post
                </button>
            </div>
            <ThreadList
                threads={threads}
                deleteThread={deleteThread}
                setEditingThread={(thread) => navigate(`/edit-post/${thread.id}`)}
                filterByTag={fetchThreadByTag}
            />
        </div>
    );
};

export default ThreadsPage;