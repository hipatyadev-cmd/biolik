import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Gem, HeartHandshake, ScanLine, Sparkles, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../data/i18n.js';
import fallbackHero from '../assets/hero.jpeg';

const fade = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .2 },
  transition: { duration: .65 }
};

const assetCandidates = name => [
  `/src/assets/${name}.png`,
  `/src/assets/${name}.jpg`,
  `/src/assets/${name}.jpeg`,
  `/src/assets/${name}.webp`,
  `/src/assets/${name}`
];

function AssetImage({ name, alt, className }) {
  const [index, setIndex] = useState(0);
  const candidates = assetCandidates(name);
  return (
    <img
      className={className}
      src={candidates[index] || fallbackHero}
      alt={alt}
      onError={() => setIndex(i => (i < candidates.length - 1 ? i + 1 : i))}
    />
  );
}

const faqs = [
  ['Quelle huile choisir pour une peau seche ?', 'L huile d argan ou l huile d amande douce sont conseillees pour nourrir la peau et renforcer la barriere naturelle.'],
  ['Est-ce adapte aux peaux sensibles ?', 'Oui, privilegiez les produits purs, sans parfum agressif, et testez une petite zone avant la premiere utilisation.'],
  ['Les produits conviennent-ils aux hommes ?', 'Oui. Les huiles, savons et soins BioLik sont filtres par profil: femme, homme, enfant ou tout le monde.'],
  ['Peut-on utiliser les huiles sur les cheveux ?', 'Oui, quelques gouttes en bain d huile ou sur les pointes aident a nourrir et apporter de la brillance.'],
  ['Pourquoi Made in Morocco bio ?', 'Le Maroc a un terroir riche en argan, miel, plantes et savoir-faire cooperatif recherche par la diaspora et les clients europeens.'],
  ['Est-ce possible de livrer en Europe ?', 'Le site est pense pour le Maroc, l Europe, la France en priorite, et les commandes internationales confirmees par WhatsApp.'],
  ['Comment verifier la qualite ?', 'Chaque fiche peut afficher l origine, le type de peau, le profil, les images et les specifications du produit.'],
  ['Comment conserver les produits naturels ?', 'Gardez-les a l abri de la chaleur, de la lumiere directe et refermez bien le contenant apres usage.']
];

export default function Home() {
  const { lang } = useApp();

  return (
    <main>
      <section className='hero'>
        <div className='zellij'></div>
        <motion.div className='heroText' initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8 }}>
          <span className='kicker'>{tr(lang, 'heroKicker')}</span>
          <h1>{tr(lang, 'heroTitle')}</h1>
          <p>{tr(lang, 'heroText')}</p>
          <div className='heroBtns'>
            <Link className='btn gold' to='/shop'><Sparkles size={18}/>{tr(lang, 'shopNow')}</Link>
            <Link className='btn ghost' to='/about'>{tr(lang, 'story')}</Link>
          </div>
        </motion.div>
        <motion.div className='heroVisual' initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9 }}>
          <div className='lux-card'>
            <AssetImage name='img1' alt='BioLik hero product' />
            <div>
              <b>BioLik</b>
              <span>Pure oils, natural care</span>
            </div>
          </div>
          <div className='float f1'>Argan</div>
          <div className='float f2'>Amlou</div>
          <div className='float f3'>Miel</div>
        </motion.div>
      </section>

      <section className='lux-strip'>
        <span>Cooperatives marocaines</span>
        <span>Made in Morocco bio</span>
        <span>France & Europe</span>
        <span>Huiles vegetales pures</span>
      </section>

      <section className='features'>
        {[[Gem, tr(lang, 'quality')], [ScanLine, tr(lang, 'trace')], [Truck, tr(lang, 'delivery')], [HeartHandshake, tr(lang, 'social')]].map(([Icon, title], i) => (
          <motion.div className='feature' key={title} {...fade} transition={{ delay: i * .08 }}>
            <Icon />
            <h3>{title}</h3>
            <p>Selection naturelle, origine claire et presentation premium pour chaque produit.</p>
          </motion.div>
        ))}
      </section>

      <section className='editorial'>
        <motion.div {...fade}>
          <span className='kicker'>BioLik Experience</span>
          <h2>{tr(lang, 'featured')}</h2>
          <p>{tr(lang, 'packText')}</p>
          <Link className='btn gold' to='/shop'>{tr(lang, 'shopNow')}</Link>
        </motion.div>
        <motion.div className='mosaic' {...fade}>
          <AssetImage name='img2' alt='BioLik natural product 1' />
          <AssetImage name='img3' alt='BioLik natural product 2' />
          <AssetImage name='img4' alt='BioLik natural product 3' />
        </motion.div>
      </section>

      <section className='faqSection'>
        <div className='faqIntro'>
          <span className='kicker'>{tr(lang, 'faqKicker')}</span>
          <h2>{tr(lang, 'faqTitle')}</h2>
          <p>Des reponses simples pour aider le client a choisir rapidement selon le besoin, la peau et le profil.</p>
        </div>
        <div className='faqGrid'>
          {faqs.map(([q, a], i) => (
            <motion.details className='faqItem' key={q} {...fade} transition={{ delay: i * .04 }}>
              <summary><span>{q}</span><ChevronDown size={18}/></summary>
              <p>{a}</p>
            </motion.details>
          ))}
        </div>
      </section>
    </main>
  );
}
