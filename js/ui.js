/* Дрібні UI-утиліти. */
const UI = {
  esc(s){ return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); },
  cls(b){ return b==="N"?"n":"b"; },
  badge(b){ return `<span class="pill ${UI.cls(b)}">${D.bloc(b)}</span>`; },
  cc(code,b){ return `<span class="cc ${UI.cls(b)}">${UI.esc(code)}</span>`; },
  /* Двобічна смуга: частка НАТО проти БРІКС. */
  /* f — форматер значення; hideUnit — масштаб уже у числі («$30,3 трлн»), окрема одиниця не потрібна */
  duel(label, unit, n, b, note, f, hideUnit){
    f = f || DATA.fmt;
    const tot = n + b;
    const pn = tot ? (n/tot*100) : 50;
    const pb = 100 - pn;
    const nm = D.bloc("N"), bm = D.bloc("B");
    const hi = Math.max(n,b), lo = Math.min(n,b);
    const ratio = (lo>0 && hi/lo>=1.1) ? `${hi===n?nm:bm} ${t("більше у","is")} ${(hi/lo>=10?Math.round(hi/lo):Math.round(hi/lo*10)/10).toLocaleString(L.lang==="en"?"en-US":"uk-UA")}×${L.lang==="en"?" larger":""}` : "";
    return `<div class="duel-row">
      <div class="duel-head"><b>${UI.esc(label)}</b><span class="muted">${hideUnit?"":UI.esc(unit)}</span></div>
      <div class="duel-vals"><span class="c-nato">${f(n)}</span><span class="c-brics">${f(b)}</span></div>
      <div class="bar2" role="img" aria-label="${nm} ${f(n)}, ${bm} ${f(b)}"><i class="n" style="width:${pn}%"></i><i class="b" style="width:${pb}%"></i></div>
      <div class="duel-sub">${nm} ${pn.toFixed(0)}% · ${bm} ${pb.toFixed(0)}%${ratio?" · "+ratio:""}${note?" · "+UI.esc(note):""}</div>
    </div>`;
  },
  seg(name, opts, current){
    return `<div class="seg" data-seg="${name}">` + opts.map(o=>
      `<button type="button" data-v="${o.v}" class="${o.v===current?"on "+(o.c||""):""}">${UI.esc(o.t)}</button>`).join("") + `</div>`;
  },
  blocOpts(){ return [{v:"all",t:t("Усі","All")},{v:"N",t:D.bloc("N"),c:"n"},{v:"B",t:D.bloc("B"),c:"b"}]; }
};
