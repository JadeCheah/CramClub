import React from 'react';
import './ThreadList.css';

interface Thread {
    id: number;
    title: string;
    content: string;
    author?: { username: string }; // Optional, only needed for display
}

interface ThreadListProps {
    threads: Thread[];
    deleteThread: (id: number) => void;
    setEditingThread: (thread: Thread) => void;
}

const ThreadList: React.FC<ThreadListProps> = ({ threads, deleteThread, setEditingThread }) => {
    return (
        <div>
            {threads.map((thread) => {
                return (
                    <div className="thread-container" key={thread.id}>
                        <h3 className="thread-title">{thread.title}</h3>
                        <p className="thread-content">{thread.content}</p>
                        <p className="thread-author">Author: {thread.author?.username || "Unknown"}</p> 
                        <div className="thread-buttons">
                            <button onClick={() => setEditingThread(thread)}>Edit</button>
                            <button onClick={() => deleteThread(thread.id)}>Delete</button>
                        </div>
                    </div>        
                );
            })}
        </div>
    );
};

export default ThreadList;