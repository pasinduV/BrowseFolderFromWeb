using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;

namespace OpenFolder.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        private readonly string _basePath = @"\\ERP10-APS\DocTrakDocuments\";

        // Endpoint to list files and folders
        [HttpGet("list")]
        public IActionResult GetFilesAndFolders([FromQuery] string site = "", string record = "")
        {
            try
            {
                // Build the full path
                var fullPath = Path.Combine(_basePath, site, "EnquiryReview", record);

                if (!Directory.Exists(fullPath))
                {
                    return NotFound("Directory does not exist.");
                }

                // Get directories and files
                var directories = Directory.GetDirectories(fullPath)
                    .Select(dir => new { Name = Path.GetFileName(dir), IsFolder = true }).ToList();

                var files = Directory.GetFiles(fullPath)
                    .Select(file => new { Name = Path.GetFileName(file), IsFolder = false }).ToList();

                // Combine directories and files into a single list
                var items = directories.Concat(files).ToList();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to download a file
        [HttpGet("download")]
        public IActionResult DownloadFile([FromQuery] string path)
        {
            try
            {
                // Build the full file path
                var fullPath = Path.Combine(_basePath, path);

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound("File not found.");
                }

                // Get the file content and return it as a download
                var fileBytes = System.IO.File.ReadAllBytes(fullPath);
                var fileName = Path.GetFileName(fullPath);
                return File(fileBytes, "application/octet-stream", fileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to upload a file
        [HttpPost("upload")]
        public IActionResult UploadFiles([FromQuery] string site, string record, [FromForm] IFormFileCollection files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest("No files uploaded.");
                }

                // Build the full path where the files will be saved
                var fullPath = Path.Combine(_basePath, site, "EnquiryReview", record);

                if (!Directory.Exists(fullPath))
                {
                    return NotFound("Directory does not exist.");
                }

                // Save each file
                foreach (var file in files)
                {
                    var fileName = Path.GetFileName(file.FileName);
                    var filePath = Path.Combine(fullPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok(new { message = "Files uploaded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // View a file (such as PDF) in the browser
        [HttpGet("view")]
        public IActionResult ViewFile([FromQuery] string path)
        {
            try
            {
                // Build the full file path
                var fullPath = Path.Combine(_basePath, path);

                if (!System.IO.File.Exists(fullPath))
                {
                    return NotFound("File not found.");
                }

                // Get the file's content type (specifically for PDF)
                var contentType = "application/pdf";

                // Read the file as bytes
                var fileBytes = System.IO.File.ReadAllBytes(fullPath);

                // Return the file as a byte stream with inline Content-Disposition
                return File(fileBytes, contentType, Path.GetFileName(fullPath), enableRangeProcessing: true);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Endpoint to list files and folders in the requested format
        [HttpGet("list2")]
        public IActionResult GetFilesAndFolders2([FromQuery] string site = "", string record = "")
        {
            try
            {
                // Build the full path
                var fullPath = Path.Combine(_basePath, site, "EnquiryReview", record);

                if (!Directory.Exists(fullPath))
                {
                    return NotFound("Directory does not exist.");
                }

                // Get the current folder's info
                var currentFolder = new
                {
                    id = $"folder-{Guid.NewGuid()}",
                    name = Path.GetFileName(fullPath),
                    path = fullPath.Replace(_basePath, "").Replace('\\', '/'),
                    createdDate = Directory.GetCreationTime(fullPath).ToString("yyyy-MM-ddTHH:mm:ss")
                };

                // Get parent folder's info (if any)
                var parentDirectory = Directory.GetParent(fullPath);
                var parentFolder = parentDirectory != null
                    ? new
                    {
                        id = $"folder-{Guid.NewGuid()}",
                        name = parentDirectory.Name,
                        path = parentDirectory.FullName.Replace(_basePath, "").Replace('\\', '/'),
                        createdDate = Directory.GetCreationTime(parentDirectory.FullName).ToString("yyyy-MM-ddTHH:mm:ss")
                    }
                    : new { id = "root", name = "Root", path = "/", createdDate = "2024-09-01T12:00:00" };

                // Get directories (folders)
                var directories = Directory.GetDirectories(fullPath)
                    .Select(dir => new
                    {
                        id = $"folder-{Guid.NewGuid()}",
                        name = Path.GetFileName(dir),
                        isDir = true,
                        size = (string)null,
                        modifiedDate = Directory.GetLastWriteTime(dir).ToString("yyyy-MM-ddTHH:mm:ss")
                    }).ToList();

                // Get files
                var files = Directory.GetFiles(fullPath)
                    .Select(file => new
                    {
                        id = $"file-{Guid.NewGuid()}",
                        name = Path.GetFileName(file),
                        isDir = false,
                        size = $"{new FileInfo(file).Length / 1024}KB", // File size in KB
                        modifiedDate = System.IO.File.GetLastWriteTime(file).ToString("yyyy-MM-ddTHH:mm:ss")
                    }).ToList();

                // Combine results into the final structure
                var response = new
                {
                    files = files,
                    folders = directories,
                    currentFolder = currentFolder,
                    parentFolder = parentFolder
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        //Endpoint to create a new folder
        [HttpPost("create-folder")]
        public IActionResult CreateFolder([FromQuery] string path, [FromQuery] string folderName)
        {
            try
            {
                // Build the full path
                var fullPath = Path.Combine(_basePath, path, folderName);

                if (Directory.Exists(fullPath))
                {
                    return BadRequest("Folder already exists.");
                }

                // Create the folder
                Directory.CreateDirectory(fullPath);

                return Ok(new { message = "Folder created successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
