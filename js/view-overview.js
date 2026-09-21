/* Вкладка «Огляд»: загальна характеристика двох блоків. */
function viewOverview(){
  const N = DATA.blocs.N, B = DATA.blocs.B;
  const nC = DATA.byBloc("N").length, bC = DATA.byBloc("B").length;
  const kpi = (label, key, unit, div=1) => {
    const n = DATA.sum("N",key)/div, b = DATA.sum("B",key)/div;
    return `<div class="card"><div class="label">${label}</div>
      <div class="kpi"><span class="c-nato">${DATA.fmt(n)}</span> <small>vs</small> <span class="c-brics">${DATA.fmt(b)}</span></div>
      <div class="muted" style="font-size:12px">${unit}</div></div>`;
  };
  const rows = N.facts.map((f,i)=>`<tr><td>${UI.esc(f[0])}</td><td class="n">${UI.esc(f[1])}</td><td class="b">${UI.esc(B.facts[i][1])}</td></tr>`).join("");
  const list = a => "<ul style='margin:0;padding-left:18px'>" + a.map(x=>`<li>${UI.esc(x)}</li>`).join("") + "</ul>";
  return `
    <h1>НАТО і БРІКС: порівняння блоків</h1>
    <p class="lead">Два принципово різні об'єднання: НАТО — військовий альянс із колективною обороною, БРІКС — політико-економічний форум без спільної армії. Нижче — ключові цифри та ті факти, що визначають їхню реальну силу.</p>
    <div class="note">${UI.esc(DATA.blocs.note)}</div>

    <div class="grid g4" style="margin:18px 0">
      <div class="card nato"><div class="label">НАТО</div><div class="kpi">${nC}<small>країн</small></div><div class="muted" style="font-size:13px">${UI.esc(N.full)}</div></div>
      <div class="card brics"><div class="label">БРІКС</div><div class="kpi">${bC}<small>країн</small></div><div class="muted" style="font-size:13px">${UI.esc(B.full)}</div></div>
      ${kpi("Населення","pop","млн осіб")}
      ${kpi("ВВП (номінальний)","gdp","$ трлн",1000)}
      ${kpi("Оборонні витрати","budget","$ млрд")}
      ${kpi("Особовий склад","active","тис. активних")}
      ${kpi("Ядерні боєголовки","nukes","шт. (сумарний інвентар)")}
      ${kpi("Бойові літаки","air","од.")}
    </div>

    <h2>Характеристика за параметрами</h2>
    <div class="scroll"><table class="vs">
      <thead><tr><th>Параметр</th><th class="n">НАТО</th><th class="b">БРІКС</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>

    <div class="grid g2" style="margin-top:22px">
      <div class="card nato"><h3 class="c-nato">НАТО — сильні сторони</h3>${list(N.strengths)}<h3 style="margin-top:14px">Слабкі сторони</h3>${list(N.weaknesses)}</div>
      <div class="card brics"><h3 class="c-brics">БРІКС — сильні сторони</h3>${list(B.strengths)}<h3 style="margin-top:14px">Слабкі сторони</h3>${list(B.weaknesses)}</div>
    </div>`;
}
