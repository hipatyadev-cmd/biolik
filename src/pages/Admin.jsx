import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { ImagePlus, Loader2, Save, Trash2, UploadCloud } from 'lucide-react';
import { auth, db } from '../firebase/config.js';
import { labelFor, tr } from '../data/i18n.js';
import { useApp } from '../context/AppContext.jsx';

const empty = {
  name_fr: '',
  name_en: '',
  name_ar: '',
  description_fr: '',
  description_en: '',
  description_ar: '',
  category: 'Cosmetiques',
  skin: 'All',
  audience: 'Everyone',
  origin: 'Morocco',
  price: '',
  oldPrice: '',
  stock: 1,
  images: ''
};

const skinOptions = ['All', 'Normal', 'Dry', 'Oily', 'Mixed', 'Sensitive'];
const audienceOptions = ['Everyone', 'Women', 'Men', 'Children'];

export default function Admin() {
  const { lang } = useApp();
  const [user, setUser] = useState(null);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [form, setForm] = useState(empty);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promo, setPromo] = useState({ code: 'WELCOME10', percentage: 10 });
  const [cloudinary, setCloudinary] = useState(() => JSON.parse(localStorage.biolicCloudinary || '{"cloudName":"","uploadPreset":""}'));
  const [uploading, setUploading] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    localStorage.biolicCloudinary = JSON.stringify(cloudinary);
  }, [cloudinary]);

  useEffect(() => {
    if (!user) return;
    const a = onSnapshot(collection(db, 'products'), s => setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const b = onSnapshot(collection(db, 'orders'), s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { a(); b(); };
  }, [user]);

  async function uploadImages(files) {
    if (!files.length || !cloudinary.cloudName || !cloudinary.uploadPreset) return;
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        body.append('upload_preset', cloudinary.uploadPreset);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`, { method: 'POST', body });
        if (!res.ok) throw new Error('Cloudinary upload failed');
        const data = await res.json();
        urls.push(data.secure_url);
      }
      setForm(f => ({ ...f, images: [f.images, ...urls].filter(Boolean).join('\n') }));
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();
    const imageUrls = form.images.split('\n').map(x => x.trim()).filter(Boolean);
    const data = {
      ...form,
      price: Number(form.price || 0),
      oldPrice: Number(form.oldPrice || 0),
      stock: Number(form.stock || 0),
      inStock: Number(form.stock) > 0,
      featured: true,
      createdAt: serverTimestamp(),
      name: { fr: form.name_fr, en: form.name_en, ar: form.name_ar },
      short: { fr: form.description_fr, en: form.description_en, ar: form.description_ar },
      desc: { fr: form.description_fr, en: form.description_en, ar: form.description_ar },
      images: imageUrls
    };
    await addDoc(collection(db, 'products'), data);
    setForm(empty);
  }

  async function savePromo() {
    await setDoc(doc(db, 'promoCodes', promo.code.trim().toUpperCase()), { percentage: Number(promo.percentage), active: true });
  }

  if (!user) return (
    <main className='page admin'>
      <form className='adminLogin' onSubmit={e => { e.preventDefault(); signInWithEmailAndPassword(auth, login.email, login.password); }}>
        <h1>{tr(lang, 'login')}</h1>
        <input placeholder={tr(lang, 'email')} onChange={e => setLogin({ ...login, email: e.target.value })} />
        <input type='password' placeholder={tr(lang, 'password')} onChange={e => setLogin({ ...login, password: e.target.value })} />
        <button className='btn gold'>Login</button>
      </form>
    </main>
  );

  return (
    <main className='page admin'>
      <div className='adminTop'>
        <h1>{tr(lang, 'admin')}</h1>
        <button onClick={() => signOut(auth)}>{tr(lang, 'logout')}</button>
      </div>

      <section className='adminPanel'>
        <form onSubmit={save} className='productForm'>
          <h2>{tr(lang, 'products')}</h2>

          <div className='formGrid'>
            <input placeholder='Nom FR' value={form.name_fr} onChange={e => setForm({ ...form, name_fr: e.target.value })} />
            <input placeholder='Name EN' value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} />
            <input placeholder='الاسم AR' value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })} />
          </div>

          <textarea placeholder='Description FR' value={form.description_fr} onChange={e => setForm({ ...form, description_fr: e.target.value })}></textarea>
          <textarea placeholder='Description EN' value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}></textarea>
          <textarea placeholder='الوصف AR' value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })}></textarea>

          <div className='formGrid'>
            <input placeholder={tr(lang, 'category')} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <select value={form.skin} onChange={e => setForm({ ...form, skin: e.target.value })}>
              {skinOptions.map(x => <option value={x} key={x}>{x === 'All' ? tr(lang, 'allSkin') : labelFor(lang, x)}</option>)}
            </select>
            <select value={form.audience} onChange={e => setForm({ ...form, audience: e.target.value })}>
              {audienceOptions.map(x => <option value={x} key={x}>{labelFor(lang, x)}</option>)}
            </select>
            <input placeholder={tr(lang, 'origin')} value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} />
            <input type='number' min='0' step='0.01' placeholder='Prix' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input type='number' min='0' step='0.01' placeholder='Old prix' value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} />
            <input type='number' min='0' placeholder='Stock' value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          </div>

          <div className='cloudBox'>
            <h3><UploadCloud size={18}/>{tr(lang, 'cloudinary')}</h3>
            <div className='formGrid'>
              <input placeholder={tr(lang, 'cloudName')} value={cloudinary.cloudName} onChange={e => setCloudinary({ ...cloudinary, cloudName: e.target.value })} />
              <input placeholder={tr(lang, 'uploadPreset')} value={cloudinary.uploadPreset} onChange={e => setCloudinary({ ...cloudinary, uploadPreset: e.target.value })} />
            </div>
            <label className='uploadButton'>
              {uploading ? <Loader2 className='spin' size={18}/> : <ImagePlus size={18}/>}
              {uploading ? 'Uploading...' : tr(lang, 'uploadImages')}
              <input type='file' accept='image/*' multiple onChange={e => uploadImages([...e.target.files])} />
            </label>
          </div>

          <textarea placeholder='Cloudinary image links, one per line' value={form.images} onChange={e => setForm({ ...form, images: e.target.value })}></textarea>
          <button className='btn gold'><Save size={18}/>{tr(lang, 'save')}</button>
        </form>

        <div className='adminList'>
          {products.map(p => (
            <div className='adminRow productAdminRow' key={p.id}>
              <img src={p.images?.[0] || p.image} alt='' />
              <div>
                <b>{p.name_fr || p.name?.fr}</b>
                <span>${p.price} / {p.skin || 'All'} / {labelFor(lang, p.audience || 'Everyone')} / stock {p.stock}</span>
              </div>
              <button onClick={() => deleteDoc(doc(db, 'products', p.id))}><Trash2 size={16}/>{tr(lang, 'delete')}</button>
            </div>
          ))}
        </div>
      </section>

      <section className='adminPanel'>
        <div className='settingsBox'>
          <h2>{tr(lang, 'settings')}</h2>
          <input value={promo.code} onChange={e => setPromo({ ...promo, code: e.target.value })} />
          <input type='number' value={promo.percentage} onChange={e => setPromo({ ...promo, percentage: e.target.value })} />
          <button onClick={savePromo}>{tr(lang, 'save')}</button>
        </div>
        <div className='orders'>
          <h2>{tr(lang, 'orders')}</h2>
          {orders.map(o => (
            <div className='adminRow' key={o.id}>
              <b>{o.client?.name}</b>
              <span>${o.total} · {o.status}</span>
              <select value={o.status} onChange={e => updateDoc(doc(db, 'orders', o.id), { status: e.target.value })}>
                <option>new</option>
                <option>confirmed</option>
                <option>shipped</option>
                <option>cancelled</option>
              </select>
              <button onClick={() => deleteDoc(doc(db, 'orders', o.id))}>{tr(lang, 'delete')}</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
