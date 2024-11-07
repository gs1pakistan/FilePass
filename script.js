// scripts.js

// Dummy file storage
let uploadedFileLink = '';

async function uploadFile() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file to upload');
        return;
    }

    // Mock URL for the uploaded file (replace with your server URL)
    const serverURL = 'https://file-pass-alpha.vercel.app';

    // Simulate file upload and create a link
    uploadedFileLink = `${serverURL}/${file.name}`;
    document.getElementById('file-link').innerHTML = `Download link: <a href="${uploadedFileLink}" target="_blank">${uploadedFileLink}</a>`;

    // Generate the QR Code for the download link
    generateQRCode(uploadedFileLink);
}

function generateQRCode(text) {
    const qrCodeDiv = document.getElementById('qr-code');
    qrCodeDiv.innerHTML = '';

    // Use a library to generate QR codes (e.g., QRCode.js)
    const qrCode = new QRCode(qrCodeDiv, {
        text: text,
        width: 128,
        height: 128,
    });
}

// Delete file from server after download
function deleteFile() {
    if (uploadedFileLink) {
        // Make request to delete file from server (mock example)
        console.log(`Deleting file at: ${uploadedFileLink}`);
        uploadedFileLink = '';
        document.getElementById('file-link').innerHTML = '';
        document.getElementById('qr-code').innerHTML = '';
    }
}

// Listen for download action
document.getElementById('file-link').addEventListener('click', deleteFile);
