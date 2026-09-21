/* Hash-роутер з підтримкою глибоких посилань: #countries/PL/CN, #weapons/air/f-35a-b-c-lightning-ii */
const Router = {
  /* Оновити адресу без повторного рендеру (для збереження стану у посиланні). */
  sync(parts){
    const h = "#" + parts.filter(Boolean).join("/");
    if(location.hash !== h) history.replaceState(null, "", h);
  },
  slug(s){ return String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu,"-").replace(/^-|-$/g,""); },
  async copy(text, btn){
    try{ await navigator.clipboard.writeText(text); }
    catch(e){ const t=document.createElement("textarea"); t.value=text; document.body.appendChild(t); t.select();
      try{ document.execCommand("copy"); }catch(_){} t.remove(); }
    if(btn){ const old=btn.textContent; btn.textContent=t("Скопійовано ✓","Copied ✓"); setTimeout(()=>btn.textContent=old,1500); }
  }
};

(function(){
  const routes = {
    overview:{render:viewOverview},
    compare:{render:viewCompare, bind:()=>viewCompare.bind()},
    countries:{render:viewCountries, init:a=>viewCountries.init(a), bind:()=>viewCountries.bind()},
    duel:{render:viewDuel, init:a=>viewDuel.init(a), bind:()=>viewDuel.bind()},
    weapons:{render:viewWeapons, init:a=>viewWeapons.init(a), bind:()=>viewWeapons.bind()},
    method:{render:viewMethod}
  };
  const NAV = {overview:["Огляд","Overview"], compare:["Порівняння сил","Force comparison"], countries:["Країни","Countries"],
    duel:["Дуель","Duel"], weapons:["Моделі озброєння","Weapons"], method:["Методологія","Methodology"]};
  function applyStatic(){
    document.querySelectorAll("#tabs a").forEach(a=>{ const n = NAV[a.dataset.tab]; if(n) a.textContent = t(n[0], n[1]); });
    document.getElementById("lang").textContent = L.lang==="en" ? "UA" : "EN";
    document.getElementById("tabs").setAttribute("aria-label", t("Розділи","Sections"));
    document.querySelector(".brand").setAttribute("aria-label", t("На головну","Home"));
    document.getElementById("lang").setAttribute("aria-label", t("Перемкнути мову на англійську","Switch language to Ukrainian"));
    document.getElementById("foot").textContent = t(
      "Бюджети (SIPRI, НАТО, 2025) і ядерні арсенали (FAS, 2026) звірено з першоджерелами, решта показників — наближені оцінки (позначено «≈»). Це інформаційний довідник, а не офіційне джерело. Деталі — у розділі «Методологія».",
      "Budgets (SIPRI, NATO, 2025) and nuclear arsenals (FAS, 2026) are checked against primary sources; all other figures are approximate estimates (marked “≈”). This is an information reference, not an official source. See “Methodology” for details.");
    document.title = t("NATO vs BRICS — порівняння блоків", "NATO vs BRICS — bloc comparison");
  }
  function go(){
    const parts = (location.hash||"#overview").slice(1).split("/").map(decodeURIComponent);
    const key = routes[parts[0]] ? parts[0] : "overview";
    const r = routes[key];
    if(r.init) r.init(parts.slice(1));
    const root = document.getElementById("view");
    root.innerHTML = r.render();
    if(r.bind) r.bind();
    document.querySelectorAll("#tabs a").forEach(a=>a.classList.toggle("on", a.dataset.tab===key));
    const on = document.querySelector("#tabs a.on");
    if(on) document.getElementById("tabs").scrollLeft = on.offsetLeft - 16;
    const focus = root.querySelector(".focus");
    if(focus) focus.scrollIntoView({block:"center"}); else window.scrollTo(0,0);
  }
  window.addEventListener("hashchange", go);
  document.getElementById("lang").onclick = ()=>{
    L.set(L.lang==="en" ? "uk" : "en");
    if(viewWeapons.state) viewWeapons.state.type = "all";   // назви типів залежать від мови
    applyStatic(); go();
  };
  L.init();
  applyStatic();
  go();
})();
