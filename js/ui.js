/* Дрібні UI-утиліти. */
const UI = {
  esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); },
  cls(b){ return b==="N"?"n":"b"; },
  badge(b){ return `<span class="pill ${UI.cls(b)}">${DATA.blocName[b]}</span>`; },
  cc(code,b){ return `<span class="cc ${UI.cls(b)}">${UI.esc(code)}</span>`; },
  /* Двобічна смуга: частка НАТО проти БРІКС. */
  duel(label, unit, n, b, note){
    const tot = n + b;
    const pn = tot ? (n/tot*100) : 50;
    const pb = 100 - pn;
    return `<div class="duel-row">
      <div class="duel-head"><b>${UI.esc(label)}</b><span class="muted">${UI.esc(unit)}</span></div>
      <div class="duel-vals"><span class="c-nato">${DATA.fmt(n)}</span><span class="c-brics">${DATA.fmt(b)}</span></div>
      <div class="bar2" role="img" aria-label="НАТО ${DATA.fmt(n)}, БРІКС ${DATA.fmt(b)}"><i class="n" style="width:${pn}%"></i><i class="b" style="width:${pb}%"></i></div>
      <div class="duel-sub">НАТО ${pn.toFixed(0)}% · БРІКС ${pb.toFixed(0)}%${note?" · "+UI.esc(note):""}</div>
    </div>`;
  },
  seg(name, opts, current){
    return `<div class="seg" data-seg="${name}">` + opts.map(o=>
      `<button type="button" data-v="${o.v}" class="${o.v===current?"on "+(o.c||""):""}">${UI.esc(o.t)}</button>`).join("") + `</div>`;
  }
};
