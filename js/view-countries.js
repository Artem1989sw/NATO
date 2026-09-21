/* Вкладка «Країни»: таблиця з сортуванням і картка країни / порівняння двох країн. */
function cState(){ return viewCountries.state || (viewCountries.state = {bloc:"all", q:"", sort:"budget", asc:false, sel:"US", cmp:""}); }
viewCountries.init = function(args){
  const s = cState();
  if(args[0] && DATA.country(args[0])){ s.sel = args[0]; s.cmp = (args[1] && DATA.country(args[1])) ? args[1] : ""; }
};

function viewCountries(){
  const s = cState();
  const loc = L.lang==="en" ? "en" : "uk";
  const cols = [["budget",t("Бюджет $млрд","Budget $bn")],["active",t("Армія тис.","Army k")],["tanks",t("Танки","Tanks")],["afv",t("БМП/БТР","IFV/APC")],["arty",t("Артилерія","Artillery")],["air",t("Літаки","Aircraft")],["heli",t("Гелікоптери","Helicopters")],["ships",t("Кораблі","Ships")],["subs",t("ПЧ","Subs")],["nukes",t("Ядерні бч","Warheads")]];
  const q = s.q.toLowerCase();
  let list = DATA.countries.filter(c=>(s.bloc==="all"||c.bloc===s.bloc) && (c.name.toLowerCase().includes(q) || D.cname(c).toLowerCase().includes(q)));
  list.sort((a,b)=> (s.sort==="name" ? D.cname(a).localeCompare(D.cname(b),loc) : (a[s.sort]-b[s.sort])) * (s.asc?1:-1));

  const head = `<th data-sort="name" class="${s.sort==="name"?"sorted"+(s.asc?" asc":""):""}">${t("Країна","Country")}</th>` +
    cols.map(c=>`<th data-sort="${c[0]}" class="${s.sort===c[0]?"sorted"+(s.asc?" asc":""):""}">${c[1]}</th>`).join("");
  const rows = list.map(c=>`<tr data-code="${c.code}">
      <td>${UI.cc(c.code,c.bloc)}${UI.esc(D.cname(c))}</td>` +
      cols.map(k=>`<td>${DATA.fmt(c[k[0]])}</td>`).join("") + `</tr>`).join("");

  const picker = (id,val,blank)=>`<select id="${id}">${blank?`<option value="">— ${blank} —</option>`:""}${DATA.countries.map(c=>`<option value="${c.code}" ${c.code===val?"selected":""}>${UI.esc(D.cname(c))} (${D.bloc(c.bloc)})</option>`).join("")}</select>`;

  return `
    <h1>${t("Країни","Countries")}</h1>
    <p class="lead">${t(
      "Озброєння і ресурси кожної країни. Натисніть на назву стовпчика, щоб відсортувати, або на рядок — щоб відкрити картку країни.",
      "Armed forces and resources of each country. Click a column heading to sort, or a row to open the country card.")}</p>
    <div class="controls">
      ${UI.seg("bloc",UI.blocOpts(),s.bloc)}
      <input type="search" id="q" placeholder="${t("Пошук країни…","Search country…")}" value="${UI.esc(s.q)}" aria-label="${t("Пошук країни","Search country")}">
      <span class="count">${list.length} ${t("країн","countries")}</span>
    </div>
    <p class="hint">${t("Гортайте таблицю вбік, щоб побачити всі показники →","Scroll the table sideways to see all figures →")}</p>
    <div class="scroll" style="max-height:520px;overflow:auto"><table class="data"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="detail" id="detail">${countryDetail(s)}</div>
    <div class="controls"><span class="muted">${t("Порівняти:","Compare:")}</span>${picker("sel",s.sel)} <span class="muted">${t("з","with")}</span> ${picker("cmp",s.cmp,t("нічого","nothing"))}
      <button type="button" class="btn" id="copy">${t("Копіювати посилання","Copy link")}</button>
      ${s.cmp?`<a class="btn" href="#duel/${s.sel}/${s.cmp}">${t("Детальна дуель →","Detailed duel →")}</a>`:""}</div>`;
}

function countryDetail(s){
  const a = DATA.country(s.sel), b = s.cmp ? DATA.country(s.cmp) : null;
  if(!a) return "";
  const keys = DATA.metrics;
  const max = {}; keys.forEach(m=>{ max[m.k] = Math.max(...DATA.countries.map(c=>c[m.k]||0)) || 1; });
  const rowsFor = (c)=> keys.map(m=>{
    const w = Math.min(100, (c[m.k]||0)/max[m.k]*100), d = D.metric(m);
    return `<div class="stat-row"><span title="${UI.esc(d.src)}">${d.label} <span class="src ${m.ok?"ok":"est"}">${m.ok?"✓":"≈"}</span></span><span class="track"><i style="width:${w}%;background:var(--${c.bloc==="N"?"nato":"brics"})"></i></span><span class="v">${DATA.fmtVal(m.k,c[m.k])}</span></div>`;
  }).join("");
  const card = c => `<div class="card ${UI.cls(c.bloc)}">
      <h3>${UI.cc(c.code,c.bloc)}${UI.esc(D.cname(c))} ${UI.badge(c.bloc)}</h3>
      <div class="muted" style="font-size:13px">${c.bloc==="N" ? t("У НАТО з","In NATO since") : t("У БРІКС (форум) з","In BRICS (forum) since")} ${c.joined}${t(" р.","")}</div>
      <p style="margin:10px 0 0">${UI.esc(D.cnote(c))}</p>
      <div class="stat-rows">${rowsFor(c)}</div>
    </div>`;
  return `<div class="grid ${b?"g2":""}">${card(a)}${b?card(b):""}</div>
    <p class="muted" style="font-size:12px">${t("Смуги нормовані до максимуму серед усіх 42 країн за кожним показником.","Bars are scaled to the maximum among all 42 countries for each metric.")} <span class="src ok">✓</span> ${t("звірено з першоджерелом","checked against a primary source")} (${DATA.verifiedOn}), <span class="src est">≈</span> ${t("наближена оцінка.","approximate estimate.")} ${t("Наведіть курсор на назву показника, щоб побачити джерело.","Hover over a metric name to see its source.")}</p>`;
}

viewCountries.bind = function(){
  const s = viewCountries.state, root = document.getElementById("view");
  Router.sync(["countries", s.sel, s.cmp]);
  document.getElementById("copy").onclick = e=>Router.copy(location.href, e.currentTarget);
  const rerender = (keepFocus)=>{ root.innerHTML = viewCountries(); viewCountries.bind();
    if(keepFocus){ const q = document.getElementById("q"); q.focus(); q.setSelectionRange(q.value.length,q.value.length); } };
  root.querySelectorAll("[data-seg=bloc] button").forEach(b=>b.onclick=()=>{ s.bloc=b.dataset.v; rerender(); });
  document.getElementById("q").oninput = e=>{ s.q = e.target.value; rerender(true); };
  root.querySelectorAll("th[data-sort]").forEach(th=>th.onclick=()=>{
    const k = th.dataset.sort; if(s.sort===k) s.asc=!s.asc; else { s.sort=k; s.asc = k==="name"; } rerender(); });
  root.querySelectorAll("tbody tr").forEach(tr=>tr.onclick=()=>{ s.sel = tr.dataset.code; rerender();
    document.getElementById("detail").scrollIntoView({block:"start"}); });
  document.getElementById("sel").onchange = e=>{ s.sel = e.target.value; rerender(); };
  document.getElementById("cmp").onchange = e=>{ s.cmp = e.target.value; rerender(); };
};
