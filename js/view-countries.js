/* Вкладка «Країни»: таблиця з сортуванням і картка країни / порівняння двох країн. */
function cState(){ return viewCountries.state || (viewCountries.state = {bloc:"all", q:"", sort:"budget", asc:false, sel:"US", cmp:""}); }
viewCountries.init = function(args){
  const s = cState();
  if(args[0] && DATA.country(args[0])){ s.sel = args[0]; s.cmp = (args[1] && DATA.country(args[1])) ? args[1] : ""; }
};

function viewCountries(){
  const s = cState();
  const cols = [["budget","Бюджет $млрд"],["active","Армія тис."],["tanks","Танки"],["afv","БМП/БТР"],["arty","Артилерія"],["air","Літаки"],["heli","Гелікоптери"],["ships","Кораблі"],["subs","ПЧ"],["nukes","Ядерні бч"]];
  let list = DATA.countries.filter(c=>(s.bloc==="all"||c.bloc===s.bloc) && c.name.toLowerCase().includes(s.q.toLowerCase()));
  list.sort((a,b)=> (s.sort==="name" ? a.name.localeCompare(b.name,"uk") : (a[s.sort]-b[s.sort])) * (s.asc?1:-1));

  const head = `<th data-sort="name" class="${s.sort==="name"?"sorted"+(s.asc?" asc":""):""}">Країна</th>` +
    cols.map(c=>`<th data-sort="${c[0]}" class="${s.sort===c[0]?"sorted"+(s.asc?" asc":""):""}">${c[1]}</th>`).join("");
  const rows = list.map(c=>`<tr data-code="${c.code}">
      <td>${UI.cc(c.code,c.bloc)}${UI.esc(c.name)}</td>` +
      cols.map(k=>`<td>${DATA.fmt(c[k[0]])}</td>`).join("") + `</tr>`).join("");

  const opts = [{v:"all",t:"Усі"},{v:"N",t:"НАТО",c:"n"},{v:"B",t:"БРІКС",c:"b"}];
  const picker = (id,val,blank)=>`<select id="${id}">${blank?`<option value="">— ${blank} —</option>`:""}${DATA.countries.map(c=>`<option value="${c.code}" ${c.code===val?"selected":""}>${UI.esc(c.name)} (${DATA.blocName[c.bloc]})</option>`).join("")}</select>`;

  return `
    <h1>Країни</h1>
    <p class="lead">Озброєння і ресурси кожної країни. Натисніть на назву стовпчика, щоб відсортувати, або на рядок — щоб відкрити картку країни.</p>
    <div class="controls">
      ${UI.seg("bloc",opts,s.bloc)}
      <input type="search" id="q" placeholder="Пошук країни…" value="${UI.esc(s.q)}" aria-label="Пошук країни">
      <span class="count">${list.length} країн</span>
    </div>
    <p class="hint">Гортайте таблицю вбік, щоб побачити всі показники →</p>
    <div class="scroll" style="max-height:520px;overflow:auto"><table class="data"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>
    <div class="detail" id="detail">${countryDetail(s)}</div>
    <div class="controls"><span class="muted">Порівняти:</span>${picker("sel",s.sel)} <span class="muted">з</span> ${picker("cmp",s.cmp,"нічого")}
      <button type="button" class="btn" id="copy">Копіювати посилання</button>
      ${s.cmp?`<a class="btn" href="#duel/${s.sel}/${s.cmp}">Детальна дуель →</a>`:""}</div>`;
}

function countryDetail(s){
  const a = DATA.country(s.sel), b = s.cmp ? DATA.country(s.cmp) : null;
  if(!a) return "";
  const keys = DATA.metrics;
  const max = {}; keys.forEach(m=>{ max[m.k] = Math.max(...DATA.countries.map(c=>c[m.k]||0)) || 1; });
  const rowsFor = (c)=> keys.map(m=>{
    const w = Math.min(100, (c[m.k]||0)/max[m.k]*100);
    return `<div class="stat-row"><span title="${UI.esc(m.src)}">${m.label} <span class="src ${m.ok?"ok":"est"}">${m.ok?"✓":"≈"}</span></span><span class="track"><i style="width:${w}%;background:var(--${c.bloc==="N"?"nato":"brics"})"></i></span><span class="v">${DATA.fmt(c[m.k])}</span></div>`;
  }).join("");
  const card = c => `<div class="card ${UI.cls(c.bloc)}">
      <h3>${UI.cc(c.code,c.bloc)}${UI.esc(c.name)} ${UI.badge(c.bloc)}</h3>
      <div class="muted" style="font-size:13px">${c.bloc==="N"?"У НАТО":"У БРІКС (форум)"} з ${c.joined} р.</div>
      <p style="margin:10px 0 0">${UI.esc(c.note)}</p>
      <div class="stat-rows">${rowsFor(c)}</div>
    </div>`;
  return `<div class="grid ${b?"g2":""}">${card(a)}${b?card(b):""}</div>
    <p class="muted" style="font-size:12px">Смуги нормовані до максимуму серед усіх 42 країн за кожним показником. <span class="src ok">✓</span> звірено з першоджерелом (${DATA.verifiedOn}), <span class="src est">≈</span> наближена оцінка. Наведіть курсор на назву показника, щоб побачити джерело.</p>`;
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
