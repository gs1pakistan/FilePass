// Utility functions
const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// State management
let currentView = 'grid';
let files = [];
const MAX_STORAGE = 1024 * 1024 * 1024; // 1GB in bytes

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

const initializeApp = () => {
    const storedPassword = localStorage.getItem('appPassword');
    if (!storedPassword) {
        showSection('setPasswordSection');
        hideSection('enterPasswordSection');
    }
    loadFiles();
    updateStorageInfo();
};

const setupEventListeners = () => {
    // Auth related listeners
    document.getElementById('enterPasswordBtn').addEventListener('click', handleLogin);
    document.getElementById('setPasswordBtn').addEventListener('click', handlePasswordSet);
    
    // File management listeners
    document.getElementById('uploadBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    document.getElementById('searchFiles').addEventListener('input', handleSearch);
    document.getElementById('gridView').addEventListener('click', () => switchView('grid'));
    document.getElementById('listView').addEventListener('click', () => switchView('list'));

    // Navigation listeners
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => handleNavigation(item.dataset.section));
    });

    // Modal listener
    document.querySelector('.modal .close').addEventListener('click', closeModal);
};

// Authentication handlers
const handleLogin = () => {
    const enteredPassword = document.getElementById('enterPassword').value;
    const storedPassword = localStorage.getItem('appPassword');

    if (enteredPassword === storedPassword) {
        showFileSection();
    } else {
        showError('Incorrect password. Please try again.');
    }
};

const handlePasswordSet = () => {
    const password = document.getElementById('setPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!password || !confirmPassword) {
        showError('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match.');
        return;
    }

    localStorage.setItem('appPassword', password);
    showSuccess('Password set successfully!');
    showFileSection();
};

// File management handlers
const handleFileUpload = async (event) => {
    const newFiles = Array.from(event.target.files);
    const currentStorage = calculateCurrentStorage();

    // Check storage limit
    const newStorage = newFiles.reduce((acc, file) => acc + file.size, currentStorage);
    if (newStorage > MAX_STORAGE) {
        showError('Storage limit exceeded. Please free up some space.');
        return;
    }

    // Process files
    for (const file of newFiles) {
        const fileData = {
            id: generateUniqueId(),
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: new Date(file.lastModified),
            url: await createFileURL(file)
        };
        files.push(fileData);
    }

    saveFiles();
    renderFiles();
    updateStorageInfo();
    showSuccess('Files uploaded successfully!');
};

const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    renderFiles(filteredFiles);
};

const handleNavigation = (section) => {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Handle section display logic here
    if (section === 'settings') {
        showSettingsSection();
    } else {
        showFileSection();
    }
};

// View management
const switchView = (view) => {
    currentView = view;
    document.getElementById('gridView').classList.toggle('active', view === 'grid');
    document.getElementById('listView').classList.toggle('active', view === 'list');
    document.getElementById('filesList').className = `files-${view}`;
    renderFiles();
};

const renderFiles = (filesToRender = files) => {
    const filesContainer = document.getElementById('filesList');
    filesContainer.innerHTML = '';

    filesToRender.forEach(file => {
        const fileElement = createFileElement(file);
        filesContainer.appendChild(fileElement);
    });
};

const createFileElement = (file) => {
    const element = document.createElement('div');
    element.className = 'file-card';
    element.onclick = () => showFileDetails(file);

    const icon = getFileIcon(file.type);
    
    element.innerHTML = `
        <div class="file-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="file-name">${file.name}</div>
        <div class="file-info">
            ${formatBytes(file.size)} • ${formatDate(file.lastModified)}
        </div>
    `;

    return element;
};

// Storage management
const calculateCurrentStorage = () => {
    return files.reduce((total, file) => total + file.size, 0);
};

const updateStorageInfo = () => {
    const currentStorage = calculateCurrentStorage();
    const usedStorage = formatBytes(currentStorage);
    const totalStorage = formatBytes(MAX_STORAGE);
    const percentageUsed = (currentStorage / MAX_STORAGE) * 100;

    document.getElementById('storageAmount').textContent = `${usedStorage} / ${totalStorage}`;
    document.querySelector('.storage-fill').style.width = `${percentageUsed}%`;
};

// File operations
const createFileURL = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
};

const getFileIcon = (fileType) => {
    if (fileType.includes('image')) return 'fa-image';
    if (fileType.includes('video')) return 'fa-video';
    if (fileType.includes('audio')) return 'fa-music';
    if (fileType.includes('pdf')) return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    if (fileType.includes('excel')) return 'fa-file-excel';
    return 'fa-file';
};

// UI helpers
const showSection = (sectionId) => {
    document.getElementById(sectionId).style.display = 'block';
};

const hideSection = (sectionId) => {
    document.getElementById(sectionId).style.display = 'none';
};

const showFileSection = () => {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('fileSection').style.display = 'block';
    loadFiles();
    renderFiles();
};

const showFileDetails = (file) => {
    const modal = document.getElementById('fileModal');
    const details = document.getElementById('fileDetails');
    
    details.innerHTML = `
        <div class="file-detail-content">
            <div class="file-icon"><i class="fas ${getFileIcon(file.type)} fa-3x"></i></div>
            <h4>${file.name}</h4>
            <p>Size: ${formatBytes(file.size)}</p>
            <p>Type: ${file.type || 'Unknown'}</p>
            <p>Modified: ${formatDate(file.lastModified)}</p>
            <div class="file-actions">
                <a href="${file.url}" download="${file.name}" class="btn-primary">
                    <i class="fas fa-download"></i> Download
                </a>
                <button onclick="deleteFile('${file.id}')" class="btn-danger">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
};

const closeModal = () => {
    document.getElementById('fileModal').style.display = 'none';
};

// Storage helpers
const saveFiles = () => {
    localStorage.setItem('files', JSON.stringify(files));
};

const loadFiles = () => {
    const storedFiles = localStorage.getItem('files');
    files = storedFiles ? JSON.parse(storedFiles) : [];
};

const deleteFile = (fileId) => {
    files = files.filter(file => file.id !== fileId);
    saveFiles();
    renderFiles();
    updateStorageInfo();
    closeModal();
    showSuccess('File deleted successfully!');
};

// Utility functions
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const showError = (message) => {
    // Implement your error notification system here
    alert(message);
};

const showSuccess = (message) => {
    // Implement your success notification system here
    alert(message);
};