const waveform = document.getElementById('waveform');
const bars = 40;
for (let i = 0; i < bars; i++) {
  const bar = document.createElement('div');
  bar.className = 'wave-bar';
  bar.style.animationDelay = (i * 0.04) + 's';
  bar.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
  bar.style.height = (6 + Math.random() * 30) + 'px';
  waveform.appendChild(bar);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fadeInUp 0.6s ease both';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .step-card').forEach(el => observer.observe(el));