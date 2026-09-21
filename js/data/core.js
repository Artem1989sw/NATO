/* Спільне ядро даних: реєстр країн і зброї + допоміжні функції. */
window.DATA = {
  countries: [],
  weapons: [],

  /* Кортеж країни:
     [код, назва, блок(N|B), рік вступу, населення млн, ВВП $млрд, бюджет $млрд,
      активні тис., резерв тис., танки, БМП/БТР, артилерія (ствольна+РСЗВ),
      бойові літаки, гелікоптери, головні кораблі, ПЧ, ядерні боєголовки, примітка] */
  addCountries(rows){
    rows.forEach(r=>{
      this.countries.push({
        code:r[0], name:r[1], bloc:r[2], joined:r[3], pop:r[4], gdp:r[5], budget:r[6],
        active:r[7], reserve:r[8], tanks:r[9], afv:r[10], arty:r[11], air:r[12],
        heli:r[13], ships:r[14], subs:r[15], nukes:r[16], note:r[17]||""
      });
    });
  },

  /* Кортеж моделі: [назва, країна-виробник(код), блок, тип, рік, ТТХ, опис]
     cat — категорія вкладки: armor | air | missiles | naval */
  addWeapons(cat, rows){
    rows.forEach(r=>{
      this.weapons.push({cat, name:r[0], country:r[1], bloc:r[2], type:r[3], year:r[4], spec:r[5], desc:r[6]||""});
    });
  }
};

/* Метрики для порівняння: ключ, назва, одиниця, чи сумується */
/* ok:true — звірено з першоджерелом; ok:false — наближена оцінка, не звірена. */
DATA.metrics = [
  {k:"pop",     label:"Населення",             unit:"млн",    ok:false, src:"Оцінка (ООН/Світовий банк), округлено"},
  {k:"gdp",     label:"ВВП (номінальний)",     unit:"$ млрд", ok:false, src:"Оцінка (МВФ), округлено"},
  {k:"budget",  label:"Оборонний бюджет",      unit:"$ млрд", ok:true,  src:"SIPRI 2025 (кв. 2026); малі члени НАТО — звіт НАТО 2025e; ОАЕ та Ефіопія — оцінка"},
  {k:"active",  label:"Особовий склад (актив.)", unit:"тис.", ok:false, src:"Оцінка за IISS, не звірено"},
  {k:"reserve", label:"Резерв",                unit:"тис.",   ok:false, src:"Оцінка за IISS, не звірено"},
  {k:"tanks",   label:"Танки",                 unit:"од.",    ok:false, src:"Оцінка за IISS/GFP, не звірено"},
  {k:"afv",     label:"БМП / БТР",             unit:"од.",    ok:false, src:"Оцінка за IISS/GFP, не звірено"},
  {k:"arty",    label:"Артилерія та РСЗВ",     unit:"од.",    ok:false, src:"Оцінка за IISS/GFP, не звірено"},
  {k:"air",     label:"Бойові літаки",         unit:"од.",    ok:false, src:"Оцінка за IISS/GFP, не звірено"},
  {k:"heli",    label:"Гелікоптери",           unit:"од.",    ok:false, src:"Оцінка за IISS/GFP, не звірено"},
  {k:"ships",   label:"Головні надводні кораблі", unit:"од.", ok:false, src:"Оцінка за IISS, не звірено"},
  {k:"subs",    label:"Підводні човни",        unit:"од.",    ok:false, src:"Оцінка за IISS, не звірено"},
  {k:"nukes",   label:"Ядерні боєголовки",     unit:"шт.",    ok:true,  src:"FAS, Status of World Nuclear Forces, початок 2026 (сумарний інвентар)"}
];
DATA.verifiedOn = "21.09.2026";

DATA.blocName = {N:"НАТО", B:"БРІКС"};

DATA.byBloc = function(b){ return DATA.countries.filter(c=>c.bloc===b); };
DATA.sum = function(b,k){ return DATA.byBloc(b).reduce((s,c)=>s+(c[k]||0),0); };
DATA.country = function(code){ return DATA.countries.find(c=>c.code===code); };

/* Форматування чисел за українською локаллю */
DATA.fmt = function(n){
  if(n===null||n===undefined||isNaN(n)) return "—";
  if(Math.abs(n)>=100) return Math.round(n).toLocaleString("uk-UA");
  if(Math.abs(n)>=10) return (Math.round(n*10)/10).toLocaleString("uk-UA");
  return (Math.round(n*100)/100).toLocaleString("uk-UA");
};
