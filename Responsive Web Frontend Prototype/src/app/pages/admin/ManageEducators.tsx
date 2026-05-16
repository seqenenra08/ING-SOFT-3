import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, UserCog, BookOpen, Users, Mail, Phone, ArrowRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { educatorsData, programsData } from '../../data/mockData';

const specialtyColor: Record<string, string> = {
  'Danza Clásica': C.primary,
  'Música':        C.gold,
  'Teatro':        '#4b7a30',
  'Danza':         C.primary,
  'Artes Visuales':'#6b4040',
};

export const ManageEducators = () => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  const filtered = (educatorsData as any[]).filter((e: any) => {
    const fullName = `${e.nombre ?? ''} ${e.apellido ?? ''}`.toLowerCase();
    return fullName.includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase()) ||
      e.especialidad?.toLowerCase().includes(search.toLowerCase());
  });

  const getPrograms = (ids: string[]) =>
    ids.map(id => (programsData as any[]).find((p: any) => p.id === id)?.name).filter(Boolean);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Educadores</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{(educatorsData as any[]).length} educadores registrados</p>
          </div>
          <button onClick={() => toast.info('Función disponible con backend conectado')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Educador
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Total educadores', value: (educatorsData as any[]).length, color: C.primary },
          { label: 'Total programas activos', value: (programsData as any[]).length, color: C.gold },
          { label: 'Total estudiantes', value: (educatorsData as any[]).reduce((a, e: any) => a + (e.estudiantes ?? 0), 0), color: '#4b7a30' },
          { label: 'Especialidades', value: new Set((educatorsData as any[]).map((e: any) => e.especialidad)).size, color: C.active },
        ].map((k, i, arr) => (
          <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 28px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontSize: '0.65rem', color: C.subtle, marginTop: 3 }}>{k.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o especialidad..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle }}>{filtered.length} resultado(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}` }}>
            {/* Header row */}
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Educador</span>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Especialidad</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Grupos</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 90, textAlign: 'center' }}>Estudiantes</span>
              <span style={{ width: 80 }} />
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>
                No se encontraron educadores con esa búsqueda.
              </div>
            )}

            {filtered.map((e: any, i: number, arr: any[]) => {
              const color = specialtyColor[e.especialidad] ?? C.muted;
              return (
                <div key={e.id}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={el => (el.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={el => (el.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    onClick={() => setSelected(selected?.id === e.id ? null : e)}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 30, height: 30, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <UserCog style={{ width: 13, height: 13, color }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{e.nombre} {e.apellido}</p>
                        <p style={{ fontSize: '0.68rem', color: C.subtle }}>{e.email}</p>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ padding: '3px 10px', background: `${color}15`, border: `1px solid ${color}33`, fontSize: '0.68rem', color, fontWeight: 600, borderRadius: 2 }}>
                        {e.especialidad}
                      </span>
                    </div>
                    <div style={{ width: 80, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>{e.grupos ?? 0}</p>
                    </div>
                    <div style={{ width: 90, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>{e.estudiantes ?? 0}</p>
                    </div>
                    <div style={{ width: 80, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={ev => { ev.stopPropagation(); setSelected(selected?.id === e.id ? null : e); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        Ver <ArrowRight style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border, margin: '0 20px' }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              style={{ width: 280, flexShrink: 0, background: '#fff', border: `1px solid ${C.border}` }}>
              <div style={{ padding: '14px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL EDUCADOR</span>
              </div>
              <div style={{ padding: 16 }}>
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 2, background: `${specialtyColor[selected.especialidad] ?? C.primary}15`, border: `1px solid ${specialtyColor[selected.especialidad] ?? C.primary}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCog style={{ width: 20, height: 20, color: specialtyColor[selected.especialidad] ?? C.primary }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{selected.nombre} {selected.apellido}</p>
                    <p style={{ fontSize: '0.68rem', color: C.active, fontWeight: 600 }}>{selected.especialidad}</p>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Mail style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                    <p style={{ fontSize: '0.72rem', color: C.muted }}>{selected.email}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Phone style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                    <p style={{ fontSize: '0.72rem', color: C.muted }}>{selected.telefono}</p>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <div style={{ flex: 1, padding: '10px 12px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.primary }}>{selected.grupos ?? 0}</p>
                    <p style={{ fontSize: '0.62rem', color: C.subtle, marginTop: 2 }}>Grupos</p>
                  </div>
                  <div style={{ flex: 1, padding: '10px 12px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.primary }}>{selected.estudiantes ?? 0}</p>
                    <p style={{ fontSize: '0.62rem', color: C.subtle, marginTop: 2 }}>Estudiantes</p>
                  </div>
                </div>

                {/* Programs */}
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookOpen style={{ width: 11, height: 11 }} /> Programas asignados
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {getPrograms(selected.programas ?? []).map((p: string) => (
                      <div key={p} style={{ padding: '5px 10px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.72rem', color: C.primary, borderRadius: 2 }}>
                        {p}
                      </div>
                    ))}
                    {(!selected.programas || selected.programas.length === 0) && (
                      <p style={{ fontSize: '0.72rem', color: C.subtle }}>Sin programas asignados</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button onClick={() => toast.info('Función disponible con backend conectado')}
                    style={{ padding: '8px 12px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                    Editar Perfil
                  </button>
                  <button onClick={() => { setSelected(null); }}
                    style={{ padding: '8px 12px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
