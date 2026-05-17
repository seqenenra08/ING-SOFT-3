import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, CheckCircle } from 'lucide-react';
import { venuesService } from '../../services/venuesService';
import { C } from '../../theme';

const statusTimeline: Record<string, { steps: string[]; current: number }> = {
  enviada:     { steps: ['Enviada', 'En revisión', 'Aprobada', 'Contrato', 'Pago', 'Confirmada'], current: 0 },
  en_revision: { steps: ['Enviada', 'En revisión', 'Aprobada', 'Contrato', 'Pago', 'Confirmada'], current: 1 },
  aprobada:    { steps: ['Enviada', 'En revisión', 'Aprobada', 'Contrato', 'Pago', 'Confirmada'], current: 2 },
  pagada:      { steps: ['Enviada', 'En revisión', 'Aprobada', 'Contrato', 'Pago', 'Confirmada'], current: 4 },
};

const statusStyle: Record<string, { label: string; color: string }> = {
  pagada:      { label: 'Pagada',       color: '#4b7a30' },
  en_revision: { label: 'En revisión',  color: C.gold    },
  enviada:     { label: 'Enviada',      color: C.primary },
  aprobada:    { label: 'Aprobada',     color: '#4b7a30' },
};

export function RequestTracking() {
  const [query, setQuery] = useState('');
  const [found, setFound] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const requests = await venuesService.getRequests();
    const result = requests.find(r =>
      r.requestNumber?.toLowerCase() === query.toLowerCase() ||
      r.clientEmail?.toLowerCase() === query.toLowerCase()
    );
    setFound(result ?? null);
    setSearched(true);
  };

  const timeline = found ? statusTimeline[found.status] ?? statusTimeline.enviada : null;
  const ss = found ? (statusStyle[found.status] ?? statusStyle.enviada) : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Portal de Escenarios</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Seguimiento de Solicitud</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Ingresa el número de solicitud o tu correo para ver el estado</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 32px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '24px 28px', marginBottom: 20 }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginBottom: 14 }}>Buscar solicitud</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="SGE-2026-001 o tu@email.com"
                style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.primary}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <button onClick={handleSearch} style={{ padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
              Buscar
            </button>
          </div>
          <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 8 }}>
            Prueba con: SGE-2026-001, SGE-2026-002 o SGE-2026-004
          </p>
        </motion.div>

        {searched && !found && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ background: C.tint, border: `1px solid ${C.active}33`, borderLeft: `3px solid ${C.active}`, padding: '16px 20px' }}>
            <p style={{ fontSize: '0.82rem', color: C.active, fontWeight: 600 }}>No se encontró la solicitud</p>
            <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 4 }}>Verifica el número de solicitud o correo ingresado.</p>
          </motion.div>
        )}

        {found && ss && timeline && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Summary */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 16 }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>{found.requestNumber}</span>
                </div>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '3px 8px', borderRadius: 2 }}>{ss.label}</span>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Cliente',   value: found.clientName  },
                  { label: 'Escenario', value: found.venueName   },
                  { label: 'Fecha',     value: found.startDate   },
                  { label: 'Uso',       value: found.eventType ?? 'Evento cultural' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.72rem', color: C.subtle }}>{item.label}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '20px 24px' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.subtle, marginBottom: 16 }}>Estado del proceso</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {timeline.steps.map((step, i) => {
                  const done = i <= timeline.current;
                  const active = i === timeline.current;
                  return (
                    <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                      {/* Connector line */}
                      {i > 0 && (
                        <div style={{ position: 'absolute', left: 0, top: 11, width: '50%', height: 2, background: i <= timeline.current ? C.primary : C.border }} />
                      )}
                      {i < timeline.steps.length - 1 && (
                        <div style={{ position: 'absolute', right: 0, top: 11, width: '50%', height: 2, background: i < timeline.current ? C.primary : C.border }} />
                      )}
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%', zIndex: 1,
                        background: done ? C.primary : C.surfaceAlt,
                        border: `2px solid ${done ? C.primary : C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: active ? `0 0 0 3px ${C.primary}33` : 'none',
                      }}>
                        {done && <CheckCircle style={{ width: 12, height: 12, color: '#fff' }} />}
                      </div>
                      <p style={{ fontSize: '0.6rem', color: done ? C.primary : C.subtle, fontWeight: done ? 600 : 400, marginTop: 5, textAlign: 'center' }}>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
