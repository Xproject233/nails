/* Cozy Lab replica + booking -> WhatsApp (name · time · price) */
const WHATSAPP_NUMBER = "77471969692";

const SERVICES = [
  { id: "manicure",   name: "Маникюр + гель-лак", desc: "Комби-техника · 1,5–2 ч", price: 8000 },
  { id: "four-hands", name: "В 4 руки: маникюр + педикюр", desc: "Два мастера · ~2 ч", price: 15000, hit: "хит" },
  { id: "pedicure",   name: "Педикюр + покрытие", desc: "~2 ч", price: 10000 },
  { id: "lashes",     name: "Наращивание ресниц", desc: "~2 ч · −15%", price: 10000, hit: "−15%" },
  { id: "extension",  name: "Наращивание ногтей", desc: "2,5–3 ч", price: 12000 },
  { id: "correction", name: "Коррекция", desc: "~2 ч", price: 9000 },
  { id: "hair",       name: "Волосы: укладка", desc: "1–1,5 ч", price: 6000, from: true },
  { id: "design",     name: "Дизайн", desc: "+30 мин", price: 2000, from: true },
];
const MASTERS = ["Любой мастер","Куралган","Мадина","Измира","Аружан","Алия","Нарханым"];
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const DAYS = 14, DISC = 0.10;

const $=(s,c=document)=>c.querySelector(s);
const fmt=n=>n.toLocaleString("ru-RU")+" ₸";
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const toast=$("#toast");
const show=m=>{ if(!toast)return; toast.textContent=m; toast.classList.add("show"); clearTimeout(show._t); show._t=setTimeout(()=>toast.classList.remove("show"),3400); };

const plist=$("#plist");
if(plist) plist.innerHTML=SERVICES.map((s,i)=>`
  <button type="button" class="prow" data-book data-service="${s.id}">
    <span class="prow__n">${String(i+1).padStart(2,"0")}</span>
    <span class="prow__main"><b>${s.name}${s.hit?` <i>${s.hit}</i>`:""}</b><small>${s.desc}</small></span>
    <span class="prow__price">${s.from?"от ":""}${fmt(s.price)}</span>
  </button>`).join("");

const modal=$("#modal"), fService=$("#fService"), fMaster=$("#fMaster"),
      fName=$("#fName"), fFirst=$("#fFirst"), priceOut=$("#priceOut"),
      ticketLine=$("#ticketLine"), slotsEl=$("#slots"), dateRow=$("#dateRow"), form=$("#bookForm");
let selDate=iso(new Date()), selTime="";
const open=()=>{ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll"); setTimeout(()=>fName&&fName.focus({preventScroll:true}),300); };
const close=()=>{ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.classList.remove("no-scroll"); };
document.addEventListener("click",e=>{ if(e.target.closest("[data-close]")) close(); });
addEventListener("keydown",e=>{ if(e.key==="Escape") close(); });

if(fService){
  fService.innerHTML=SERVICES.map(s=>`<option value="${s.id}">${s.name} — ${s.from?"от ":""}${fmt(s.price)}</option>`).join("");
  fMaster.innerHTML=MASTERS.map(m=>`<option>${m}</option>`).join("");
  const cur=()=>SERVICES.find(s=>s.id===fService.value)||SERVICES[0];
  const past=t=>{ if(selDate!==iso(new Date()))return false; const[h,m]=t.split(":").map(Number); const n=new Date(); return h*60+m<=n.getHours()*60+n.getMinutes(); };
  const rDates=()=>{ const t=new Date(); dateRow.innerHTML=Array.from({length:DAYS},(_,i)=>{ const d=new Date(t); d.setDate(d.getDate()+i); const id=iso(d); return `<button type="button" class="dchip${id===selDate?" sel":""}" data-d="${id}"><span>${d.toLocaleDateString("ru-RU",{weekday:"short"})}</span><b>${d.getDate()}</b><span>${d.toLocaleDateString("ru-RU",{month:"short"}).replace(".","")}</span></button>`; }).join(""); };
  const rSlots=()=>{ slotsEl.innerHTML=TIMES.map(t=>`<button type="button" class="slot${t===selTime?" sel":""}" data-t="${t}"${past(t)?" disabled":""}>${t}</button>`).join(""); };
  const pr=()=>{ const s=cur(); const d=fFirst.checked&&!s.from; const f=d?Math.round(s.price*(1-DISC)/100)*100:s.price; return {s,d,f,str:(s.from?"от ":"")+(d?fmt(f):fmt(s.price)),old:d?fmt(s.price):""}; };
  const ref=()=>{ const{s,d,str,old}=pr(); priceOut.innerHTML=`${str}${old?` <s>${old}</s>`:""}`; const dt=new Date(selDate+"T00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long",weekday:"short"}); ticketLine.textContent=`${s.name} · ${dt} · ${selTime||"выбери время"} · ${str}${d?" · −10%":""}`; };
  rDates(); rSlots(); ref();
  dateRow.addEventListener("click",e=>{ const b=e.target.closest(".dchip"); if(!b)return; selDate=b.dataset.d; if(selTime&&past(selTime))selTime=""; rDates(); rSlots(); ref(); });
  slotsEl.addEventListener("click",e=>{ const b=e.target.closest(".slot"); if(!b||b.disabled)return; selTime=b.dataset.t; rSlots(); ref(); });
  [fService,fMaster].forEach(el=>el.addEventListener("change",ref));
  fFirst.addEventListener("change",ref);
  document.addEventListener("click",e=>{ const b=e.target.closest("[data-book]"); if(!b)return; e.preventDefault(); if(b.dataset.service&&SERVICES.some(s=>s.id===b.dataset.service))fService.value=b.dataset.service; if(b.dataset.master&&[...fMaster.options].some(o=>o.value===b.dataset.master))fMaster.value=b.dataset.master; ref(); open(); });
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    const name=fName.value.trim(), {s,d,f}=pr();
    if(!name){ show("Подскажи своё имя ✨"); fName.focus(); return; }
    if(!selTime){ show("Выбери время — 10:00–21:00 ⏰"); return; }
    const dr=new Date(selDate+"T00:00").toLocaleDateString("ru-RU",{day:"numeric",month:"long",weekday:"long"});
    const lines=["Здравствуйте, Cozy Lab! Хочу записаться:",`• Имя: ${name}`,`• Услуга: ${s.name}`,`• Цена: ${(s.from?"от ":"")+fmt(s.price)}`,d?`• Скидка −10%: итого ${fmt(f)}`:null,`• Мастер: ${fMaster.value}`,`• Дата: ${dr}`,`• Время: ${selTime}`].filter(Boolean);
    const msg=lines.join("\n"), url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    const w=window.open(url,"_blank","noopener");
    if(!w){ try{ await navigator.clipboard.writeText(msg); show("Копировано — вставь в WhatsApp 💬"); }catch(_){ show("Позвони: +7 747 196-96-92"); } }
    else show(`Готово, ${name}! Отправь сообщение в WhatsApp 💬`);
    close();
  });
}
