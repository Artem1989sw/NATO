/* Вкладка «Моделі озброєння»: бронетехніка, авіація, ППО/ракети, флот — з ТТХ. */
function wState(){ return viewWeapons.state || (viewWeapons.state = {cat:"armor", bloc:"all", type:"all", q:"", focus:""}); }
viewWeapons.init = function(args){
  const s = wState();
  if(["armor","air","missiles","naval"].includes(args[0])){
    s.cat = args[0]; s.focus = args[1] || "";
    if(s.focus){ s.bloc="all"; s.type="all"; s.q=""; }
  }
};

function viewWeapons(){
  const s = wState();
  const loc = L.lang==="en" ? "en" : "uk";
  const cats = [["armor",t("Бронетехніка","Armour")],["air",t("Авіація","Aviation")],["missiles",t("ППО та ракети","Air defence & missiles")],["naval",t("Флот","Navy")]];
  const inCat = DATA.weapons.filter(w=>w.cat===s.cat);
  const types = [...new Set(inCat.map(w=>D.weapon(w).type))].sort((a,b)=>a.localeCompare(b,loc));
  const q = s.q.toLowerCase();
  const list = inCat.filter(w=>{
    const d = D.weapon(w);
    return (s.bloc==="all"||w.bloc===s.bloc) && (s.type==="all"||d.type===s.type) &&
      (!q || (w.name+" "+d.name+" "+d.type+" "+d.spec+" "+d.desc).toLowerCase().includes(q));
  });

  const cards = list.map(w=>{
    const c = DATA.country(w.country), d = D.weapon(w);
    const slug = Router.slug(w.name);
    const ph = D.photo(w);
    const photo = ph ? `<figure class="ph"><img src="img/weapons/${encodeURIComponent(ph.file)}" alt="${UI.esc(d.name)}" loading="lazy" onerror="this.closest('figure').remove()">
        <figcaption>${t("Фото:","Photo:")} ${UI.esc(ph.author)} · ${ph.url?`<a href="${UI.esc(ph.url)}" target="_blank" rel="noopener">${UI.esc(ph.license)}</a>`:UI.esc(ph.license)}</figcaption></figure>` : "";
    return `<article class="w ${UI.cls(w.bloc)}${s.focus===slug?" focus":""}" id="w-${UI.esc(slug)}">${photo}
      <h3><a class="wl" href="#weapons/${w.cat}/${encodeURIComponent(slug)}" title="${t("Посилання на цю модель","Link to this model")}">${UI.esc(d.name)}</a></h3>
      <div class="meta">${UI.badge(w.bloc)}<span>${UI.esc(d.type)}</span><span>·</span><span>${t("вир.","made in")} ${c?UI.esc(D.cname(c)):UI.esc(w.country)}</span><span>·</span><span>${w.year}${t(" р.","")}</span></div>
      <div class="spec">${UI.esc(d.spec)}</div>
      ${d.desc?`<p class="desc">${UI.esc(d.desc)}</p>`:""}
    </article>`;
  }).join("");

  return `
    <h1>${t("Моделі озброєння","Weapon models")}</h1>
    <p class="lead">${t("Основні зразки техніки блоків з короткими ТТХ. Дані приблизні: у джерелах цифри розходяться, а точні параметри часто засекречені.","Main equipment of the two blocs with brief specifications. Figures are approximate: sources disagree and exact parameters are often classified.")}</p>
    <div class="subtabs" role="tablist">${cats.map(c=>`<button type="button" role="tab" data-cat="${c[0]}" class="${c[0]===s.cat?"on":""}">${c[1]}</button>`).join("")}</div>
    <div class="controls">
      ${UI.seg("bloc",UI.blocOpts(),s.bloc)}
      <select id="type" aria-label="${t("Тип","Type")}"><option value="all">${t("Усі типи","All types")}</option>${types.map(x=>`<option ${x===s.type?"selected":""}>${UI.esc(x)}</option>`).join("")}</select>
      <input type="search" id="q" placeholder="${t("Пошук моделі…","Search model…")}" value="${UI.esc(s.q)}" aria-label="${t("Пошук моделі","Search model")}">
      <span class="count">${list.length} ${t("із","of")} ${inCat.length}</span>
    </div>
    ${list.length?`<div class="wgrid">${cards}</div>`:`<div class="empty">${t("Нічого не знайдено за цими фільтрами.","Nothing found for these filters.")}</div>`}`;
}

viewWeapons.bind = function(){
  const s = viewWeapons.state, root = document.getElementById("view");
  Router.sync(["weapons", s.cat, s.focus ? encodeURIComponent(s.focus) : ""]);
  const rerender = (keepFocus)=>{ s.focus = ""; root.innerHTML = viewWeapons(); viewWeapons.bind();
    if(keepFocus){ const q = document.getElementById("q"); q.focus(); q.setSelectionRange(q.value.length,q.value.length); } };
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{ s.cat=b.dataset.cat; s.type="all"; rerender(); });
  root.querySelectorAll("[data-seg=bloc] button").forEach(b=>b.onclick=()=>{ s.bloc=b.dataset.v; rerender(); });
  document.getElementById("type").onchange = e=>{ s.type = e.target.value; rerender(); };
  document.getElementById("q").oninput = e=>{ s.q = e.target.value; rerender(true); };
};
