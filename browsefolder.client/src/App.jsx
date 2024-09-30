//import { useEffect, useState } from 'react';
//import './App.css';
//import { FaFolder, FaFolderPlus, FaUpload, FaFile } from 'react-icons/fa'; // Import necessary icons

//function App() {
//    const [files, setFiles] = useState([]);
//    const [selectedFiles, setSelectedFiles] = useState(null);
//    const [newFolderName, setNewFolderName] = useState("");
//    const [isModalOpen, setIsModalOpen] = useState(false);
//    const [currentPath, setCurrentPath] = useState({ site: 'BPL', record: '100001' });

//    useEffect(() => {
//        fetchFiles(currentPath.site, currentPath.record);
//    }, [currentPath]);

//    async function fetchFiles(site, record) {
//        try {
//            const response = await fetch(`https://localhost:7000/api/File/list?site=${site}&record=${record}`);
//            const data = await response.json();
//            setFiles(data);
//        } catch (error) {
//            console.error("Error fetching files: ", error);
//        }
//    }

//    function handleFileChange(event) {
//        setSelectedFiles(event.target.files);  // Handle multiple files
//    }

//    async function handleUpload() {
//        if (!selectedFiles.length) {
//            alert("Please select files before uploading.");
//            return;
//        }

//        const formData = new FormData();

//        // Loop through each selected file and append to formData
//        for (let i = 0; i < selectedFiles.length; i++) {
//            formData.append('files', selectedFiles[i]);
//        }

//        try {
//            const response = await fetch(`https://localhost:7000/api/upload?site=${currentPath.site}&record=${currentPath.record}`, {
//                method: 'POST',
//                body: formData,
//            });

//            if (response.ok) {
//                alert('Files uploaded successfully!');
//                fetchFiles(currentPath.site, currentPath.record);
//            } else {
//                const errorText = await response.text();
//                alert(`File upload failed: ${errorText}`);
//            }
//        } catch (error) {
//            console.error('Error uploading files:', error);
//        }
//    }



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
//                fetchFiles(currentPath.site, currentPath.record);
//                setNewFolderName("");
//                setIsModalOpen(false);
//            } else {
//                alert('Folder creation failed!');
//            }
//        } catch (error) {
//            console.error('Error creating folder:', error);
//        }
//    }

//    function handleFolderClick(folderName) {
//        setCurrentPath(prevPath => ({
//            ...prevPath,
//            record: `${prevPath.record}\\${folderName}`
//        }));
//    }

//    function handleBackNavigation() {
//        const pathParts = currentPath.record.split("\\");
//        if (pathParts.length > 1) {
//            pathParts.pop();
//            setCurrentPath(prevPath => ({
//                ...prevPath,
//                record: pathParts.join("\\")
//            }));
//        }
//    }

//    return (
//        <div className="file-browser-container">
//            <div className="header">
//                {currentPath.record.includes("\\") && (
//                    <button onClick={handleBackNavigation} className="back-btn">Back</button>
//                )}
//                <h2 className="record-title">{currentPath.record}</h2>
//                <div className="upload-container">
//                    <label className="file-upload-label">
//                        <input type="file" onChange={handleFileChange} className="file-input" multiple />
//                        <FaUpload className="icon" title="Upload File" onClick={handleUpload} />
//                    </label>
//                    <FaFolderPlus className="icon" onClick={() => setIsModalOpen(true)} title="Create New Folder" />
//                </div>
//            </div>

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
//                                    <a href={`https://localhost:7000/api/File/download?path=${currentPath.site}\\EnquiryReview\\${currentPath.record}\\${item.name}`} download className="file-link">
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

//import logo from './logo.svg';
import './App.css';
import FileBrowser from './component/fileBrowser';

function App() {
    return (
        <div className="FileBrowser" style={{ marginTop: "20px", marginBottom: "20px", margin: "10px" }}>
            <FileBrowser />
        </div>
    );
}

export default App;
