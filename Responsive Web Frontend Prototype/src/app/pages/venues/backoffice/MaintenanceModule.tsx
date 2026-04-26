import { useState } from 'react';
import { motion } from 'motion/react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';

const tickets = [
  { id: 'm1', ref: 'MTN-2026-001', venue: 'Teatro Jorge Isaacs',        issue: 'Sistema de iluminación – falla en zona A', priority: 'alta',   status: 'abierto',     date: '2026-04-18', tech: 'Carlos Muñoz'    },
  { id: 'm2', ref: 'MTN-2026-002', venue: 'Sala Lucy Tejada',           issue: 'Aire acondicionado – mantenimiento preventivo', priority: 'normal', status: 'en_proceso',  date: '2026-04-16', tech: 'Pedro Salcedo'   },
  { id: 'm3', ref: 'MTN-2026-003', venue: 'Auditorio Mayor',            issue: 'Sillas fila 5 – deterioro visible',           priority: 'baja',   status: 'abierto',     date: '2026-04-15', tech: 'Sin asignar'     },
  { id: 'm4', ref: 'MTN-2026-004', venue: 'Salón Belalcázar',           issue: 'Pintura exterior – renovación anual',          priority: 'normal', status: 'cerrado',     date: '2026-03-30', tech: 'Carlos Muñoz'    },
];

const statusStyle: Record<string, { label: string; color: string; icon: any }> = {
  abierto:    { label: 'Abierto',     color: C.active,  icon: AlertTriangle },
  en_proceso: { label: 'En proceso',  color: C.gold,    icon: Clock         },
  cerrado:    { label: 'Cerrado',     color: '#4b7a30', icon: CheckCircle   },
};

const priorityColor: Record<string, string> = { alta: C.active, normal: C.gold, baja: C.muted };

export function MaintenanceModule() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? tickets : tickets.filter(t => t.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mantenimiento de Escenarios</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {tickets.filter(t => t.status !== 'cerrado').length} tickets abiertos
            </p>
          </div>
          <button onClick={() => toast.success('Nuevo ticket creado (demo)')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Ticket
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Abiertos',    value: tickets.filter(t => t.status === 'abierto').length,    color: C.active  },
          { label: 'En proceso',  value: tickets.filter(t => t.status === 'en_proceso').length, color: C.gold    },
          { label: 'Cerrados',    value: tickets.filter(t => t.status === 'cerrado').length,    color: '#4b7a30' },
          { label: 'Total',       value: tickets.length,                                         color: C.muted   },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
            <div style={{ height: 2, background: k.color, marginTop: 8, width: 24, borderRadius: 1 }} />
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[['all', 'Todos'], ['abierto', 'Abiertos'], ['en_proceso', 'En proceso'], ['cerrado', 'Cerrados']].map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              padding: '6px 14px', background: filter === v ? C.primary : C.surface,
              color: filter === v ? '#fff' : C.muted, border: `1px solid ${filter === v ? C.primary : C.border}`,
              fontSize: '0.75rem', fontWeight: filter === v ? 600 : 400, cursor: 'pointer', borderRadius: 2,
            }}>{l}</button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            {['Ticket / Escenario', 'Problema', 'Técnico', 'Prioridad', 'Estado'].map((h, i) => (
              <span key={i} style={{ flex: i === 0 || i === 1 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {filtered.map((t, i, arr) => {
            const ss = statusStyle[t.status] ?? statusStyle.abierto;
            const Icon = ss.icon;
            return (
              <div key={t.id}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', transition: 'background 0.15s', borderLeft: t.status !== 'cerrado' ? `3px solid ${ss.color}55` : '3px solid transparent' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                  <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Wrench style={{ width: 11, height: 11, color: C.primary }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{t.ref}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted }}>{t.venue}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 2 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{t.issue}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{t.tech}</p></div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: priorityColor[t.priority], border: `1px solid ${priorityColor[t.priority]}44`, padding: '2px 6px', borderRadius: 2 }}>
                      {t.priority === 'alta' ? 'Alta' : t.priority === 'normal' ? 'Normal' : 'Baja'}
                    </span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon style={{ width: 12, height: 12, color: ss.color }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ss.color }}>{ss.label}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
