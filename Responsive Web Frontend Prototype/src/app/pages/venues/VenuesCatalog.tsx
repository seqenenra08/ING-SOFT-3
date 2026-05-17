import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, MapPin, Users, ArrowRight } from 'lucide-react';
import { venuesService } from '../../services/venuesService';
import { C } from '../../theme';

const types = ['Todos', 'auditorio', 'teatro', 'sala', 'salon_cultural'];

export function VenuesCatalog() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Todos');

  useEffect(() => {
    venuesService.getVenues().then(setVenues).finally(() => setLoading(false));
  }, []);

  const filtered = venues.filter((v: any) =>
    (type === 'Todos' || v.type === type) &&
    (v.name?.toLowerCase().includes(search.toLowerCase()) || v.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Portal de Escenarios</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Catálogo de Escenarios Culturales</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Secretaría de Cultura · Alcaldía de Santiago de Pereira</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 380 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar escenario..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {types.map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '6px 14px', background: type === t ? C.primary : C.surface,
                color: type === t ? '#fff' : C.muted, border: `1px solid ${type === t ? C.primary : C.border}`,
                fontSize: '0.72rem', fontWeight: type === t ? 600 : 400, cursor: 'pointer', borderRadius: 2,
              }}>{t}</button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ fontSize: '0.82rem', color: C.subtle, padding: '32px 0' }}>Cargando escenarios...</p>
        ) : (
          <>
            <p style={{ fontSize: '0.72rem', color: C.subtle, marginBottom: 16 }}>{filtered.length} escenario(s) disponible(s)</p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              {filtered.map((v: any, i: number, arr: any[]) => (
                <div key={v.id}>
                  <div style={{ display: 'flex', gap: 20, padding: '18px 20px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <div style={{ width: 100, height: 72, flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                      {v.images?.[0]
                        ? <img src={v.images[0]} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: C.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin style={{ width: 20, height: 20, color: C.primary }} />
                          </div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem' }}>{v.name}</p>
                          <p style={{ fontSize: '0.7rem', color: C.active, fontWeight: 600, marginTop: 2 }}>{v.type}</p>
                        </div>
                        <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4b7a30', border: `1px solid #4b7a3044`, padding: '2px 8px', borderRadius: 2 }}>Disponible</span>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: C.muted, margin: '5px 0', lineHeight: 1.5 }}>{v.description?.slice(0, 100)}...</p>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><Users style={{ width: 11, height: 11 }} /> {v.capacity} personas</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><MapPin style={{ width: 11, height: 11 }} /> {v.address}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
                      {v.hourlyRate && (
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text, textAlign: 'right' }}>
                          ${v.hourlyRate?.toLocaleString()}<span style={{ fontSize: '0.65rem', fontWeight: 400, color: C.subtle }}>/hora</span>
                        </p>
                      )}
                      <Link to={`/escenarios/detalle/${v.id}`}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                          Ver detalles <ArrowRight style={{ width: 12, height: 12 }} />
                        </button>
                      </Link>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
