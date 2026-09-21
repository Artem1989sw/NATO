/* Вкладка «Методологія»: джерела, обмеження, застереження. */
function viewMethod(){
  const a = (href,txt)=>`<a href="${href}" target="_blank" rel="noopener">${txt}</a>`;
  const sipri = a("https://www.sipri.org/publications/2026/sipri-fact-sheets/trends-world-military-expenditure-2025", t("SIPRI, квітень 2026","SIPRI, April 2026"));
  const nato = a("https://www.nato.int/content/dam/nato/webready/documents/finance/def-exp-2025-en.pdf", t("звітом НАТО","the NATO report"));
  const fas = a("https://fas.org/initiative/status-world-nuclear-forces/", t("FAS, початок 2026","FAS, early 2026"));
  return `
    <h1>${t("Методологія та обмеження","Methodology and limitations")}</h1>
    <p class="lead">${t("Що означають цифри на сайті і чому їм не варто довіряти буквально.","What the figures on this site mean and why they should not be taken literally.")}</p>
    <div class="grid g2">
      <div class="card"><h3>${t("Що звірено (✓)","Verified (✓)")}</h3>
        <ul style="margin:0;padding-left:18px">
          <li>${t(`<b>Оборонні бюджети, 2025</b> — ${sipri}. Для Китаю та Росії це оцінки SIPRI. Малі члени НАТО (Португалія, Угорщина, Болгарія, Словаччина, Хорватія, країни Балтії, Словенія, Албанія, Північна Македонія, Чорногорія, Люксембург) — за ${nato} (оцінка 2025, за методикою НАТО).`,
                   `<b>Defence budgets, 2025</b> — ${sipri}. Figures for China and Russia are SIPRI estimates. Smaller NATO members (Portugal, Hungary, Bulgaria, Slovakia, Croatia, the Baltic states, Slovenia, Albania, North Macedonia, Montenegro, Luxembourg) come from ${nato} (2025 estimate, NATO methodology).`)}</li>
          <li>${t(`<b>Ядерні боєголовки</b> — ${fas} (сумарний інвентар, з резервом).`,`<b>Nuclear warheads</b> — ${fas} (total inventory, including reserves).`)}</li>
          <li>${t("Єгипет — SIPRI ≈2,5 млрд. Для ОАЕ та Ефіопії SIPRI даних не публікує, тому там оцінка.","Egypt — SIPRI ≈$2.5 bn. SIPRI publishes no data for the UAE and Ethiopia, so those are estimates.")}</li>
        </ul>
        <p class="muted" style="margin-top:10px">${t("Дата звірки:","Verified on:")} ${DATA.verifiedOn}.</p>
      </div>
      <div class="card"><h3>${t("Що лишається оцінкою (≈)","Still an estimate (≈)")}</h3>
        <ul style="margin:0;padding-left:18px">
          <li>${t("Населення та ВВП — округлені оцінки.","Population and GDP — rounded estimates.")}</li>
          <li>${t("Особовий склад, танки, бронетехніка, артилерія, літаки, гелікоптери, кораблі, підводні човни — за пам'яттю за IISS «The Military Balance» та Global Firepower, без звірки. Повні дані IISS платні.","Personnel, tanks, armour, artillery, aircraft, helicopters, ships, submarines — approximations based on IISS “The Military Balance” and Global Firepower, not verified. Full IISS data is paywalled.")}</li>
          <li>${t("Моделі озброєння та їхні ТТХ — довідкові значення з відкритих джерел, без побічної звірки.","Weapon models and their specifications — reference values from open sources, not cross-checked.")}</li>
        </ul>
      </div>
      <div class="card"><h3>${t("Обмеження","Limitations")}</h3>
        <ul style="margin:0;padding-left:18px">
          <li>${t("Джерела розходяться на десятки відсотків, особливо по Росії, КНР та Ірану.","Sources differ by tens of percent, especially for Russia, China and Iran.")}</li>
          <li>${t("Кількість техніки ≠ боєздатність: підготовка, логістика, боєприпаси та ППО важливіші за цифри.","Quantity ≠ combat capability: training, logistics, ammunition and air defence matter more than headcounts.")}</li>
          <li>${t("Бюджети — у поточних доларах США за обмінним курсом, без поправки на купівельну спроможність (ПКС): в РФ та КНР реально купують більше.","Budgets are in current US dollars at market exchange rates, without purchasing-power adjustment: Russia and China effectively buy more.")}</li>
          <li>${t("«Головні кораблі» — есмінці, фрегати, крейсери, авіаносці, десантні.","“Major ships” means destroyers, frigates, cruisers, carriers and amphibious ships.")}</li>
          <li>${t("Ядерні боєголовки — сумарний інвентар (включає резерв і ті, що чекають на розбирання).","Nuclear warheads are the total inventory (including reserves and those awaiting dismantlement).")}</li>
        </ul>
      </div>
    </div>
    <div class="note">${t("Склад БРІКС у цих даних — 10 членів (Бразилія, Росія, Індія, Китай, ПАР, Єгипет, Ефіопія, Іран, ОАЕ, Індонезія). Саудівська Аравія запрошена, але не підтвердила членство; країни-партнери (Білорусь, Казахстан, Куба, Нігерія, В'єтнам та інші) у підрахунок не входять.","BRICS in this dataset has 10 members (Brazil, Russia, India, China, South Africa, Egypt, Ethiopia, Iran, UAE, Indonesia). Saudi Arabia was invited but has not confirmed membership; partner countries (Belarus, Kazakhstan, Cuba, Nigeria, Vietnam and others) are not counted.")}</div>
    <div class="note">${t("Сайт створено як інформаційно-порівняльний довідник; не є розвідувальним чи офіційним продуктом і не закликає до жодних дій.","This site is an informational and comparative reference; it is not an intelligence or official product and does not call for any action.")}</div>`;
}
