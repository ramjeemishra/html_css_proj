const WORDS_PER_MIN = 150;
const STANDARD_RATE = 1.25;
const URGENT_RATE = 2.50;

const dropZone = document.getElementById('dropZone');
const audioFile = document.getElementById('audioFile');

dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('dragover'); processFile(e.dataTransfer.files[0]); });
audioFile.addEventListener('change', () => processFile(audioFile.files[0]));

function processFile(file) {
  if (!file) return;
  const allowed = /\.(mp3|wav|m4a|ogg|flac)$/i;
  const maxSize = 500 * 1024 * 1024;
  const errEl = document.getElementById('fileError');
  if (!allowed.test(file.name)) {
    errEl.classList.add('visible');
    errEl.textContent = '⚠️ Invalid file type. Please upload MP3, WAV, M4A, OGG, or FLAC.';
    return;
  }
  if (file.size > maxSize) {
    errEl.classList.add('visible');
    errEl.textContent = '⚠️ File too large. Maximum size is 500MB.';
    return;
  }
  errEl.classList.remove('visible');
  const preview = document.getElementById('filePreview');
  document.getElementById('prevName').textContent = file.name;
  document.getElementById('prevMeta').textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type || 'audio'}`;
  preview.classList.add('visible');
  dropZone.classList.add('has-file');
  document.getElementById('dropTitle').textContent = '✅ File selected';
  document.getElementById('dropSub').textContent = 'Click or drop to replace';
  updateEstimate();
  updateSubmitState();
}

function clearFile() {
  document.getElementById('filePreview').classList.remove('visible');
  dropZone.classList.remove('has-file');
  document.getElementById('dropTitle').textContent = 'Drag & drop your audio file here';
  document.getElementById('dropSub').textContent = 'or click to browse from your computer';
  audioFile.value = '';
  updateSubmitState();
}

function updateEstimate() {
  const durInput = document.getElementById('audioDuration');
  const duration = parseFloat(durInput.value) || 0;
  const isUrgent = document.querySelector('input[name="turnaround"]:checked').value === 'urgent';
  const rate = isUrgent ? URGENT_RATE : STANDARD_RATE;
  const multiplier = isUrgent ? 2 : 1;
  const words = Math.round(duration * WORDS_PER_MIN);
  const total = (duration * rate).toFixed(2);

  document.getElementById('estDuration').textContent = duration ? `${duration} min` : '— min';
  document.getElementById('estWords').textContent = duration ? `~${words.toLocaleString()} words` : '—';
  document.getElementById('estRate').textContent = `$${rate.toFixed(2)} / min`;
  document.getElementById('estTurnaround').textContent = isUrgent ? 'Urgent (4hr)' : 'Standard (24hr)';
  document.getElementById('estMultiplier').innerHTML = multiplier === 2 ? `2× <span class="multiplier-badge">Urgent</span>` : '1×';
  document.getElementById('estTotal').textContent = duration ? `$${total}` : '$0.00';
}

function updateSubmitState() {
  const hasFile = document.getElementById('filePreview').classList.contains('visible');
  const agreed = document.getElementById('agreeCheck').checked;
  document.getElementById('submitBtn').disabled = !(hasFile && agreed);
}

function submitForm() {
  const durInput = document.getElementById('audioDuration');
  if (!durInput.value || parseFloat(durInput.value) <= 0) {
    durInput.focus();
    durInput.style.borderColor = 'var(--danger)';
    setTimeout(() => durInput.style.borderColor = '', 2000);
    return;
  }
  const ref = 'REF-MT-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('refNumber').textContent = ref;
  document.getElementById('successOverlay').classList.add('visible');
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('visible');
  clearFile();
  document.getElementById('audioDuration').value = '';
  document.getElementById('agreeCheck').checked = false;
  document.getElementById('submitBtn').disabled = true;
  updateEstimate();
}