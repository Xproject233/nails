/* ═══════════════════════════════════════════════════════════
   LILIYA LASH STUDIO — app.js
   ═══════════════════════════════════════════════════════════
   ★★★ WhatsApp-номер студии — одна строка ниже ★★★
   Формат: код страны + номер БЕЗ плюса, пробелов и тире.
   +7 747 037-83-29 → "77470378329"
   Чтобы поменять номер позже — поменяй ТОЛЬКО эту строку.
   Прайс тоже правится здесь: SERVICES. Форма и сообщение
   WhatsApp обновятся сами (имя · время · цена · дата · филиал).
*/
const WHATSAPP_NUMBER = "77470378329";

/* Прайс (₸). from:true = «от … ₸» (дизайн, снятие).
   Цены ориентировочные по рынку Алматы — поправь под свой прайс. */
const SERVICES = [
  { id: "classic",   tag: "",      name: "Классическое наращивание ресниц", desc: "1:1 — эффект туши. Естественно, невесомо, на каждый день.", price: 12000, dur: "~2 ч", img: "assets/ig/liliya-02.jpg" },
  { id: "volume",    tag: "топ",   name: "Объём 2D–3D", desc: "Густо, выразительно, с идеальной ноской. Хит студии.", price: 14000, dur: "~2–2,5 ч", img: "assets/ig/liliya-05.jpg" },
  { id: "anime",     tag: "хит",   name: "Аниме / лисий эффект", desc: "Тот самый взгляд из отзывов. Подберём под твой разрез глаз.", price: 15000, dur: "~2,5 ч", img: "assets/ig/liliya-02.jpg" },
  { id: "lamlash",   tag: "",      name: "Ламинирование ресниц + ботокс", desc: "Завиток, питание и блеск для своих ресниц. Без наращивания.", price: 12000, dur: "~1,5 ч", img: "assets/ig/liliya-06.jpg" },
  { id: "brows",     tag: "",      name: "Брови: коррекция + окрашивание / лами", desc: "Форма, цвет, укладка. Аккуратно и бережно — у Самал.", price: 8000, dur: "~1 ч", img: "assets/ig/liliya-07.jpg" },
  { id: "manicure",  tag: "45 мин",name: "Маникюр + гель-лак", desc: "Комби-техника за 45 минут. Ровное покрытие — как любят гости.", price: 9000, dur: "45 мин–1,5 ч", img: "assets/ig/liliya-03.jpg" },
  { id: "pedicure",  tag: "",      name: "Педикюр + покрытие", desc: "Обработка стоп, кутикула, гель-лак. Лёгкость надолго.", price: 11000, dur: "~2 ч", img: "assets/ig/liliya-08.jpg" },
  { id: "extension", tag: "",      name: "Наращивание / коррекция ногтей", desc: "Длина и форма мечты. Прочная архитектура от Елизаветы.", price: 13000, dur: "2–2,5 ч", img: "assets/ig/liliya-04.jpg" },
  { id: "design",    tag: "арт",   name: "Дизайн / снятие", desc: "Френч, стразы, роспись, аниме-арт. Снятие своей работы — бесплатно.", price: 1000, dur: "+30 мин", img: "assets/ig/liliya-03.jpg", from: true },
];

const MASTERS = ["Любой мастер", "Елизавета", "Самал", "Саида", "Дана", "Жанат", "Толкын"];
const BRANCHES = ["Абая 68 (основной)", "Филиал 2 — уточню в WhatsApp"];
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const DAYS_AHEAD = 14;
const FIRST_VISIT_DISCOUNT = 0.10; // −10% на первый визит (01.07.26–31.12.26)

/* ---------- helpers ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const fmt = n => n.toLocaleString("ru-RU") + " ₸";
const localISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const RM   = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(pointer: fine)").matches;

/* ---------- toast ---------- */
const toast = $("#toast");
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3400);
}

