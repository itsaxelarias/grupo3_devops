const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '')

export const url = (path) => (BASE ? `${BASE}${path}` : `/api${path}`)

export async function getHealth(){
  const r = await fetch(url('/health'))
  if(!r.ok) throw new Error(`HTTP ${r.status}`)
  return (await r.text()).trim()
}

export async function listAppointments(){
  const r = await fetch(url('/api/appointments'))
  if(!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}

export async function createAppointment(payload){
  const r = await fetch(url('/api/appointments'), {
    method:'POST',
    headers:{ 'Content-Type':'application/json' },
    body: JSON.stringify(payload)
  })
  if(!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json()
}
