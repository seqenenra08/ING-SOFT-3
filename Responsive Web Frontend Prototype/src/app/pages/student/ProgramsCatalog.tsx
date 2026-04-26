import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, Users, Clock, ArrowRight } from 'lucide-react';
import { C } from '../../theme';
import { programsData as programs } from '../../data/mockData';

const categories = ['Todos', 'Danza', 'Música', 'Teatro', 'Artes Visuales'];

export const ProgramsCatalog = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = programs.filter((p: any) =>
    (category === 'Todos' || p.category === category) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Catálogo</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Explorar Programas</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Descubre toda la oferta académica del centro cultural</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar programas..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '7px 14px', background: category === c ? C.primary : C.surface,
                color: category === c ? '#fff' : C.muted, border: `1px solid ${category === c ? C.primary : C.border}`,
                fontSize: '0.75rem', fontWeight: category === c ? 600 : 400, cursor: 'pointer', borderRadius: 2,
              }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: C.subtle, marginBottom: 16 }}>{filtered.length} programa(s) encontrado(s)</p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((p: any, i: number, arr: any[]) => (
            <div key={p.id}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: i * 0.06 }}
                style={{ display: 'flex', gap: 20, padding: '18px 0', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ width: 96, height: 72, flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                  {p.image
                    ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: C.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users style={{ width: 24, height: 24, color: C.primary }} />
                      </div>
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem' }}>{p.name}</p>
                      <p style={{ fontSize: '0.7rem', color: C.active, marginTop: 2, fontWeight: 600 }}>{p.category}</p>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: C.muted, padding: '2px 8px', border: `1px solid ${C.border}`, borderRadius: 2, whiteSpace: 'nowrap' }}>
                      {p.level ?? 'Todos los niveles'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: C.muted, margin: '6px 0', lineHeight: 1.5 }}>{p.description?.slice(0, 100)}...</p>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {p.educator && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><Users style={{ width: 11, height: 11 }} /> {p.educator}</span>}
                    {p.duration && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}><Clock style={{ width: 11, height: 11 }} /> {p.duration}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <Link to={`/estudiante/programa/${p.id}`}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                      Ver programa <ArrowRight style={{ width: 12, height: 12 }} />
                    </button>
                  </Link>
                </div>
              </motion.div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
