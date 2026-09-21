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
    ["Економіка і людські ресурси", ["pop","gdp","budget"]],
    ["Особовий склад", ["active","reserve"]],
    ["Сухопутні сили", ["tanks","afv","arty"]],
    ["Авіація", ["air","heli"]],
    ["Флот і ядерний потенціал", ["ships","subs","nukes"]]
  ];
  const metric = k => DATA.metrics.find(m=>m.k===k);
  const body = groups.map(g=>`
    <h2>${g[0]}</h2>
    <div class="duel">${g[1].map(k=>{const m=metric(k);return UI.duel(m.label,m.unit,sumOf("N",k),sumOf("B",k));}).join("")}</div>`).join("");

  const chk = (id,label,on)=>`<label style="display:inline-flex;gap:6px;align-items:center;cursor:pointer"><input type="checkbox" id="${id}" ${on?"checked":""}> ${label}</label>`;
  return `
    <h1>Порівняння сил</h1>
    <p class="lead">Сумарні показники країн-членів. Смуга показує частку кожного блоку від суми двох. Це арифметика, а не прогноз війни: БРІКС не діє як єдина армія.</p>
    <div class="controls">
      ${chk("ex-us","Без США (лише Європа та Канада в НАТО)",st.excludeUS)}
      ${chk("ex-ru","Без Росії у БРІКС",st.excludeRF)}
    </div>
    <div class="note">Танки і бронетехніка Росії — оцінка активного парку після втрат 2022–2025 років; запаси на зберіганні не враховано.</div>
    ${body}`;
}
viewCompare.bind = function(){
  const rerender = ()=>{ document.getElementById("view").innerHTML = viewCompare(); viewCompare.bind(); };
  const st = viewCompare.state;
  document.getElementById("ex-us").onchange = e=>{ st.excludeUS = e.target.checked; rerender(); };
  document.getElementById("ex-ru").onchange = e=>{ st.excludeRF = e.target.checked; rerender(); };
};
