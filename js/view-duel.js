/* Вкладка «Дуель»: пряме порівняння будь-яких двох країн. Посилання: #duel/PL/CN */
const DUEL_PRESETS = [["PL","CN"],["US","IN"],["DE","RU"],["TR","IR"],["FR","BR"],["GB","ID"],["IT","EG"],["CA","ZA"]];

function dState(){ return viewDuel.state || (viewDuel.state = {a:"PL", b:"CN"}); }
viewDuel.init = function(args){
  const s = dState();
  if(args[0] && DATA.country(args[0])) s.a = args[0];
  if(args[1] && DATA.country(args[1])) s.b = args[1];
};

/* Кольори сторін: за блоком; якщо блок однаковий — друга сторона світліша. */
function duelColors(a,b){
  const base = c => c.bloc==="N" ? "var(--nato)" : "var(--brics)";
  const ca = base(a);
  const cb = a.bloc===b.bloc ? `color-mix(in srgb, ${base(b)} 45%, white)` : base(b);
  return [ca,cb];
}

function duelRow(label, unit, va, vb, cols, src, ok){
  const tot = (va||0)+(vb||0);
  const pa = tot ? va/tot*100 : 50;
  const lead = va===vb ? "" : (va>vb ? "a" : "b");
  return `<div class="duel-row">
    <div class="duel-head"><b>${UI.esc(label)} <span class="src ${ok?"ok":"est"}" title="${UI.esc(src)}">${ok?"✓":"≈"}</span></b><span class="muted">${UI.esc(unit)}</span></div>
    <div class="duel-vals"><span style="color:${cols[0]};${lead==="a"?"":"opacity:.75"}">${DATA.fmt(va)}</span><span style="color:${cols[1]};${lead==="b"?"":"opacity:.75"}">${DATA.fmt(vb)}</span></div>
    <div class="bar2"><i style="width:${pa}%;background:${cols[0]}"></i><i style="width:${100-pa}%;background:${cols[1]}"></i></div>
  </div>`;
}

function duelSide(c, col){
  return `<div class="card" style="border-top:3px solid ${col}">
    <div class="label">${D.bloc(c.bloc)} · ${t("з","since")} ${c.joined}${t(" р.","")}</div>
    <h2 style="margin:4px 0 6px;font-size:24px;color:${col}">${UI.esc(D.cname(c))}</h2>
    <p class="muted" style="margin:0;font-size:13px">${UI.esc(D.cnote(c))}</p>
  </div>`;
}

