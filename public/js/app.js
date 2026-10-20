(function () {
  var f = document.getElementById('f');
  if (!f) return;
  var status = document.getElementById('status');
  var btn = f.querySelector('button[type=submit]');
  var alt = document.getElementById('alt');
  function data() { var o = {}; new FormData(f).forEach(function (v, k) { o[k] = v; }); return o; }
  function mailto(d) {
    return 'mailto:' + f.dataset.email + '?subject=' + encodeURIComponent(d.perihal || '') +
      '&body=' + encodeURIComponent('Halo Richo,\n\n' + (d.pesan || '') + '\n\nSalam,\n' + (d.nama || ''));
  }
  f.addEventListener('input', function () { alt.href = mailto(data()); });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = data();
    if (!d.nama.trim() || !d.perihal.trim() || d.pesan.trim().length < 10) {
      status.style.color = ''; status.textContent = 'Lengkapi nama, perihal, dan pesan (minimal 10 karakter).'; return;
    }
    btn.disabled = true; status.style.color = ''; status.textContent = 'Mengirim...';
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Gagal mengirim.'); }); })
      .then(function () { status.style.color = 'var(--ok)'; status.textContent = 'Terima kasih, pesan Anda sudah terkirim.'; f.reset(); })
      .catch(function (err) { status.style.color = ''; status.textContent = err.message + ' Silakan kirim lewat email.'; })
      .then(function () { btn.disabled = false; });
  });
})();
