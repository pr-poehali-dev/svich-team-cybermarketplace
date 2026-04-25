import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/68fcd510-1dba-4f9e-b39b-e1a7c1bc1919/files/4cfd6400-82bf-4608-9ba3-1e465d852ba9.jpg";

type Rarity = "common" | "rare" | "epic" | "legendary" | "mythic";
type Section = "home" | "categories" | "marketplace" | "about" | "cabinet" | "contacts";

interface Product {
  id: number;
  name: string;
  game: string;
  category: string;
  price: number;
  oldPrice?: number;
  rarity: Rarity;
  server: string;
  seller: string;
  sellerRating: number;
  verified: boolean;
  image: string;
  isNew?: boolean;
  isFlash?: boolean;
  discount?: number;
}

const RARITY_CONFIG: Record<Rarity, { label: string; className: string; icon: string }> = {
  common:    { label: "Обычный",     className: "rarity-common",    icon: "⬜" },
  rare:      { label: "Редкий",      className: "rarity-rare",      icon: "🔷" },
  epic:      { label: "Эпический",   className: "rarity-epic",      icon: "🟣" },
  legendary: { label: "Легендарный", className: "rarity-legendary", icon: "🌟" },
  mythic:    { label: "Мифический",  className: "rarity-mythic",    icon: "💎" },
};

const PRODUCTS: Product[] = [
  { id: 1, name: "Dragon Lore AWP", game: "CS2", category: "Скины", price: 2499, oldPrice: 3200, rarity: "legendary", server: "EU", seller: "PhantomTrader", sellerRating: 4.9, verified: true, image: "🐉", isFlash: true, discount: 22 },
  { id: 2, name: "Аккаунт 50+ побед", game: "Valorant", category: "Аккаунты", price: 899, rarity: "epic", server: "RU", seller: "ValoMaster", sellerRating: 4.7, verified: true, image: "⚡", isNew: true },
  { id: 3, name: "10 000 V-Bucks", game: "Fortnite", category: "Валюта", price: 349, oldPrice: 450, rarity: "rare", server: "Global", seller: "FortKing", sellerRating: 4.8, verified: false, image: "💰", isFlash: true, discount: 22 },
  { id: 4, name: "Предвестник Хаоса", game: "Dota 2", category: "Предметы", price: 1299, rarity: "mythic", server: "RU/CIS", seller: "DotaGod_777", sellerRating: 5.0, verified: true, image: "⚔️", isNew: true },
  { id: 5, name: "Буст до Платины", game: "CS2", category: "Услуги", price: 599, rarity: "rare", server: "EU", seller: "PhantomTrader", sellerRating: 4.9, verified: true, image: "🏆" },
  { id: 6, name: "Скин AK-47 | Asiimov", game: "CS2", category: "Скины", price: 489, rarity: "epic", server: "EU", seller: "SkinVault", sellerRating: 4.6, verified: true, image: "🔫" },
  { id: 7, name: "TF2 Mann Co. Keys x10", game: "TF2", category: "Предметы", price: 199, rarity: "common", server: "Global", seller: "KeyTrader", sellerRating: 4.5, verified: false, image: "🔑", isNew: true },
  { id: 8, name: "Кристаллы 5000 шт", game: "Genshin Impact", category: "Валюта", price: 699, oldPrice: 900, rarity: "rare", server: "Asia", seller: "GenshinShop", sellerRating: 4.8, verified: true, image: "💎", isFlash: true, discount: 22 },
];

const CATEGORIES = [
  { name: "Скины", icon: "🎨", count: 1240, color: "var(--neon-pink)" },
  { name: "Аккаунты", icon: "👤", count: 342, color: "var(--neon-purple)" },
  { name: "Валюта", icon: "💰", count: 890, color: "var(--neon-yellow)" },
  { name: "Предметы", icon: "⚔️", count: 567, color: "var(--neon-cyan)" },
  { name: "Услуги", icon: "🏆", count: 213, color: "var(--neon-green)" },
  { name: "Стримы", icon: "📺", count: 78, color: "#FF6B6B" },
];

const TOP_SELLERS = [
  { name: "PhantomTrader", rating: 4.9, sales: 1247, avatar: "🦊", verified: true },
  { name: "DotaGod_777", rating: 5.0, sales: 892, avatar: "⚡", verified: true },
  { name: "ValoMaster", rating: 4.7, sales: 654, avatar: "🎯", verified: true },
  { name: "GenshinShop", rating: 4.8, sales: 432, avatar: "🌸", verified: true },
];

