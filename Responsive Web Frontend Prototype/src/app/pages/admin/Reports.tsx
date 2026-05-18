import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, BarChart3, Users, TrendingUp, BookOpen, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { C } from '../../theme';
import { studentsService } from '../../services/studentsService';
import { programsService, Program } from '../../services/programsService';
import { educatorsService, Educator } from '../../services/educatorsService';
import { evaluationsService } from '../../services/evaluationsService';
import { downloadCsv } from '../../services/csvExport';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.dark, border: `1px solid #2a1212`, padding: '8px 12px', fontSize: '0.72rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</p>
        {payload.map((p: any, i: number) => <p key={i} style={{ color: '#fff' }}>{p.dataKey}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

const reports = [
  { name: 'Reporte de Inscripciones',  desc: 'Detalle de todos los estudiantes inscritos por programa', icon: Users },
  { name: 'Reporte de Programas',      desc: 'Estado y estadísticas de todos los programas del centro', icon: BookOpen },
  { name: 'Reporte de Educadores',     desc: 'Listado de educadores y sus programas asignados',         icon: BarChart3 },
  { name: 'Reporte de Evaluaciones',   desc: 'Histórico completo de notas y observaciones (CSV)',       icon: ClipboardCheck },
  { name: 'Reporte General',           desc: 'Resumen ejecutivo del centro cultural',                   icon: TrendingUp },
];

export const Reports = () => {
  const [monthlyData, setMonthlyData] = useState<{ month: string; students: number }[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      programsService.getMonthlyEnrollmentCounts(),
      programsService.getAll(),
      studentsService.getAll(),
      educatorsService.getAll(),
    ]).then(([monthly, progs, studs, edus]) => {
      setMonthlyData(monthly);
      setPrograms(progs);
      setStudents(studs);
      setEducators(edus);
    }).finally(() => setLoading(false));
  }, []);

  async function downloadReport(reportName: string) {
    // Reporte de evaluaciones: CSV directo desde Supabase
    if (reportName.includes('Evaluaciones')) {
      try {
        const evals = await evaluationsService.getAll();
        if (evals.length === 0) {
          toast.error('Aún no hay evaluaciones registradas en el sistema');
          return;
        }
        const rows = evals.map(e => [
          e.date,
          e.studentName ?? '',
          e.programName ?? '',
          e.programCategory ?? '',
          e.nota === null ? '' : e.nota,
          e.observaciones ?? '',
          e.educatorName ?? '',
        ]);
        downloadCsv(
          `evaluaciones-${new Date().toISOString().slice(0, 10)}.csv`,
          ['Fecha', 'Estudiante', 'Programa', 'Categoría', 'Nota', 'Observaciones', 'Educador'],
          rows
        );
        toast.success(`Reporte de ${evals.length} evaluación(es) descargado`);
      } catch (err: any) {
        toast.error(err?.message ?? 'Error al generar el reporte');
      }
      return;
    }

    let content = '';
    if (reportName.includes('Inscripciones')) {
      const rows = students.map((s: any) =>
        `<tr><td>${s.nombre ?? ''} ${s.apellido ?? ''}</td><td>${s.email ?? ''}</td><td>${s.documento ?? ''}</td><td>${s.estado ?? 'activo'}</td></tr>`
      ).join('');
      content = `<table border="1" style="border-collapse:collapse;width:100%">
        <tr><th>Nombre</th><th>Email</th><th>Documento</th><th>Estado</th></tr>${rows}</table>`;
    } else if (reportName.includes('Programas')) {
      const rows = programs.map((p: any) =>
        `<tr><td>${p.name}</td><td>${p.category}</td><td>${p.educator || '—'}</td><td>${p.enrolled ?? 0}/${p.capacity ?? 0}</td></tr>`
      ).join('');
      content = `<table border="1" style="border-collapse:collapse;width:100%">
        <tr><th>Programa</th><th>Categoría</th><th>Educador</th><th>Inscripciones</th></tr>${rows}</table>`;
    } else if (reportName.includes('Educadores')) {
      const rows = educators.map((e: any) =>
        `<tr><td>${e.nombre ?? ''} ${e.apellido ?? ''}</td><td>${e.email ?? ''}</td><td>${e.especialidad ?? ''}</td><td>${e.grupos ?? 0}</td><td>${e.estudiantes ?? 0}</td></tr>`
      ).join('');
      content = `<table border="1" style="border-collapse:collapse;width:100%">
        <tr><th>Nombre</th><th>Email</th><th>Especialidad</th><th>Programas</th><th>Estudiantes</th></tr>${rows}</table>`;
    } else {
      const totalEnrolled = programs.reduce((s, p) => s + (p.enrolled ?? 0), 0);
      content = `
        <h2>Resumen General</h2>
        <table border="1" style="border-collapse:collapse">
          <tr><td><b>Total estudiantes registrados</b></td><td>${students.length}</td></tr>
          <tr><td><b>Total educadores</b></td><td>${educators.length}</td></tr>
          <tr><td><b>Total programas</b></td><td>${programs.length}</td></tr>
          <tr><td><b>Total inscripciones activas</b></td><td>${totalEnrolled}</td></tr>
        </table>`;
    }
    const html = `<!DOCTYPE html><html><head><title>${reportName}</title>
      <style>body{font-family:Arial;padding:40px} h1,h2{color:#8b1a1a} th,td{padding:8px;text-align:left} th{background:#f5f1ee}</style>
      </head><body>
      <h1>${reportName}</h1>
      <p style="color:#7a5050">Centro Cultural Lucy Tejada &mdash; Generado: ${new Date().toLocaleDateString('es-CO')}</p>
      <hr style="margin:16px 0"/>
      ${content}
      </body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Centro de Reportes</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Exporta y visualiza datos del centro cultural</p>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Estudiantes',    value: loading ? '...' : students.length },
          { label: 'Programas',      value: loading ? '...' : programs.length },
          { label: 'Educadores',     value: loading ? '...' : educators.length },
          { label: 'Inscripciones',  value: loading ? '...' : programs.reduce((s, p) => s + (p.enrolled ?? 0), 0) },
        ].map((k, i, arr) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Monthly enrollment chart */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>INSCRIPCIONES POR MES</span>
            </div>
            <div style={{ padding: 20 }}>
              {loading ? (
                <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '0.82rem' }}>Cargando...</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                    <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: `${C.primary}08` }} />
                    <Bar dataKey="students" fill={C.primary} radius={[2, 2, 0, 0]} name="Inscripciones" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* Programs table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ESTADO DE PROGRAMAS</span>
            </div>
            <div style={{ padding: '8px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Programa</span>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoría</span>
              <span style={{ width: 120, textAlign: 'center', fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inscripciones</span>
            </div>
            {loading ? (
              <div style={{ padding: '24px 20px', color: C.muted, fontSize: '0.82rem' }}>Cargando...</div>
            ) : programs.map((p, i, arr) => {
              const pct = p.capacity ? Math.round((p.enrolled / p.capacity) * 100) : 0;
              return (
                <div key={p.id}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px' }}>
                    <div style={{ flex: 2 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{p.name}</p>
                      <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 1 }}>{p.educator || 'Sin educador'}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.72rem', color: C.muted }}>{p.category}</span>
                    </div>
                    <div style={{ width: 120, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: pct >= 80 ? C.active : C.primary, minWidth: 40 }}>
                        {p.enrolled}/{p.capacity}
                      </span>
                      <div style={{ flex: 1, height: 3, background: C.border, borderRadius: 1 }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: pct >= 80 ? C.active : C.primary, borderRadius: 1 }} />
                      </div>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border, margin: '0 20px' }} />}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Reports sidebar */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Exportar Reportes</span>
            </div>
            {reports.map((r, i, arr) => {
              const Icon = r.icon;
              return (
                <div key={r.name}>
                  <div
                    onClick={() => !loading && downloadReport(r.name)}
                    style={{ display: 'flex', gap: 12, padding: '14px 18px', cursor: loading ? 'default' : 'pointer', transition: 'background 0.15s', opacity: loading ? 0.5 : 1 }}
                    onMouseEnter={e => !loading && ((e.currentTarget as HTMLDivElement).style.background = C.tint)}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <div style={{ width: 30, height: 30, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                      <Icon style={{ width: 13, height: 13, color: C.primary }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, marginBottom: 2 }}>{r.name}</p>
                      <p style={{ fontSize: '0.68rem', color: C.subtle, lineHeight: 1.4 }}>{r.desc}</p>
                    </div>
                    <Download style={{ width: 13, height: 13, color: C.muted, flexShrink: 0, marginTop: 2 }} />
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
