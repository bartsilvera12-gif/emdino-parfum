// EMDINO — Combos: visual compuesto con fotos reales de los frascos
const { useState: useKState, useEffect: useKEffect } = React;
const { formatGs: kFmt, waLink: kWa, waComboMessage } = window.EMDINO_UTILS;

const pct = (c) => Math.round((1 - c.precioPromo / c.precioNormal) * 100);
const cut = (id) => "assets/perfumes-cut/" + id + ".png";

function ComboVisual({ combo, big, onOpen }) {
  const interactive = !!onOpen;
  const handleKey = (e) => { if (interactive && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpen(combo); } };
  return (
    <div
      className={"combo-visual" + (big ? " big" : "") + (interactive ? " is-clickable" : "")}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? "Ver detalle del combo " + combo.nombre : undefined}
      onClick={interactive ? () => onOpen(combo) : undefined}
      onKeyDown={interactive ? handleKey : undefined}
    >
      <div className="combo-visual-top">
        <span className="combo-kicker">Set de decants</span>
        <p className="combo-name display">{combo.nombre}</p>
      </div>
      <div className="combo-bottles" aria-hidden="true">
        {combo.items.map((id, i) => (
          <img
            key={id}
            className={"cb cb-" + i}
            src={cut(id)}
            alt=""
            loading="lazy"
          />
        ))}
        <span className="combo-floor"></span>
      </div>
      <span className="combo-badge">{pct(combo)}% OFF</span>
    </div>
  );
}

function ComboActions({ combo, added, onAdd, big }) {
  return (
    <div className="combo-foot">
      <div className="combo-prices">
        <span className="price-old">{kFmt(combo.precioNormal)}</span>
        <span className={"price-promo" + (big ? " big" : "")}>{kFmt(combo.precioPromo)}</span>
      </div>
      <div className="combo-acts">
        <button className={"btn sm solid add-btn" + (added ? " added" : "")} onClick={(e) => { e.stopPropagation(); onAdd(); }}>{added ? "Agregado ✓" : "Agregar"}</button>
        <a className="pcard-wa dark" href={kWa(waComboMessage(combo.nombre))} target="_blank" rel="noopener" aria-label="Consultar combo por WhatsApp" title="WhatsApp" onClick={(e) => e.stopPropagation()}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.2-4.45A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9Z"></path></svg>
        </a>
      </div>
    </div>
  );
}

