document.getElementById('enterPasswordBtn').addEventListener('click', function() {
    const enteredPassword = document.getElementById('enterPassword').value;
    const storedPassword = localStorage.getItem('appPassword');

    if (storedPassword) {
        if (enteredPassword === storedPassword) {
            showSection('accessSection');
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
        showSection('uploadSection');
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
            showSection('accessSection');
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
        showSection('accessSection');
    } else {
        alert('No files found. Please upload files first.');
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

document.getElementById('uploadMoreBtn').addEventListener('click', function() {
    showSection('uploadSection');
});

document.getElementById('backToMainBtn').addEventListener('click', function() {
    location.reload();
});

