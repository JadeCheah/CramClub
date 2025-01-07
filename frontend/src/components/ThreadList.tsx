import React from 'react';
import './ThreadList.css';

interface Thread {
    id: number;
    title: string;
    content: string;
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