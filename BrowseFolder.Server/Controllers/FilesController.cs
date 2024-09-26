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
        public IActionResult UploadFile([FromQuery] string site, string record, IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file uploaded.");
                }

                // Build the full path where the file will be saved
                var fullPath = Path.Combine(_basePath, site, "EnquiryReview", record);

                if (!Directory.Exists(fullPath))
                {
                    return NotFound("Directory does not exist.");
                }

                // Create a unique file name to prevent overwriting
                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(fullPath, fileName);

                // Save the file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                return Ok(new { message = "File uploaded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
