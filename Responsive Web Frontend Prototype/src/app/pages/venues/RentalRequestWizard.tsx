import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { venuesService } from '../../services/venuesService';
import { toast } from 'sonner';
import { C } from '../../theme';

const steps = ['Información del evento', 'Datos del solicitante', 'Confirmar solicitud'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', fontSize: '0.82rem',
  background: C.surfaceAlt, border: `1px solid ${C.border}`,
  color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.68rem', fontWeight: 600,
  color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase',
};

interface FieldProps {
  id: string; label: string; type?: string; placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

function Field({ id, label, type = 'text', placeholder = '', value, onChange }: FieldProps) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {type === 'textarea'
        ? <textarea name={id} value={value} onChange={onChange} placeholder={placeholder} rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        : <input name={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
      }
    </div>
  );
}

export function RentalRequestWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venues, setVenues] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    eventName: '', eventType: '', attendees: '', startDate: '', endDate: '',
    startTime: '', endTime: '', description: '',
    clientName: '', clientEmail: '', clientPhone: '', clientId: '', organization: '',
  });

  useEffect(() => {
    venuesService.getVenues().then(setVenues);
  }, []);

  const venue: any = venues.find(v => v.id === id) ?? venues[0] ?? { name: '', location: '' };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const payload = {
      venueId:        venue.id,
      venueName:      venue.name,
      clientName:     form.clientName,
      clientEmail:    form.clientEmail,
      clientPhone:    form.clientPhone,
      clientDocument: form.clientId,
      clientOrg:      form.organization,
      eventType:      form.eventType,
      eventName:      form.eventName,
      startDate:      form.startDate,
      endDate:        form.endDate || form.startDate,
      startTime:      form.startTime || '08:00',
      endTime:        form.endTime   || '18:00',
      attendees:      parseInt(form.attendees) || 0,
      notes:          form.description,
    } as any;
    try {
      const result = await venuesService.createRequest(payload);
      toast.success(`Solicitud enviada. Número: ${result.requestNumber}`);
      setTimeout(() => navigate('/escenarios/seguimiento'), 1500);
    } catch (err: any) {
      toast.error(`Error: ${err?.message ?? 'Error al enviar la solicitud.'}`);
    }
  };

  const f = (fieldId: keyof typeof form) => ({
    id: fieldId,
    value: form[fieldId],
    onChange: handleChange as React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  });

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Solicitud de Alquiler</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{venue.name || 'Escenario'}</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{venue.address ?? ''}</p>
        </div>
      </div>

      {/* Step progress */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 40px', display: 'flex' }}>
          {steps.map((s, i) => (
            <div key={s} style={{ flex: 1, padding: '14px 0', textAlign: 'center', borderBottom: i === step ? `2px solid ${C.primary}` : '2px solid transparent' }}>
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

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {step === 0 && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}>
                    <Field {...f('eventName')} label="Nombre del evento" placeholder="Festival de Danza 2026" />
                  </div>
                  <div style={{ flex: '1 1 220px' }}>
                    <label style={labelStyle}>Tipo de evento</label>
                    <select name="eventType" value={form.eventType} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}>
                      <option value="">Seleccionar...</option>
                      <option>Cultural</option>
                      <option>Académico</option>
                      <option>Artístico</option>
                      <option>Social</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 160px' }}>
                    <Field {...f('startDate')} label="Fecha inicio" type="date" />
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <Field {...f('startTime')} label="Hora inicio" type="time" />
                  </div>
                  <div style={{ flex: '1 1 160px' }}>
                    <Field {...f('endDate')} label="Fecha fin" type="date" />
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <Field {...f('endTime')} label="Hora fin" type="time" />
                  </div>
                  <div style={{ flex: '1 1 120px' }}>
                    <Field {...f('attendees')} label="Asistentes" type="number" placeholder="100" />
                  </div>
                </div>
                <Field {...f('description')} label="Descripción del evento" type="textarea" placeholder="Describe brevemente el evento..." />
              </>
            )}

            {step === 1 && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}>
                    <Field {...f('clientName')} label="Nombre completo" placeholder="Tu nombre completo" />
                  </div>
                  <div style={{ flex: '1 1 220px' }}>
                    <Field {...f('clientId')} label="Documento de identidad" placeholder="1234567890" />
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ flex: '1 1 220px' }}>
                    <Field {...f('clientEmail')} label="Correo electrónico" type="email" placeholder="tu@email.com" />
                  </div>
                  <div style={{ flex: '1 1 220px' }}>
                    <Field {...f('clientPhone')} label="Teléfono" placeholder="315 123 4567" />
                  </div>
                </div>
                <Field {...f('organization')} label="Organización o entidad" placeholder="Nombre de la organización (opcional)" />
              </>
            )}

            {step === 2 && (
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, marginBottom: 14 }}>Resumen de la solicitud</p>
                {[
                  { label: 'Escenario',   value: venue.name },
                  { label: 'Evento',      value: form.eventName || '—' },
                  { label: 'Tipo',        value: form.eventType || '—' },
                  { label: 'Fecha inicio',value: form.startDate || '—' },
                  { label: 'Hora inicio', value: form.startTime || '08:00' },
                  { label: 'Fecha fin',   value: form.endDate || form.startDate || '—' },
                  { label: 'Hora fin',    value: form.endTime || '18:00' },
                  { label: 'Asistentes',  value: form.attendees || '—' },
                  { label: 'Solicitante', value: form.clientName || '—' },
                  { label: 'Correo',      value: form.clientEmail || '—' },
                  { label: 'Teléfono',    value: form.clientPhone || '—' },
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
