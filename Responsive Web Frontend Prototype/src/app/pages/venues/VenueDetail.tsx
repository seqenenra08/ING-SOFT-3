import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Users, Clock, ArrowLeft, Calendar, ArrowRight, Wifi, Car } from 'lucide-react';
import { venues } from '../../data/venuesData';
import { C } from '../../theme';

export function VenueDetail() {
  const { id } = useParams();
  const venue: any = (venues as any[]).find(v => v.id === id) ?? venues[0];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
        {venue.images?.[0]
          ? <img src={venue.images[0]} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: C.dark }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${C.dark}ee 0%, ${C.dark}99 50%, transparent 100%)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <div style={{ position: 'absolute', inset: 0, padding: '28px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Link to="/escenarios/catalogo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 12, textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> Catálogo de escenarios
          </Link>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>{venue.type}</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{venue.name}</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{venue.location}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>DESCRIPCIÓN</span>
            </div>
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.7 }}>{venue.description ?? 'Espacio cultural del municipio de Santiago de Pereira, disponible para eventos culturales, artísticos y académicos.'}</p>
            </div>
          </motion.div>

          {venue.amenities?.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>AMENIDADES</span>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {venue.amenities.map((a: string) => (
                  <span key={a} style={{ padding: '5px 12px', background: C.tint, border: `1px solid ${C.active}22`, fontSize: '0.75rem', color: C.primary, borderRadius: 2 }}>{a}</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 14 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Información</span>
            </div>
            {[
              { icon: Users,    label: 'Capacidad',  value: `${venue.capacity ?? '—'} personas` },
              { icon: MapPin,   label: 'Ubicación',  value: venue.location ?? '—'               },
              { icon: Clock,    label: 'Disponibilidad', value: 'Lunes a domingo'               },
              { icon: Calendar, label: 'Tarifa',     value: venue.pricePerDay ? `$${venue.pricePerDay.toLocaleString()} COP/día` : 'Consultar' },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', gap: 12, padding: '11px 18px', alignItems: 'center' }}>
                    <Icon style={{ width: 13, height: 13, color: C.subtle, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text }}>{item.value}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>
          <Link to={`/escenarios/solicitud/${venue.id}`}>
            <button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 0', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
              Solicitar Alquiler <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
