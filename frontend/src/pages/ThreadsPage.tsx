import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreadList from "../components/ThreadList";
import ThreadForm from "../components/ThreadForm";
import './ThreadsPage.css';
import axiosInstance from "../utils/axiosInstance";

interface Thread {
    id: number;
    title: string;
    content: string;
}

const ThreadsPage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const navigate = useNavigate();
    // const [editingThread, setEditingThread] = useState<Thread | null>(null);

    //fetch threads from backend 
    const fetchThreads = async () => {
        try {
            const response = await axiosInstance.get<{ threads: Thread[] }>("/threads/");
            console.log("Fetched threads:", response.data.threads); // Debug log
            setThreads(response.data.threads);
        } catch (error) {
            console.error("Failed to fetch threads", error);
        }
    };

    // //Add a new thread 
    // const addThread = async (thread: Omit<Thread, "id">) => {
    //     try {
    //         await axiosInstance.post("/threads/", thread);
    //         fetchThreads();
    //     } catch (error) {
    //         console.error("Failed to add new thread: ", error);
    //     }
    // };

    // //Update an existing thread 
    // const updateThread = async (id: number, newThread: Omit<Thread, "id">) => {
    //     try {
    //         console.log(`Updating thread with id: ${id}`, newThread); // Debug message
    //         await axiosInstance.put(`/threads/${id}`, newThread);
    //         fetchThreads();
    //         setEditingThread(null); //no more editing thread 
    //         console.log(`Thread with id: ${id} updated successfully`); // Debug message
    //     } catch (error) {
    //         console.error("Failed to update thread:", error);
    //     }
    // };

    //Delete a thread 
    const deleteThread = async (id: number) => {
        try {
            await axiosInstance.delete(`/threads/${id}`);
            fetchThreads();
        } catch (error) {
            console.error("Failed to delete thread: ", error);
        }
    };

    useEffect(() => {
        fetchThreads();
    }, []);

    return (
        <div className="thread-page">
            <h1>All Threads</h1>
            <button 
                className="add-post-button" 
                onClick={() => navigate("/add-post")} // Navigate to ThreadFormPage
            >
                Add New Post
            </button>
            {/* <ThreadForm
                onSubmit={addThread}
                onUpdate={updateThread}
                editingThread={editingThread}
                setEditingThread={setEditingThread}
            /> */}
            <ThreadList
                threads={threads}
                deleteThread={deleteThread}
                setEditingThread={() => {}}
            />
        </div>
    );
};

export default ThreadsPage;