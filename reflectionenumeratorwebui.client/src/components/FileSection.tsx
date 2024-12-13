import { useState, useRef } from "react"; // Import React and the `useState` hook for managing component state.
import "./components.css"

export const FileSection = () => {
    // State to hold the selected file.
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref to access the file input element.

    // Function to handle file input changes (when a user selects a file).
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null); // Reset to null if file selection is canceled.
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent the default behavior (e.g., opening the file).
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files.length > 0) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    // Handle file upload
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
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Upload successful: ${result.message}`);
            } else {
                const error = await response.text();
                alert(`Upload failed: ${error}`);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred during upload.");
        }
    };

    //const handleTest = async () => {
    //    const response = await fetch('reflectorenumerator/test');
    //    if (response.ok) {
    //        const result = await response.json();
    //        console.log(result);
    //        alert(`${result.message}`);
    //    } else {
    //        alert("Error");
    //    }
    //}

    return (
        <div className="file-section-container">
            {/* ToDo Style for the label */}
            <p className="select-file-label">Selected File:</p>
            <div className="file-picker"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()} // Trigger file selection on click
            >
                <input
                    type="file"
                    accept=".dll"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }} // Hide the default file input
                />
                <div className="file-input-box">
                    <p className="selected-file-label">
                        {selectedFile ? `Selected File: ${selectedFile.name}` : "Select or drop file"}
                    </p>
                </div>
            </div>
            <button className="enumerate-button" onClick={handleFileUpload} disabled={!selectedFile}>
                Enumerate assembly
            </button>
        </div>
    );
};