function FeaturedCombo({ combo, onAdd, onOpenCombo }) {
  const [added, setAdded] = useKState(false);
  const add = () => { onAdd(combo); setAdded(true); setTimeout(() => setAdded(false), 1100); };
  return (
    <article className="combo-feat reveal">
      <ComboVisual combo={combo} big={true} onOpen={onOpenCombo} />
      <div className="combo-feat-info">
        <p className="eyebrow"><span className="tick"></span>Más elegido</p>
        <h3 className="combo-feat-name display">Combo {combo.nombre}</h3>
        <p className="combo-feat-tag">{combo.tagline}</p>
        <ul className="combo-list">{combo.incluye.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="combo-pres">{combo.presentacion}</p>
        <ComboActions combo={combo} added={added} onAdd={add} big={true} />
      </div>
    </article>
  );
}

function ComboCard({ combo, onAdd, onOpenCombo }) {
  const [added, setAdded] = useKState(false);
  const add = () => { onAdd(combo); setAdded(true); setTimeout(() => setAdded(false), 1100); };
  return (
    <article className="combo-card reveal">
      <ComboVisual combo={combo} onOpen={onOpenCombo} />
      <div className="combo-info">
        <div className="combo-info-head">
          <h3 className="combo-name-sm display">Combo {combo.nombre}</h3>
          <span className="combo-tagline">{combo.tagline}</span>
        </div>
        <ul className="combo-list">{combo.incluye.map((f) => <li key={f}>{f}</li>)}</ul>
        <p className="combo-pres">{combo.presentacion}</p>
        <ComboActions combo={combo} added={added} onAdd={add} />
      </div>
    </article>
  );
}

const HOME_COMBOS_LIMIT = 8; // combos en la grilla del inicio (sin contar el destacado)

function ComboSection({ onAdd, onOpenCombo }) {
  const all = window.EMDINO_COMBOS;
  const rest = all.slice(1);
  const preview = rest.slice(0, HOME_COMBOS_LIMIT);
  const hasMore = rest.length > HOME_COMBOS_LIMIT;
  return (
    <section className="section combos" id="combos-preview" data-screen-label="Combos">
      <div className="wrap">
        <div className="section-head reveal combos-head">
          <p className="eyebrow"><span className="tick"></span>Sets seleccionados</p>
          <h2 className="display">Combos para regalar y descubrir</h2>
          <p>Tríos de decants curados para combinar entre sí. Más fragancias, mejor precio, listos para regalar.</p>
        </div>
        <FeaturedCombo combo={all[0]} onAdd={onAdd} onOpenCombo={onOpenCombo} />
        <div className="combo-grid">{preview.map((c) => <ComboCard key={c.id} combo={c} onAdd={onAdd} onOpenCombo={onOpenCombo} />)}</div>
        <div className="more-row">
          <a className="btn outline-dark" href="#combos">Ver todos los combos{hasMore ? " (" + rest.length + ")" : ""}</a>
        </div>
      </div>
    </section>
  );
}

function ComboPage({ onAdd, onOpenCombo }) {
  const all = window.EMDINO_COMBOS;
  return (
    <section className="section combos" id="combos" data-screen-label="Todos los combos">
      <div className="wrap">
        <header className="catalog-page-head">
          <p className="eyebrow"><span className="tick"></span>Sets seleccionados</p>
          <h1 className="display catalog-page-title">Todos los combos</h1>
          <p className="catalog-page-intro">Tríos de decants curados para combinar entre sí. Más fragancias, mejor precio, listos para regalar.</p>
          <span className="catalog-rule" aria-hidden="true"></span>
        </header>
        <FeaturedCombo combo={all[0]} onAdd={onAdd} onOpenCombo={onOpenCombo} />
        <div className="combo-grid">{all.slice(1).map((c) => <ComboCard key={c.id} combo={c} onAdd={onAdd} onOpenCombo={onOpenCombo} />)}</div>
      </div>
    </section>
  );
}

function ComboModal({ combo, onClose, onAdd }) {
  const [added, setAdded] = useKState(false);
  useKEffect(() => {
    if (!combo) return undefined;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [combo]);

  if (!combo) return null;
  const PRODUCTS_BY_ID = window.EMDINO_DATA.PRODUCTS_BY_ID;
  const items = combo.items.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);
  const off = pct(combo);
  const ahorro = combo.precioNormal - combo.precioPromo;

  const handleAdd = () => { onAdd(combo); setAdded(true); setTimeout(() => setAdded(false), 1100); };

  return (
    <div className="pmodal-root open" data-screen-label="Detalle de combo">
      <div className="overlay" onClick={onClose}></div>
      <div className="pmodal cmodal" role="dialog" aria-modal="true" aria-label={"Combo " + combo.nombre}>
        <button className="x-btn pmodal-x" onClick={onClose} aria-label="Cerrar">&#10005;</button>
        <div className="pmodal-media cmodal-media">
          <span className="cmodal-kicker">Set de decants</span>
          <p className="cmodal-name display">{combo.nombre}</p>
          <div className="cmodal-bottles" aria-hidden="true">
            {combo.items.map((id, i) => (
              <img key={id} className={"cb cb-" + i} src={cut(id)} alt="" loading="lazy" />
            ))}
          </div>
          <span className="combo-floor"></span>
          <span className="combo-badge cmodal-badge">{off}% OFF</span>
        </div>
        <div className="pmodal-info">
          <span className="pmodal-cat">Combo especial</span>
          <p className="pmodal-brand">Set de decants</p>
          <h3 className="pmodal-name display">Combo {combo.nombre}</h3>
          <p className="pmodal-desc">{combo.tagline}</p>
          <span className="pmodal-rule" aria-hidden="true"></span>

          <span className="pmodal-k">Incluye</span>
          <ul className="combo-list cmodal-list">
            {items.map((p, i) => (
              <li key={p.id}>
                <span className="cmodal-item-name">{p.marca} {p.nombre}</span>
                <span className="cmodal-item-cat">{window.EMDINO_DATA.CATEGORY_LABELS[p.categoria]}</span>
              </li>
            ))}
          </ul>
          <p className="combo-pres cmodal-pres">{combo.presentacion}</p>

          <div className="pmodal-foot">
            <div className="cmodal-prices">
              <span className="cmodal-price-old">{kFmt(combo.precioNormal)}</span>
              <span className="cmodal-price-promo">{kFmt(combo.precioPromo)}</span>
              <span className="cmodal-price-saving">Ahorrás {kFmt(ahorro)}</span>
            </div>
            <div className="pmodal-acts">
              <button className={"btn yellow add-btn pmodal-add" + (added ? " added" : "")} onClick={handleAdd}>{added ? "Agregado ✓" : "Agregar al carrito"}</button>
              <a className="pmodal-wa" href={kWa(waComboMessage(combo.nombre))} target="_blank" rel="noopener" aria-label="Consultar combo por WhatsApp" title="Consultar por WhatsApp">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5a11.5 11.5 0 0 0-9.9 17.3L.5 23.5l5.9-1.5A11.5 11.5 0 1 0 12 .5Zm0 21a9.5 9.5 0 0 1-4.9-1.3l-.4-.2-3.5.9.9-3.4-.2-.4A9.5 9.5 0 1 1 12 21.5Zm5.4-7.1c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.2-.8.9-.9 1.1c-.2.2-.3.2-.6.1a8 8 0 0 1-2.3-1.4 8.7 8.7 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.4.3-.4c.1-.2 0-.3 0-.5l-.9-2c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4a3.4 3.4 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 12.9 12.9 0 0 0 5 4.4 17 17 0 0 0 1.7.6 4 4 0 0 0 1.8.1 3 3 0 0 0 2-1.4 2.4 2.4 0 0 0 .2-1.4c-.1-.1-.3-.2-.6-.3Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ComboSection, ComboPage, ComboModal });
