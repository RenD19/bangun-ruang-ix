/* Gambar SVG bangun ruang dan jaring-jaringnya.
 * Semua ukuran dalam "cm" diskalakan agar muat di kotak gambar.
 * Warna diambil dari variabel CSS (--tabung, --kerucut, --bola, --ink). */
const Gambar = (() => {
  const W = 340, H = 280;
  /* Skala tetap (piksel per cm). Gambar tidak diskalakan otomatis, jadi
     mengubah satu ukuran hanya mengubah bagian itu di gambar.
     Rentang slider: r 1-10 cm, t 1-20 cm. */
  const SKALA = { bangun: 9, bola: 10, jaringTabung: 4.3, jaringKerucut: 3.8 };
  const n = (x) => Math.round(x * 10) / 10;
  const fmt = (x, dp = 2) => (Math.round(x * 10 ** dp) / 10 ** dp).toLocaleString("id-ID", { maximumFractionDigits: dp });

  function svg(inner, label, w = W, h = H) {
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink)"/></marker></defs>
      ${inner}</svg>`;
  }
  const txt = (x, y, s, o = {}) =>
    `<text x="${n(x)}" y="${n(y)}" font-family="var(--f-mono)" font-size="${o.size || 13}" font-weight="${o.w || 700}" fill="${o.fill || "var(--ink)"}" text-anchor="${o.anchor || "middle"}" dominant-baseline="middle"${o.bg ? ' paint-order="stroke" stroke="var(--surface-2)" stroke-width="4"' : ""}>${s}</text>`;
  const ellipseHalf = (cx, cy, rx, ry, front) =>
    `M ${n(cx - rx)} ${n(cy)} A ${n(rx)} ${n(ry)} 0 0 ${front ? 0 : 1} ${n(cx + rx)} ${n(cy)}`;

  /* ---------- Tabung ---------- */
  function tabung(r, t, opt = {}) {
    const k = SKALA.bangun;
    const rx = r * k, ry = rx * 0.3, h = t * k;
    const cx = W / 2 - 10, bot = 238, top = bot - h;
    const c = "var(--tabung)";
    let s = "";
    s += `<path d="M ${n(cx - rx)} ${n(top)} L ${n(cx - rx)} ${n(bot)} ${ellipseHalf(cx, bot, rx, ry, true).replace("M", "L")} L ${n(cx + rx)} ${n(top)} Z" fill="var(--tabung-soft)" stroke="none"/>`;
    s += `<path d="${ellipseHalf(cx, bot, rx, ry, false)}" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    s += `<path d="${ellipseHalf(cx, bot, rx, ry, true)}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${n(cx - rx)}" y1="${n(top)}" x2="${n(cx - rx)}" y2="${n(bot)}" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${n(cx + rx)}" y1="${n(top)}" x2="${n(cx + rx)}" y2="${n(bot)}" stroke="${c}" stroke-width="2.5"/>`;
    s += `<ellipse cx="${n(cx)}" cy="${n(top)}" rx="${n(rx)}" ry="${n(ry)}" fill="var(--surface)" fill-opacity="0.55" stroke="${c}" stroke-width="2.5"/>`;
    if (opt.tanpaTutup) s += `<ellipse cx="${n(cx)}" cy="${n(top)}" rx="${n(rx)}" ry="${n(ry)}" fill="var(--surface-2)" stroke="${c}" stroke-width="2.5" stroke-dasharray="2 3"/>`;
    // jari-jari pada tutup
    s += `<line x1="${n(cx)}" y1="${n(top)}" x2="${n(cx + rx)}" y2="${n(top)}" stroke="var(--ink)" stroke-width="1.8"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(top)}" r="2.5" fill="var(--ink)"/>`;
    s += txt(cx + rx / 2, top - 12, `r = ${fmt(r)}`, { bg: true });
    // tinggi
    const hx = cx + rx + 22;
    s += `<line x1="${n(hx)}" y1="${n(top)}" x2="${n(hx)}" y2="${n(bot)}" stroke="var(--ink)" stroke-width="1.5" marker-start="url(#ah)" marker-end="url(#ah)"/>`;
    s += txt(hx + 6, (top + bot) / 2, `t = ${fmt(t)}`, { anchor: "start", bg: true });
    return svg(s, `Tabung dengan jari-jari ${fmt(r)} dan tinggi ${fmt(t)}`);
  }

  function jaringTabung(r, t, opt = {}) {
    const C = 2 * Math.PI * r;
    const totalH = t + (opt.tanpaTutup ? 2 * r : 4 * r);
    const k = SKALA.jaringTabung;
    const w = C * k, h = t * k, rr = r * k;
    const x0 = (W - w) / 2;
    const y0 = (H - totalH * k) / 2 + (opt.tanpaTutup ? 0 : 2 * rr);
    const cx = W / 2;
    const c = "var(--tabung)";
    let s = "";
    if (!opt.tanpaTutup) s += `<circle cx="${n(cx)}" cy="${n(y0 - rr)}" r="${n(rr)}" fill="var(--tabung-soft)" stroke="${c}" stroke-width="2"/>`;
    s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(w)}" height="${n(h)}" fill="var(--tabung-soft)" stroke="${c}" stroke-width="2.2"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(y0 + h + rr)}" r="${n(rr)}" fill="var(--tabung-soft)" stroke="${c}" stroke-width="2"/>`;
    s += txt(cx, y0 + h / 2 - 9, `selimut`, { size: 12, w: 600, fill: "var(--muted)" });
    s += txt(cx, y0 + h / 2 + 9, `2πr × t`, { size: 13 });
    s += txt(cx, y0 + h + 14, `2πr = ${fmt(C)}`, { size: 11, bg: true });
    s += txt(x0 - 4, y0 + h / 2, `t`, { anchor: "end" });
    s += txt(cx, y0 + h + rr, `πr²`, { size: 12 });
    if (!opt.tanpaTutup) s += txt(cx, y0 - rr, `πr²`, { size: 12 });
    return svg(s, `Jaring-jaring tabung: ${opt.tanpaTutup ? "satu" : "dua"} lingkaran dan satu persegi panjang`);
  }

  /* ---------- Kerucut ---------- */
  function kerucut(r, t, opt = {}) {
    const s0 = Math.hypot(r, t);
    const k = SKALA.bangun;
    const rx = r * k, ry = rx * 0.3, h = t * k;
    const cx = W / 2 - 14, bot = 238, top = bot - h;
    const c = "var(--kerucut)";
    let s = "";
    s += `<path d="M ${n(cx)} ${n(top)} L ${n(cx - rx)} ${n(bot)} ${ellipseHalf(cx, bot, rx, ry, true).replace(/^M [^A]+/, "")} Z" fill="var(--kerucut-soft)"/>`;
    s += `<path d="${ellipseHalf(cx, bot, rx, ry, false)}" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    s += `<path d="${ellipseHalf(cx, bot, rx, ry, true)}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${n(cx)}" y1="${n(top)}" x2="${n(cx - rx)}" y2="${n(bot)}" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${n(cx)}" y1="${n(top)}" x2="${n(cx + rx)}" y2="${n(bot)}" stroke="${c}" stroke-width="2.5"/>`;
    if (opt.segitiga) s += `<path d="M ${n(cx)} ${n(top)} L ${n(cx)} ${n(bot)} L ${n(cx + rx)} ${n(bot)} Z" fill="var(--mark)" fill-opacity="0.35" stroke="var(--mark)" stroke-width="1.5"/>`;
    // tinggi, jari-jari, siku
    s += `<line x1="${n(cx)}" y1="${n(top)}" x2="${n(cx)}" y2="${n(bot)}" stroke="var(--ink)" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    s += `<line x1="${n(cx)}" y1="${n(bot)}" x2="${n(cx + rx)}" y2="${n(bot)}" stroke="var(--ink)" stroke-width="1.8"/>`;
    s += `<path d="M ${n(cx)} ${n(bot - 9)} L ${n(cx + 9)} ${n(bot - 9)} L ${n(cx + 9)} ${n(bot)}" fill="none" stroke="var(--ink)" stroke-width="1.2"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(bot)}" r="2.5" fill="var(--ink)"/>`;
    s += txt(cx - 8, (top + bot) / 2, `t = ${fmt(t)}`, { anchor: "end", bg: true });
    s += txt(cx + rx / 2, bot + 14, `r = ${fmt(r)}`, { bg: true });
    s += txt(cx + rx / 2 + 12, (top + bot) / 2 - 6, `s = ${fmt(s0)}`, { anchor: "start", bg: true, fill: c });
    return svg(s, `Kerucut dengan jari-jari ${fmt(r)}, tinggi ${fmt(t)}, garis pelukis ${fmt(s0)}`);
  }

  function jaringKerucut(r, t) {
    const sl = Math.hypot(r, t);
    const th = (360 * r) / sl; // derajat
    const rad = (d) => (d * Math.PI) / 180;
    const a1 = 90 + th / 2, a2 = 90 - th / 2; // sudut layar (90 = ke bawah)
    // kotak pembatas: titik puncak, titik busur (sampel), lingkaran alas
    const pts = [[0, 0]];
    for (let i = 0; i <= 48; i++) {
      const a = rad(a2 + (th * i) / 48);
      pts.push([sl * Math.cos(a), sl * Math.sin(a)]);
    }
    pts.push([-r, sl + r], [r, sl + r], [0, sl + 2 * r]);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const k = SKALA.jaringKerucut;
    const ox = W / 2 - ((minX + maxX) / 2) * k, oy = (H - (maxY - minY) * k) / 2 - minY * k;
    const P = (x, y) => [ox + x * k, oy + y * k];
    const [ax, ay] = P(0, 0);
    const [x1, y1] = P(sl * Math.cos(rad(a1)), sl * Math.sin(rad(a1)));
    const [x2, y2] = P(sl * Math.cos(rad(a2)), sl * Math.sin(rad(a2)));
    const c = "var(--kerucut)";
    let s = "";
    s += `<path d="M ${n(ax)} ${n(ay)} L ${n(x1)} ${n(y1)} A ${n(sl * k)} ${n(sl * k)} 0 ${th > 180 ? 1 : 0} 0 ${n(x2)} ${n(y2)} Z" fill="var(--kerucut-soft)" stroke="${c}" stroke-width="2.2"/>`;
    const [ccx, ccy] = P(0, sl + r);
    s += `<circle cx="${n(ccx)}" cy="${n(ccy)}" r="${n(r * k)}" fill="var(--kerucut-soft)" stroke="${c}" stroke-width="2"/>`;
    // jari-jari juring = s
    const [mx, my] = P(sl * Math.cos(rad(a2)) / 2, sl * Math.sin(rad(a2)) / 2);
    s += txt(mx + 10, my - 4, `s`, { anchor: "start", fill: c });
    s += txt(ccx, ccy, `πr²`, { size: 12 });
    const [lx, ly] = P(0, sl * 0.55);
    s += txt(lx, ly - 8, `juring`, { size: 12, w: 600, fill: "var(--muted)" });
    s += txt(lx, ly + 9, `πrs`, { size: 13 });
    s += txt(ax, ay - 12 < 10 ? ay + 16 : ay - 12, `${fmt(th, 1)}°`, { size: 12, bg: true });
    return svg(s, `Jaring-jaring kerucut: juring berjari-jari ${fmt(sl)} dengan sudut ${fmt(th, 1)} derajat dan lingkaran alas`);
  }

  /* ---------- Bola ---------- */
  function bola(r, opt = {}) {
    const R = r * (opt.skala || SKALA.bola), cx = W / 2, cy = H / 2 + 4;
    const c = "var(--bola)";
    let s = "";
    if (opt.belahan) {
      s += `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy} A ${R} ${n(R * 0.28)} 0 0 1 ${cx - R} ${cy} Z" fill="var(--bola-soft)" stroke="none"/>`;
      s += `<path d="M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${n(R * 0.28)}" fill="var(--bola-soft)" stroke="${c}" stroke-width="2.5"/>`;
    } else {
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="var(--bola-soft)" stroke="${c}" stroke-width="2.5"/>`;
      s += `<path d="${ellipseHalf(cx, cy, R, R * 0.28, false)}" fill="none" stroke="${c}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
      s += `<path d="${ellipseHalf(cx, cy, R, R * 0.28, true)}" fill="none" stroke="${c}" stroke-width="1.6"/>`;
      s += `<ellipse cx="${n(cx - R * 0.35)}" cy="${n(cy - R * 0.45)}" rx="${n(R * 0.22)}" ry="${n(R * 0.12)}" fill="var(--surface)" fill-opacity="0.45" transform="rotate(-30 ${n(cx - R * 0.35)} ${n(cy - R * 0.45)})"/>`;
    }
    s += `<line x1="${cx}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="var(--ink)" stroke-width="1.8"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="2.5" fill="var(--ink)"/>`;
    s += txt(cx + R / 2, cy - 12, `r = ${fmt(r)}`, { bg: true });
    return svg(s, opt.belahan ? `Belahan bola berjari-jari ${fmt(r)}` : `Bola berjari-jari ${fmt(r)}`);
  }

  function bolaEmpatLingkaran(r) {
    const R = 46, c = "var(--bola)";
    let s = `<circle cx="70" cy="${H / 2}" r="58" fill="var(--bola-soft)" stroke="${c}" stroke-width="2.5"/>`;
    s += txt(70, H / 2, "kulit", { size: 12, w: 600, fill: "var(--muted)" });
    s += txt(70, H / 2 + 76, "1 bola", { size: 12 });
    s += txt(150, H / 2, "=", { size: 26 });
    const pos = [[215, H / 2 - 52], [300, H / 2 - 52], [215, H / 2 + 46], [300, H / 2 + 46]];
    pos.forEach(([x, y], i) => {
      s += `<circle cx="${x}" cy="${y}" r="${R * 0.82}" fill="var(--bola-soft)" stroke="${c}" stroke-width="2"/>`;
      s += txt(x, y, "πr²", { size: 12 });
    });
    return svg(s, "Kulit satu bola sama dengan empat lingkaran berjari-jari sama");
  }

  /* ---------- Gabungan (untuk stimulus soal) ---------- */
  function eskrim() {
    const cx = 130, R = 62, top = 92, bot = 250, c1 = "var(--kerucut)", c2 = "var(--bola)";
    let s = "";
    s += `<path d="M ${cx - R} ${top} L ${cx} ${bot} L ${cx + R} ${top} Z" fill="var(--kerucut-soft)" stroke="${c1}" stroke-width="2.5"/>`;
    s += `<path d="M ${cx - R} ${top} A ${R} ${R} 0 0 1 ${cx + R} ${top}" fill="var(--bola-soft)" stroke="${c2}" stroke-width="2.5"/>`;
    s += `<ellipse cx="${cx}" cy="${top}" rx="${R}" ry="16" fill="none" stroke="var(--ink)" stroke-width="1.2" stroke-dasharray="4 3"/>`;
    s += `<line x1="${cx}" y1="${top}" x2="${cx + R}" y2="${top}" stroke="var(--ink)" stroke-width="1.6"/>`;
    s += txt(cx + R / 2, top - 10, "6 cm", { size: 12, bg: true });
    s += `<line x1="${cx}" y1="${top}" x2="${cx}" y2="${bot}" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="4 3"/>`;
    s += txt(cx + 8, (top + bot) / 2 + 10, "8 cm", { size: 12, anchor: "start", bg: true });
    return svg(s, "Model es krim: kerucut di bawah dan belahan bola di atas", 260, 270);
  }
  function tandon() {
    const cx = 130, rx = 70, ry = 18, top = 50, bot = 220, c = "var(--tabung)";
    let s = "";
    s += `<path d="M ${cx - rx} ${top} L ${cx - rx} ${bot} ${ellipseHalf(cx, bot, rx, ry, true).replace("M", "L")} L ${cx + rx} ${top} Z" fill="var(--tabung-soft)"/>`;
    s += `<path d="${ellipseHalf(cx, bot, rx, ry, true)}" fill="none" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${cx - rx}" y1="${top}" x2="${cx - rx}" y2="${bot}" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${cx + rx}" y1="${top}" x2="${cx + rx}" y2="${bot}" stroke="${c}" stroke-width="2.5"/>`;
    s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="var(--surface)" fill-opacity="0.5" stroke="${c}" stroke-width="2.5"/>`;
    s += `<line x1="${cx - rx}" y1="${top}" x2="${cx + rx}" y2="${top}" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += txt(cx, top - 26, "d = 1,4 m", { size: 12, bg: true });
    s += `<line x1="${cx + rx + 16}" y1="${top}" x2="${cx + rx + 16}" y2="${bot}" stroke="var(--ink)" stroke-width="1.4" marker-start="url(#ah)" marker-end="url(#ah)"/>`;
    s += txt(cx + rx + 22, (top + bot) / 2, "2 m", { size: 12, anchor: "start", bg: true });
    s += `<path d="M ${cx - rx - 30} ${top + 6} h 26 v 14" fill="none" stroke="var(--muted)" stroke-width="5" stroke-linecap="round"/>`;
    return svg(s, "Tandon air berbentuk tabung berdiameter 1,4 meter dan tinggi 2 meter", 260, 250);
  }

  /* ---------- Bangun gabungan untuk latihan memilih sisi ---------- */
  function gabungan(jenis) {
    let s = "";
    const T = "var(--tabung)", K = "var(--kerucut)", B = "var(--bola)";
    if (jenis === "kapsul") {
      const cx = 170, cy = 140, rr = 52, half = 80;
      s += `<path d="M ${cx - half} ${cy - rr} A ${rr} ${rr} 0 0 0 ${cx - half} ${cy + rr} Z" fill="var(--bola-soft)" stroke="${B}" stroke-width="2.5"/>`;
      s += `<path d="M ${cx + half} ${cy - rr} A ${rr} ${rr} 0 0 1 ${cx + half} ${cy + rr} Z" fill="var(--bola-soft)" stroke="${B}" stroke-width="2.5"/>`;
      s += `<rect x="${cx - half}" y="${cy - rr}" width="${2 * half}" height="${2 * rr}" fill="var(--tabung-soft)" stroke="${T}" stroke-width="2.5"/>`;
      s += `<ellipse cx="${cx - half}" cy="${cy}" rx="14" ry="${rr}" fill="none" stroke="var(--ink)" stroke-dasharray="4 3"/>`;
      s += `<ellipse cx="${cx + half}" cy="${cy}" rx="14" ry="${rr}" fill="none" stroke="var(--ink)" stroke-dasharray="4 3"/>`;
      return svg(s, "Kapsul: tabung dengan belahan bola di kedua ujung");
    }
    if (jenis === "padat") {
      const cx = 170, rx = 60, ry = 16, b = 250, m = 160, p = 30;
      s += `<path d="M ${cx - rx} ${m} L ${cx - rx} ${b} ${ellipseHalf(cx, b, rx, ry, true).replace("M", "L")} L ${cx + rx} ${m} Z" fill="var(--tabung-soft)" stroke="${T}" stroke-width="2.5"/>`;
      s += `<path d="M ${cx - rx} ${m} L ${cx} ${p} L ${cx + rx} ${m} A ${rx} ${ry} 0 0 1 ${cx - rx} ${m} Z" fill="var(--kerucut-soft)" stroke="${K}" stroke-width="2.5"/>`;
      s += `<ellipse cx="${cx}" cy="${m}" rx="${rx}" ry="${ry}" fill="none" stroke="var(--ink)" stroke-dasharray="4 3"/>`;
      s += `<path d="${ellipseHalf(cx, b, rx, ry, false)}" fill="none" stroke="${T}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
      return svg(s, "Bangun padat: tabung dengan kerucut di atasnya");
    }
    if (jenis === "kaleng") {
      const cx = 170, rx = 70, ry = 20, top = 60, bot = 230;
      s += `<path d="M ${cx - rx} ${top} L ${cx - rx} ${bot} ${ellipseHalf(cx, bot, rx, ry, true).replace("M", "L")} L ${cx + rx} ${top} Z" fill="var(--tabung-soft)" stroke="${T}" stroke-width="2.5"/>`;
      s += `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" fill="var(--surface)" stroke="${T}" stroke-width="2.5"/>`;
      s += `<path d="${ellipseHalf(cx, bot, rx, ry, false)}" fill="none" stroke="${T}" stroke-width="1.4" stroke-dasharray="5 4"/>`;
      s += txt(cx, top, "terbuka", { size: 11, w: 600, fill: "var(--muted)" });
      return svg(s, "Kaleng tanpa tutup");
    }
    // belahan bola padat
    return bola(7, { belahan: true, skala: 15 });
  }

  /* ---------- Simulasi menuang ---------- */
  function wadah(isi, maks = 3) {
    // tabung tampak depan, isi dalam pertiga
    const x = 60, y = 40, w = 160, h = 200, ry = 14;
    const lv = Math.min(isi, maks) / 3;
    const fy = y + h - h * lv;
    let s = "";
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--surface)" stroke="none"/>`;
    if (lv > 0) {
      s += `<rect class="air" x="${x}" y="${n(fy)}" width="${w}" height="${n(h * lv)}" fill="var(--tabung)" fill-opacity="0.35"/>`;
      s += `<ellipse cx="${x + w / 2}" cy="${n(fy)}" rx="${w / 2}" ry="${ry}" fill="var(--tabung)" fill-opacity="0.45"/>`;
    }
    s += `<ellipse cx="${x + w / 2}" cy="${y + h}" rx="${w / 2}" ry="${ry}" fill="${lv > 0 ? "var(--tabung)" : "none"}" fill-opacity="0.35" stroke="var(--tabung)" stroke-width="2.5"/>`;
    s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + h}" stroke="var(--tabung)" stroke-width="2.5"/>`;
    s += `<line x1="${x + w}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="var(--tabung)" stroke-width="2.5"/>`;
    s += `<ellipse cx="${x + w / 2}" cy="${y}" rx="${w / 2}" ry="${ry}" fill="none" stroke="var(--tabung)" stroke-width="2.5"/>`;
    for (let i = 1; i < 3; i++) {
      const ly = y + h - (h * i) / 3;
      s += `<line x1="${x + w}" y1="${ly}" x2="${x + w + 14}" y2="${ly}" stroke="var(--muted)" stroke-width="1.5"/>`;
      s += txt(x + w + 18, ly, `${i}/3`, { size: 11, anchor: "start", fill: "var(--muted)", w: 600 });
    }
    s += `<line x1="${x + w}" y1="${y}" x2="${x + w + 14}" y2="${y}" stroke="var(--muted)" stroke-width="1.5"/>`;
    s += txt(x + w + 18, y, `penuh`, { size: 11, anchor: "start", fill: "var(--muted)", w: 600 });
    s += txt(x + w / 2, y + h + 30, `tabung r, tinggi 2r`, { size: 11, fill: "var(--muted)", w: 600 });
    return svg(s, `Tabung terisi ${isi} per 3`, 300, 280);
  }

  return { tabung, jaringTabung, kerucut, jaringKerucut, bola, bolaEmpatLingkaran, eskrim, tandon, gabungan, wadah };
})();
