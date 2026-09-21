/* Двомовність (uk/en). t(uk, en) — рядок інтерфейсу; D.* — переклад даних із накладок DATA.en. */
const L = {
  lang: "uk",
  init(){
    let l = "uk";
    try{
      const q = new URLSearchParams(location.search).get("lang");
      l = (q==="en"||q==="uk") ? q : (localStorage.getItem("lang")||"uk");
    }catch(e){}
    this.set(l, false);
  },
  set(l, save=true){
    this.lang = (l==="en") ? "en" : "uk";
    document.documentElement.lang = this.lang;
    if(save){ try{ localStorage.setItem("lang", this.lang); }catch(e){} }
  }
};
function t(uk, en){ return (L.lang==="en" && en!==undefined) ? en : uk; }

/* Накладки перекладу: заповнюються файлами js/data/en/*.js */
DATA.en = { countries:{}, weapons:{armor:[],air:[],missiles:[],naval:[]}, blocs:{} };

const D = {
  bloc(b){ return b==="N" ? t("НАТО","NATO") : t("БРІКС","BRICS"); },
  cname(c){ const e = DATA.en.countries[c.code]; return (L.lang==="en" && e) ? e[0] : c.name; },
  cnote(c){ const e = DATA.en.countries[c.code]; return (L.lang==="en" && e) ? e[1] : c.note; },
  metric(m){ return {label:t(m.label,m.en), unit:t(m.unit,m.unitEn), src:t(m.src,m.srcEn)}; },
  /* Фото моделі (або null): ключ = слаг англійської назви, збігається з img/weapons/NAMES.txt */
  photo(w){
    const e = (DATA.en.weapons[w.cat]||[])[w.i];
    return e ? (DATA.photos[Router.slug(e[0])] || null) : null;
  },
  /* Модель озброєння: [name,type,spec,desc] англійською, якщо є */
  weapon(w){
    const e = (L.lang==="en") ? (DATA.en.weapons[w.cat]||[])[w.i] : null;
    return e ? {name:e[0], type:e[1], spec:e[2], desc:e[3]||""} : {name:w.name, type:w.type, spec:w.spec, desc:w.desc};
  }
};
