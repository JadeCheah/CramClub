import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThreadFormPage.css';
import axiosInstance from "../utils/axiosInstance";

const ThreadFormPage: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/threads/", { title, content });
            navigate("/threads");
        } catch (error) {
            console.error("Failed to create new thread: ", error);
        }
    };

    return (
        <div className="thread-form-page">
            <h1>Create a new post</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Title 
                    <input 
                        type="text" 
                        placeholder="Enter a title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Content
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                {/* placeholder buttons for attachments and categories */}
                <div>
                    <label>Attachments</label>
                    <button type="button" disabled>Attach</button>
                </div>
                <div>
                    <label>Categories</label>
                    <button type="button" disabled>Add Category</button>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate("/threads")}>Cancel</button>
                    <button type="submit">Post</button>
                </div>
            </form>
        </div>
    );
};

export default ThreadFormPage;

