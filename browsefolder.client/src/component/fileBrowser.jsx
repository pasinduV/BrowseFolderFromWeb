import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChonkyIconFA } from 'chonky-icon-fontawesome';
import { FileBrowser, FileContextMenu, FileList, FileNavbar, FileToolbar, setChonkyDefaults, ChonkyActions } from 'chonky';
import MultipleFileUploader from './uploadFile';

// Set default icon component for Chonky
setChonkyDefaults({ iconComponent: ChonkyIconFA });

// Define the API endpoints
const DOWNLOAD_API_URL = '/api/files/download'; // Endpoint for downloading files

const FileBrowse = () => {
    // State variables
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState('root');
    const FETCH_FILES_FOLDERS_API = 'https://localhost:7000/api/File/list2?site=BPL&record=100001';

    // Fetch files and folders from API based on current folder ID
    useEffect(() => {
        const fetchFilesAndFolders = async () => {
            try {
                // Fetch the folder contents from the API
                const response = await axios.get(`${FETCH_FILES_FOLDERS_API}&folderId=${currentFolderId}`);
                const { files: apiFiles, folders, currentFolder, parentFolder } = response.data;

                // Combine files and folders into a single array
                const combinedFiles = [
                    ...folders.map(folder => ({
                        id: folder.id,
                        name: folder.name,
                        isDir: folder.isDir,
                        size: folder.size,
                        modifiedDate: folder.modifiedDate
                    })),
                    ...apiFiles.map(file => ({
                        id: file.id,
                        name: file.name,
                        isDir: file.isDir,
                        size: file.size,
                        modifiedDate: file.modifiedDate
                    }))
                ];

                // Set the combined files and update folder chain
                setFiles(combinedFiles);

                // Update the folder chain for navigation
                if (parentFolder) {
                    setFolderChain([...folderChain, { id: currentFolder.id, name: currentFolder.name }]);
                } else {
                    setFolderChain([{ id: currentFolder.id, name: currentFolder.name }]); // Root folder
                }
            } catch (error) {
                console.error('Error fetching files and folders:', error);
            }
        };

        fetchFilesAndFolders();
    }, [currentFolderId]);

    // Handle folder navigation when a folder is opened
    const handleFileAction = async (data) => {
        if (data.id === ChonkyActions.OpenFiles.id) {
            const targetFile = data.payload.targetFile;

            if (targetFile && targetFile.isDir) {
                // Navigate into the clicked folder
                setCurrentFolderId(targetFile.id);
            }
        } else if (data.id === ChonkyActions.DownloadFiles.id) {
            const file = data.payload.file;
            if (file && !file.isDir) {
                try {
                    // Download file from the API
                    const response = await axios.get(`${DOWNLOAD_API_URL}?fileId=${file.id}`, {
                        responseType: 'blob',
                    });

                    // Create a temporary URL to download the file
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file.name);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } catch (error) {
                    console.error('Error downloading file:', error);
                }
            }
        }
    };

    return (
        <div style={{
            minHeight: "500px",
            height: "100vh",
           boxSizing: "border-box" // Ensures padding and borders are included in the element's total height
        }}>
        
            <h2>{folderChain.length > 0 ? "Enquiry Review Number : " + folderChain[0].name : 'Root'}</h2>
            <FileBrowser
                files={files}
                folderChain={folderChain}
                onFileAction={handleFileAction} // Handle file actions like open folder or download
            >
                <FileNavbar />
                <FileToolbar />

                <MultipleFileUploader />
                <FileList />
                <FileContextMenu />
            </FileBrowser>
        </div>
    );
};

export default FileBrowse;
