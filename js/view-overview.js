/* Вкладка «Огляд»: загальна характеристика двох блоків. */
function viewOverview(){
  const en = L.lang==="en";
  const N = DATA.blocs.N, B = DATA.blocs.B;
  const eN = DATA.en.blocs.N, eB = DATA.en.blocs.B;
  const nC = DATA.byBloc("N").length, bC = DATA.byBloc("B").length;
  /* Показники зі шкалою (гроші, люди) виводимо словами: «$30,3 трлн», решта — числом + одиниця. */
  const kpi = (label, key, unit) => {
    const n = DATA.sum("N",key), b = DATA.sum("B",key), scaled = !!DATA.kind[key];
    return `<div class="card"><div class="label">${label}</div>
      <div class="kpi kpi-s"><span class="c-nato">${DATA.fmtVal(key,n)}</span> <small>vs</small> <span class="c-brics">${DATA.fmtVal(key,b)}</span></div>
      <div class="muted" style="font-size:12px">${scaled?"":unit}</div></div>`;
  };
  const facts = en ? [eN.facts, eB.facts] : [N.facts, B.facts];
  const rows = facts[0].map((f,i)=>`<tr><td>${UI.esc(f[0])}</td><td class="n">${UI.esc(f[1])}</td><td class="b">${UI.esc(facts[1][i][1])}</td></tr>`).join("");
  const list = a => "<ul style='margin:0;padding-left:18px'>" + a.map(x=>`<li>${UI.esc(x)}</li>`).join("") + "</ul>";
  const pick = (b, key) => en ? DATA.en.blocs[b][key] : DATA.blocs[b][key];
  return `
    <h1>${t("НАТО і БРІКС: порівняння блоків","NATO and BRICS: comparing the blocs")}</h1>
    <p class="lead">${t(
      "Два принципово різні об'єднання: НАТО — військовий альянс із колективною обороною, БРІКС — політико-економічний форум без спільної армії. Нижче — ключові цифри та ті факти, що визначають їхню реальну силу.",
      "Two fundamentally different groupings: NATO is a military alliance with collective defence, BRICS is a political and economic forum with no joint army. Below are the key figures and the facts that shape their real strength.")}</p>
    <div class="note">${UI.esc(en ? DATA.en.blocs.note : DATA.blocs.note)}</div>

    <div class="grid g4" style="margin:18px 0">
      <div class="card nato"><div class="label">${D.bloc("N")}</div><div class="kpi">${nC}<small>${t("країн","countries")}</small></div><div class="muted" style="font-size:13px">${UI.esc(pick("N","full"))}</div></div>
      <div class="card brics"><div class="label">${D.bloc("B")}</div><div class="kpi">${bC}<small>${t("країн","countries")}</small></div><div class="muted" style="font-size:13px">${UI.esc(pick("B","full"))}</div></div>
      ${kpi(t("Населення","Population"),"pop",t("млн осіб","million people"))}
      ${kpi(t("ВВП (номінальний)","GDP (nominal)"),"gdp","")}
      ${kpi(t("Оборонні витрати","Defence spending"),"budget",t("$ млрд","$ billion"))}
      ${kpi(t("Особовий склад","Personnel"),"active",t("тис. активних","thousand active"))}
      ${kpi(t("Ядерні боєголовки","Nuclear warheads"),"nukes",t("шт. (сумарний інвентар)","pcs (total inventory)"))}
      ${kpi(t("Бойові літаки","Combat aircraft"),"air",t("од.","units"))}
    </div>

    <h2>${t("Характеристика за параметрами","Side by side")}</h2>
    <div class="scroll"><table class="vs">
      <thead><tr><th>${t("Параметр","Parameter")}</th><th class="n">${D.bloc("N")}</th><th class="b">${D.bloc("B")}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>

    <div class="grid g2" style="margin-top:22px">
      <div class="card nato"><h3 class="c-nato">${D.bloc("N")} — ${t("сильні сторони","strengths")}</h3>${list(pick("N","strengths"))}<h3 style="margin-top:14px">${t("Слабкі сторони","Weaknesses")}</h3>${list(pick("N","weaknesses"))}</div>
      <div class="card brics"><h3 class="c-brics">${D.bloc("B")} — ${t("сильні сторони","strengths")}</h3>${list(pick("B","strengths"))}<h3 style="margin-top:14px">${t("Слабкі сторони","Weaknesses")}</h3>${list(pick("B","weaknesses"))}</div>
    </div>`;
}
