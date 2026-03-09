function calcEstimate() {
  const dur = parseFloat(document.getElementById('calcDuration').value) || 0;
  const type = document.getElementById('calcType').value;
  const baseRate = parseFloat(document.getElementById('calcVolume').value);
  const multiplier = type === 'urgent' ? 2 : 1;
  const rate = baseRate * multiplier;
  const total = (dur * rate).toFixed(2);
  const words = Math.round(dur * 150);

  document.getElementById('calcResult').textContent = dur ? `$${total}` : '$0.00';
  document.getElementById('calcBreakdown').innerHTML = dur
    ? `${dur} min × $${rate.toFixed(2)}/min${multiplier > 1 ? ` (2× urgent)` : ''}<br>~${words.toLocaleString()} estimated words`
    : 'Enter duration to see estimate';
}