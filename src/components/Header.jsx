import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext.jsx";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { lang, setLang, cart } = useApp();
  const location = useLocation();

  const active = (path) => location.pathname === path ? "active" : "";

  return (
    <header className="topbar">
      <Link to="/" className="logo">
        <span>✦</span>
        <div>
          <b>BioLik</b>
          <small>Moroccan Bio</small>
        </div>
      </Link>

      <nav className={open ? "nav open" : "nav"}>
        <Link className={active("/")} to="/" onClick={() => setOpen(false)}>Home</Link>
        <Link className={active("/shop")} to="/shop" onClick={() => setOpen(false)}>Shop</Link>
        <Link className={active("/about")} to="/about" onClick={() => setOpen(false)}>About</Link>
        <Link className={active("/admin")} to="/admin" onClick={() => setOpen(false)}>Admin</Link>
      </nav>

      <div className="langs">
        <button className={lang === "fr" ? "active" : ""} onClick={() => setLang("fr")}>FR</button>
        <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        <button className={lang === "ar" ? "active" : ""} onClick={() => setLang("ar")}>AR</button>
      </div>

      <Link to="/cart" className="cartIcon">
        <ShoppingBag size={22} />
        <small>{cart?.length || 0}</small>
      </Link>

      <button className="hamb" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}