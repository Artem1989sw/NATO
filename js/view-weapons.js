/* Вкладка «Моделі озброєння»: бронетехніка, авіація, ППО/ракети, флот — з ТТХ. */
function viewWeapons(){
  const s = viewWeapons.state || (viewWeapons.state = {cat:"armor", bloc:"all", type:"all", q:""});
  const cats = [["armor","Бронетехніка"],["air","Авіація"],["missiles","ППО та ракети"],["naval","Флот"]];
  const inCat = DATA.weapons.filter(w=>w.cat===s.cat);
  const types = [...new Set(inCat.map(w=>w.type))].sort((a,b)=>a.localeCompare(b,"uk"));
  const q = s.q.toLowerCase();
  const list = inCat.filter(w=>
    (s.bloc==="all"||w.bloc===s.bloc) && (s.type==="all"||w.type===s.type) &&
    (!q || (w.name+" "+w.type+" "+w.spec+" "+w.desc).toLowerCase().includes(q)));

  const cards = list.map(w=>{
    const c = DATA.country(w.country);
    return `<article class="w ${UI.cls(w.bloc)}">
      <h3>${UI.esc(w.name)}</h3>
      <div class="meta">${UI.badge(w.bloc)}<span>${UI.esc(w.type)}</span><span>·</span><span>вир. ${c?UI.esc(c.name):UI.esc(w.country)}</span><span>·</span><span>${w.year} р.</span></div>
      <div class="spec">${UI.esc(w.spec)}</div>
      ${w.desc?`<p class="desc">${UI.esc(w.desc)}</p>`:""}
    </article>`;
  }).join("");

  const opts = [{v:"all",t:"Усі"},{v:"N",t:"НАТО",c:"n"},{v:"B",t:"БРІКС",c:"b"}];
  return `
    <h1>Моделі озброєння</h1>
    <p class="lead">Основні зразки техніки блоків з короткими ТТХ. Дані приблизні: у джерелах цифри розходяться, а точні параметри часто засекречені.</p>
    <div class="subtabs" role="tablist">${cats.map(c=>`<button type="button" role="tab" data-cat="${c[0]}" class="${c[0]===s.cat?"on":""}">${c[1]}</button>`).join("")}</div>
    <div class="controls">
      ${UI.seg("bloc",opts,s.bloc)}
      <select id="type" aria-label="Тип"><option value="all">Усі типи</option>${types.map(t=>`<option ${t===s.type?"selected":""}>${UI.esc(t)}</option>`).join("")}</select>
      <input type="search" id="q" placeholder="Пошук моделі…" value="${UI.esc(s.q)}" aria-label="Пошук моделі">
      <span class="count">${list.length} із ${inCat.length}</span>
    </div>
    ${list.length?`<div class="wgrid">${cards}</div>`:`<div class="empty">Нічого не знайдено за цими фільтрами.</div>`}`;
}

viewWeapons.bind = function(){
  const s = viewWeapons.state, root = document.getElementById("view");
  const rerender = (keepFocus)=>{ root.innerHTML = viewWeapons(); viewWeapons.bind();
    if(keepFocus){ const q = document.getElementById("q"); q.focus(); q.setSelectionRange(q.value.length,q.value.length); } };
  root.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{ s.cat=b.dataset.cat; s.type="all"; rerender(); });
  root.querySelectorAll("[data-seg=bloc] button").forEach(b=>b.onclick=()=>{ s.bloc=b.dataset.v; rerender(); });
  document.getElementById("type").onchange = e=>{ s.type = e.target.value; rerender(); };
  document.getElementById("q").oninput = e=>{ s.q = e.target.value; rerender(true); };
};
