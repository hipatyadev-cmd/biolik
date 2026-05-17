import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Gem,
  HeartHandshake,
  ScanLine,
  Sparkles,
  Truck,
  Leaf,
  ShieldCheck,
  Globe2,
  Star,
  ShoppingBag,
  PlayCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../data/i18n.js';

const fallbackHero = "/images/hero.jpeg";

const fadeUp = {
  initial: { opacity: 0, y: 45 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .18 },
  transition: { duration: .75, ease: "easeOut" }
};

const assetCandidates = name => [
  `/images/${name}.png`,
  `/images/${name}.jpg`,
  `/images/${name}.jpeg`,
  `/images/${name}.webp`,
  `/images/${name}`
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
  {
    q: 'Quels produits choisir pour une peau sensible ?',
    a: 'Pour une peau sensible, il est preferable de choisir des produits doux et naturels comme l huile d argan, le savon naturel ou la nila bleue avec une utilisation moderee.'
  },
  {
    q: 'Les produits BioLik sont-ils vraiment naturels ?',
    a: 'Oui. BioLik met en avant des produits inspires du terroir marocain, avec une selection basee sur la qualite, la simplicite des ingredients et le savoir-faire traditionnel.'
  },
  {
    q: 'Comment utiliser le QR Code sur le produit ?',
    a: 'Chaque QR Code permet au client d acceder a une video explicative, a l origine du produit, aux conseils d utilisation et a l histoire de la cooperative.'
  },
  {
    q: 'Est-ce que les produits conviennent aux hommes ?',
    a: 'Oui. Plusieurs produits comme le ghassoul, le savon naturel, l huile d argan et le miel peuvent etre utilises par les hommes, les femmes et toute la famille.'
  },
  {
    q: 'Est-ce possible de livrer a l international ?',
    a: 'Oui. Le projet BioLik est pense pour le Maroc mais aussi pour la diaspora marocaine et les clients en Europe interesses par les produits naturels marocains.'
  },
  {
    q: 'Pourquoi les prix sont-ils premium ?',
    a: 'Les prix refletent la qualite des ingredients, le packaging eco-responsable, la tracabilite, le design premium et l experience client proposee par BioLik.'
  }
];

export default function Home() {
  const { lang } = useApp();

  return (
    <main className="homePage">
      <section className="hero heroBig">
        <div className="zellij"></div>
        <div className="heroGlow"></div>

        <motion.div
          className="heroText"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: .9, ease: "easeOut" }}
        >
          <span className="kicker">Premium Moroccan Bio</span>
          <h1>{tr(lang, 'heroTitle')}</h1>
          <p>{tr(lang, 'heroText')}</p>

          <div className="heroStats">
            <div><b>100%</b><span>Naturel</span></div>
            <div><b>QR</b><span>Traçabilité</span></div>
            <div><b>Bio</b><span>Terroir Marocain</span></div>
          </div>

          <div className="heroBtns">
            <Link className="btn gold" to="/shop">
              <ShoppingBag size={18} />
              {tr(lang, 'shopNow')}
            </Link>
            <Link className="btn ghost" to="/about">
              <PlayCircle size={18} />
              {tr(lang, 'story')}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="heroVisual"
          initial={{ opacity: 0, scale: .9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="lux-card bigLuxCard"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <AssetImage name="img1" alt="BioLik hero product" />
            <div>
              <b>BioLik</b>
              <span>Pure oils · Natural care · Moroccan terroir</span>
            </div>
          </motion.div>

          <motion.div className="float f1" animate={{ y: [0, -14, 0] }} transition={{ duration: 3, repeat: Infinity }}>Argan</motion.div>
          <motion.div className="float f2" animate={{ y: [0, 14, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>Amlou</motion.div>
          <motion.div className="float f3" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>Miel</motion.div>
        </motion.div>
      </section>

      <section className="lux-strip">
        <span>Coopératives marocaines</span>
        <span>Made in Morocco bio</span>
        <span>Packaging premium</span>
        <span>QR Code traçabilité</span>
        <span>France & Europe</span>
      </section>

      <section className="features premiumFeatures">
        {[
          [Gem, 'Qualité Premium', 'Des produits naturels sélectionnés avec soin.'],
          [ScanLine, 'QR Code', 'Une traçabilité claire et moderne.'],
          [Truck, 'Livraison', 'Maroc et international avec suivi.'],
          [HeartHandshake, 'Impact Social', 'Valorisation des coopératives marocaines.']
        ].map(([Icon, title, text], i) => (
          <motion.div className="feature" key={title} {...fadeUp} transition={{ delay: i * .1 }}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </motion.div>
        ))}
      </section>

      <section className="storySection">
        <motion.div className="storyImage" {...fadeUp}>
          <img
  src="/images/all.png"
  alt="BioLik natural product"
  className="storyImgMega"
/>
        </motion.div>

        <motion.div className="storyText" {...fadeUp}>
          <span className="kicker">Notre Signature</span>
          <h2>Le naturel marocain présenté avec élégance</h2>
          <p>
            BioLik transforme les produits du terroir marocain en une expérience premium :
            packaging eco-responsable, identité visuelle raffinée, QR Code et storytelling produit.
          </p>

          <div className="miniList">
            <span><Leaf size={18} /> Produits naturels</span>
            <span><ShieldCheck size={18} /> Qualité rassurante</span>
            <span><Globe2 size={18} /> Vision internationale</span>
          </div>
        </motion.div>
      </section>

      <section className="editorial bigEditorial">
        <motion.div {...fadeUp}>
          <span className="kicker">BioLik Experience</span>
          <h2>{tr(lang, 'featured')}</h2>
          <p>{tr(lang, 'packText')}</p>
          <Link className="btn gold" to="/shop">
            <Sparkles size={18} />
            {tr(lang, 'shopNow')}
          </Link>
        </motion.div>

        <motion.div className="mosaic premiumMosaic" {...fadeUp}>
          <AssetImage name="packaging" alt="BioLik premium packaging" />
          <AssetImage name="img3" alt="BioLik natural product 2" />
          <AssetImage name="img4" alt="BioLik natural product 3" />
        </motion.div>
      </section>

      <section className="whySection">
        <motion.div className="centerTitle" {...fadeUp}>
          <span className="kicker">Pourquoi BioLik ?</span>
          <h2>Une marque naturelle, digitale et premium</h2>
        </motion.div>

        <div className="whyGrid">
          {[
            ['Terroir', 'Des produits inspirés des traditions marocaines.'],
            ['Confiance', 'Une communication claire et rassurante.'],
            ['Design', 'Une image premium adaptée au marché moderne.'],
            ['Traçabilité', 'QR Code et histoire du produit accessibles.']
          ].map(([title, text], i) => (
            <motion.div className="whyCard" key={title} {...fadeUp} transition={{ delay: i * .08 }}>
              <Star />
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="faqSection faqPremium">
        <motion.div className="faqIntro" {...fadeUp}>
          <span className="kicker">{tr(lang, 'faqKicker')}</span>
          <h2>{tr(lang, 'faqTitle')}</h2>
          <p>
            Des réponses simples, claires et rassurantes pour aider chaque client
            à choisir le bon produit selon son besoin.
          </p>
        </motion.div>

        <div className="faqGrid">
          {faqs.map(({ q, a }, i) => (
            <motion.details className="faqItem" key={q} {...fadeUp} transition={{ delay: i * .05 }}>
              <summary>
                <span>{q}</span>
                <ChevronDown size={20} />
              </summary>
              <p>{a}</p>
            </motion.details>
          ))}
        </div>
      </section>
    </main>
  );
}