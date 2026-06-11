// EMDINO — Combos: visual compuesto con fotos reales de los frascos
const { useState: useKState } = React;
const { formatGs: kFmt, waLink: kWa, waComboMessage } = window.EMDINO_UTILS;

const pct = (c) => Math.round((1 - c.precioPromo / c.precioNormal) * 100);
const cut = (id) => "assets/perfumes-cut/" + id + ".png";

function ComboVisual({ combo, big }) {
  return (
    <div className={"combo-visual" + (big ? " big" : "")}>
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

const HOME_COMBOS_LIMIT = 8; // combos en la grilla del inicio (sin contar el destacado)

function ComboSection({ onAdd }) {
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
        <FeaturedCombo combo={all[0]} onAdd={onAdd} />
        <div className="combo-grid">{preview.map((c) => <ComboCard key={c.id} combo={c} onAdd={onAdd} />)}</div>
        <div className="more-row">
          <a className="btn outline-dark" href="#combos">Ver todos los combos{hasMore ? " (" + rest.length + ")" : ""}</a>
        </div>
      </div>
    </section>
  );
}

function ComboPage({ onAdd }) {
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
        <FeaturedCombo combo={all[0]} onAdd={onAdd} />
        <div className="combo-grid">{all.slice(1).map((c) => <ComboCard key={c.id} combo={c} onAdd={onAdd} />)}</div>
      </div>
    </section>
  );
}

Object.assign(window, { ComboSection, ComboPage });
