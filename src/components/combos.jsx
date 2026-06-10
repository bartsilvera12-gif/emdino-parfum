// EMDINO — Combos: visual compuesto con fotos reales de los frascos
const { useState: useKState } = React;
const { formatGs: kFmt, waLink: kWa, waComboMessage } = window.EMDINO_UTILS;

const pct = (c) => Math.round((1 - c.precioPromo / c.precioNormal) * 100);
const cut = (id) => "assets/perfumes-cut/" + id + ".png";

function ComboBottles({ items, big }) {
  return (
    <div className={"combo-bottles" + (big ? " big" : "")} aria-hidden="true">
      {items.map((id, i) => (
        <img key={id} className={"cb cb-" + i} src={cut(id)} alt="" loading="lazy" />
      ))}
      <span className="combo-floor"></span>
    </div>
  );
}

function ComboVisual({ combo, big }) {
  return (
    <div className={"combo-visual" + (big ? " big" : "")}>
      <div className="combo-visual-top">
        <span className="combo-kicker">Combo decants</span>
        <p className="combo-name display">{combo.nombre}</p>
      </div>
      <ComboBottles items={combo.items} big={big} />
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
        <button className={"btn sm solid add-btn" + (added ? " added" : "")} onClick={onAdd}>{added ? "Agregado ✓" : "Agregar"}</button>
        <a className="pcard-wa dark" href={kWa(waComboMessage(combo.nombre))} target="_blank" rel="noopener" aria-label="Consultar combo por WhatsApp" title="WhatsApp">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9c-1.6 0-3.1-.42-4.4-1.15L3 21l1.2-4.45A8.96 8.96 0 0 1 3 12a9 9 0 0 1 9-9Z"></path></svg>
        </a>
      </div>
    </div>
  );
}

function FeaturedCombo({ combo, onAdd }) {
  const [added, setAdded] = useKState(false);
  const add = () => { onAdd(combo); setAdded(true); setTimeout(() => setAdded(false), 1100); };
  return (
    <article className="combo-feat reveal">
      <ComboVisual combo={combo} big={true} />
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

function ComboCard({ combo, onAdd }) {
  const [added, setAdded] = useKState(false);
  const add = () => { onAdd(combo); setAdded(true); setTimeout(() => setAdded(false), 1100); };
  return (
    <article className="combo-card reveal">
      <ComboVisual combo={combo} />
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

function ComboSection({ onAdd }) {
  const all = window.EMDINO_COMBOS;
  return (
    <section className="section combos" id="combos" data-screen-label="Combos">
      <div className="wrap">
        <div className="section-head reveal combos-head">
          <p className="eyebrow on-dark"><span className="tick"></span>Promociones</p>
          <h2 className="display">Combos</h2>
          <p>Tríos de decants pensados para combinar. Más fragancias, mejor precio.</p>
        </div>
        <FeaturedCombo combo={all[0]} onAdd={onAdd} />
        <div className="combo-grid">{all.slice(1).map((c) => <ComboCard key={c.id} combo={c} onAdd={onAdd} />)}</div>
      </div>
    </section>
  );
}

window.ComboSection = ComboSection;