function viewDuel(){
  const s = dState(), A = DATA.country(s.a), B = DATA.country(s.b);
  const cols = duelColors(A,B);
  const nm = c => UI.esc(D.cname(c));
  const picker = (id,val)=>`<select id="${id}" aria-label="${t("Країна","Country")}">${["N","B"].map(bl=>`<optgroup label="${D.bloc(bl)}">${DATA.byBloc(bl).map(c=>`<option value="${c.code}" ${c.code===val?"selected":""}>${nm(c)}</option>`).join("")}</optgroup>`).join("")}</select>`;
  const chips = DUEL_PRESETS.map(p=>`<button type="button" class="chip ${(p[0]===s.a&&p[1]===s.b)?"on":""}" data-a="${p[0]}" data-b="${p[1]}">${nm(DATA.country(p[0]))} – ${nm(DATA.country(p[1]))}</button>`).join("");

  let wins = [0,0];
  const rows = DATA.metrics.map(m=>{
    if(A[m.k]!==B[m.k]) wins[A[m.k]>B[m.k]?0:1]++;
    const d = D.metric(m);
    return duelRow(d.label,d.unit,A[m.k],B[m.k],cols,d.src,m.ok);
  }).join("");

  /* Похідні показники */
  const per = c => c.pop ? c.budget*1000/c.pop : 0;                 // $ на людину
  const pct = c => c.gdp ? c.budget/c.gdp*100 : 0;                  // % ВВП
  const perSoldier = c => c.active ? c.budget*1e6/c.active/1000 : 0; // $ тис. на військового
  const derived = [
    duelRow(t("Оборонні витрати на людину","Defence spending per capita"),t("$ на особу","$ per person"),per(A),per(B),cols,t("Бюджет ÷ населення (ВВП і населення — оцінки)","Budget ÷ population (population is an estimate)"),false),
    duelRow(t("Оборонні витрати, % ВВП","Defence spending, % of GDP"),"%",pct(A),pct(B),cols,t("Бюджет ÷ ВВП (ВВП — оцінка); SIPRI дає точніші значення","Budget ÷ GDP (GDP is an estimate); SIPRI gives more precise values"),false),
    duelRow(t("Витрати на одного військового","Spending per service member"),t("$ тис.","$ thousand"),perSoldier(A),perSoldier(B),cols,t("Бюджет ÷ чисельність активного складу","Budget ÷ active personnel"),false)
  ].join("");

  const models = c => DATA.weapons.filter(w=>w.country===c.code && w.bloc===c.bloc);
  const modelChips = c => { const m = models(c);
    return m.length ? m.slice(0,12).map(w=>`<a class="chip" href="#weapons/${w.cat}/${encodeURIComponent(Router.slug(w.name))}">${UI.esc(D.weapon(w).name)}</a>`).join("")
      : `<span class="muted">${t("Власних моделей у базі немає.","No domestic models in the database.")}</span>`; };

  return `
    <h1>${t("Дуель країн","Country duel")}</h1>
    <p class="lead">${t("Оберіть будь-які дві країни і порівняйте їх за всіма показниками. Смуга показує частку кожної від суми двох.","Pick any two countries and compare them on every metric. The bar shows each country's share of the two-country total.")}</p>
    <div class="chips">${chips}</div>
    <div class="controls">${picker("da",s.a)} <span class="muted">${t("проти","vs")}</span> ${picker("db",s.b)}
      <button type="button" class="btn" id="swap">⇄ ${t("Поміняти","Swap")}</button>
      <button type="button" class="btn" id="copy">${t("Копіювати посилання","Copy link")}</button></div>
    <div class="grid g2">${duelSide(A,cols[0])}${duelSide(B,cols[1])}</div>
    <h2>${t("Показники","Metrics")}</h2>
    <div class="duel">${rows}</div>
    <h2>${t("Похідні показники","Derived metrics")}</h2>
    <div class="duel">${derived}</div>
    <div class="note">${t(
      `За кількістю показників з 13: ${nm(A)} — ${wins[0]}, ${nm(B)} — ${wins[1]}. Це лише кількісне порівняння; воно не враховує якість техніки, підготовку, союзників чи географію. ✓ — звірено з джерелом, ≈ — наближена оцінка.`,
      `Out of 13 metrics: ${nm(A)} leads on ${wins[0]}, ${nm(B)} on ${wins[1]}. This is a quantitative comparison only; it ignores equipment quality, training, allies and geography. ✓ = checked against a source, ≈ = approximate estimate.`)}</div>
    <div class="grid g2">
      <div><h3 style="color:${cols[0]}">${nm(A)}: ${t("моделі у базі","models in the database")}</h3><div class="chips">${modelChips(A)}</div></div>
      <div><h3 style="color:${cols[1]}">${nm(B)}: ${t("моделі у базі","models in the database")}</h3><div class="chips">${modelChips(B)}</div></div>
    </div>`;
}

viewDuel.bind = function(){
  const s = viewDuel.state, root = document.getElementById("view");
  Router.sync(["duel", s.a, s.b]);
  const rerender = ()=>{ root.innerHTML = viewDuel(); viewDuel.bind(); };
  document.getElementById("da").onchange = e=>{ s.a = e.target.value; rerender(); };
  document.getElementById("db").onchange = e=>{ s.b = e.target.value; rerender(); };
  document.getElementById("swap").onclick = ()=>{ [s.a,s.b]=[s.b,s.a]; rerender(); };
  document.getElementById("copy").onclick = e=>Router.copy(location.href, e.currentTarget);
  root.querySelectorAll(".chip[data-a]").forEach(c=>c.onclick=()=>{ s.a=c.dataset.a; s.b=c.dataset.b; rerender(); });
};
