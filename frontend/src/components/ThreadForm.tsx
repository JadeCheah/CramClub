import React, { useState, useEffect } from 'react';

interface Thread {
    id: number;
    title: string;
    content: string;
}

interface ThreadFormProps {
    onSubmit: (thread: Omit<Thread, "id">) => void;
    onUpdate: (id: number, thread: Omit<Thread, "id">) => void;
    editingThread: Thread | null;
    setEditingThread: (thread: null) => void;
}

const ThreadForm: React.FC<ThreadFormProps> = ( {onSubmit, onUpdate, editingThread, setEditingThread} ) => {
    const[title, setTitle] = useState("");
    const[content, setContent] = useState("");

    useEffect(() => {
        if (editingThread) {
            setTitle(editingThread.title);
            setContent(editingThread.content);
        } else {
            setTitle("");
            setContent("");
        }
    }, [editingThread]);

    
    //submit form event handler 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingThread) {
            onUpdate(editingThread.id, { title, content });
        } else {
            onSubmit({ title, content });
        }
    };

    const handleCancel = () => {
        setEditingThread(null);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required/>
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            <button type="submit">{editingThread ? "Update": "Add"}</button>
            {editingThread && <button type="button" onClick={handleCancel}>Cancel</button>}
        </form>
    );
};

export default ThreadForm;
