import React, { useState } from "react";
import "./CreateAppForm.css";

export type CreateAppFormProps = {
    onSubmit: (formData: any) => void;
    onCancel: () => void;
};

const CreateAppForm = (props: CreateAppFormProps) => {
    const [formData, setFormData] = useState({
        appName: "",
        domain: "",
        description: "",
        logo: null as File | null,
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onSubmit({
            ...formData,
            logo: logoPreview,
        });
    };

    return (
        <div className="create-app-form-container">
            <div className="create-app-form-content">
                <h2 className="create-app-form-title">Create app</h2>

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="appName" className="form-label">
                            App name
                        </label>
                        <input
                            type="text"
                            id="appName"
                            name="appName"
                            placeholder="My new app"
                            value={formData.appName}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="domain" className="form-label">
                            Domain
                        </label>
                        <input
                            type="text"
                            id="domain"
                            name="domain"
                            placeholder="https://example.com"
                            value={formData.domain}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Briefly describe your app"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="form-input form-textarea"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="logo" className="form-label">
                            Upload app logo
                        </label>
                        <div className="logo-upload-area">
                            {logoPreview ? (
                                <div className="logo-preview">
                                    <img src={logoPreview} alt="App logo preview" />
                                    <button
                                        type="button"
                                        className="remove-logo-button"
                                        onClick={() => {
                                            setLogoPreview(null);
                                            setFormData({ ...formData, logo: null });
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <label htmlFor="logoInput" className="upload-label">
                                    <svg
                                        className="upload-icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="17 8 12 3 7 8"></polyline>
                                        <line x1="12" y1="3" x2="12" y2="15"></line>
                                    </svg>
                                    <p className="upload-text">Click or drag and drop to upload</p>
                                </label>
                            )}
                            <input
                                type="file"
                                id="logoInput"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="file-input"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={props.onCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Create app
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAppForm;
