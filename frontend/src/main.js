const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, ''); // p.ej. https://tu-backend.onrender.com

const root = document.getElementById('app');
root.innerHTML = `
  <main style="font-family: system-ui, Arial; padding: 24px; max-width: 720px;">
    <h1>Frontend listo ✅</h1>
    <p>Este frontend consulta el backend en <code>/health</code>.</p>

    <div id="statusBox" style="margin-top: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
      <strong>Backend status:</strong> <span id="status">checking…</span>
      <pre id="error" style="white-space: pre-wrap; color: #b00; margin-top: 8px; display:none;"></pre>
      <button id="retry" style="margin-top: 12px; padding: 6px 12px;">Reintentar</button>
    </div>

    <p style="margin-top: 24px; font-size: 14px; color: #666;">
      Local: el frontend llama a <code>/api/health</code> vía proxy de Vite.<br/>
      Producción: define <code>VITE_API_BASE</code> con la URL de Render (p.ej. https://tu-be.onrender.com).
    </p>
  </main>
`;

async function checkHealth() {
  const statusEl = document.getElementById('status');
  const errorEl = document.getElementById('error');
  statusEl.textContent = 'checking…';
  errorEl.style.display = 'none';
  errorEl.textContent = '';

  try {
    const url = API_BASE ? `${API_BASE}/health` : '/api/health';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = (await res.text()).trim();
    statusEl.textContent = (text === 'OK') ? '🟢 OK' : `⚠️ ${text}`;
  } catch (e) {
    statusEl.textContent = '🔴 DOWN';
    errorEl.textContent = String(e);
    errorEl.style.display = 'block';
  }
}

document.getElementById('retry').addEventListener('click', checkHealth);
checkHealth();
