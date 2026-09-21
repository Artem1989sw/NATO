/* Вкладка «Порівняння сил»: сумарні показники та частки. */
function viewCompare(){
  const st = viewCompare.state || (viewCompare.state = {excludeUS:false, excludeRF:false});
  const sumOf = (b,k)=>{
    let list = DATA.byBloc(b);
    if(b==="N" && st.excludeUS) list = list.filter(c=>c.code!=="US");
    if(b==="B" && st.excludeRF) list = list.filter(c=>c.code!=="RU");
    return list.reduce((s,c)=>s+(c[k]||0),0);
  };
  const groups = [
    [t("Економіка і людські ресурси","Economy and population"), ["pop","gdp","budget"]],
    [t("Особовий склад","Personnel"), ["active","reserve"]],
    [t("Сухопутні сили","Land forces"), ["tanks","afv","arty"]],
    [t("Авіація","Air power"), ["air","heli"]],
    [t("Флот і ядерний потенціал","Navy and nuclear forces"), ["ships","subs","nukes"]]
  ];
  const metric = k => DATA.metrics.find(m=>m.k===k);
  const body = groups.map(g=>`
    <h2>${g[0]}</h2>
    <div class="duel">${g[1].map(k=>{const m=metric(k), d=D.metric(m);return UI.duel(d.label,d.unit,sumOf("N",k),sumOf("B",k),(m.ok?"✓ ":"≈ ")+d.src,v=>DATA.fmtVal(k,v),!!DATA.kind[k]);}).join("")}</div>`).join("");

  const chk = (id,label,on)=>`<label style="display:inline-flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" id="${id}" ${on?"checked":""}> ${label}</label>`;
  return `
    <h1>${t("Порівняння сил","Force comparison")}</h1>
    <p class="lead">${t(
      "Сумарні показники країн-членів. Смуга показує частку кожного блоку від суми двох. Це арифметика, а не прогноз війни: БРІКС не діє як єдина армія.",
      "Combined figures of member states. The bar shows each bloc's share of the two-bloc total. This is arithmetic, not a war forecast: BRICS does not act as a single army.")}</p>
    <div class="controls">
      ${chk("ex-us",t("Без США (лише Європа та Канада в НАТО)","Without the US (Europe and Canada only in NATO)"),st.excludeUS)}
      ${chk("ex-ru",t("Без Росії у БРІКС","Without Russia in BRICS"),st.excludeRF)}
    </div>
    <div class="note">${t(
      "Танки і бронетехніка Росії — оцінка активного парку після втрат 2022–2025 років; запаси на зберіганні не враховано.",
      "Russian tank and armour figures are an estimate of the active fleet after the losses of 2022–2025; stored reserves are not included.")}</div>
    ${body}`;
}
viewCompare.bind = function(){
  const rerender = ()=>{ document.getElementById("view").innerHTML = viewCompare(); viewCompare.bind(); };
  const st = viewCompare.state;
  document.getElementById("ex-us").onchange = e=>{ st.excludeUS = e.target.checked; rerender(); };
  document.getElementById("ex-ru").onchange = e=>{ st.excludeRF = e.target.checked; rerender(); };
};
