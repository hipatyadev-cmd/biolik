import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { db } from '../firebase/config.js';
import { seedProducts } from '../data/seed.js';
import { useApp } from '../context/AppContext.jsx';
import { labelFor, tr } from '../data/i18n.js';

export default function ProductDetails() {
  const { id } = useParams();
  const { lang, add } = useApp();
  const [p, setP] = useState(seedProducts.find(x => x.id === id));
  const [i, setI] = useState(0);

  useEffect(() => onSnapshot(doc(db, 'products', id), s => {
    if (s.exists()) setP({ id: s.id, ...s.data() });
  }, () => {}), [id]);

  if (!p) return <main className='page'><h1>Product not found</h1></main>;

  const imgs = p.images?.length ? p.images : [];
  const name = p.name?.[lang] || p[`name_${lang}`] || p.name?.fr;
  const desc = p.desc?.[lang] || p[`description_${lang}`] || p.short?.[lang] || p.short?.fr;

  return (
    <main className='page detail'>
      <div className='gallery'>
        <button disabled={imgs.length < 2} onClick={() => setI((i - 1 + imgs.length) % imgs.length)}><ChevronLeft /></button>
        <img src={imgs[i]} alt={name} />
        <button disabled={imgs.length < 2} onClick={() => setI((i + 1) % imgs.length)}><ChevronRight /></button>
        <div className='thumbs'>{imgs.map((im, k) => <img className={i === k ? 'active' : ''} src={im} onClick={() => setI(k)} key={im} alt='' />)}</div>
      </div>
      <div className='detailText'>
        <span className='kicker'>{p.origin} / {p.category}</span>
        <h1>{name}</h1>
        <p>{desc}</p>
        <div className='chips detailChips'>
          <span>{labelFor(lang, p.skin || 'All')}</span>
          <span>{labelFor(lang, p.audience || 'Everyone')}</span>
        </div>
        <div className='price big'><b>${p.price}</b>{p.oldPrice && <s>${p.oldPrice}</s>}</div>
        <p className={p.stock > 0 ? 'stock ok' : 'stock no'}>{p.stock > 0 ? tr(lang, 'stock') : tr(lang, 'out')}</p>
        <button className='btn gold' disabled={p.stock <= 0} onClick={() => add(p)}><ShoppingBag /> {tr(lang, 'add')}</button>
        <Link to='/shop' className='back'>{'<'} {tr(lang, 'navShop')}</Link>
      </div>
    </main>
  );
}