/* ---------- preloader ---------- */
(() => {
  const pre = $("#preloader");
  if (!pre) { document.body.classList.add("ready"); return; }
  const finish = () => {
    pre.classList.add("done");
    document.body.classList.add("ready");
    setTimeout(() => pre.remove(), 1100);
  };
  if (RM) { finish(); return; }
  const count = $("#loadCount"), bar = $("#loadBar");
  try {
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 26 + 12);
      if (count) count.textContent = String(Math.floor(p)).padStart(2, "0");
      if (bar) bar.style.width = p + "%";
      if (p >= 100) { clearInterval(t); setTimeout(finish, 250); }
    }, 80);
  } catch (e) { finish(); }
})();

/* ---------- nav / mobile menu ---------- */
(() => {
  const nav = $("#nav");
  if (!nav) return;
  const mmenu = $("#mmenu");
  const burger = $("#burger");
  let lastY = scrollY;

  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 40);
    if (!mmenu || !mmenu.classList.contains("open")) {
      nav.classList.toggle("hide", y > 140 && y > lastY);
    }
    lastY = y;
  }, { passive: true });

  const closeMenu = () => {
    if (!mmenu) return;
    mmenu.classList.remove("open");
    if (burger) { burger.classList.remove("x"); burger.setAttribute("aria-expanded", "false"); }
    document.body.classList.remove("no-scroll");
  };

  if (burger && mmenu) {
    burger.addEventListener("click", () => {
      const open = mmenu.classList.toggle("open");
      burger.classList.toggle("x", open);
      burger.setAttribute("aria-expanded", open);
      document.body.classList.toggle("no-scroll", open);
      nav.classList.remove("hide");
    });
    mmenu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  }
})();

/* ---------- services price list ---------- */
const plist = $("#plist");
if (plist) {
  plist.innerHTML = SERVICES.map((s, i) => `
    <button type="button" class="prow" data-book data-service="${s.id}" data-cursor="записаться">
      <span class="prow__n">${String(i + 1).padStart(2, "0")}</span>
      <span class="prow__main"><b>${s.name}${s.tag ? ` <i class="prow__tag">${s.tag}</i>` : ""}</b><small>${s.desc}</small></span>
      <span class="prow__dur">${s.dur}</span>
      <span class="prow__price">${s.from ? "от " : ""}${fmt(s.price)}</span>
      <span class="prow__go">записаться <em>→</em></span>
    </button>`).join("");
}

/* ---------- floating preview image over the price list ---------- */
(() => {
  if (!FINE || RM || !plist) return;
  const holder = $("#plistImg");
  const img = holder && holder.querySelector("img");
  if (!holder || !img) return;
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
    holder.style.transform = `translate(${cx - 115}px,${cy - 150}px) rotate(-4deg)`;
    raf = requestAnimationFrame(loop);
  };
  const setImg = (src) => { if (src && img.getAttribute("src") !== src) { img.src = src; img.alt = ""; } };
  plist.addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; });
  plist.addEventListener("pointerover", e => {
    const row = e.target.closest(".prow");
    if (!row) return;
    const s = SERVICES.find(x => x.id === row.dataset.service);
    if (s) setImg(s.img);
  });
  plist.addEventListener("pointerenter", () => { holder.classList.add("on"); if (!raf) loop(); });
  plist.addEventListener("pointerleave", () => holder.classList.remove("on"));
})();

/* ---------- booking ---------- */
const fService = $("#fService"), fMaster = $("#fMaster"), fBranch = $("#fBranch"),
      fName = $("#fName"), fPhone = $("#fPhone"), fFirst = $("#fFirst"),
      priceOut = $("#priceOut"), ticketMain = $("#ticketMain"), ticketSub = $("#ticketSub"),
      slotsEl = $("#slots"), dateRow = $("#dateRow"), bookForm = $("#bookForm");
let selTime = "", selDate = localISO(new Date());

