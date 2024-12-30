import { useState, useRef } from "react";
import * as Interfaces from '../interfaces/ReflectionModels';
import "./components.css"

// File section properties with method to update assembly data.
interface FileSectionProps {
    updateAssemblyData: (data: Interfaces.InterrogatedAssembly) => void;
}

// File section export for selection and enumeration call for assembly file.
export const FileSection: React.FC<FileSectionProps> = ({ updateAssemblyData }) => {
    // State and reference for selected file.
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Function to handle file input changes (when a user selects a file).
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null); // Reset to null if file selection is canceled.
        }
    };

    // Drag over function (prevent default behaviour of opening file).
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    // Drag drop function to set selected file.
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    // Handle file upload.
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch("reflectorenumerator/reflect-assembly", {
                method: "POST",
                headers: { 'Cache-Control': 'no-cache' },
                body: formData,
            });

            if (response.ok) {
                // Response is OK so get JSON data and then call the updateAssemblyData method defined in the interface
                // for this component to pass it back to App.tsx, where it will then be passed to the reflected assembly
                // section component to display the data.
                const data = await response.json();

                updateAssemblyData(data);
            } else {
                const error = await response.text();
                alert(`Upload failed: ${error}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred during upload.");
        }
    };

    return (
        <div className="file-section-container">
            <p className="select-file-label">Selected File:</p>
            <div className="file-picker"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    accept=".dll"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                />
                <div className="file-input-box">
                    <p className="selected-file-label">
                        {selectedFile ? selectedFile.name : "Select or drop file"}
                    </p>
                </div>
            </div>
            <button className="enumerate-button" onClick={handleFileUpload} disabled={!selectedFile}>
                Enumerate assembly
            </button>
        </div>
    );
};

export default FileSection;