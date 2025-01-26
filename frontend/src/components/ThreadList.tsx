import React from 'react';
import './ThreadList.css';

interface Tag {
    id: number;
    name: string;
}

interface Thread {
    id: number;
    title: string;
    content: string;
    author?: { username: string }; // Optional, only needed for display
    createdAt?: string;
    tags?: Tag[];
}

interface ThreadListProps {
    threads: Thread[];
    deleteThread: (id: number) => void;
    setEditingThread: (thread: Thread) => void;
    filterByTag: (tagName: string) => void; // Function to reset filter and fetch all threads
}

const ThreadList: React.FC<ThreadListProps> = ({
    threads,
    deleteThread,
    setEditingThread,
    filterByTag,
}) => {

    //helper function to format dates
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
        return new Date(dateString).toLocaleString("en-US", options);
    }

    return (
        <div>
            {threads.map((thread) => {
                return (
                    <div className="thread-container" key={thread.id}>
                        <div className="thread-header">
                            <h3 className="thread-title">{thread.title}</h3>
                            {thread.createdAt && (
                                <p className="thread-date">{formatDate(thread.createdAt)}</p>
                            )}
                        </div>
                        <div className="thread-rest">
                            <p className="thread-author">By: {thread.author?.username || "Unknown"}</p>
                            <p className="thread-content">{thread.content}</p>
                            <div className="thread-tags">
                                Tags:{" "}
                                {thread.tags && thread.tags.length > 0 ? (
                                    thread.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="tag"
                                            onClick={(() => filterByTag(tag.name))} //filter threads by tag
                                        >
                                            {tag.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="no-tags">No Tags</span>
                                )}
                            </div>
                        </div>
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