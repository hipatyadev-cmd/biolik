import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, UserRound } from 'lucide-react';
import { db } from '../firebase/config.js';
import ProductCard from '../components/ProductCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { labelFor, tr } from '../data/i18n.js';
import { seedProducts } from '../data/seed.js';

const norm = value => String(value || '').trim().toLowerCase();
const uniq = arr => ['All', ...new Set(arr.map(x => String(x || '').trim()).filter(Boolean))];
const audiences = ['All', 'Everyone', 'Women', 'Men', 'Children'];
const skinTypes = ['All', 'Normal', 'Dry', 'Oily', 'Mixed', 'Sensitive'];
const mergeProducts = firestoreProducts => {
  const ids = new Set(firestoreProducts.map(p => p.id));
  return [...firestoreProducts, ...seedProducts.filter(p => !ids.has(p.id))];
};

export default function Shop() {
  const { lang } = useApp();
  const [products, setProducts] = useState(seedProducts);
  const [cat, setCat] = useState('All');
  const [skin, setSkin] = useState('All');
  const [audience, setAudience] = useState('All');
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, s => {
      const arr = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(mergeProducts(arr));
    }, () => {});
  }, []);

  const cats = useMemo(() => uniq(products.map(p => p.category)), [products]);

  const list = useMemo(() => products.filter(p => {
    const name = (p.name?.[lang] || p[`name_${lang}`] || p.name?.fr || p.name_fr || '').toLowerCase();
    const description = (p.short?.[lang] || p.desc?.[lang] || p.description_fr || '').toLowerCase();
    const productSkin = norm(p.skin || p.skinType || 'All');
    const productAudience = norm(p.audience || p.profile || 'Everyone');
    const chosenAudience = norm(audience);
    const matchesAudience = chosenAudience === 'all' || productAudience === 'everyone' || productAudience === chosenAudience;
    return (
      (cat === 'All' || p.category === cat) &&
      (skin === 'All' || productSkin === norm(skin) || productSkin === 'all') &&
      matchesAudience &&
      `${name} ${description}`.includes(text.toLowerCase())
    );
  }), [products, cat, skin, audience, text, lang]);

  return (
    <main className='page shopPage'>
      <motion.div className='pageHead' initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
        <span className='kicker'>{tr(lang, 'heroKicker')}</span>
        <h1>{tr(lang, 'sections')}</h1>
        <p>{tr(lang, 'heroText')}</p>
      </motion.div>

      <div className='filters refinedFilters'>
        <label><Search size={17}/><input placeholder={tr(lang, 'search')} value={text} onChange={e => setText(e.target.value)} /></label>
        <label><SlidersHorizontal size={17}/><select value={cat} onChange={e => setCat(e.target.value)}>{cats.map(x => <option key={x} value={x}>{x === 'All' ? tr(lang, 'all') : x}</option>)}</select></label>
        <label><Sparkles size={17}/><select value={skin} onChange={e => setSkin(e.target.value)}>{skinTypes.map(x => <option key={x} value={x}>{x === 'All' ? tr(lang, 'allSkin') : labelFor(lang, x)}</option>)}</select></label>
        <label><UserRound size={17}/><select value={audience} onChange={e => setAudience(e.target.value)}>{audiences.map(x => <option key={x} value={x}>{x === 'All' ? tr(lang, 'allAudience') : labelFor(lang, x)}</option>)}</select></label>
      </div>

      <div className='resultBar'>
        <b>{list.length}</b>
        <span>{tr(lang, 'products')}</span>
      </div>

      <div className='products'>{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
    </main>
  );
}
