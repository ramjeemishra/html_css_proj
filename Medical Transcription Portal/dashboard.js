const sampleFiles = [
  { name: 'consult_cardio_0312.wav', size: '28.4 MB', duration: '14:32', type: 'Urgent', status: 'processing', progress: 68 },
  { name: 'discharge_notes_neuro.mp3', size: '12.1 MB', duration: '06:18', type: 'Standard', status: 'complete', progress: 100 },
  { name: 'op_report_ortho_0311.wav', size: '41.2 MB', duration: '21:05', type: 'Standard', status: 'processing', progress: 32 },
  { name: 'patient_intake_endo.m4a', size: '8.6 MB', duration: '04:47', type: 'Urgent', status: 'uploaded', progress: 10 },
  { name: 'radiology_notes_0310.wav', size: '19.8 MB', duration: '10:15', type: 'Standard', status: 'complete', progress: 100 },
];

function statusBadge(status) {
  const map = {
    processing: ['badge-processing', '⏳ Processing'],
    complete: ['badge-complete', '✅ Complete'],
    uploaded: ['badge-uploaded', '📁 Uploaded'],
  };
  const [cls, label] = map[status] || ['badge-uploaded', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function typeBadge(type) {
  return type === 'Urgent'
    ? `<span class="badge badge-urgent">⚡ Urgent</span>`
    : `<span class="badge badge-standard">Standard</span>`;
}

const tbody = document.getElementById('fileTableBody');
sampleFiles.forEach(f => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><div class="file-name">${f.name}</div><div class="file-size">${f.size}</div></td>
    <td>${f.duration} min</td>
    <td>${typeBadge(f.type)}</td>
    <td>${statusBadge(f.status)}</td>
    <td>
      <div class="progress-bar-wrap">
        <div class="progress-bar" style="width:${f.progress}%"></div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:3px;">${f.progress}%</div>
    </td>
    <td><button class="action-btn">${f.status === 'complete' ? 'Download' : 'View'}</button></td>
  `;
  tbody.appendChild(tr);
});

const dropZone = document.getElementById('quickDrop');
const fileInput = document.getElementById('fileInput');
const progressList = document.getElementById('uploadProgressList');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => handleFiles(fileInput.files));

function handleFiles(files) {
  Array.from(files).forEach(file => {
    const allowed = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/ogg', 'audio/flac', 'audio/x-m4a'];
    const isAudio = allowed.includes(file.type) || file.name.match(/\.(mp3|wav|m4a|ogg|flac)$/i);
    if (!isAudio) { alert('Please upload a valid audio file (MP3, WAV, M4A, OGG, FLAC).'); return; }
    if (file.size > 500 * 1024 * 1024) { alert('File too large. Max size is 500MB.'); return; }
    simulateUpload(file);
  });
}

function simulateUpload(file) {
  const item = document.createElement('div');
  item.className = 'upload-item';
  item.innerHTML = `
    <div class="upload-item-icon">🎙️</div>
    <div class="upload-item-info">
      <div class="upload-item-name">${file.name}</div>
      <div class="upload-item-sub">${(file.size / 1024 / 1024).toFixed(1)} MB · Uploading...</div>
      <div class="upload-item-bar"><div class="upload-item-fill" style="width:0%"></div></div>
    </div>
  `;
  progressList.prepend(item);
  let pct = 0;
  const fill = item.querySelector('.upload-item-fill');
  const sub = item.querySelector('.upload-item-sub');
  const interval = setInterval(() => {
    pct += Math.random() * 15;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      sub.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB · ✅ Uploaded`;
    } else {
      sub.textContent = `${(file.size / 1024 / 1024).toFixed(1)} MB · Uploading ${Math.round(pct)}%...`;
    }
    fill.style.width = pct + '%';
  }, 300);
}