function checkAgreement() {
  const allChecked = document.getElementById('agree1').checked &&
                     document.getElementById('agree2').checked &&
                     document.getElementById('agree3').checked;
  document.getElementById('signBtn').disabled = !allChecked;
}

function signAgreement() {
  const org = document.getElementById('orgName').value.trim();
  const sig = document.getElementById('sigName').value.trim();
  const email = document.getElementById('sigEmail').value.trim();
  if (!org || !sig || !email) {
    alert('Please fill in all required fields before signing.');
    return;
  }
  const refId = 'BAA-' + Date.now().toString(36).toUpperCase();
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('signRef').textContent = `Reference: ${refId} · Signed by ${sig} on ${date}`;
  document.getElementById('signSuccess').classList.add('visible');
  document.getElementById('signBtn').disabled = true;
  document.getElementById('signBtn').textContent = '✅ Agreement Signed';
  document.getElementById('signBtn').style.background = 'var(--success)';
}

function submitContact() {
  document.getElementById('contactFormContent').style.display = 'none';
  document.getElementById('contactSuccess').classList.add('visible');
}

document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
  el.addEventListener('focus', () => el.style.borderColor = 'var(--primary-light)');
  el.addEventListener('blur', () => el.style.borderColor = 'var(--border)');
});