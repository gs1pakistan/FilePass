document.getElementById('enterPasswordBtn').addEventListener('click', function() {
    const enteredPassword = document.getElementById('enterPassword').value;
    const storedPassword = localStorage.getItem('appPassword');

    if (storedPassword) {
        if (enteredPassword === storedPassword) {
            showAccessSection();
        } else {
            alert('Incorrect password, please try again.');
        }
    } else {
        document.getElementById('enterPasswordSection').style.display = 'none';
        document.getElementById('setPasswordSection').style.display = 'block';
    }
});

document.getElementById('setPasswordBtn').addEventListener('click', function() {
    const setPassword = document.getElementById('setPassword').value;
    if (setPassword) {
        localStorage.setItem('appPassword', setPassword);
        alert('Password set successfully!');
        document.getElementById('setPasswordSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'block';
    } else {
        alert('Please enter a password.');
    }
});

document.getElementById('uploadBtn').addEventListener('click', function() {
    const uploadPassword = document.getElementById('uploadPassword').value;
    const storedPassword = localStorage.getItem('appPassword');

    if (uploadPassword === storedPassword) {
        const fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            let uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

            Array.from(fileInput.files).forEach(file => {
                const fileURL = URL.createObjectURL(file);
                uploadedFiles.push({ name: file.name, url: fileURL });
            });

            localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
            alert('Files uploaded successfully!');
            document.getElementById('uploadSection').style.display = 'none';
            showAccessSection();
        } else {
            alert('Please select files to upload.');
        }
    } else {
        alert('Incorrect password, please try again.');
    }
});

document.getElementById('accessFileBtn').addEventListener('click', function() {
    const accessPassword = document.getElementById('accessPassword').value;
    const storedPassword = localStorage.getItem('appPassword');

    if (accessPassword === storedPassword) {
        showAccessSection();
    } else {
        alert('Incorrect password, please try again.');
    }
});

function showAccessSection() {
    const uploadedFiles = JSON.parse(localStorage.getItem('uploadedFiles')) || [];

    if (uploadedFiles.length > 0) {
        const fileLinksContainer = document.getElementById('fileLinks');
        fileLinksContainer.innerHTML = ''; // Clear existing links

        uploadedFiles.forEach(file => {
            const link = document.createElement('a');
            link.href = file.url;
            link.textContent = `Download ${file.name}`;
            link.download = file.name;
            fileLinksContainer.appendChild(link);
        });

        fileLinksContainer.style.display = 'block';
        document.getElementById('accessSection').style.display = 'block';
        document.getElementById('uploadMoreBtn').style.display = 'block';
        document.getElementById('backToMainBtn').style.display = 'block';
        document.getElementById('enterPasswordSection').style.display = 'none';
    } else {
        alert('No files found. Please upload files first.');
    }
}

document.getElementById('uploadMoreBtn').addEventListener('click', function() {
    document.getElementById('accessSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
});

document.getElementById('backToMainBtn').addEventListener('click', function() {
    location.reload();
});