if (fService && dateRow && slotsEl) {
  fService.innerHTML = SERVICES.map(s =>
    `<option value="${s.id}">${s.name} — ${s.from ? "от " : ""}${fmt(s.price)}</option>`).join("");
  if (fMaster) fMaster.innerHTML = MASTERS.map(m => `<option value="${m}">${m}</option>`).join("");
  if (fBranch) fBranch.innerHTML = BRANCHES.map(b => `<option value="${b}">${b}</option>`).join("");

  const currentService = () => SERVICES.find(s => s.id === fService.value) || SERVICES[0];
  const isPast = t => {
    if (selDate !== localISO(new Date())) return false;
    const [h, m] = t.split(":").map(Number);
    const now = new Date();
    return h * 60 + m <= now.getHours() * 60 + now.getMinutes() + 30; // +30 мин на сборы
  };

  const renderDates = () => {
    const today = new Date();
    dateRow.innerHTML = Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const d = new Date(today); d.setDate(d.getDate() + i);
      const iso = localISO(d);
      return `<button type="button" class="dchip${iso === selDate ? " sel" : ""}" data-d="${iso}">
        <span>${d.toLocaleDateString("ru-RU", { weekday: "short" })}</span>
        <b>${d.getDate()}</b>
        <span>${d.toLocaleDateString("ru-RU", { month: "short" }).replace(".", "")}</span>
      </button>`;
    }).join("");
  };

  const renderSlots = () => {
    slotsEl.innerHTML = TIMES.map(t =>
      `<button type="button" class="slot${t === selTime ? " sel" : ""}" data-t="${t}"${isPast(t) ? " disabled" : ""}>${t}</button>`).join("");
  };

  const priceParts = () => {
    const s = currentService();
    const disc = !!(fFirst && fFirst.checked && !s.from);
    const final = disc ? Math.round(s.price * (1 - FIRST_VISIT_DISCOUNT) / 100) * 100 : s.price;
    return { s, disc, final,
      str: (s.from ? "от " : "") + (disc ? fmt(final) : fmt(s.price)),
      old: disc ? fmt(s.price) : "" };
  };

  const refreshSummary = () => {
    const { s, disc, str, old } = priceParts();
    if (priceOut) priceOut.innerHTML = `${str}${old ? ` <s>${old}</s><em>−10%</em>` : ""}`;
    const d = selDate
      ? new Date(selDate + "T00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "short" })
      : "дата?";
    if (ticketMain) ticketMain.textContent = `${s.name} · ${selTime || "время?"}`;
    if (ticketSub) ticketSub.textContent = `${d} · ${fMaster ? fMaster.value : "любой мастер"} · ${str}${disc ? " · −10%" : ""}`;
  };

  renderDates();
  renderSlots();
  refreshSummary();

  dateRow.addEventListener("click", e => {
    const b = e.target.closest(".dchip");
    if (!b) return;
    selDate = b.dataset.d;
    if (selTime && isPast(selTime)) selTime = "";
    renderDates();
    renderSlots();
    refreshSummary();
  });

  slotsEl.addEventListener("click", e => {
    const b = e.target.closest(".slot");
    if (!b || b.disabled) return;
    selTime = b.dataset.t;
    renderSlots();
    refreshSummary();
  });

  [fService, fMaster, fBranch].forEach(el => el && el.addEventListener("change", refreshSummary));
  if (fFirst) fFirst.addEventListener("change", refreshSummary);

  /* открыть форму с предвыбором услуги/мастера */
  const openBooking = (serviceId, master) => {
    if (serviceId && SERVICES.some(s => s.id === serviceId)) fService.value = serviceId;
    if (master && fMaster && [...fMaster.options].some(o => o.value === master)) fMaster.value = master;
    refreshSummary();
    const menu = $("#mmenu");
    if (menu && menu.classList.contains("open")) {
      menu.classList.remove("open");
      document.body.classList.remove("no-scroll");
      const burger = $("#burger");
      if (burger) { burger.classList.remove("x"); burger.setAttribute("aria-expanded", "false"); }
    }
    const target = $("#booking");
    if (target) target.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    if (bookForm) {
      bookForm.classList.remove("flash");
      setTimeout(() => {
        bookForm.classList.add("flash");
        setTimeout(() => fName && fName.focus({ preventScroll: true }), 500);
      }, RM ? 50 : 600);
    }
  };
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-book]");
    if (!b) return;
    e.preventDefault();
    openBooking(b.dataset.service, b.dataset.master);
  });
  // keyboard access for promo cards
  $$("[data-book][tabindex]").forEach(el => {
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBooking(el.dataset.service, el.dataset.master); }
    });
  });

  /* ---------- submit → WhatsApp (имя · время · цена + дата/филиал) ---------- */
  if (bookForm) bookForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = fName.value.trim();
    const { s, disc, final } = priceParts();
    if (!name) { showToast("Подскажи своё имя — мастер ждёт ✨"); fName.focus(); return; }
    if (!selDate) { showToast("Выбери дату визита 📅"); return; }
    if (!selTime) { showToast("Выбери время — работаем 10:00–21:00 ⏰"); return; }

    const dateRu = new Date(selDate + "T00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long", weekday: "long" });
    const lines = [
      "Здравствуйте, Liliya Lash Studio! 🌸 Хочу записаться:",
      `• Имя: ${name}`,
      fPhone.value.trim() ? `• Телефон: ${fPhone.value.trim()}` : null,
      `• Услуга: ${s.name}`,
      `• Цена: ${(s.from ? "от " : "") + fmt(s.price)}`,
      disc ? `• Скидка −10% (первый визит): итого ${fmt(final)}` : null,
      `• Мастер: ${fMaster ? fMaster.value : "Любой мастер"}`,
      `• Филиал: ${fBranch ? fBranch.value : BRANCHES[0]}`,
      `• Дата: ${dateRu}`,
      `• Время: ${selTime}`,
    ].filter(Boolean);
    const msg = lines.join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    const win = window.open(url, "_blank", "noopener");
    if (!win) {
      try { await navigator.clipboard.writeText(msg); showToast("Открытие заблокировано — сообщение скопировано, вставь его в WhatsApp 💬"); }
      catch (err) { showToast("Разреши всплывающие окна или позвони: +7 747 037-83-29"); }
    } else {
      showToast(`Готово, ${name}! Сообщение собрано — отправь его в WhatsApp 💬`);
    }
    if (ticketMain) {
      const oldTxt = ticketMain.textContent;
      ticketMain.textContent = "Отправлено ✓ проверь WhatsApp";
      setTimeout(() => { ticketMain.textContent = oldTxt; refreshSummary(); }, 4000);
    }
  });

  /* vacancy → WhatsApp */
  const vacBtn = $("#vacancyBtn");
  if (vacBtn) vacBtn.addEventListener("click", () => {
    const msg = "Здравствуйте! Хочу в команду Liliya Lash Studio ❤️\n• Имя:\n• Специальность (маникюр/педикюр):\n• Опыт:";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });
}

