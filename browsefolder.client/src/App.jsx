//import { useEffect, useState } from 'react';
//import './App.css';
//import { FaFolder, FaFolderPlus, FaUpload, FaFile } from 'react-icons/fa'; // Import necessary icons

//function App() {
//    const [files, setFiles] = useState([]);
//    const [selectedFile, setSelectedFile] = useState(null);
//    const [newFolderName, setNewFolderName] = useState("");
//    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
//    const [currentPath, setCurrentPath] = useState({ site: 'BPL', record: '100001' });

//    // Fetch files and folders when component mounts or path changes
//    useEffect(() => {
//        fetchFiles(currentPath.site, currentPath.record);
//    }, [currentPath]);

//    // Fetch files and folders from the server
//    async function fetchFiles(site, record) {
//        try {
//            const response = await fetch(`https://localhost:7000/api/File/list?site=${site}&record=${record}`);
//            const data = await response.json();
//            console.log("Files fetched: ", data);
//            setFiles(data);
//        } catch (error) {
//            console.error("Error fetching files: ", error);
//        }
//    }

//    // Handle file selection
//    function handleFileChange(event) {
//        setSelectedFile(event.target.files[0]);
//    }

//    // Upload the selected file
//    async function handleUpload() {
//        if (!selectedFile) {
//            alert("Please select a file first!");
//            return;
//        }

//        const formData = new FormData();
//        formData.append('file', selectedFile);

//        try {
//            const response = await fetch(`/api/upload?site=${currentPath.site}&record=${currentPath.record}`, {
//                method: 'POST',
//                body: formData,
//            });

//            if (response.ok) {
//                alert('File uploaded successfully!');
//                fetchFiles(currentPath.site, currentPath.record); // Refresh file list after upload
//            } else {
//                alert('File upload failed!');
//            }
//        } catch (error) {
//            console.error('Error uploading file:', error);
//        }
//    }

//    // Handle folder creation inside the modal
//    async function handleCreateFolder() {
//        if (!newFolderName) {
//            alert("Please enter a folder name.");
//            return;
//        }

//        try {
//            const response = await fetch(`/api/File/create-folder?site=${currentPath.site}&record=${currentPath.record}`, {
//                method: 'POST',
//                headers: { 'Content-Type': 'application/json' },
//                body: JSON.stringify({ folderName: newFolderName })
//            });

//            if (response.ok) {
//                alert('Folder created successfully!');
//                fetchFiles(currentPath.site, currentPath.record); // Refresh file list after folder creation
//                setNewFolderName(""); // Clear the input
//                setIsModalOpen(false); // Close modal after success
//            } else {
//                alert('Folder creation failed!');
//            }
//        } catch (error) {
//            console.error('Error creating folder:', error);
//        }
//    }

//    // Handle folder click to navigate into the folder
//    function handleFolderClick(folderName) {
//        setCurrentPath(prevPath => ({
//            ...prevPath,
//            record: `${prevPath.record}\\${folderName}` // Navigate into the folder
//        }));
//    }

//    // Handle back navigation
//    function handleBackNavigation() {
//        const pathParts = currentPath.record.split("\\");
//        if (pathParts.length > 1) {
//            pathParts.pop(); // Remove the last part of the path
//            setCurrentPath(prevPath => ({
//                ...prevPath,
//                record: pathParts.join("\\")
//            }));
//        }
//    }

//    return (
//        <div className="file-browser-container">



//            {/* Back button to navigate up */}
//            {currentPath.record.includes("\\") && (
//                <button onClick={handleBackNavigation} className="back-btn">Back</button>
//            )}

//            {/* List of Files and Folders */}
//            <h2 style={{ color: 'black' }}>{currentPath.record}</h2>
//            {/* File Upload Section */}
//            <div className="file-upload-container">
//                <label className="file-upload-label">
//                    <input type="file" onChange={handleFileChange} className="file-input" />
//                    <FaUpload className="icon" title="Upload File" />
//                </label>
//                <FaFolderPlus className="icon" onClick={() => setIsModalOpen(true)} title="Create New Folder" />
//            </div>

