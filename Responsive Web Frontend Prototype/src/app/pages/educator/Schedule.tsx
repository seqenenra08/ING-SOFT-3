import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { C } from '../../theme';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const schedule = [
  { day: 'Lunes',     time: '5:00 PM - 7:00 PM', program: 'Danza Folklórica - Grupo A',   location: 'Sala 2',          students: 18 },
  { day: 'Martes',    time: '4:00 PM - 6:00 PM', program: 'Ballet Clásico - Grupo A',     location: 'Sala Principal',  students: 12 },
  { day: 'Miércoles', time: '5:00 PM - 7:00 PM', program: 'Danza Folklórica - Grupo A',   location: 'Sala 2',          students: 18 },
  { day: 'Jueves',    time: '4:00 PM - 6:00 PM', program: 'Ballet Clásico - Grupo A',     location: 'Sala Principal',  students: 12 },
  { day: 'Jueves',    time: '7:00 PM - 9:00 PM', program: 'Ballet Clásico - Grupo B',     location: 'Sala Principal',  students: 10 },
  { day: 'Viernes',   time: '3:00 PM - 5:00 PM', program: 'Ballet Clásico - Grupo B',     location: 'Sala Principal',  students: 10 },
  { day: 'Sábado',    time: '9:00 AM - 11:00 AM',program: 'Danza Contemporánea',          location: 'Auditorio',       students: 15 },
];

export const Schedule = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
    <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Educador</p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mi Horario</h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{schedule.length} clases programadas esta semana</p>
      </motion.div>
    </div>

    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
      {days.map(day => {
        const daySessions = schedule.filter(s => s.day === day);
        if (!daySessions.length) return null;
        return (
          <motion.div key={day}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: days.indexOf(day) * 0.07 }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ padding: '12px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day}</span>
            </div>
            {daySessions.map((s, i, arr) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderLeft: i === 0 ? `3px solid ${C.active}` : '3px solid transparent' }}>
                  <div style={{ width: 36, height: 36, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <Calendar style={{ width: 14, height: 14, color: C.primary }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{s.program}</p>
                    <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><Clock style={{ width: 11, height: 11 }} /> {s.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><MapPin style={{ width: 11, height: 11 }} /> {s.location}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><Users style={{ width: 11, height: 11 }} /> {s.students} estudiantes</span>
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
          </motion.div>
        );
      })}
    </div>
  </div>
);
