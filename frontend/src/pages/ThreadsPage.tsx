import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ThreadList from "../components/ThreadList";
import ThreadForm from "../components/ThreadForm";
import './ThreadsPage.css';

interface Thread {
    id: number;
    title: string;
    content: string;
}

const ThreadsPage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [editingThread, setEditingThread] = useState<Thread | null>(null);

    //fetch threads from backend 
    const fetchThreads = async() => {
        try {
            const response = await axios.get<{ threads: Thread[] }>("http://localhost:8080/threads");
            setThreads(response.data.threads);
        } catch (error) {
            console.error("Failed to fetch threads", error);
        }
    };

    //Add a new thread 
    const addThread = async(thread : Omit<Thread, "id">) => {
        try {
            await axios.post("http://localhost:8080/threads", thread);
            fetchThreads();
        } catch (error) {
            console.error("Failed to add new thread: ", error);
        }
    };

    //Update an existing thread 
    const updateThread = async(id: number, newThread: Omit<Thread, "id">) => {
        try {
            await axios.put(`http://localhost:8080/threads/${id}`, newThread);
            fetchThreads();
            setEditingThread(null); //no more editing thread 
        } catch (error) {
            console.error("Failed to update thread:", error);
        }
    };

    //Delete a thread 
    const deleteThread = async(id: number)  => {
        try {
            await axios.delete(`http://localhost:8080/threads/${id}`);
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
            <ThreadForm
                onSubmit={addThread}
                onUpdate={updateThread}
                editingThread={editingThread}
                setEditingThread={setEditingThread}
            />
            <ThreadList
                threads={threads}
                deleteThread={deleteThread}
                setEditingThread={setEditingThread}
            />
        </div>
    );
};

export default ThreadsPage;