//            {/* Modal for creating folder */}
//            {isModalOpen && (
//                <div className="modal">
//                    <div className="modal-content">
//                        <h2>Create New Folder</h2>
//                        <input
//                            type="text"
//                            placeholder="Enter folder name"
//                            value={newFolderName}
//                            onChange={(e) => setNewFolderName(e.target.value)}
//                            className="folder-input"
//                        />
//                        <div className="modal-actions">
//                            <button onClick={handleCreateFolder} className="save-btn">Save</button>
//                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
//                        </div>
//                    </div>
//                </div>
//            )}
//            <div className="file-list-container">
//                {files.length > 0 ? (
//                    <ul className="file-list">
//                        {files.map((item, index) => (
//                            <li key={index} className="file-item">
//                                {item.isFolder ? (
//                                    <span onClick={() => handleFolderClick(item.name)} className="folder-item">
//                                        <FaFolder className="folder-icon" /> {item.name}
//                                    </span>
//                                ) : (
//                                        <a href={`https://localhost:7000/api/File/download?path=${currentPath.site}\\"EnquiryReview"\\${currentPath.record}\\${item.name}`} download className="file-link">
//                                        <FaFile className="file-icon" /> {item.name}
//                                    </a>
//                                )}
//                            </li>
//                        ))}
//                    </ul>
//                ) : (
//                    <p>No files or folders found.</p>
//                )}
//            </div>
//        </div>
//    );
//}

//export default App;

import { useEffect, useState } from 'react';
import './App.css';
import { FaFolder, FaFolderPlus, FaUpload, FaFile } from 'react-icons/fa'; // Import necessary icons

function App() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFolderName, setNewFolderName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState({ site: 'BPL', record: '100001' });

    useEffect(() => {
        fetchFiles(currentPath.site, currentPath.record);
    }, [currentPath]);

    async function fetchFiles(site, record) {
        try {
            const response = await fetch(`https://localhost:7000/api/File/list?site=${site}&record=${record}`);
            const data = await response.json();
            setFiles(data);
        } catch (error) {
            console.error("Error fetching files: ", error);
        }
    }

    function handleFileChange(event) {
        setSelectedFile(event.target.files[0]);
    }

    async function handleUpload() {
        //if (!selectedFile) {
        //    alert("Please select a file first!");
        //    return;
        //}

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`https://localhost:7000/api/upload?site=${currentPath.site}&record=${currentPath.record}`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                fetchFiles(currentPath.site, currentPath.record);
            } else {
                alert('File upload failed!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    async function handleCreateFolder() {
        if (!newFolderName) {
            alert("Please enter a folder name.");
            return;
        }

        try {
            const response = await fetch(`/api/File/create-folder?site=${currentPath.site}&record=${currentPath.record}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderName: newFolderName })
            });

            if (response.ok) {
                alert('Folder created successfully!');
                fetchFiles(currentPath.site, currentPath.record);
                setNewFolderName("");
                setIsModalOpen(false);
            } else {
                alert('Folder creation failed!');
            }
        } catch (error) {
            console.error('Error creating folder:', error);
        }
    }

    function handleFolderClick(folderName) {
        setCurrentPath(prevPath => ({
            ...prevPath,
            record: `${prevPath.record}\\${folderName}`
        }));
    }

    function handleBackNavigation() {
        const pathParts = currentPath.record.split("\\");
        if (pathParts.length > 1) {
            pathParts.pop();
            setCurrentPath(prevPath => ({
                ...prevPath,
                record: pathParts.join("\\")
            }));
        }
    }

    return (
        <div className="file-browser-container">
            <div className="header">
                {currentPath.record.includes("\\") && (
                    <button onClick={handleBackNavigation} className="back-btn">Back</button>
                )}
                <h2 className="record-title">{currentPath.record}</h2>
                <div className="upload-container">
                    <label className="file-upload-label">
                        <input type="file" onChange={handleFileChange} className="file-input" />
                        <FaUpload className="icon" title="Upload File" onClick={handleUpload} />
                    </label>
                    <FaFolderPlus className="icon" onClick={() => setIsModalOpen(true)} title="Create New Folder" />
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Create New Folder</h2>
                        <input
                            type="text"
                            placeholder="Enter folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="folder-input"
                        />
                        <div className="modal-actions">
                            <button onClick={handleCreateFolder} className="save-btn">Save</button>
                            <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="file-list-container">
                {files.length > 0 ? (
                    <ul className="file-list">
                        {files.map((item, index) => (
                            <li key={index} className="file-item">
                                {item.isFolder ? (
                                    <span onClick={() => handleFolderClick(item.name)} className="folder-item">
                                        <FaFolder className="folder-icon" /> {item.name}
                                    </span>
                                ) : (
                                    <a href={`https://localhost:7000/api/File/download?path=${currentPath.site}\\EnquiryReview\\${currentPath.record}\\${item.name}`} download className="file-link">
                                        <FaFile className="file-icon" /> {item.name}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No files or folders found.</p>
                )}
            </div>
        </div>
    );
}

export default App;