const CHAT_MESSAGES = [
  { id: 1, from: "seller", name: "PhantomTrader", text: "Привет! Dragon Lore в наличии, могу показать скриншоты.", time: "14:22" },
  { id: 2, from: "user", name: "Вы", text: "Отлично! Можете снизить цену до 2300?", time: "14:23" },
  { id: 3, from: "seller", name: "PhantomTrader", text: "Минимум 2400, но включу бесплатную доставку через Steam.", time: "14:24" },
  { id: 4, from: "user", name: "Вы", text: "Договорились! Как оплата?", time: "14:25" },
];

const ORDERS = [
  { id: "#SVT-4821", date: "23 апр 2026", item: "AWP | Dragon Lore", game: "CS2", price: 2499, status: "completed" },
  { id: "#SVT-4798", date: "20 апр 2026", item: "10 000 V-Bucks", game: "Fortnite", price: 349, status: "completed" },
  { id: "#SVT-4750", date: "15 апр 2026", item: "Буст до Платины", game: "CS2", price: 599, status: "processing" },
];

function FlashTimer() {
  const [time, setTime] = useState({ h: 2, m: 47, s: 33 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="flash-sale-timer text-2xl">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  );
}

function ProductCard({ product }: { product: Product }) {
  const rarity = RARITY_CONFIG[product.rarity];
  return (
    <div className="glass-card glass-card-hover rounded-xl overflow-hidden relative group">
      {product.isFlash && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-600 to-purple-700 text-white font-orbitron text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm uppercase">
          ⚡ Флеш
        </div>
      )}
      {product.isNew && !product.isFlash && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-orbitron text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-sm uppercase">
          ✦ Новое
        </div>
      )}
      {product.verified && (
        <div className="absolute top-2 right-2 z-10 verified-badge">✓ SVICH</div>
      )}

      <div className="h-36 flex items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(13,13,26,0.9), rgba(30,15,50,0.8))" }}>
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <span className="text-6xl animate-float product-image-glow relative z-10">{product.image}</span>
        <div className="absolute bottom-0 left-0 right-0 h-8"
          style={{ background: "linear-gradient(0deg, rgba(13,13,26,0.9), transparent)" }} />
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-orbitron font-bold border rounded-sm px-1.5 py-0.5 ${rarity.className}`}>
            {rarity.icon} {rarity.label.toUpperCase()}
          </span>
          <span className="text-[10px] text-white/40 font-rubik ml-auto">{product.game}</span>
        </div>
        <div>
          <h3 className="text-white font-rubik font-semibold text-sm leading-tight line-clamp-1">{product.name}</h3>
          <p className="text-white/40 text-[10px] mt-0.5">{product.server} • {product.category}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-yellow-400">{"★".repeat(Math.floor(product.sellerRating))}</span>
          <span className="text-[10px] text-white/40">{product.seller}</span>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="price-tag text-white font-bold text-base">
              {product.price.toLocaleString("ru-RU")} ₽
            </div>
            {product.oldPrice && (
              <div className="text-white/35 text-[10px] line-through font-rubik">
                {product.oldPrice.toLocaleString("ru-RU")} ₽
              </div>
            )}
          </div>
          <button className="btn-cyber-pink rounded-md px-3 py-1.5 text-[10px] cursor-pointer">
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}

function Navbar({ active, setSection }: { active: Section; setSection: (s: Section) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links: { key: Section; label: string }[] = [
    { key: "home", label: "Главная" },
    { key: "categories", label: "Категории" },
    { key: "marketplace", label: "Маркетплейс" },
    { key: "about", label: "О нас" },
    { key: "cabinet", label: "Кабинет" },
    { key: "contacts", label: "Контакты" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "rgba(5,5,8,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(192,132,252,0.15)" }}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSection("home")} className="flex items-center gap-2 cursor-pointer bg-transparent border-0">
          <div className="w-7 h-7 rounded-md flex items-center justify-center text-sm"
            style={{ background: "linear-gradient(135deg, #FF0099, #7B2FBE)", boxShadow: "0 0 12px rgba(255,0,153,0.5)" }}>
            ⚡
          </div>
          <span className="font-orbitron font-bold text-sm text-white tracking-wider">
            SVICH <span className="neon-text-pink">TEAM</span>
          </span>
        </button>

        <div className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <button key={link.key} onClick={() => setSection(link.key)}
              className={`nav-link cursor-pointer bg-transparent border-0 ${active === link.key ? "active" : ""}`}>
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 glass-card rounded-full px-3 py-1.5">
            <span className="text-xs">💎</span>
            <span className="font-orbitron text-xs font-bold text-white">3 240 ₽</span>
          </div>
          <button onClick={() => setSection("cabinet")}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-0"
            style={{ background: "linear-gradient(135deg, #7B2FBE, #FF0099)" }}>
            <Icon name="User" size={14} className="text-white" />
          </button>
        </div>

        <button className="md:hidden cursor-pointer bg-transparent border-0 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}>
          <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden glass-card" style={{ borderTop: "1px solid rgba(123,47,190,0.2)" }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
            {links.map(link => (
              <button key={link.key} onClick={() => { setSection(link.key); setMobileOpen(false); }}
                className={`nav-link text-left cursor-pointer bg-transparent border-0 py-1 ${active === link.key ? "active" : ""}`}>
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function HomePage({ setSection }: { setSection: (s: Section) => void }) {
  const flash = PRODUCTS.filter(p => p.isFlash);
  const newest = PRODUCTS.filter(p => p.isNew);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center hero-bg cyber-grid overflow-hidden">
        <div className="scan-line-overlay" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-20"
            style={{ backgroundImage: `url(${HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center left" }} />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, #050508 45%, rgba(5,5,8,0.2) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-32">
          <div className="max-w-2xl animate-fade-in opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <div className="inline-flex items-center gap-2 glass-card neon-border-cyan rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-orbitron text-xs text-white/70 tracking-widest">МАРКЕТПЛЕЙС ОНЛАЙН</span>
            </div>

            <h1 className="font-orbitron font-black mb-4 leading-none">
              <span className="glitch-text text-white text-4xl md:text-6xl block" data-text="SVICH TEAM">SVICH TEAM</span>
              <span className="gradient-text text-3xl md:text-5xl block mt-2">MARKETPLACE</span>
            </h1>

            <p className="font-rubik text-white/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Повышайте свой уровень игры. Редкие скины, топовые аккаунты, игровая валюта — всё с защитой покупателя и гарантией возврата.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => setSection("marketplace")}
                className="btn-cyber-pink rounded-lg px-6 py-3 text-sm cursor-pointer">
                Перейти в маркетплейс →
              </button>
              <button onClick={() => setSection("categories")}
                className="btn-cyber-outline rounded-lg px-6 py-3 text-sm cursor-pointer">
                Все категории
              </button>
            </div>

            <div className="flex flex-wrap gap-8">
              {[
                { value: "50,000+", label: "Товаров" },
                { value: "12,400+", label: "Продавцов" },
                { value: "99.2%", label: "Успешных сделок" },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-orbitron font-bold text-xl neon-text-pink">{stat.value}</div>
                  <div className="text-white/40 text-xs font-rubik mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: "linear-gradient(0deg, #050508, transparent)" }} />
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title text-white text-xl">⭐ Рекомендуемые товары</h2>
          <button onClick={() => setSection("marketplace")} className="text-white/40 hover:text-white font-rubik text-sm transition-colors cursor-pointer bg-transparent border-0">
            Все товары →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,0,153,0.07), rgba(123,47,190,0.07))", borderTop: "1px solid rgba(255,0,153,0.12)", borderBottom: "1px solid rgba(255,0,153,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="section-title text-white text-xl">⚡ Флеш-распродажа</h2>
              <p className="text-white/40 text-sm font-rubik mt-3">Заканчивается через</p>
            </div>
            <FlashTimer />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flash.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* NEW ITEMS */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="section-title text-white text-xl mb-8">✦ Новые поступления</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {newest.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TOP SELLERS */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="section-title text-white text-xl mb-10">🏆 Лучшие продавцы</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_SELLERS.map((seller, i) => (
            <div key={seller.name} className="glass-card glass-card-hover rounded-xl p-5 text-center">
              <div className="relative inline-block mb-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto"
                  style={{ background: "linear-gradient(135deg, rgba(123,47,190,0.4), rgba(255,0,153,0.2))", border: "2px solid rgba(192,132,252,0.4)" }}>
                  {seller.avatar}
                </div>
                {seller.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)" }}>
                    <span className="text-[8px] font-black text-black">✓</span>
                  </div>
                )}
              </div>
              <div className="font-orbitron text-white font-semibold text-sm">{seller.name}</div>
              <div className="text-yellow-400 text-xs mt-1">★★★★★ {seller.rating}</div>
              <div className="text-white/40 text-[11px] mt-1 font-rubik">{seller.sales.toLocaleString("ru-RU")} продаж</div>
              {i === 0 && <div className="mt-2 verified-badge inline-block">ТОП ПРОДАВЕЦ</div>}
            </div>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16"
        style={{ background: "rgba(13,13,26,0.8)", borderTop: "1px solid rgba(192,132,252,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-orbitron text-white font-bold text-xl text-center mb-12">🛡️ Мы гарантируем</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: "🔒", title: "Безопасные платежи", desc: "Все транзакции защищены 256-bit шифрованием. Ваши данные в полной безопасности." },
              { icon: "🛡️", title: "Защита покупателя", desc: "Средства заморожены до получения товара. Никакого риска для покупателя." },
              { icon: "💸", title: "Гарантия возврата", desc: "Если товар не соответствует описанию — вернём деньги в течение 24 часов." },
            ].map(item => (
              <div key={item.title} className="glass-card rounded-xl p-6 text-center glass-card-hover">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-orbitron text-white font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm font-rubik leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoriesPage({ setSection }: { setSection: (s: Section) => void }) {
  return (
    <div className="min-h-screen py-24 max-w-7xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="section-title text-white text-2xl mb-2">Категории</h1>
        <p className="text-white/40 text-sm font-rubik mt-4">Выберите нужный раздел маркетплейса</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map(cat => (
          <button key={cat.name} onClick={() => setSection("marketplace")}
            className="glass-card glass-card-hover rounded-xl p-6 text-left cursor-pointer border-0 w-full group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: "rgba(13,13,26,0.8)", border: `1px solid ${cat.color}40`, boxShadow: `0 0 15px ${cat.color}25` }}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-orbitron text-white font-bold text-sm">{cat.name}</h3>
                <div className="text-white/40 text-xs font-rubik mt-0.5">{cat.count.toLocaleString("ru-RU")} товаров</div>
              </div>
              <Icon name="ChevronRight" size={18} className="text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 glass-card rounded-xl p-6" style={{ border: "1px solid rgba(255,215,0,0.2)" }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎮</span>
          <h2 className="font-orbitron text-white font-bold">Популярные игры</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {["CS2", "Dota 2", "Valorant", "Fortnite", "Minecraft", "Genshin Impact", "TF2", "PUBG", "Apex Legends", "GTA V"].map(game => (
            <button key={game} onClick={() => setSection("marketplace")}
              className="btn-cyber-outline rounded-md px-3 py-1.5 text-[11px] cursor-pointer">
              {game}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("Все");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedRarity, setSelectedRarity] = useState("Все");
  const [selectedServer, setSelectedServer] = useState("Все");
  const [maxPrice, setMaxPrice] = useState(5000);

  const games = ["Все", "CS2", "Dota 2", "Valorant", "Fortnite", "Genshin Impact", "TF2"];
  const categories = ["Все", "Скины", "Аккаунты", "Валюта", "Предметы", "Услуги"];
  const rarities = ["Все", "common", "rare", "epic", "legendary", "mythic"];
  const rarityLabels: Record<string, string> = { "Все": "Все", common: "Обычный", rare: "Редкий", epic: "Эпический", legendary: "Легендарный", mythic: "Мифический" };
  const servers = ["Все", "EU", "RU", "RU/CIS", "Global", "Asia"];

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.game.toLowerCase().includes(search.toLowerCase());
    const matchGame = selectedGame === "Все" || p.game === selectedGame;
    const matchCat = selectedCategory === "Все" || p.category === selectedCategory;
    const matchRarity = selectedRarity === "Все" || p.rarity === selectedRarity;
    const matchServer = selectedServer === "Все" || p.server === selectedServer;
    return matchSearch && matchGame && matchCat && matchRarity && matchServer && p.price <= maxPrice;
  });

  return (
    <div className="min-h-screen py-24 max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="section-title text-white text-2xl mb-2">Маркетплейс</h1>
        <p className="text-white/40 text-sm font-rubik mt-4">{PRODUCTS.length}+ товаров в каталоге</p>
      </div>

      <div className="relative mb-6">
        <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Поиск товаров, игр, продавцов..."
          className="cyber-input w-full rounded-xl pl-10 pr-4 py-3 text-sm" />
      </div>

      <div className="glass-card rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Игра", value: selectedGame, onChange: setSelectedGame, options: games },
          { label: "Категория", value: selectedCategory, onChange: setSelectedCategory, options: categories },
          { label: "Сервер", value: selectedServer, onChange: setSelectedServer, options: servers },
        ].map(f => (
          <div key={f.label}>
            <label className="text-white/40 text-[10px] font-orbitron uppercase tracking-wider block mb-1.5">{f.label}</label>
            <select value={f.value} onChange={e => f.onChange(e.target.value)}
              className="cyber-input w-full rounded-lg px-3 py-2 text-xs">
              {f.options.map(o => <option key={o} value={o} style={{ background: "#0d0d1a" }}>{o}</option>)}
            </select>
          </div>
        ))}
        <div>
          <label className="text-white/40 text-[10px] font-orbitron uppercase tracking-wider block mb-1.5">Редкость</label>
          <select value={selectedRarity} onChange={e => setSelectedRarity(e.target.value)}
            className="cyber-input w-full rounded-lg px-3 py-2 text-xs">
            {rarities.map(r => <option key={r} value={r} style={{ background: "#0d0d1a" }}>{rarityLabels[r]}</option>)}
          </select>
        </div>
        <div className="col-span-2 md:col-span-4">
          <label className="text-white/40 text-[10px] font-orbitron uppercase tracking-wider block mb-1.5">
            Макс. цена: <span className="neon-text-pink">{maxPrice.toLocaleString("ru-RU")} ₽</span>
          </label>
          <input type="range" min={100} max={5000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
            className="w-full accent-pink-500 cursor-pointer" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-white/40 font-rubik">Ничего не найдено. Попробуйте изменить фильтры.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen py-24 max-w-7xl mx-auto px-4">
      <div className="mb-12">
        <h1 className="section-title text-white text-2xl mb-2">О нас</h1>
        <p className="text-white/40 text-sm font-rubik mt-4">Svich Team — ваш надёжный маркетплейс</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="glass-card rounded-xl p-8">
          <div className="text-4xl mb-4">⚡</div>
          <h2 className="font-orbitron text-white font-bold text-lg mb-3">Кто мы</h2>
          <p className="text-white/55 font-rubik leading-relaxed text-sm">
            Svich Team — это команда геймеров и разработчиков, объединённых одной целью: создать самый безопасный и удобный маркетплейс игровых товаров на территории СНГ. С 2021 года мы помогаем игрокам покупать и продавать скины, аккаунты и игровую валюту без риска и стресса.
          </p>
        </div>
        <div className="glass-card rounded-xl p-8">
          <div className="text-4xl mb-4">🛡️</div>
          <h2 className="font-orbitron text-white font-bold text-lg mb-3">Наша миссия</h2>
          <p className="text-white/55 font-rubik leading-relaxed text-sm">
            Мы верим, что торговля игровыми предметами должна быть такой же простой и безопасной, как покупка в обычном магазине. Каждый продавец проходит верификацию, каждая сделка защищена системой гарантирования средств.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { value: "2021", label: "Год основания" },
          { value: "50K+", label: "Товаров" },
          { value: "150K+", label: "Пользователей" },
          { value: "₽1.2B+", label: "Оборот" },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-5 text-center neon-border-purple">
            <div className="font-orbitron font-black text-2xl gradient-text mb-1">{stat.value}</div>
            <div className="text-white/40 text-xs font-rubik">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-8">
        <h2 className="font-orbitron text-white font-bold text-lg mb-6">⚙️ Как работает защита покупателя</h2>
        <div className="space-y-5">
          {[
            { step: "01", title: "Оплата", desc: "Вы оплачиваете товар — средства замораживаются на нашем счёте." },
            { step: "02", title: "Передача", desc: "Продавец передаёт товар. Вы подтверждаете получение." },
            { step: "03", title: "Выплата", desc: "После подтверждения продавец получает деньги." },
            { step: "04", title: "Спор", desc: "Если что-то пошло не так — открываем спор и возвращаем деньги." },
          ].map(item => (
            <div key={item.step} className="flex gap-4 items-start">
              <div className="font-orbitron font-black text-lg neon-text-pink shrink-0 w-8">{item.step}</div>
              <div>
                <div className="font-orbitron text-white font-semibold text-sm mb-0.5">{item.title}</div>
                <div className="text-white/45 text-sm font-rubik">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CabinetPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const chatRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      from: "user",
      name: "Вы",
      text: chatInput,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    };
    setMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  return (
    <div className="min-h-screen py-24 max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="section-title text-white text-2xl mb-2">Личный кабинет</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-6 neon-border-purple">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "linear-gradient(135deg, #7B2FBE, #FF0099)" }}>
                🎮
              </div>
              <div>
                <div className="font-orbitron text-white font-bold">CyberPlayer_X</div>
                <div className="text-white/40 text-xs font-rubik">Покупатель • Верифицирован</div>
              </div>
            </div>
            <div className="space-y-0">
              {[
                { label: "Баланс", value: "💎 3 240 ₽", special: true },
                { label: "Сделок", value: "47" },
                { label: "Рейтинг", value: "★★★★★" },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
                  <span className="text-white/40 text-xs font-rubik">{row.label}</span>
                  <span className={`font-orbitron text-sm font-bold ${row.special ? "text-white" : row.label === "Рейтинг" ? "text-yellow-400" : "text-white"}`}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <button className="btn-cyber-pink w-full rounded-lg py-2 mt-4 cursor-pointer">
              Пополнить баланс
            </button>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="font-orbitron text-white font-bold text-sm mb-4">📦 История заказов</h3>
            <div className="space-y-3">
              {ORDERS.map(order => (
                <div key={order.id} className="rounded-lg p-3"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-orbitron text-[10px] text-white/40">{order.id}</span>
                    <span className={`text-[10px] font-orbitron rounded-sm px-1.5 py-0.5 ${
                      order.status === "completed" ? "text-green-400 bg-green-400/10" : "text-pink-400 bg-pink-500/10"
                    }`}>
                      {order.status === "completed" ? "Завершён" : "В процессе"}
                    </span>
                  </div>
                  <div className="text-white text-xs font-rubik font-medium line-clamp-1">{order.item}</div>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-white/30 text-[10px] font-rubik">{order.date}</span>
                    <span className="font-orbitron text-xs font-bold text-white">{order.price.toLocaleString("ru-RU")} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ONLINE CHAT */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden flex flex-col" style={{ height: 520 }}>
          <div className="px-5 py-3 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(192,132,252,0.15)", background: "rgba(5,5,8,0.9)" }}>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-orbitron text-white text-sm font-semibold">Онлайн-чат</span>
            <span className="text-white/40 text-xs font-rubik">• PhantomTrader</span>
            <div className="ml-auto verified-badge">✓ SVICH</div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: "rgba(5,5,8,0.4)" }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-xs px-4 py-2.5 ${msg.from === "user" ? "chat-bubble-user" : "chat-bubble-seller"}`}>
                  <p className="text-white text-sm font-rubik leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-white/25 text-[10px] font-rubik mt-1">{msg.name} • {msg.time}</span>
              </div>
            ))}
          </div>

          <div className="p-3 flex gap-2"
            style={{ borderTop: "1px solid rgba(192,132,252,0.12)", background: "rgba(5,5,8,0.85)" }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Напишите сообщение..."
              className="cyber-input flex-1 rounded-lg px-4 py-2.5 text-sm" />
            <button onClick={sendMessage}
              className="btn-cyber-pink rounded-lg px-4 py-2.5 cursor-pointer shrink-0">
              <Icon name="Send" size={15} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen py-24 max-w-5xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="section-title text-white text-2xl mb-2">Контакты</h1>
        <p className="text-white/40 text-sm font-rubik mt-4">Мы всегда на связи</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {[
            { icon: "💬", title: "Поддержка 24/7", desc: "support@svichteam.gg", sub: "Ответим в течение часа" },
            { icon: "🔒", title: "Споры и возвраты", desc: "disputes@svichteam.gg", sub: "Решаем за 24 часа" },
            { icon: "📢", title: "Telegram канал", desc: "@Svichmefces", sub: "Новости и акции", link: "https://t.me/Svichmefces" },
            { icon: "🤝", title: "Сотрудничество", desc: "partner@svichteam.gg", sub: "Для продавцов и партнёров" },
          ].map(item => (
            <a key={item.title} href={(item as { link?: string }).link ?? undefined} target="_blank" rel="noopener noreferrer"
              className={`glass-card glass-card-hover rounded-xl p-5 flex items-start gap-4 block no-underline ${(item as { link?: string }).link ? "cursor-pointer" : ""}`}>
              <div className="text-2xl">{item.icon}</div>
              <div className="flex-1">
                <div className="font-orbitron text-white font-semibold text-sm">{item.title}</div>
                <div className="neon-text-cyan text-xs font-rubik mt-0.5">{item.desc}</div>
                <div className="text-white/35 text-[11px] font-rubik mt-0.5">{item.sub}</div>
              </div>
              {(item as { link?: string }).link && (
                <div className="shrink-0 self-center">
                  <Icon name="ExternalLink" size={14} className="text-white/30 group-hover:text-white/60" />
                </div>
              )}
            </a>
          ))}
        </div>

        <div className="glass-card rounded-xl p-6 neon-border-purple">
          <h3 className="font-orbitron text-white font-bold mb-5">Написать нам</h3>
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-orbitron text-white font-bold mb-2">Сообщение отправлено!</div>
              <div className="text-white/40 text-sm font-rubik">Мы ответим в течение часа.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { key: "name" as const, label: "Имя", placeholder: "Ваш ник или имя", type: "text" },
                { key: "email" as const, label: "Email", placeholder: "your@email.com", type: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-white/40 text-[10px] font-orbitron uppercase tracking-wider block mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="cyber-input w-full rounded-lg px-4 py-2.5 text-sm" />
                </div>
              ))}
              <div>
                <label className="text-white/40 text-[10px] font-orbitron uppercase tracking-wider block mb-1.5">Сообщение</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Ваш вопрос или предложение..."
                  rows={4}
                  className="cyber-input w-full rounded-lg px-4 py-2.5 text-sm resize-none" />
              </div>
              <button onClick={() => form.name && form.email && form.message && setSent(true)}
                className="btn-cyber-pink w-full rounded-lg py-3 cursor-pointer">
                Отправить сообщение
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Footer({ setSection }: { setSection: (s: Section) => void }) {
  return (
    <footer style={{ background: "rgba(5,5,8,0.98)", borderTop: "1px solid rgba(192,132,252,0.08)" }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #FF0099, #7B2FBE)" }}>⚡</div>
              <span className="font-orbitron font-bold text-white text-sm">SVICH <span className="neon-text-pink">TEAM</span></span>
            </div>
            <p className="text-white/30 text-xs font-rubik leading-relaxed">
              Надёжный маркетплейс игровых товаров с гарантией возврата и защитой покупателя.
            </p>
          </div>
          <div>
            <h4 className="font-orbitron text-white/50 text-[10px] uppercase tracking-widest mb-3">Маркетплейс</h4>
            <div className="space-y-2">
              {["Скины", "Аккаунты", "Валюта", "Услуги"].map(l => (
                <button key={l} onClick={() => setSection("marketplace")}
                  className="block text-white/30 hover:text-white text-xs font-rubik transition-colors cursor-pointer bg-transparent border-0">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-white/50 text-[10px] uppercase tracking-widest mb-3">Поддержка</h4>
            <div className="space-y-2">
              {["Защита покупателя", "Возврат средств", "Споры", "Правила"].map(l => (
                <button key={l} onClick={() => setSection("about")}
                  className="block text-white/30 hover:text-white text-xs font-rubik transition-colors cursor-pointer bg-transparent border-0">{l}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-orbitron text-white/50 text-[10px] uppercase tracking-widest mb-3">Мы в сети</h4>
            <div className="flex gap-2 flex-wrap">
              {["💬", "📢", "🎮", "📧"].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer glass-card hover:neon-border-pink transition-all border-0">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 pt-5 flex flex-wrap justify-between items-center gap-3">
          <span className="text-white/20 text-[11px] font-rubik">© 2026 Svich Team Marketplace. Все права защищены.</span>
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/20 text-[11px] font-rubik">Система работает</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Index() {
  const [section, setSection] = useState<Section>("home");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [section]);

  const renderSection = () => {
    switch (section) {
      case "home": return <HomePage setSection={setSection} />;
      case "categories": return <CategoriesPage setSection={setSection} />;
      case "marketplace": return <MarketplacePage />;
      case "about": return <AboutPage />;
      case "cabinet": return <CabinetPage />;
      case "contacts": return <ContactsPage />;
      default: return <HomePage setSection={setSection} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      <Navbar active={section} setSection={setSection} />
      <main>{renderSection()}</main>
      <Footer setSection={setSection} />
    </div>
  );
}