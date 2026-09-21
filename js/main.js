/* Простий hash-роутер. */
(function(){
  const routes = {
    overview:{render:viewOverview},
    compare:{render:viewCompare, bind:()=>viewCompare.bind()},
    countries:{render:viewCountries, bind:()=>viewCountries.bind()},
    weapons:{render:viewWeapons, bind:()=>viewWeapons.bind()},
    method:{render:viewMethod}
  };
  function go(){
    const key = (location.hash||"#overview").slice(1);
    const r = routes[key] || routes.overview;
    const active = routes[key] ? key : "overview";
    const root = document.getElementById("view");
    root.innerHTML = r.render();
    if(r.bind) r.bind();
    document.querySelectorAll("#tabs a").forEach(a=>a.classList.toggle("on", a.dataset.tab===active));
    const on = document.querySelector("#tabs a.on");
    if(on) document.getElementById("tabs").scrollLeft = on.offsetLeft - 16;
    window.scrollTo(0,0);
  }
  window.addEventListener("hashchange", go);
  go();
})();
