document.getElementById('uploadBtn').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        const url = URL.createObjectURL(file); // Create a temporary URL for the file
        const qrCode = `Download Link: ${url}`; // Simulated QR code text

        document.getElementById('qrCode').innerText = qrCode;
        
        // Automatically delete after user downloads (simulated with a timeout)
        setTimeout(() => {
            fileInput.value = ''; // Clear the input
            document.getElementById('qrCode').innerText = ''; // Remove the QR code link
        }, 20000); // Change time according to needs, simulating file expiry
    } else {
        alert('Please choose a file to upload.');
    }
});
