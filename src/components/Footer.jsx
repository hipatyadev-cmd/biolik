import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { tr } from '../data/i18n.js';

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className='footer'>
      <div>
        <h2>BioLik</h2>
        <p>{tr(lang, 'tag')}</p>
      </div>

      <div>
        <p><MapPin size={16}/>Morocco / Europe / USA / Gulf</p>
        <p><Phone size={16}/>WhatsApp confirmation</p>
        <p><Mail size={16}/>contact@biolik.ma</p>
      </div>

      <div className='social'>
        <span>Premium Moroccan Bio</span>
      </div>
    </footer>
  );
}
