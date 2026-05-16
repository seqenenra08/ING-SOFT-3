import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { venues } from '../../data/venuesData';
import { toast } from 'sonner';
import { C } from '../../theme';

const steps = ['Información del evento', 'Datos del solicitante', 'Confirmar solicitud'];

export function RentalRequestWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const venue: any = (venues as any[]).find(v => v.id === id) ?? venues[0];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    eventName: '', eventType: '', attendees: '', startDate: '', endDate: '', description: '',
    clientName: '', clientEmail: '', clientPhone: '', clientId: '', organization: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    toast.success('Solicitud enviada exitosamente. Número: SGE-2026-005');
    setTimeout(() => navigate('/escenarios/seguimiento'), 1500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', fontSize: '0.82rem',
    background: C.surfaceAlt, border: `1px solid ${C.border}`,
    color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
  };

  const Field = ({ id, label, type = 'text', placeholder = '' }: { id: string; label: string; type?: string; placeholder?: string }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>
      {type === 'textarea'
        ? <textarea name={id} value={(form as any)[id]} onChange={handleChange} placeholder={placeholder}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        : <input name={id} type={type} value={(form as any)[id]} onChange={handleChange} placeholder={placeholder}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
      }
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Solicitud de Alquiler</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{venue.name}</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{venue.location}</p>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 40px', display: 'flex' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '14px 0', textAlign: 'center', borderBottom: i === step ? `2px solid ${C.primary}` : '2px solid transparent', cursor: 'default' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: i <= step ? 700 : 400, color: i <= step ? C.primary : C.subtle }}>
                {i + 1}. {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px' }}>
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text, textTransform: 'uppercase' }}>
              {steps[step]}
            </span>
          </div>
          <div style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 0 && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}><Field id="eventName" label="Nombre del evento" placeholder="Festival de Danza 2026" /></div>
                  <div style={{ flex: '1 1 220px' }}>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tipo de evento</label>
                    <select name="eventType" value={form.eventType} onChange={handleChange}
                      style={{ ...inputStyle }}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}>
                      <option value="">Seleccionar...</option>
                      <option>Cultural</option><option>Académico</option><option>Artístico</option><option>Social</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 180px' }}><Field id="startDate" label="Fecha inicio" type="date" /></div>
                  <div style={{ flex: '1 1 180px' }}><Field id="endDate" label="Fecha fin" type="date" /></div>
                  <div style={{ flex: '1 1 120px' }}><Field id="attendees" label="Asistentes" type="number" placeholder="100" /></div>
                </div>
                <Field id="description" label="Descripción del evento" type="textarea" placeholder="Describe brevemente el evento..." />
              </>
            )}
            {step === 1 && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}><Field id="clientName" label="Nombre completo" /></div>
                  <div style={{ flex: '1 1 220px' }}><Field id="clientId" label="Documento de identidad" /></div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}><Field id="clientEmail" label="Correo electrónico" type="email" placeholder="tu@email.com" /></div>
                  <div style={{ flex: '1 1 220px' }}><Field id="clientPhone" label="Teléfono" placeholder="315 123 4567" /></div>
                </div>
                <Field id="organization" label="Organización o entidad" placeholder="Nombre de la organización (opcional)" />
              </>
            )}
            {step === 2 && (
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, marginBottom: 14 }}>Resumen de la solicitud</p>
                {[
                  { label: 'Escenario',   value: venue.name       },
                  { label: 'Evento',      value: form.eventName || '—' },
                  { label: 'Tipo',        value: form.eventType || '—' },
                  { label: 'Fechas',      value: form.startDate ? `${form.startDate} → ${form.endDate}` : '—' },
                  { label: 'Solicitante', value: form.clientName || '—' },
                  { label: 'Correo',      value: form.clientEmail || '—' },
                ].map((item, i, arr) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                      <span style={{ fontSize: '0.75rem', color: C.subtle }}>{item.label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }}>{item.value}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
            {step > 0
              ? <button onClick={() => setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2 }}>
                  <ArrowLeft style={{ width: 13, height: 13 }} /> Anterior
                </button>
              : <div />
            }
            {step < 2
              ? <button onClick={() => setStep(step + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: C.primary, color: '#fff', fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                  Siguiente <ArrowRight style={{ width: 13, height: 13 }} />
                </button>
              : <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 20px', background: C.primary, color: '#fff', fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                  <CheckCircle style={{ width: 13, height: 13 }} /> Enviar solicitud
                </button>
            }
          </div>
        </motion.div>
      </div>
    </div>
  );
}
