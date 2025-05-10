# 📂 Google Drive Uploader API

This NestJS-based API service uploads files from external URLs directly to Google Drive, with file validation and PostgreSQL metadata storage. The app supports large file streaming and can be containerized via Docker Compose.

---

## ⚙️ Setup Instructions

1. **Create a Google Cloud Service Account** with access to Google Drive API.
2. **Download the credentials JSON** file and place it in the root directory (name must match `GOOGLE_CREDENTIALS_FILE_NAME`).
3. **Optional: Share your target Google Drive folder** with the service account email.
4. **Create a `.env` file** based on `.env.example` and fill in:
```env
# Google Drive
GOOGLE_CREDENTIALS_FILE_NAME=credentials.json
GOOGLE_DRIVE_FOLDER_ID=your_folder_id         # optional if using folder name
GOOGLE_DRIVE_FOLDER_NAME=your_folder_name     # optional fallback
GOOGLE_DRIVE_LINK_TEMPLATE=https://drive.google.com/file/d/{driveId}/view
GOOGLE_DRIVE_MAKE_NEW_FILE_PUBLIC=true

# File validation
FILE_VALIDATION_MAX_UPLOAD_SIZE=2147483648    # 2GB

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_user
DB_PASSWORD=your_pass
DB_DATABASE=drive_uploader
```
5. Build and run

```bash
docker-compose up --build
```

## API Endpoints
### POST /files/upload-from-links
Request
```json
{
  "urls": [
    "https://example.com/photo.jpg"
  ]
}
```
Response
```json
[
  {
    "fileName": "photo.jpg",
    "mimeType": "image/jpeg",
    "driveId": "1a2b3c...",
    "webViewLink": "https://drive.google.com/file/d/1a2b3c.../view",
    "status": "SUCCESS"
  }
]
```

### GET /files
Response
```json
[
     {
        "id": "5effe758-d5ed-47ca-962c-035ce3ae511d",
        "fileName": "photo.jpg",
        "mimeType": "image/jpeg",
        "status": "SUCCESS",
        "driveId":"1a2b3c...",
        "createdAt": "2025-05-10T18:24:25.019Z",
        "url": "https://drive.google.com/file/d/1a2b3c.../view"
    }
]
```
## Technologies
1. NestJS + CQRS
2. PostgreSQL
3. Google Drive API
4. Axios (streaming)
5. Docker Compose