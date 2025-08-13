import './style.css'
import { getHealth, listAppointments, createAppointment } from './api.js'

const $ = (s) => document.querySelector(s)
const el = {
  app: $('#app')
}

el.app.innerHTML = `
  <div class="container">
    <header class="header">
      <div>
        <h1 class="title">Demo CI/CD – Citas 🏥</h1>
        <p class="subtitle">Frontend (Vite) + Backend (Spring Boot)</p>
      </div>
      <div class="row">
        <div id="statusBadge" class="badge wait"><span class="dot"></span><span>Verificando…</span></div>
        <button id="retry" class="btn secondary">Reintentar</button>
      </div>
    </header>

    <div class="grid">
      <section class="card">
        <h3 style="margin-top:0">Citas existentes</h3>
        <ul id="list" class="list"></ul>
      </section>

      <section class="card">
        <h3 style="margin-top:0">Nueva cita</h3>
        <form id="form">
          <label>Paciente</label>
          <input id="patient" class="input" placeholder="Ana López" required />
          <br/><br/>
          <label>Fecha/hora (ISO-8601)</label>
          <input id="date" class="input" placeholder="2025-12-01T09:00" required />
          <br/><br/>
          <label>Motivo (opcional)</label>
          <input id="reason" class="input" placeholder="Chequeo" />
          <br/><br/>
          <div class="row">
            <button type="submit" class="btn" id="submitBtn">Crear</button>
            <button type="button" class="btn secondary" id="clearBtn">Limpiar</button>
          </div>
        </form>
      </section>
    </div>
  </div>
  <div id="toast" class="toast">Guardado</div>
`

const statusBadge = $('#statusBadge')
const retryBtn = $('#retry')
const listEl = $('#list')
const form = $('#form')
const patient = $('#patient')
const date = $('#date')
const reason = $('#reason')
const submitBtn = $('#submitBtn')
const clearBtn = $('#clearBtn')
const toast = $('#toast')

function showToast(msg='Hecho'){
  toast.textContent = msg
  toast.classList.add('show')
  setTimeout(()=> toast.classList.remove('show'), 1600)
}

function setStatus(kind, text){
  statusBadge.className = `badge ${kind}`
  statusBadge.querySelector('span:last-child').textContent = text
}

function isIsoDateTime(str){
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(str)
}

async function refreshHealth(){
  try{
    setStatus('wait','Verificando…')
    const h = await getHealth()
    setStatus(h === 'OK' ? 'ok' : 'warn', h === 'OK' ? 'Backend OK' : h)
  }catch(e){
    setStatus('err', 'Backend DOWN')
    console.error(e)
  }
}

async function refreshList(){
  listEl.innerHTML = `<li class="item">Cargando…</li>`
  try{
    const items = await listAppointments()
    if(!items.length){ listEl.innerHTML = `<li class="item" style="color:var(--muted)">(sin citas)</li>`; return }
    listEl.innerHTML = items.map(a => `
      <li class="item">
        <div class="id">#${a.id} — ${a.patient}</div>
        <div class="meta">${a.date}${a.reason ? ' · '+a.reason : ''}</div>
      </li>
    `).join('')
  }catch(e){
    listEl.innerHTML = `<li class="item" style="color:var(--bad)">Error: ${e}</li>`
  }
}

retryBtn.addEventListener('click', ()=>{ refreshHealth(); refreshList(); })
clearBtn.addEventListener('click', ()=> form.reset())

form.addEventListener('submit', async (ev)=>{
  ev.preventDefault()
  if(!isIsoDateTime(date.value.trim())){
    alert('Formato de fecha/hora inválido. Usa: YYYY-MM-DDTHH:MM (ej. 2025-12-01T09:00)')
    return
  }
  submitBtn.disabled = true
  try{
    await createAppointment({
      patient: patient.value.trim(),
      date: date.value.trim(),
      reason: reason.value.trim()
    })
    form.reset()
    showToast('Cita creada ✅')
    await refreshList()
  }catch(e){
    alert('No se pudo crear la cita: ' + e)
  }finally{
    submitBtn.disabled = false
  }
})

refreshHealth()
refreshList()
