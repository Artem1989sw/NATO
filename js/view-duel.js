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

function duelSide(c, col, side){
  return `<div class="card" style="border-top:3px solid ${col}">
    <div class="label">${DATA.blocName[c.bloc]} · з ${c.joined} р.</div>
    <h2 style="margin:4px 0 6px;font-size:24px;color:${col}">${UI.esc(c.name)}</h2>
    <p class="muted" style="margin:0;font-size:13px">${UI.esc(c.note)}</p>
  </div>`;
}

function viewDuel(){
  const s = dState(), A = DATA.country(s.a), B = DATA.country(s.b);
  const cols = duelColors(A,B);
  const picker = (id,val)=>`<select id="${id}" aria-label="Країна">${["N","B"].map(bl=>`<optgroup label="${DATA.blocName[bl]}">${DATA.byBloc(bl).map(c=>`<option value="${c.code}" ${c.code===val?"selected":""}>${UI.esc(c.name)}</option>`).join("")}</optgroup>`).join("")}</select>`;
  const chips = DUEL_PRESETS.map(p=>`<button type="button" class="chip ${(p[0]===s.a&&p[1]===s.b)?"on":""}" data-a="${p[0]}" data-b="${p[1]}">${UI.esc(DATA.country(p[0]).name)} – ${UI.esc(DATA.country(p[1]).name)}</button>`).join("");

  let wins = [0,0];
  const rows = DATA.metrics.map(m=>{
    if(A[m.k]!==B[m.k]) wins[A[m.k]>B[m.k]?0:1]++;
    return duelRow(m.label,m.unit,A[m.k],B[m.k],cols,m.src,m.ok);
  }).join("");

  /* Похідні показники */
  const per = c => c.pop ? c.budget*1000/c.pop : 0;                 // $ на людину
  const pct = c => c.gdp ? c.budget/c.gdp*100 : 0;                  // % ВВП
  const perSoldier = c => c.active ? c.budget*1e6/c.active/1000 : 0; // $ тис. на військового
  const derived = [
    duelRow("Оборонні витрати на людину","$ на особу",per(A),per(B),cols,"Бюджет ÷ населення (ВВП і населення — оцінки)",false),
    duelRow("Оборонні витрати, % ВВП","%",pct(A),pct(B),cols,"Бюджет ÷ ВВП (ВВП — оцінка); SIPRI дає точніші значення",false),
    duelRow("Витрати на одного військового","$ тис.",perSoldier(A),perSoldier(B),cols,"Бюджет ÷ чисельність активного складу",false)
  ].join("");

  const models = c => DATA.weapons.filter(w=>w.country===c.code && w.bloc===c.bloc);
  const modelChips = c => { const m = models(c);
    return m.length ? m.slice(0,12).map(w=>`<a class="chip" href="#weapons/${w.cat}/${encodeURIComponent(Router.slug(w.name))}">${UI.esc(w.name)}</a>`).join("")
      : `<span class="muted">Власних моделей у базі немає.</span>`; };

  return `
    <h1>Дуель країн</h1>
    <p class="lead">Оберіть будь-які дві країни і порівняйте їх за всіма показниками. Смуга показує частку кожної від суми двох.</p>
    <div class="chips">${chips}</div>
    <div class="controls">${picker("da",s.a)} <span class="muted">проти</span> ${picker("db",s.b)}
      <button type="button" class="btn" id="swap">⇄ Поміняти</button>
      <button type="button" class="btn" id="copy">Копіювати посилання</button></div>
    <div class="grid g2">${duelSide(A,cols[0])}${duelSide(B,cols[1])}</div>
    <h2>Показники</h2>
    <div class="duel">${rows}</div>
    <h2>Похідні показники</h2>
    <div class="duel">${derived}</div>
    <div class="note">За кількістю показників з 13: ${UI.esc(A.name)} — ${wins[0]}, ${UI.esc(B.name)} — ${wins[1]}. Це лише кількісне порівняння; воно не враховує якість техніки, підготовку, союзників чи географію. ✓ — звірено з джерелом, ≈ — наближена оцінка.</div>
    <div class="grid g2">
      <div><h3 style="color:${cols[0]}">${UI.esc(A.name)}: моделі у базі</h3><div class="chips">${modelChips(A)}</div></div>
      <div><h3 style="color:${cols[1]}">${UI.esc(B.name)}: моделі у базі</h3><div class="chips">${modelChips(B)}</div></div>
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
