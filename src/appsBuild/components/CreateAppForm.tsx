import React, { useState } from "react";
import "./CreateAppForm.css";
import LoginPreview from "./LoginPreview";
import { useApps, AppCreateInfo, AppInfo } from "../context/AppsContext";

export type CreateAppFormProps = {
  onSubmit: (formData: AppFormData) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
  initialApp?: AppInfo;
};

export type AppFormData = {
  appName: string;
  appUsername: string;
  domain: string;
  description: string;
  logoUrl: string;
  backgroundColor: string;
  accentColor: string;
};

const CreateAppForm = (props: CreateAppFormProps) => {
  const { mode = "create", initialApp } = props;
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState<AppFormData>({
    appName: initialApp?.appName ?? "",
    appUsername: initialApp?.appUsername ?? "",
    domain: initialApp?.domain ?? "",
    description: initialApp?.description ?? "",
    logoUrl: initialApp?.logoUrl ?? "",
    backgroundColor: initialApp?.backgroundColor ?? "#ffffff",
    accentColor: initialApp?.accentColor ?? "#000000",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Auto-prepend @ for username
    if (name === "appUsername") {
      let processedValue = value;
      if (!processedValue.startsWith("@")) {
        processedValue = "@" + processedValue.replace(/^@+/, "");
      }
      setFormData({ ...formData, [name]: processedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const { addApp, updateApp } = useApps();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      appName,
      appUsername,
      domain,
      description,
      logoUrl,
      backgroundColor,
      accentColor,
    } = formData;

    if (isEditMode && initialApp) {
      // Edit mode - only update allowed fields
      const payload: Partial<AppCreateInfo> = {
        appName,
        description,
        logoUrl,
        backgroundColor,
        accentColor,
      };
      await updateApp(initialApp.appUsername, payload);
    } else {
      // Create mode
      const payload: AppCreateInfo = {
        appName,
        appUsername,
        domain,
        description,
        logoUrl,
        backgroundColor,
        accentColor,
      };
      await addApp(payload);
    }
    props.onSubmit(formData);
  };

  const title = isEditMode ? "Edit app" : "Create app";
  const submitButtonText = isEditMode ? "Save changes" : "Create app";

  return (
    <div className="create-app-form-wrapper">
      <div className="create-app-form-container">
        <div className="create-app-form-content">
          <h2 className="create-app-form-title">{title}</h2>

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
              <label htmlFor="appUsername" className="form-label">
                Tonomy @username
              </label>
              <input
                type="text"
                id="appUsername"
                name="appUsername"
                placeholder="@myapp"
                value={formData.appUsername}
                onChange={handleInputChange}
                required
                pattern="@[a-z0-9._-]+"
                title="Username must start with @ and contain only lowercase letters, numbers, dots, underscores, and hyphens"
                disabled={isEditMode}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="domain" className="form-label">
                Domain
              </label>
              <input
                type="url"
                id="domain"
                name="domain"
                placeholder="https://example.com"
                value={formData.domain}
                onChange={handleInputChange}
                required
                pattern="https?://.*"
                title="Please enter a valid URL starting with http:// or https://"
                disabled={isEditMode}
                className="form-input"
              />
              <p className="form-hint">This cannot be changed later</p>
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
              <label htmlFor="logoUrl" className="form-label">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                name="logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={handleInputChange}
                pattern="https?://.*\.(jpg|jpeg|png|gif|svg|webp)"
                title="Please enter a valid image URL (jpg, jpeg, png, gif, svg, or webp)"
                className="form-input"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="backgroundColor" className="form-label">
                  Background Color
                </label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    id="backgroundColor"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        backgroundColor: e.target.value,
                      });
                    }}
                    className="form-input color-text-input"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="accentColor" className="form-label">
                  Accent Color
                </label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleInputChange}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={formData.accentColor}
                    onChange={(e) => {
                      setFormData({ ...formData, accentColor: e.target.value });
                    }}
                    className="form-input color-text-input"
                    placeholder="#000000"
                  />
                </div>
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
                {submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="preview-section">
        <h3 className="preview-title">Login Screen Preview</h3>
        <LoginPreview appData={formData} />
      </div>
    </div>
  );
};

export default CreateAppForm;
