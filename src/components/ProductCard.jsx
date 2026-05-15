import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { labelFor, tr } from '../data/i18n.js';

export default function ProductCard({ p }) {
  const { lang, add } = useApp();
  const name = p.name?.[lang] || p[`name_${lang}`] || p.name?.fr || p.name_fr || '';
  const short = p.short?.[lang] || p.desc?.[lang] || p[`description_${lang}`] || p.short?.fr || '';
  const old = Number(p.oldPrice || 0);
  const price = Number(p.price || 0);
  const discount = old > price ? Math.round((old - price) * 100 / old) : 0;
  const image = p.images?.[0] || p.image;

  return (
    <motion.article className='product-card' initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -6 }}>
      {discount > 0 && <span className='discount'>-{discount}%</span>}
      <Link to={`/product/${p.id}`} className='imgBox'>
        <img src={image} alt={name} />
      </Link>
      <div className='pcontent'>
        <div className='metaLine'>
          <span>{p.origin || 'Morocco'}</span>
          <span>{p.category}</span>
        </div>
        <h3>{name}</h3>
        <p>{short}</p>
        <div className='chips'>
          <span>{labelFor(lang, p.skin || 'All')}</span>
          <span>{labelFor(lang, p.audience || 'Everyone')}</span>
        </div>
        <div className='price'>
          <b>${price}</b>
          {old > 0 && <s>${old}</s>}
        </div>
        <span className={Number(p.stock) > 0 ? 'stock ok' : 'stock no'}>{Number(p.stock) > 0 ? tr(lang, 'stock') : tr(lang, 'out')}</span>
        <div className='cardActions'>
          <button disabled={Number(p.stock) <= 0} onClick={() => add(p)}><ShoppingBag size={16}/>{tr(lang, 'add')}</button>
          <Link to={`/product/${p.id}`}><Eye size={16}/></Link>
        </div>
      </div>
    </motion.article>
  );
}
