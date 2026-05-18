import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardCheck, Download, Loader2, Calendar, User, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { programsService } from '../../services/programsService';
import { evaluationsService, Evaluation } from '../../services/evaluationsService';
import { downloadCsv } from '../../services/csvExport';

interface GroupedByProgram {
  programId: string;
  programName: string;
  programCategory: string;
  evaluations: Evaluation[];
  avg: number | null;
}

export const MyEvaluations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<GroupedByProgram[]>([]);
  const [overallAvg, setOverallAvg] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    programsService.getStudentId(user.id).then(sid => {
      if (!sid) { setLoading(false); return; }
      evaluationsService.getByStudent(sid)
        .then(evals => {
          const map = new Map<string, GroupedByProgram>();
          evals.forEach(e => {
            const key = e.programId;
            if (!map.has(key)) {
              map.set(key, {
                programId:       key,
                programName:     e.programName ?? 'Programa',
                programCategory: e.programCategory ?? '',
                evaluations:     [],
                avg:             null,
              });
            }
            map.get(key)!.evaluations.push(e);
          });

          // Calcular promedio por programa (solo notas no nulas)
          const list: GroupedByProgram[] = [];
          map.forEach(g => {
            const notas = g.evaluations.map(e => e.nota).filter((n): n is number => n !== null);
            g.avg = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null;
            list.push(g);
          });

          setGroups(list);

          // Promedio global (todas las notas)
          const allNotas = evals.map(e => e.nota).filter((n): n is number => n !== null);
          setOverallAvg(allNotas.length ? allNotas.reduce((a, b) => a + b, 0) / allNotas.length : null);
        })
        .catch(err => toast.error(err?.message ?? 'Error al cargar tus evaluaciones'))
        .finally(() => setLoading(false));
    });
  }, [user]);

  const totalEvaluations = groups.reduce((s, g) => s + g.evaluations.length, 0);

  const handleDownload = () => {
    const rows: (string | number)[][] = [];
    groups.forEach(g => {
      g.evaluations.forEach(e => {
        rows.push([
          e.date,
          g.programName,
          g.programCategory,
          e.nota === null ? '' : e.nota,
          e.observaciones ?? '',
          e.educatorName ?? '',
        ]);
      });
    });
    if (rows.length === 0) {
      toast.error('Aún no tienes evaluaciones para exportar');
      return;
    }
    const filename = `mis-notas-${(user?.name ?? 'estudiante').replace(/\s+/g, '_')}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename,
      ['Fecha', 'Programa', 'Categoría', 'Nota', 'Observaciones', 'Educador'],
      rows
    );
    toast.success('Reporte descargado');
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Estudiante</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mis Notas</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {loading
                ? 'Cargando...'
                : totalEvaluations === 0
                  ? 'Aún no tienes evaluaciones'
                  : `${totalEvaluations} evaluación(es) en ${groups.length} programa(s)`}
            </p>
          </div>
          {!loading && totalEvaluations > 0 && (
            <button onClick={handleDownload} type="button"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', background: C.primary, color: '#fff',
                fontWeight: 600, fontSize: '0.8rem', border: 'none',
                cursor: 'pointer', borderRadius: 2,
              }}>
              <Download style={{ width: 13, height: 13 }} /> Descargar reporte CSV
            </button>
          )}
        </motion.div>
      </div>

      {/* KPI strip */}
      {!loading && totalEvaluations > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
          {[
            { label: 'Promedio general',  value: overallAvg !== null ? overallAvg.toFixed(2) : '—', color: C.gold },
            { label: 'Evaluaciones',      value: totalEvaluations, color: C.primary },
            { label: 'Programas',         value: groups.length, color: C.active },
          ].map((k, i, arr) => (
            <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
            </div>
          ))}
        </motion.div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 40px' }}>
        {loading ? (
          <div style={{ padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: '0.82rem' }}>
            <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" /> Cargando evaluaciones...
          </div>
        ) : groups.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ padding: '60px 20px', textAlign: 'center', background: C.surface, border: `1px solid ${C.border}` }}>
            <ClipboardCheck style={{ width: 40, height: 40, color: C.border, margin: '0 auto 14px' }} />
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem', marginBottom: 6 }}>
              Aún no tienes notas registradas
            </p>
            <p style={{ fontSize: '0.78rem', color: C.muted, maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>
              Cuando tus educadores registren evaluaciones aparecerán aquí, agrupadas por programa con su histórico completo.
            </p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {groups.map((g, gi) => (
              <motion.div key={g.programId} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + gi * 0.05 }}
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.95rem' }}>{g.programName}</p>
                    {g.programCategory && <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 1 }}>{g.programCategory}</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.62rem', fontWeight: 600, color: C.subtle, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Promedio</p>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: g.avg !== null && g.avg >= 3 ? C.gold : C.active, fontSize: '1.2rem', lineHeight: 1 }}>
                      {g.avg !== null ? g.avg.toFixed(2) : '—'}
                    </p>
                  </div>
                </div>

                <div style={{ padding: '6px 0' }}>
                  {g.evaluations.map((e, ei, arr) => (
                    <div key={e.id}>
                      <div style={{ padding: '14px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                        <div style={{ width: 56, flexShrink: 0, textAlign: 'center' }}>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.4rem', color: e.nota !== null && e.nota >= 3 ? C.gold : e.nota !== null ? C.active : C.subtle, lineHeight: 1 }}>
                            {e.nota !== null ? e.nota.toFixed(1) : '—'}
                          </p>
                          <p style={{ fontSize: '0.6rem', color: C.subtle, marginTop: 4, letterSpacing: '0.06em' }}>NOTA</p>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: C.muted }}>
                              <Calendar style={{ width: 11, height: 11 }} /> {e.date || '—'}
                            </span>
                            {e.educatorName && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: C.muted }}>
                                <User style={{ width: 11, height: 11 }} /> {e.educatorName}
                              </span>
                            )}
                          </div>
                          {e.observaciones ? (
                            <p style={{ fontSize: '0.82rem', color: C.text, lineHeight: 1.5, display: 'flex', gap: 6 }}>
                              <FileText style={{ width: 12, height: 12, color: C.subtle, marginTop: 3, flexShrink: 0 }} />
                              <span>{e.observaciones}</span>
                            </p>
                          ) : (
                            <p style={{ fontSize: '0.75rem', color: C.subtle, fontStyle: 'italic' }}>Sin observaciones</p>
                          )}
                        </div>
                      </div>
                      {ei < arr.length - 1 && <div style={{ height: 1, background: C.border, margin: '0 20px' }} />}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