/* ---------- reveal on scroll ---------- */
(() => {
  const els = $$(".reveal");
  if (!els.length) return;
  if (RM) { els.forEach(el => el.classList.add("in")); return; }
  const io = new IntersectionObserver(entries => entries.forEach(x => {
    if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach(el => io.observe(el));
})();

/* ---------- animated counters ---------- */
(() => {
  const els = $$(".count");
  if (!els.length) return;
  const cio = new IntersectionObserver(entries => entries.forEach(x => {
    if (!x.isIntersecting) return;
    cio.unobserve(x.target);
    const el = x.target, target = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const t0 = performance.now(), dur = 1400;
    (function tick(t) {
      const k = Math.min(1, (t - t0) / dur), e2 = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * e2).toFixed(dec);
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }), { threshold: 0.6 });
  els.forEach(el => cio.observe(el));
})();

/* ---------- scroll parallax ---------- */
(() => {
  const els = $$("[data-parallax]");
  if (RM || !els.length) return;
  let ticking = false;
  const upd = () => {
    ticking = false;
    const vh = innerHeight;
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax || "-0.06");
      el.style.setProperty("--py", off.toFixed(1) + "px");
    });
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  upd();
})();

/* ---------- 3D tilt ---------- */
(() => {
  if (!FINE || RM) return;
  $$(".tilt").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
      el.style.setProperty("--ry", (x * 9).toFixed(2) + "deg");
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
})();

/* ---------- magnetic buttons ---------- */
(() => {
  if (!FINE || RM) return;
  $$(".magnetic").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.18}px)`;
    });
    el.addEventListener("pointerleave", () => el.style.transform = "");
  });
})();

/* ---------- custom cursor ---------- */
(() => {
  if (!FINE || RM) return;
  const dot = $("#cursorDot"), ring = $("#cursorRing");
  if (!dot || !ring) return;
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() {
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", e => {
    const lbl = e.target.closest("[data-cursor]");
    const act = e.target.closest("a,button,.slot,.dchip,.shot,summary,input,select");
    if (lbl) { const sp = ring.querySelector("span"); if (sp) sp.textContent = lbl.dataset.cursor; }
    ring.classList.toggle("label", !!lbl);
    ring.classList.toggle("on", !!act && !lbl);
  });
})();

/* ---------- reviews carousel ---------- */
(() => {
  const track = $("#revTrack");
  if (!track) return;
  const cards = $$(".rev", track);
  const prev = $("#revPrev"), next = $("#revNext"), dotsEl = $("#revDots");
  if (!cards.length) return;
  let idx = 0, timer = null;
  const step = () => cards[0].getBoundingClientRect().width + 16;

  const dots = cards.map((_, i) => {
    const d = document.createElement("button");
    d.setAttribute("aria-label", "Отзыв " + (i + 1));
    d.addEventListener("click", () => { go(i); stopAuto(); });
    if (dotsEl) dotsEl.appendChild(d);
    return d;
  });
  const sync = () => dots.forEach((d, i) => d.classList.toggle("on", i === idx));
  const go = i => {
    idx = (i + cards.length) % cards.length;
    track.scrollTo({ left: idx * step(), behavior: RM ? "auto" : "smooth" });
    sync();
  };
  if (prev) prev.onclick = () => { go(idx - 1); stopAuto(); };
  if (next) next.onclick = () => { go(idx + 1); stopAuto(); };

  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / step());
    if (i !== idx) { idx = Math.min(cards.length - 1, Math.max(0, i)); sync(); }
  }, { passive: true });

  const startAuto = () => { if (!RM && cards.length > 1 && !timer) timer = setInterval(() => go(idx + 1), 5200); };
  const stopAuto = () => { clearInterval(timer); timer = null; };
  track.addEventListener("pointerenter", stopAuto);
  track.addEventListener("pointerleave", () => { if (!timer) startAuto(); });
  sync(); startAuto();
})();

/* ---------- drag to scroll ---------- */
(() => {
  [$("#strip"), $("#revTrack")].forEach(el => {
    if (!el) return;
    let down = false, sx = 0, sl = 0, moved = false;
    el.addEventListener("pointerdown", e => {
      down = true; moved = false; sx = e.clientX; sl = el.scrollLeft;
      el.classList.add("dragging");
    });
    addEventListener("pointermove", e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      el.scrollLeft = sl - dx;
    });
    addEventListener("pointerup", () => { down = false; el.classList.remove("dragging"); });
    el.addEventListener("click", e => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  });
})();

/* ---------- gallery lightbox ---------- */
(() => {
  const shots = $$(".shot");
  const lb = $("#lightbox");
  if (!shots.length || !lb) return;
  const lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let li = 0;
  const show = i => {
    li = (i + shots.length) % shots.length;
    const fig = shots[li], img = $("img", fig), cap = $("figcaption", fig);
    if (!img) return;
    if (lbImg) {
      lbImg.src = img.currentSrc ? img.currentSrc.replace("w=700", "w=1400") : img.src.replace("w=700", "w=1400");
      lbImg.alt = img.alt;
    }
    if (lbCap) lbCap.textContent = cap ? cap.textContent : "";
  };
  const open = i => {
    show(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };
  shots.forEach((s, i) => s.addEventListener("click", () => open(i)));
  const bClose = $("#lbClose"), bPrev = $("#lbPrev"), bNext = $("#lbNext");
  if (bClose) bClose.onclick = close;
  if (bPrev) bPrev.onclick = () => show(li - 1);
  if (bNext) bNext.onclick = () => show(li + 1);
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(li - 1);
    if (e.key === "ArrowRight") show(li + 1);
  });
})();

/* ---------- scroll progress ---------- */
(() => {
  const bar = $("#progressBar");
  if (!bar) return;
  const upd = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%";
  };
  addEventListener("scroll", upd, { passive: true });
  addEventListener("resize", upd);
  upd();
})();
