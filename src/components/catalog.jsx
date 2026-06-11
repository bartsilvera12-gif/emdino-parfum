// EMDINO — Catálogo masculino: categorías, buscador, cards con foto real
const { useState: useCState, useMemo: useCMemo, useEffect: useCEffect } = React;

const CAT_LABELS = window.EMDINO_DATA.CATEGORY_LABELS;
const CAT_DESC = window.EMDINO_DATA.CATEGORY_DESC;
const CAT_ALL = window.EMDINO_DATA.MASCULINO_ALL;
const CAT_SIZES = window.EMDINO_DATA.SIZES;
const { formatGs: catFmt, waLink: catWa, waProductMessage } = window.EMDINO_UTILS;

function Placeholder({ marca }) {
  const initials = marca.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return (
    <div className="ph" aria-hidden="true">
      <span className="ph-mono">{initials}</span>
      <span className="ph-note">foto próximamente</span>
    </div>
  );
}

function ProductCard({ product, onAdd, onOpen }) {
  const [size, setSize] = useCState("5ml");
  const [added, setAdded] = useCState(false);
  const price = product.precios[size];

  const handleAdd = () => { onAdd(product, size); setAdded(true); setTimeout(() => setAdded(false), 1100); };

  return (
    <article className="pcard">
      <div
        className="pcard-media"
        role="button"
        tabIndex={0}
        aria-label={"Ver detalle de " + product.marca + " " + product.nombre}
        onClick={() => onOpen(product)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(product); } }}
      >
        {product.imagen
          ? <img className="pcard-img" src={product.imagen} alt={product.marca + " " + product.nombre} loading="lazy" />
          : <Placeholder marca={product.marca} />}
        <span className="pcard-cat">{CAT_LABELS[product.categoria]}</span>
        <span className="pcard-zoom" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7"></circle><path d="M11 8v6M8 11h6M20 20l-4-4"></path></svg>
        </span>
        <a className="pcard-wa" href={catWa(waProductMessage(product.marca + " " + product.nombre, size))} target="_blank" rel="noopener" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp" onClick={(e) => e.stopPropagation()}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.2-4.45A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9Z"></path></svg>
        </a>
      </div>
      <div className="pcard-body">
        <p className="pcard-brand">{product.marca}</p>
        <h3 className="pcard-name display">{product.nombre}</h3>
        <span className="pcard-divider" aria-hidden="true"></span>
        <div className="pcard-sizes">
          <span className="pcard-sizes-k">Presentación</span>
          <div className="size-row" role="group" aria-label="Presentación">
            {CAT_SIZES.map((s) => (
              <button key={s} className={"size-chip" + (size === s ? " active" : "")} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="pcard-foot">
          <div className="pcard-price"><span className="pcard-price-k">{size}</span><span className="pcard-price-v">{catFmt(price)}</span></div>
          <button className={"btn sm solid add-btn" + (added ? " added" : "")} onClick={handleAdd}>{added ? "Agregado ✓" : "Agregar"}</button>
        </div>
      </div>
    </article>
  );
}

const TABS = [
  { key: "todas", label: "Todas" },
  { key: "disenador", label: "Diseñador" },
  { key: "arabe", label: "Árabe" },
  { key: "nicho", label: "Nicho" },
];

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useCState("5ml");
  const [added, setAdded] = useCState(false);

  useCEffect(() => {
    if (!product) return undefined;
    setSize("5ml");
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [product]);

  if (!product) return null;
  const full = product.marca + " " + product.nombre;
  const handleAdd = () => { onAdd(product, size); setAdded(true); setTimeout(() => setAdded(false), 1100); };

  return (
    <div className="pmodal-root open" data-screen-label="Detalle de producto">
      <div className="overlay" onClick={onClose}></div>
      <div className="pmodal" role="dialog" aria-modal="true" aria-label={full}>
        <button className="x-btn pmodal-x" onClick={onClose} aria-label="Cerrar">\u2715</button>
        <div className="pmodal-media">
          {product.imagen
            ? <img src={product.imagen} alt={full} />
            : <div className="ph"><span className="ph-mono">{product.marca.split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}</span><span className="ph-note">foto pr\u00f3ximamente</span></div>}
        </div>
        <div className="pmodal-info">
          <span className="pmodal-cat">{CAT_LABELS[product.categoria]}</span>
          <p className="pmodal-brand">{product.marca}</p>
          <h3 className="pmodal-name display">{product.nombre}</h3>
          <p className="pmodal-desc">{CAT_DESC[product.categoria]}</p>
          <span className="pmodal-rule" aria-hidden="true"></span>

          <span className="pmodal-k">Presentaci\u00f3n</span>
          <div className="pmodal-sizes" role="group" aria-label="Presentaci\u00f3n">
            {CAT_SIZES.map((s) => (
              <button key={s} className={"size-chip" + (size === s ? " active" : "")} onClick={() => setSize(s)}>{s}</button>
            ))}
          </div>

          <ul className="pmodal-prices">
            {CAT_SIZES.map((s) => (
              <li key={s} className={size === s ? "is-active" : ""}>
                <span>{s}</span><span>{catFmt(product.precios[s])}</span>
              </li>
            ))}
          </ul>

          <div className="pmodal-foot">
            <div className="pmodal-price"><span className="pmodal-price-k">{size}</span><span className="pmodal-price-v">{catFmt(product.precios[size])}</span></div>
            <div className="pmodal-acts">
              <button className={"btn yellow add-btn" + (added ? " added" : "")} onClick={handleAdd}>{added ? "Agregado \u2713" : "Agregar " + size}</button>
              <a className="btn outline-dark" href={catWa(waProductMessage(full, size))} target="_blank" rel="noopener">Consultar por WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCatalog({ onAdd }) {
  const [tab, setTab] = useCState("todas");
  const [query, setQuery] = useCState("");
  const [shown, setShown] = useCState(12);
  const [detail, setDetail] = useCState(null);

  const filtered = useCMemo(() => {
    const q = norm(query.trim());
    return CAT_ALL.filter((p) => {
      if (tab !== "todas" && p.categoria !== tab) return false;
      if (!q) return true;
      const hay = norm(p.nombre + " " + p.marca + " " + CAT_LABELS[p.categoria]);
      return q.split(/\s+/).every((part) => hay.includes(part));
    });
  }, [tab, query]);

  const visible = filtered.slice(0, shown);

  return (
    <section className="section catalog" id="fragancias" data-screen-label="Catálogo masculino">
      <div className="wrap">
        <header className="catalog-page-head">
          <p className="eyebrow"><span className="tick"></span>Catálogo masculino</p>
          <h1 className="display catalog-page-title">La colección</h1>
          <p className="catalog-page-intro">{tab === "todas" ? "Decants fraccionados de perfumes originales. Elegí la presentación que quieras probar." : CAT_DESC[tab]}</p>
          <span className="catalog-rule" aria-hidden="true"></span>
        </header>

        <div className="catalog-bar">
          <div className="tabs" role="tablist" aria-label="Categorías">
            {TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} className={"tab" + (tab === t.key ? " active" : "")} onClick={() => { setTab(t.key); setShown(12); }}>{t.label}</button>
            ))}
          </div>
          <label className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg>
            <input type="search" value={query} placeholder="Buscar fragancia, marca o categoría…" onChange={(e) => { setQuery(e.target.value); setShown(12); }} aria-label="Buscar fragancia" />
          </label>
        </div>

        <p className="catalog-count"><span className="catalog-count-n">{filtered.length}</span> {filtered.length === 1 ? "fragancia" : "fragancias"}</p>

        {filtered.length === 0 ? (
          <div className="empty">
            <p className="display empty-t">Sin resultados</p>
            <p>No encontramos “{query}”. Probá con otra marca o <a href={catWa("Hola, estoy buscando el decant de " + query + ". ¿Lo tienen disponible?")} target="_blank" rel="noopener">consultanos por WhatsApp</a>.</p>
          </div>
        ) : (
          <div className="pgrid">{visible.map((p) => <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={setDetail} />)}</div>
        )}

        {shown < filtered.length && (
          <div className="more-row"><button className="btn outline-dark" onClick={() => setShown(shown + 12)}>Ver más ({filtered.length - shown})</button></div>
        )}
      </div>
      <ProductModal product={detail} onClose={() => setDetail(null)} onAdd={onAdd} />
    </section>
  );
}

window.ProductCatalog = ProductCatalog;
