import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ThreadFormPage.css';
import axiosInstance from "../utils/axiosInstance";
import CreatableSelect from "react-select/creatable";

const ThreadFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the id from the URL
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]); // Tags state
    const navigate = useNavigate();

    // Fetch the thread data for editing 
    useEffect(() => {
        if (id) {
            console.log("Fetching thread with ID:", id); // Debugging log
            const fetchThread = async () => {
                try {
                    const response = await axiosInstance.get(`/threads/${id}`);
                    console.log("Fetched thread:", response.data); // Debugging log
                    setTitle(response.data.title || "");
                    setContent(response.data.content || "");
                    setTags(response.data.tags.map((tag: any) => tag.name)); // Extract tag names
                } catch (error) {
                    console.error("Failed to fetch thread for editing: ", error);
                }
            };
            fetchThread()
        }
    }, [id]);

    const handleTagChange = (newTags: any) => {
        setTags(newTags.map((tag: any) => tag.value)); // Update tags state
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { title, content, tags };
            if (id) {
                await axiosInstance.put(`/threads/${id}`, payload);
            } else {
                await axiosInstance.post("/threads/", payload);
            }
            navigate("/threads");
        } catch (error) {
            console.error("Failed to submit thread: ", error);
        }
    };

    return (
        <div className="thread-form-page">
            <h1>{id ? "Edit Post" : "Create a New Post"}</h1>
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
                <label>
                    Tags
                    <CreatableSelect
                        isMulti
                        onChange={handleTagChange}
                        value={tags.map((tag) => ({ value: tag, label: tag }))}
                        placeholder="Add or create tags"
                    />
                </label>
                {/* placeholder buttons for attachments and categories */}
                <div>
                    <label>Attachments</label>
                    <button type="button" disabled>Attach</button>
                </div>
                <div className="form-actions">
                    <button type="button" onClick={() => navigate("/threads")}>Cancel</button>
                    <button type="submit">{id ? "Update" : "Post"}</button>
                </div>
            </form>
        </div>
    );
};

export default ThreadFormPage;

