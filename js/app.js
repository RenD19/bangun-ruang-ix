/* Media belajar Bangun Ruang Sisi Lengkung: tab Belajar dan Latihan Mandiri. */
(() => {
  "use strict";

  /* ================= Utilitas ================= */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const tx = (x) => fmt(x).replace(",", "{,}");
  const fmt = (x, dp = 2) => (Math.round(x * 10 ** dp) / 10 ** dp).toLocaleString("id-ID", { maximumFractionDigits: dp });
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const HURUF = "ABCDE";

  const store = {
    get(k, d) { try { const v = localStorage.getItem("brsl:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("brsl:" + k, JSON.stringify(v)); } catch (e) { /* abaikan */ } },
    del(k) { try { localStorage.removeItem("brsl:" + k); } catch (e) { /* abaikan */ } },
  };

  function acak(arr, seed) {
    const a = arr.slice();
    let s = seed || Math.floor(Math.random() * 1e9);
    const rnd = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; };
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function parseAngka(s) {
    s = String(s || "").trim().replace(/\s/g, "");
    if (!s) return NaN;
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(",", ".");
    return Number(s);
  }

  const PI = {
    "22/7": { v: 22 / 7, s: "\\(\\frac{22}{7}\\)", txt: "22/7" },
    "3,14": { v: 3.14, s: "3,14", txt: "3,14" },
  };

  /* ================= Mesin soal ================= */
  function nilai(q, ans) {
    const r = { benar: false, kosong: false, mis: [] };
    if (q.tipe === "pg") {
      if (ans == null) { r.kosong = true; return r; }
      const o = q.opsi[ans];
      r.benar = !!o.benar;
      if (!o.benar && o.mis) r.mis.push(o.mis);
    } else if (q.tipe === "pgk") {
      const sel = ans || [];
      if (!sel.length) { r.kosong = true; return r; }
      r.benar = q.opsi.every((o, i) => !!o.benar === sel.includes(i));
      q.opsi.forEach((o, i) => { if (!o.benar && sel.includes(i) && o.mis) r.mis.push(o.mis); });
    } else if (q.tipe === "bs") {
      const a = ans || [];
      if (!a.some((x) => x != null)) { r.kosong = true; return r; }
      r.benar = q.pernyataan.every((p, i) => a[i] === p.benar);
      q.pernyataan.forEach((p, i) => { if (a[i] != null && a[i] !== p.benar && p.mis) r.mis.push(p.mis); });
    } else if (q.tipe === "isian") {
      const x = parseAngka(ans);
      if (Number.isNaN(x)) { r.kosong = true; return r; }
      const tol = q.tol ?? 0.01;
      r.benar = Math.abs(x - q.jawaban) <= tol;
      if (!r.benar) {
        const cocok = (q.salah || []).find((w) => Math.abs(x - w.v) <= Math.max(tol, Math.abs(w.v) * 0.002));
        if (cocok) { r.mis.push(cocok.mis); r.salahKhusus = cocok; }
      }
    }
    r.mis = [...new Set(r.mis)];
    return r;
  }

  const TIPE_LABEL = { pg: "Pilihan ganda", pgk: "PG kompleks", bs: "Benar / Salah", isian: "Isian singkat" };
  const TIPE_PETUNJUK = {
    pg: "Pilih satu jawaban yang paling tepat.",
    pgk: "Jawaban benar bisa lebih dari satu. Pilih semua yang benar.",
    bs: "Tentukan Benar atau Salah untuk setiap pernyataan.",
    isian: "Tulis bilangannya saja. Pakai koma untuk desimal, misalnya 301,44.",
  };

  /* Membuat elemen soal. opt: {nomor, urutan, jawaban, onJawab, meta} */
  function elSoal(q, opt = {}) {
    const urutan = opt.urutan || (q.opsi ? q.opsi.map((_, i) => i) : null);
    let ans = opt.jawaban ?? (q.tipe === "pgk" ? [] : q.tipe === "bs" ? q.pernyataan.map(() => null) : null);
    const uid = "q" + q.id.replace(/\W/g, "") + Math.random().toString(36).slice(2, 7);
    const el = h(`<div class="q" data-id="${q.id}"></div>`);
    const meta = [];
    if (opt.nomor) meta.push(`<span class="chip">Soal ${opt.nomor}</span>`);
    meta.push(`<span class="chip tipe">${TIPE_LABEL[q.tipe]}</span>`);
    if (opt.meta !== false && TOPIK[q.topik]) meta.push(`<span class="chip">${TOPIK[q.topik]}</span>`);
    el.append(h(`<div class="q-meta">${meta.join("")}</div>`));
    if (q.grup && STIMULUS[q.grup] && opt.stimulus !== false) {
      const st = STIMULUS[q.grup];
      el.append(h(`<div class="stim"><div class="stim-head"><b>Stimulus: ${st.judul}</b><span class="muted">(dipakai untuk beberapa soal)</span></div>${st.html}${st.gambar ? Gambar[st.gambar]() : ""}</div>`));
    }
    el.append(h(`<div class="q-text">${q.soal}</div>`));
    el.append(h(`<div class="q-hint">${TIPE_PETUNJUK[q.tipe]}</div>`));

    let body;
    if (q.tipe === "pg" || q.tipe === "pgk") {
      body = h(`<div class="opsi" role="${q.tipe === "pg" ? "radiogroup" : "group"}"></div>`);
      urutan.forEach((oi, pos) => {
        const o = q.opsi[oi];
        const type = q.tipe === "pg" ? "radio" : "checkbox";
        const checked = q.tipe === "pg" ? ans === oi : ans.includes(oi);
        const lab = h(`<label class="opt${checked ? " sel" : ""}" data-oi="${oi}"><input type="${type}" name="${uid}" id="${uid}-${oi}" ${checked ? "checked" : ""}><span><span class="huruf">${HURUF[pos]}.</span>${o.t}</span></label>`);
        body.append(lab);
      });
      body.addEventListener("change", () => {
        if (q.tipe === "pg") {
          const c = $$("input", body).findIndex((i) => i.checked);
          ans = c < 0 ? null : urutan[c];
        } else {
          ans = $$("input", body).map((i, pos) => (i.checked ? urutan[pos] : -1)).filter((x) => x >= 0).sort((a, b) => a - b);
        }
        $$(".opt", body).forEach((l) => l.classList.toggle("sel", $("input", l).checked));
        opt.onJawab && opt.onJawab(ans);
      });
    } else if (q.tipe === "bs") {
      body = h(`<div class="tbl-wrap"><table class="tbl bs-tbl"><thead><tr><th>Pernyataan</th><th class="pil">Benar</th><th class="pil">Salah</th></tr></thead><tbody></tbody></table></div>`);
      const tb = $("tbody", body);
      q.pernyataan.forEach((p, i) => {
        tb.append(h(`<tr data-i="${i}"><td><div>${p.t}</div></td>
          <td class="pil"><label><input type="radio" name="${uid}-${i}" id="${uid}-${i}-b" value="b" ${ans[i] === true ? "checked" : ""}>B</label></td>
          <td class="pil"><label><input type="radio" name="${uid}-${i}" id="${uid}-${i}-s" value="s" ${ans[i] === false ? "checked" : ""}>S</label></td></tr>`));
      });
      body.addEventListener("change", (e) => {
        const tr = e.target.closest("tr");
        const i = +tr.dataset.i;
        ans = ans.slice();
        ans[i] = e.target.value === "b";
        opt.onJawab && opt.onJawab(ans);
      });
    } else {
      body = h(`<div class="isian"><input type="text" inputmode="decimal" autocomplete="off" id="${uid}-in" aria-label="Jawaban" placeholder="Jawaban" value="${ans ?? ""}"><span class="muted">${q.satuan || ""}</span></div>`);
      $("input", body).addEventListener("input", (e) => { ans = e.target.value; opt.onJawab && opt.onJawab(ans); });
      $("input", body).addEventListener("keydown", (e) => { if (e.key === "Enter" && opt.onEnter) opt.onEnter(); });
    }
    el.append(body);
    const fbBox = h(`<div class="umpan-slot"></div>`);
    el.append(fbBox);

    function tampilkan(hasil) {
      el.classList.add("locked");
      $$("input", el).forEach((i) => (i.disabled = true));
      if (q.tipe === "pg" || q.tipe === "pgk") {
        $$(".opt", body).forEach((lab) => {
          const oi = +lab.dataset.oi, o = q.opsi[oi];
          const dipilih = q.tipe === "pg" ? ans === oi : (ans || []).includes(oi);
          const tunjuk = q.tipe === "pgk" || dipilih || o.benar;
          if (o.benar && (dipilih || q.tipe === "pg")) lab.classList.add("benar");
          if (!o.benar && dipilih) lab.classList.add("salah");
          if (q.tipe === "pgk" && o.benar && !dipilih) lab.classList.add("salah");
          if (tunjuk) {
            let pre = "";
            if (q.tipe === "pgk") pre = o.benar ? (dipilih ? "✓ Benar dipilih. " : "✗ Seharusnya dipilih. ") : (dipilih ? "✗ Seharusnya tidak dipilih. " : "✓ Tepat tidak dipilih. ");
            lab.append(h(`<span class="fb">${pre}${o.why || ""}</span>`));
          }
        });
      } else if (q.tipe === "bs") {
        $$("tbody tr", body).forEach((tr) => {
          const i = +tr.dataset.i, p = q.pernyataan[i];
          const a = (ans || [])[i];
          tr.classList.add(a === p.benar ? "benar" : "salah");
          $("td", tr).append(h(`<div class="fb"><b>${p.benar ? "Benar" : "Salah"}.</b> ${a == null ? "(tidak dijawab) " : ""}${p.why}</div>`));
        });
      } else {
        const inp = $("input", body);
        inp.classList.add(hasil.benar ? "benar" : "salah");
      }
      let html = `<div class="umpan ${hasil.benar ? "ok" : "no"}"><div class="judul">${hasil.benar ? "Benar!" : hasil.kosong ? "Belum dijawab" : "Belum tepat"}</div>`;
      if (q.tipe === "isian" && !hasil.benar) {
        html += `<div>Jawaban yang benar: <b class="f">${fmt(q.jawaban)} ${q.satuan || ""}</b>.${hasil.salahKhusus ? " " + hasil.salahKhusus.why : ""}</div>`;
      }
      hasil.mis.forEach((m) => {
        const M = MISKONSEPSI[m];
        if (M) html += `<div class="mis-tag"><span>Kemungkinan penyebab: <b>${M.nama.toLowerCase()}</b></span></div>`;
      });
      if (q.pembahasan) html += `<div><b>Pembahasan:</b> ${q.pembahasan}</div>`;
      html += `</div>`;
      fbBox.innerHTML = html;
    }

    return { el, getJawaban: () => ans, tampilkan };
  }

  /* Blok "Cek pemahaman" di tab Belajar */
  function blokCek(babId) {
    const daftar = CEK[babId] || [];
    if (!daftar.length) return null;
    const box = h(`<section class="card cek" aria-label="Cek pemahaman"><div class="cek-head"><h3>Cek pemahaman</h3><span class="muted">Jawab dulu, lalu tekan Periksa. Umpan baliknya langsung muncul.</span></div></section>`);
    daftar.forEach((q, idx) => box.append(blokCekTemp(q, idx)));
    function blokCekTemp(q, idx) {
      const wrap = h(`<div class="card" style="background:var(--surface-2)"></div>`);
      const s = elSoal(q, { nomor: idx + 1, urutan: q.opsi ? acak(q.opsi.map((_, i) => i)) : null, meta: false });
      wrap.append(s.el);
      const btn = h(`<div class="btns"><button class="btn primary sm" type="button">Periksa</button><button class="btn ghost sm" type="button" hidden>Coba lagi</button></div>`);
      const [bP, bU] = $$("button", btn);
      bP.addEventListener("click", () => {
        const r = nilai(q, s.getJawaban());
        if (r.kosong) return;
        s.tampilkan(r); bP.hidden = true; bU.hidden = false;
        const st = store.get("cek", {}); st[q.id] = st[q.id] || r.benar; store.set("cek", st); tandaiNav();
      });
      bU.addEventListener("click", () => wrap.replaceWith(blokCekTemp(q, idx)));
      wrap.append(btn);
      return wrap;
    }
    return box;
  }

  /* ================= Tab Belajar ================= */
  const piSeg = (id, pilih) => `<div class="seg" role="group" aria-label="Nilai π" id="${id}">${Object.keys(PI).map((k) => `<button type="button" data-pi="${k}" aria-pressed="${k === pilih}">π = ${k}</button>`).join("")}</div>`;
  const slider = (id, label, min, max, step, val) => `<div class="slider"><label for="${id}"><span>${label}</span><output id="${id}-o">${fmt(val)} cm</output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></div>`;
  const row = (nama, nilaiStr, sub) => `<div class="row"><b>${nama}</b><span class="v">${nilaiStr}</span><span class="s">${sub}</span></div>`;
  const awas = (kode, isi) => `<div class="awas"><span class="tag">AWAS</span><h4>${MISKONSEPSI[kode].nama}</h4><p>${isi}</p></div>`;

  function segBind(root, sel, cb) {
    const seg = $(sel, root);
    seg.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", seg).forEach((x) => x.setAttribute("aria-pressed", x === b));
      cb(b);
    });
  }

  const BAB = [
    {
      id: "peta", judul: "Peta materi", dot: "var(--accent)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Matematika · Kelas IX · Fase D</span>
          <h2>Bangun Ruang Sisi Lengkung</h2>
          <p class="lead">Tabung, kerucut, dan bola ada di sekitar kita: kaleng susu, cone es krim, tandon air, bola voli. Di media ini kamu akan menurunkan rumus luas dan volume dari jaring-jaringnya, memakai rumus itu untuk soal konteks, lalu berlatih dengan soal model sumatif dan TKA.</p></div>
        <section class="card"><h3>Cara memakai media ini</h3>
          <div class="prose"><ol>
            <li>Mulai dari <a href="#belajar-prasyarat">Prasyarat</a> untuk memastikan lingkaran, juring, Pythagoras, dan satuan sudah lancar.</li>
            <li>Pelajari <a href="#belajar-tabung">Tabung</a>, <a href="#belajar-kerucut">Kerucut</a>, dan <a href="#belajar-bola">Bola</a>. Geser slider, buka jaring-jaringnya, dan amati rumus yang terisi otomatis.</li>
            <li>Lanjutkan ke <a href="#belajar-gabungan">Gabungan &amp; konteks</a> serta <a href="#belajar-perubahan">Perubahan ukuran</a>, dua bagian yang paling sering muncul di soal penalaran.</li>
            <li>Setiap bab ditutup dengan <b>Cek pemahaman</b>. Tanda ✓ muncul di daftar bab jika semua cek sudah benar.</li>
            <li>Setelah itu buka tab <a href="#latihan">Latihan Mandiri</a> untuk latihan per topik atau simulasi sumatif 30 soal.</li>
          </ol></div>
        </section>
        <section class="card"><h3>Unsur dan ciri ketiga bangun</h3>
          <p class="muted">Bangun ruang sisi lengkung dibedakan dari banyak sisi datar, sisi lengkung, dan ada tidaknya titik puncak. Prisma dicantumkan sebagai pembanding.</p>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Unsur</th><th class="c-tabung">Tabung</th><th class="c-kerucut">Kerucut</th><th class="c-bola">Bola</th><th>Prisma segitiga</th></tr></thead><tbody>
            <tr><td>Sisi datar</td><td>2 lingkaran (alas dan tutup)</td><td>1 lingkaran (alas)</td><td>tidak ada</td><td>5 (2 segitiga, 3 persegi panjang)</td></tr>
            <tr><td>Sisi lengkung</td><td>1 (selimut)</td><td>1 (selimut)</td><td>1</td><td>tidak ada</td></tr>
            <tr><td>Rusuk</td><td>2 rusuk lengkung</td><td>1 rusuk lengkung</td><td>tidak ada</td><td>9</td></tr>
            <tr><td>Titik sudut</td><td>tidak ada</td><td>1 titik puncak</td><td>tidak ada</td><td>6</td></tr>
            <tr><td>Ciri khas</td><td>tinggi = jarak alas ke tutup</td><td>garis pelukis = puncak ke keliling alas</td><td>semua titik di permukaan berjarak r dari pusat</td><td>semua sisinya datar</td></tr>
          </tbody></table></div>
          <p class="muted">Rusuk adalah pertemuan dua sisi. Ada buku yang menyebut tabung dan kerucut tidak memiliki rusuk karena pertemuannya berupa garis lengkung. Yang pasti tetap sama: banyak sisi datar dan sisi lengkungnya.</p>
        </section>
        <section class="card"><h3>Ringkasan rumus</h3>
          <div class="rumus">
            <div><span class="k c-tabung">Tabung · volume</span><span class="f">V = πr²t</span></div>
            <div><span class="k c-tabung">Tabung · luas permukaan</span><span class="f">L = 2πr(r + t)</span></div>
            <div><span class="k c-tabung">Tabung · tanpa tutup</span><span class="f">L = πr² + 2πrt</span></div>
            <div><span class="k c-kerucut">Kerucut · garis pelukis</span><span class="f">s² = r² + t²</span></div>
            <div><span class="k c-kerucut">Kerucut · volume</span><span class="f">V = \\(\\frac{1}{3}\\)πr²t</span></div>
            <div><span class="k c-kerucut">Kerucut · luas permukaan</span><span class="f">L = πr(r + s)</span></div>
            <div><span class="k c-bola">Bola · volume</span><span class="f">V = \\(\\frac{4}{3}\\)πr³</span></div>
            <div><span class="k c-bola">Bola · luas permukaan</span><span class="f">L = 4πr²</span></div>
            <div><span class="k c-bola">Belahan bola padat · luas</span><span class="f">L = 3πr²</span></div>
          </div>
          <p class="muted">Pilih π yang efisien: <span class="f">\\(\\frac{22}{7}\\)</span> jika r (atau d) kelipatan 7, <span class="f">3,14</span> untuk yang lain, kecuali soal menentukan lain.</p>
        </section>
        <section class="card"><h3>Kriteria sukses: sampai di mana aku?</h3>
          <p class="muted">Pakai ini untuk menilai diri sendiri. Latihan Mandiri juga memberi perkiraan level di akhir.</p>
          <div class="kriteria">
            <div><span class="lvl-pill lv1">Mulai berkembang</span><p>Aku bisa menyebut unsur tabung, kerucut, bola, dan menghitung jika ukuran r sudah diberikan dan rumusnya tersedia.</p></div>
            <div><span class="lvl-pill lv2">Berkembang</span><p>Aku memilih rumus sendiri, mengubah diameter ke jari-jari, dan mencari garis pelukis dengan Pythagoras.</p></div>
            <div><span class="lvl-pill lv3">Cakap</span><p>Aku menyelesaikan soal bangun gabungan dan konteks multilangkah (biaya, waktu, banyak wadah) serta bekerja mundur dari volume ke ukuran.</p></div>
            <div><span class="lvl-pill lv4">Mendalam</span><p>Aku menalar perubahan ukuran tanpa menghitung ulang, menilai pernyataan benar/salah, dan menemukan kesalahan pada penyelesaian orang lain.</p></div>
          </div>
        </section>
        <section class="card"><h3>Lima kesalahan yang paling sering terjadi</h3>
          <p class="muted">Hindari kesalahan-kesalahan ini. Jika jawabanmu di Latihan Mandiri mengarah ke salah satunya, umpan balik akan memberi tahu dan menunjukkan bagian yang perlu dipelajari lagi.</p>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Kesalahan</th><th>Pelajari di</th></tr></thead><tbody>
            ${["M1", "M2", "M3", "M4", "M5"].map((k) => `<tr><td>${MISKONSEPSI[k].nama}</td><td><a href="#belajar-${MISKONSEPSI[k].bagian}">${BAB_NAMA[MISKONSEPSI[k].bagian]}</a></td></tr>`).join("")}
          </tbody></table></div>
        </section>`;
      },
    },
    {
      id: "prasyarat", judul: "Prasyarat", dot: "var(--muted)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 0 · Sebelum mulai</span><h2>Prasyarat</h2>
          <p class="lead">Semua rumus bangun ruang sisi lengkung dibangun dari lingkaran. Jika soal kerucut terasa sulit, biasanya yang belum lancar adalah Pythagoras atau luas juring, bukan rumus kerucutnya.</p></div>
        <section class="card"><h3>Lingkaran dan juring</h3>
          <div class="rumus">
            <div><span class="k">Diameter dan jari-jari</span><span class="f">d = 2r, \\(r = \\frac{d}{2}\\)</span></div>
            <div><span class="k">Keliling lingkaran</span><span class="f">K = 2πr = πd</span></div>
            <div><span class="k">Luas lingkaran</span><span class="f">L = πr²</span></div>
            <div><span class="k">Panjang busur juring</span><span class="f">\\(\\frac{\\alpha}{360^\\circ} \\times 2\\pi r\\)</span></div>
            <div><span class="k">Luas juring</span><span class="f">\\(\\frac{\\alpha}{360^\\circ} \\times \\pi r^2\\)</span></div>
          </div>
        </section>
        ${awas("M1", "Sebelum menulis rumus, garis bawahi data di soal: apakah yang diberikan <b>jari-jari</b> atau <b>diameter</b>? Jika diameter, bagi 2 dulu. Kesalahan ini membuat volume tabung dan kerucut 4 kali, dan volume bola 8 kali terlalu besar.")}
        <section class="card"><h3>Teorema Pythagoras</h3>
          <div class="prose"><p>Pada segitiga siku-siku, kuadrat sisi miring sama dengan jumlah kuadrat dua sisi lainnya: <span class="f">c² = a² + b²</span>. Di kerucut, sisi miringnya adalah garis pelukis s.</p>
          <p>Tripel yang sering muncul: <span class="f">3-4-5</span>, <span class="f">6-8-10</span>, <span class="f">5-12-13</span>, <span class="f">7-24-25</span>, <span class="f">8-15-17</span>, <span class="f">9-12-15</span>.</p></div>
        </section>
        <section class="card"><h3>Satuan dan konversi</h3>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Besaran</th><th>Hubungan</th></tr></thead><tbody>
            <tr><td>Panjang</td><td class="num">1 m = 10 dm = 100 cm</td></tr>
            <tr><td>Luas</td><td class="num">1 m² = 100 dm² = 10.000 cm²</td></tr>
            <tr><td>Volume</td><td class="num">1 m³ = 1.000 dm³ = 1.000.000 cm³</td></tr>
            <tr><td>Volume cair</td><td class="num">1 liter = 1 dm³ = 1.000 cm³ = 1.000 ml</td></tr>
            <tr><td>Volume cair</td><td class="num">1 m³ = 1.000 liter</td></tr>
          </tbody></table></div>
          <div class="card" style="background:var(--surface-2)">
            <h4>Pengubah satuan volume</h4>
            <div class="isian"><input id="konv-in" type="text" inputmode="decimal" value="2,31" aria-label="Nilai"><select id="konv-dari" aria-label="Dari satuan"><option value="1e6">m³</option><option value="1000" selected>dm³ / liter</option><option value="1">cm³ / ml</option></select></div>
            <div id="konv-out" class="hasil"></div>
          </div>
        </section>
        ${awas("M5", "Samakan satuan sebelum menghitung. Jika jari-jari dalam cm dan tinggi dalam m, ubah dulu ke satuan yang sama. Ingat: 1 m³ = <b>1.000</b> liter, bukan 100 liter.")}`;
      },
      mount(el) {
        const inp = $("#konv-in", el), dari = $("#konv-dari", el), out = $("#konv-out", el);
        const up = () => {
          const v = parseAngka(inp.value), f = +dari.value;
          if (Number.isNaN(v)) { out.innerHTML = `<p class="muted">Tulis sebuah bilangan.</p>`; return; }
          const cm3 = v * f;
          out.innerHTML = row("cm³ (= ml)", fmt(cm3, 4), "") + row("dm³ (= liter)", fmt(cm3 / 1000, 6), "") + row("m³", fmt(cm3 / 1e6, 9), "");
        };
        inp.addEventListener("input", up); dari.addEventListener("change", up); up();
      },
    },
    {
      id: "tabung", judul: "Tabung", dot: "var(--tabung)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 1</span><h2 class="c-tabung">Tabung</h2>
          <p class="lead">Tabung dibatasi dua lingkaran kongruen (alas dan tutup) dan satu bidang lengkung (selimut). Jika selimutnya digunting tegak lalu dibuka, bentuknya persegi panjang dengan panjang sama dengan keliling alas.</p></div>
        <section class="card"><h3>Laboratorium tabung</h3>
          <div class="lab">
            <div class="fig"><div class="seg" id="tb-view" role="group" aria-label="Tampilan"><button type="button" data-v="bangun" aria-pressed="true">Bangun</button><button type="button" data-v="jaring" aria-pressed="false">Jaring-jaring</button></div><div id="tb-fig"></div><p class="muted skala-note">Skala gambar tetap: hanya ukuran yang kamu geser yang berubah.</p></div>
            <div class="ctrl">
              ${slider("tb-r", "Jari-jari r", 1, 10, 0.5, 7)}
              ${slider("tb-t", "Tinggi t", 1, 20, 0.5, 10)}
              ${piSeg("tb-pi", "22/7")}
              <label class="chk"><input type="checkbox" id="tb-tutup"> Tanpa tutup (kaleng terbuka)</label>
              <div class="hasil" id="tb-hasil" aria-live="polite"></div>
            </div>
          </div>
        </section>
        <section class="card"><h3>Dari jaring-jaring ke rumus</h3>
          <div class="prose"><ul>
            <li><b>Selimut</b> = persegi panjang berukuran keliling alas × tinggi = <span class="f">2πr × t = 2πrt</span>.</li>
            <li><b>Luas permukaan</b> = alas + tutup + selimut = <span class="f">2πr² + 2πrt = 2πr(r + t)</span>.</li>
            <li><b>Volume</b> = luas alas × tinggi, sama seperti prisma: <span class="f">V = πr² × t</span>.</li>
          </ul></div>
        </section>
        ${awas("M3", "Tidak semua tabung punya tutup. Kaleng terbuka = alas + selimut. Pipa = selimut saja. Label kaleng = selimut saja. Tanyakan selalu: sisi mana yang benar-benar ada?")}
        <details class="contoh"><summary>Contoh soal: volume dari diameter</summary><div class="isi">
          <div class="soal-contoh">Sebuah tabung berdiameter 14 cm dan tinggi 20 cm. Hitung volumenya (π = \\(\\frac{22}{7}\\)).</div>
          <ol class="langkah"><li>Ubah diameter ke jari-jari: \\(r = \\frac{14}{2} = 7\\) cm.</li><li>Luas alas = \\(\\frac{22}{7}\\) × 7 × 7 = 154 cm².</li><li>V = 154 × 20 = <b>3.080 cm³</b>.</li></ol>
          <p class="muted">Jika 14 langsung dipakai sebagai r, hasilnya 12.320 cm³ (4 kali terlalu besar).</p>
        </div></details>
        <details class="contoh"><summary>Contoh soal: kerja mundur mencari tinggi</summary><div class="isi">
          <div class="soal-contoh">Volume tabung 1.570 cm³ dan jari-jarinya 5 cm. Berapa tingginya? (π = 3,14)</div>
          <ol class="langkah"><li>Tulis rumus: V = πr²t.</li><li>Substitusi: 1.570 = 3,14 × 25 × t = 78,5 × t.</li><li>\\(t = \\frac{1.570}{78{,}5}\\) = <b>20 cm</b>.</li></ol>
        </div></details>`;
      },
      mount(el) {
        const st = { r: 7, t: 10, pi: "22/7", view: "bangun", tanpaTutup: false };
        const up = () => {
          const { r, t } = st, P = PI[st.pi];
          $("#tb-r-o", el).textContent = fmt(r) + " cm"; $("#tb-t-o", el).textContent = fmt(t) + " cm";
          $("#tb-fig", el).innerHTML = st.view === "bangun" ? Gambar.tabung(r, t, st) : Gambar.jaringTabung(r, t, st);
          const alas = P.v * r * r, kel = 2 * P.v * r, sel = kel * t, lp = (st.tanpaTutup ? 1 : 2) * alas + sel, v = alas * t;
          $("#tb-hasil", el).innerHTML =
            row("Keliling alas", `${fmt(kel)} cm`, `2 × ${P.s} × ${fmt(r)}`) +
            row("Luas alas", `${fmt(alas)} cm²`, `${P.s} × ${fmt(r)}²`) +
            row("Luas selimut", `${fmt(sel)} cm²`, `2 × ${P.s} × ${fmt(r)} × ${fmt(t)}`) +
            row(st.tanpaTutup ? "Luas tanpa tutup" : "Luas permukaan", `${fmt(lp)} cm²`, st.tanpaTutup ? `alas + selimut = ${fmt(alas)} + ${fmt(sel)}` : `2 × ${fmt(alas)} + ${fmt(sel)}`) +
            row("Volume", `${fmt(v)} cm³`, `${fmt(alas)} × ${fmt(t)} = ${fmt(v / 1000, 3)} liter`);
        };
        $("#tb-r", el).addEventListener("input", (e) => { st.r = +e.target.value; up(); });
        $("#tb-t", el).addEventListener("input", (e) => { st.t = +e.target.value; up(); });
        $("#tb-tutup", el).addEventListener("change", (e) => { st.tanpaTutup = e.target.checked; up(); });
        segBind(el, "#tb-pi", (b) => { st.pi = b.dataset.pi; up(); });
        segBind(el, "#tb-view", (b) => { st.view = b.dataset.v; up(); });
        up();
      },
    },
    {
      id: "kerucut", judul: "Kerucut", dot: "var(--kerucut)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 2</span><h2 class="c-kerucut">Kerucut</h2>
          <p class="lead">Kerucut punya satu alas lingkaran dan satu titik puncak. Ada tiga ukuran yang saling terkait: jari-jari r, tinggi t (tegak lurus dari puncak ke pusat alas), dan garis pelukis s (dari puncak ke tepi alas).</p></div>
        <section class="card"><h3>Laboratorium kerucut</h3>
          <div class="lab">
            <div class="fig"><div class="seg" id="kr-view" role="group" aria-label="Tampilan"><button type="button" data-v="bangun" aria-pressed="true">Bangun</button><button type="button" data-v="jaring" aria-pressed="false">Jaring-jaring</button></div><div id="kr-fig"></div><p class="muted skala-note">Skala gambar tetap: hanya ukuran yang kamu geser yang berubah.</p></div>
            <div class="ctrl">
              ${slider("kr-r", "Jari-jari r", 1, 10, 0.5, 6)}
              ${slider("kr-t", "Tinggi t", 1, 20, 0.5, 8)}
              ${piSeg("kr-pi", "3,14")}
              <label class="chk"><input type="checkbox" id="kr-seg" checked> Tampilkan segitiga siku-siku r, t, s</label>
              <div class="hasil" id="kr-hasil" aria-live="polite"></div>
            </div>
          </div>
        </section>
        <section class="card"><h3>Dari jaring-jaring ke rumus</h3>
          <div class="prose"><ul>
            <li>Selimut kerucut dibuka menjadi <b>juring</b> berjari-jari <b>s</b>. Panjang busurnya sama dengan keliling alas, 2πr.</li>
            <li>Luas juring = \\(\\dfrac{\\text{panjang busur}}{\\text{keliling lingkaran besar}}\\) × luas lingkaran besar = \\(\\dfrac{2\\pi r}{2\\pi s} \\times \\pi s^2 = \\pi r s\\).</li>
            <li>Sudut pusat juring = \\(\\dfrac{r}{s} \\times 360^\\circ\\).</li>
            <li><b>Luas permukaan</b> = alas + selimut = <span class="f">πr² + πrs = πr(r + s)</span>.</li>
            <li><b>Volume</b> = \\(\\frac{1}{3}\\) × volume tabung dengan alas dan tinggi sama = <span class="f">\\(\\frac{1}{3}\\)πr²t</span>. Tiga kerucut penuh air tepat mengisi satu tabung.</li>
          </ul></div>
        </section>
        ${awas("M2", "<b>Luas selimut memakai s</b> (karena juringnya berjari-jari s). <b>Volume memakai t</b> (karena volume = luas alas × tinggi). Jika soal hanya memberi salah satu, cari yang lain dengan Pythagoras.")}
        <details class="contoh"><summary>Contoh soal: volume dari diameter dan garis pelukis</summary><div class="isi">
          <div class="soal-contoh">Kerucut berdiameter 12 cm dan bergaris pelukis 10 cm. Hitung volumenya (π = 3,14).</div>
          <ol class="langkah"><li>\\(r = \\frac{12}{2} = 6\\) cm.</li><li>t = √(10² − 6²) = √64 = 8 cm.</li><li>V = \\(\\frac{1}{3}\\) × 3,14 × 36 × 8 = <b>301,44 cm³</b>.</li></ol>
          <p class="muted">Pengecoh yang biasa muncul: 376,8 (s dipakai sebagai t), 904,32 (lupa \\(\\frac{1}{3}\\)), 1.205,76 (d dipakai sebagai r).</p>
        </div></details>
        <details class="contoh"><summary>Contoh soal: luas selimut</summary><div class="isi">
          <div class="soal-contoh">Kerucut berjari-jari 7 cm dan tinggi 24 cm. Hitung luas selimutnya (π = \\(\\frac{22}{7}\\)).</div>
          <ol class="langkah"><li>s = √(7² + 24²) = √625 = 25 cm.</li><li>L selimut = πrs = \\(\\frac{22}{7}\\) × 7 × 25 = <b>550 cm²</b>.</li></ol>
        </div></details>`;
      },
      mount(el) {
        const st = { r: 6, t: 8, pi: "3,14", view: "bangun", segitiga: true };
        const up = () => {
          const { r, t } = st, P = PI[st.pi], s = Math.hypot(r, t);
          $("#kr-r-o", el).textContent = fmt(r) + " cm"; $("#kr-t-o", el).textContent = fmt(t) + " cm";
          $("#kr-fig", el).innerHTML = st.view === "bangun" ? Gambar.kerucut(r, t, st) : Gambar.jaringKerucut(r, t);
          const alas = P.v * r * r, sel = P.v * r * s, v = (alas * t) / 3;
          const bulat = Math.abs(s - Math.round(s)) < 1e-9;
          $("#kr-hasil", el).innerHTML =
            row("Garis pelukis s", `${fmt(s)} cm`, `√(${fmt(r)}² + ${fmt(t)}²) = √${fmt(r * r + t * t)}${bulat ? "" : " (bukan bilangan bulat)"}`) +
            row("Sudut juring", `${fmt((360 * r) / s, 1)}°`, `\\(\\frac{${tx(r)}}{${tx(s)}} \\times 360^\\circ\\)`) +
            row("Luas selimut", `${fmt(sel)} cm²`, `${P.s} × ${fmt(r)} × ${fmt(s)} (pakai s)`) +
            row("Luas permukaan", `${fmt(alas + sel)} cm²`, `alas ${fmt(alas)} + selimut ${fmt(sel)}`) +
            row("Volume", `${fmt(v)} cm³`, `\\(\\frac{1}{3}\\) × ${P.s} × ${fmt(r)}² × ${fmt(t)} (pakai t)`);
        };
        $("#kr-r", el).addEventListener("input", (e) => { st.r = +e.target.value; up(); });
        $("#kr-t", el).addEventListener("input", (e) => { st.t = +e.target.value; up(); });
        $("#kr-seg", el).addEventListener("change", (e) => { st.segitiga = e.target.checked; up(); });
        segBind(el, "#kr-pi", (b) => { st.pi = b.dataset.pi; up(); });
        segBind(el, "#kr-view", (b) => { st.view = b.dataset.v; up(); });
        up();
      },
    },
    {
      id: "bola", judul: "Bola", dot: "var(--bola)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 3</span><h2 class="c-bola">Bola</h2>
          <p class="lead">Bola hanya punya satu ukuran penentu: jari-jari r. Semua titik pada permukaan bola berjarak sama dari pusatnya. Bola tidak punya jaring-jaring datar, jadi rumus luasnya diperoleh dengan percobaan.</p></div>
        <section class="card"><h3>Laboratorium bola</h3>
          <div class="lab">
            <div class="fig"><div class="seg" id="bl-view" role="group" aria-label="Tampilan"><button type="button" data-v="bola" aria-pressed="true">Bola</button><button type="button" data-v="belahan" aria-pressed="false">Belahan bola</button><button type="button" data-v="kulit" aria-pressed="false">Kulit = 4 lingkaran</button></div><div id="bl-fig"></div><p class="muted skala-note">Skala gambar tetap: hanya ukuran yang kamu geser yang berubah.</p></div>
            <div class="ctrl">
              ${slider("bl-r", "Jari-jari r", 1, 10, 0.5, 7)}
              ${piSeg("bl-pi", "22/7")}
              <div class="hasil" id="bl-hasil" aria-live="polite"></div>
            </div>
          </div>
        </section>
        <section class="card"><h3>Asal rumus bola</h3>
          <div class="prose"><ul>
            <li><b>Luas permukaan</b>: kulit satu jeruk, jika dikupas dan disusun, dapat menutupi tepat 4 lingkaran berjari-jari sama dengan jeruk. Jadi <span class="f">L = 4πr²</span>.</li>
            <li><b>Volume</b>: bola yang pas di dalam tabung (r sama, tinggi 2r) mengisi \\(\\frac{2}{3}\\) tabung. <span class="f">V = \\(\\frac{2}{3}\\) × πr² × 2r = \\(\\frac{4}{3}\\)πr³</span>.</li>
            <li><b>Belahan bola padat</b> punya kulit lengkung 2πr² dan alas datar πr², jadi <span class="f">L = 3πr²</span>. Mangkuk atau kubah tanpa alas hanya <span class="f">2πr²</span>.</li>
          </ul></div>
        </section>
        ${awas("M1", "Pada bola, kesalahan memakai diameter sebagai jari-jari paling mahal: volume menjadi <b>8 kali</b> lebih besar karena r dipangkatkan tiga.")}
        <details class="contoh"><summary>Contoh soal: volume bola dengan π = \\(\\frac{22}{7}\\)</summary><div class="isi">
          <div class="soal-contoh">Bola berdiameter 42 cm. Hitung volumenya.</div>
          <ol class="langkah"><li>r = 21 cm.</li><li>V = \\(\\frac{4}{3}\\) × \\(\\frac{22}{7}\\) × 21 × 21 × 21.</li><li>Sederhanakan dulu: \\(\\frac{21}{7} = 3\\) dan \\(\\frac{3}{3} = 1\\), jadi V = 4 × 22 × 21 × 21 = <b>38.808 cm³</b>.</li></ol>
        </div></details>
        <details class="contoh"><summary>Contoh soal: mencari jari-jari dari volume</summary><div class="isi">
          <div class="soal-contoh">Volume bola 113,04 cm³ (π = 3,14). Berapa jari-jarinya?</div>
          <ol class="langkah"><li>113,04 = \\(\\frac{4}{3}\\) × 3,14 × r³.</li><li>\\(r^3 = \\frac{113{,}04 \\times 3}{4 \\times 3{,}14} = \\frac{339{,}12}{12{,}56} = 27\\).</li><li>r = ∛27 = <b>3 cm</b>.</li></ol>
        </div></details>`;
      },
      mount(el) {
        const st = { r: 7, pi: "22/7", view: "bola" };
        const up = () => {
          const { r } = st, P = PI[st.pi];
          $("#bl-r-o", el).textContent = fmt(r) + " cm";
          $("#bl-fig", el).innerHTML = st.view === "kulit" ? Gambar.bolaEmpatLingkaran(r) : Gambar.bola(r, { belahan: st.view === "belahan" });
          const L = 4 * P.v * r * r, V = (4 / 3) * P.v * r ** 3;
          $("#bl-hasil", el).innerHTML =
            row("Luas permukaan bola", `${fmt(L)} cm²`, `4 × ${P.s} × ${fmt(r)}²`) +
            row("Volume bola", `${fmt(V)} cm³`, `\\(\\frac{4}{3}\\) × ${P.s} × ${fmt(r)}³`) +
            row("Belahan bola padat · luas", `${fmt((3 / 4) * L)} cm²`, `3 × ${P.s} × ${fmt(r)}²`) +
            row("Kubah / mangkuk · luas", `${fmt(L / 2)} cm²`, `2 × ${P.s} × ${fmt(r)}²`) +
            row("Belahan bola · volume", `${fmt(V / 2)} cm³`, `\\(\\frac{2}{3}\\) × ${P.s} × ${fmt(r)}³`);
        };
        $("#bl-r", el).addEventListener("input", (e) => { st.r = +e.target.value; up(); });
        segBind(el, "#bl-pi", (b) => { st.pi = b.dataset.pi; up(); });
        segBind(el, "#bl-view", (b) => { st.view = b.dataset.v; up(); });
        up();
      },
    },
    {
      id: "gabungan", judul: "Gabungan & konteks", dot: "var(--mark)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 4</span><h2>Bangun gabungan dan soal konteks</h2>
          <p class="lead">Kapsul, es krim, tugu, dan tandon air adalah gabungan tabung, kerucut, dan bola. Volume gabungan cukup dijumlahkan. Luas permukaan perlu hati-hati: sisi yang menempel tidak terlihat, jadi tidak dihitung.</p></div>
        <section class="card"><h3>Latihan memilih sisi yang dihitung</h3>
          <p class="muted">Pilih bangun, centang semua bagian yang luasnya dihitung untuk <b>luas permukaan luar</b>, lalu periksa.</p>
          <div class="seg" id="gb-pilih" role="group" aria-label="Pilih bangun">
            <button type="button" data-g="kapsul" aria-pressed="true">Kapsul</button><button type="button" data-g="tugu" aria-pressed="false">Tugu di lantai</button><button type="button" data-g="padat" aria-pressed="false">Tabung + kerucut padat</button><button type="button" data-g="kaleng" aria-pressed="false">Kaleng terbuka</button><button type="button" data-g="belahan" aria-pressed="false">Belahan bola padat</button>
          </div>
          <div class="lab"><div class="fig" id="gb-fig"></div><div class="ctrl"><div class="pilih-bagian" id="gb-parts"></div><div class="btns"><button class="btn primary sm" id="gb-cek" type="button">Periksa</button></div><div id="gb-fb"></div></div></div>
        </section>
        ${awas("M3", "Gunakan cara berpikir jaring-jaring: daftar semua sisi bangun, lalu coret sisi yang menempel pada bangun lain atau pada lantai, dan sisi yang memang tidak ada (tanpa tutup). Baru jumlahkan sisanya.")}
        <section class="card"><h3>Langkah menyelesaikan soal konteks</h3>
          <div class="prose"><ol>
            <li><b>Kenali bangun</b> dan gambar sketsanya. Tulis r (bukan d), t, dan s. Jika gambar memberi tinggi <i>seluruh</i> bangun, kurangi dengan tinggi bagian lain untuk mendapat tinggi tiap bagian.</li>
            <li><b>Tentukan yang ditanya</b>: volume (isi, air, muatan) atau luas (cat, kertas, bahan).</li>
            <li><b>Samakan satuan</b> sebelum menghitung.</li>
            <li><b>Hitung</b> setiap bagian lalu jumlahkan atau kurangkan.</li>
            <li><b>Jawab pertanyaan akhir</b>: biaya, waktu, atau banyak wadah. Ubah ke satuan yang diminta. Untuk banyak hari atau wadah yang <i>penuh</i>, bulatkan ke bawah.</li>
          </ol></div>
        </section>
        <details class="contoh"><summary>Contoh soal: waktu mengisi tandon</summary><div class="isi">
          <div class="soal-contoh">Tandon berbentuk tabung berdiameter 1,4 m dan tinggi 2 m diisi dengan debit 7 liter per menit. Berapa lama sampai penuh? (π = \\(\\frac{22}{7}\\))</div>
          <ol class="langkah"><li>r = 0,7 m. V = \\(\\frac{22}{7}\\) × 0,7 × 0,7 × 2 = 3,08 m³.</li><li>3,08 m³ = 3,08 × 1.000 = 3.080 liter.</li><li>Waktu = \\(\\frac{3.080}{7} = 440\\) menit = <b>7 jam 20 menit</b>.</li></ol>
        </div></details>
        <details class="contoh"><summary>Contoh soal: kenaikan air saat bola dimasukkan</summary><div class="isi">
          <div class="soal-contoh">Gelas tabung berdiameter 12 cm berisi air. Kelereng berjari-jari 3 cm dimasukkan sampai tenggelam. Berapa kenaikan air? (π = 3,14)</div>
          <ol class="langkah"><li>Volume kelereng = \\(\\frac{4}{3}\\) × 3,14 × 27 = 113,04 cm³.</li><li>Luas alas gelas = 3,14 × 6² = 113,04 cm².</li><li>Kenaikan = \\(\\dfrac{\\text{volume kelereng}}{\\text{luas alas gelas}}\\) = <b>1 cm</b>.</li></ol>
        </div></details>
        <details class="contoh"><summary>Contoh soal: membaca ukuran pada gambar bangun gabungan</summary><div class="isi">
          <div class="soal-contoh">Bangun padat terdiri atas tabung dan kerucut di atasnya. Diameter alas 10 cm, tinggi tabung 6 cm, dan tinggi seluruh bangun 18 cm. Hitung luas permukaannya (π = 3,14).</div>
          <ol class="langkah"><li>\\(r = \\frac{10}{2} = 5\\) cm. Tinggi kerucut = 18 − 6 = 12 cm (bukan 18 cm).</li><li>s = \\(\\sqrt{5^2 + 12^2} = \\sqrt{169} = 13\\) cm.</li><li>Sisi yang terlihat: alas tabung, selimut tabung, selimut kerucut. Tutup tabung dan alas kerucut saling menempel.</li><li>L = 3,14 × 25 + 2 × 3,14 × 5 × 6 + 3,14 × 5 × 13 = 78,5 + 188,4 + 204,1 = <b>471 cm²</b>.</li></ol>
          <p class="muted">Jika bangun berdiri di lantai dan yang ditanya bagian yang dicat, alas tabung tidak dihitung.</p>
        </div></details>
        <details class="contoh"><summary>Contoh soal: beberapa bola dimasukkan ke dalam air</summary><div class="isi">
          <div class="soal-contoh">Wadah tabung berjari-jari 10 cm berisi air setinggi 8 cm. Tiga bola berjari-jari 5 cm dimasukkan sampai tenggelam. Berapa tinggi air sekarang? (π = 3,14)</div>
          <ol class="langkah"><li>Volume 1 bola = \\(\\frac{4}{3}\\) × 3,14 × 125 ≈ 523,33 cm³. Volume 3 bola = 3 × 523,33 ≈ 1.570 cm³.</li><li>Luas alas wadah = 3,14 × 100 = 314 cm².</li><li>Kenaikan = \\(\\frac{1.570}{314} = 5\\) cm.</li><li>Tinggi air sekarang = tinggi awal + kenaikan = 8 + 5 = <b>13 cm</b>.</li></ol>
          <p class="muted">Kenaikan sebanding dengan banyak bola: 1 bola menaikkan \\(\\frac{1}{3}\\) dari 5 cm, 2 bola dua kali lipatnya, dan seterusnya. Bedakan "kenaikan" dengan "tinggi air sekarang".</p>
        </div></details>
        <details class="contoh"><summary>Contoh soal: ruang kosong di sekitar bola dalam tabung</summary><div class="isi">
          <div class="soal-contoh">Bola berjari-jari 3 cm pas di dalam tabung (menyentuh alas, tutup, dan selimut). Berapa volume ruang kosong di dalam tabung? (π = 3,14)</div>
          <ol class="langkah"><li>Tabung yang memuat bola pas: r = 3 cm, t = 2r = 6 cm. V tabung = 3,14 × 9 × 6 = 169,56 cm³.</li><li>V bola = \\(\\frac{4}{3}\\) × 3,14 × 27 = 113,04 cm³.</li><li>Ruang kosong = 169,56 − 113,04 = <b>56,52 cm³</b>.</li></ol>
          <p class="muted">Jalan pintas: bola = \\(\\frac{2}{3}\\) tabung, jadi ruang kosong = \\(\\frac{1}{3}\\) tabung = \\(\\frac{169{,}56}{3}\\) = 56,52 cm³.</p>
        </div></details>
        <details class="contoh"><summary>Contoh soal: persediaan air untuk beberapa hari</summary><div class="isi">
          <div class="soal-contoh">Tandon tabung berjari-jari 0,5 m dan tinggi 1 m terisi penuh. Setiap hari dipakai 60 liter. (a) Cukup untuk berapa hari penuh? (b) Agar cukup 10 hari, berapa liter paling banyak dipakai per hari? (π = 3,14)</div>
          <ol class="langkah"><li>V = 3,14 × 0,5 × 0,5 × 1 = 0,785 m³ = 785 liter.</li><li>(a) \\(\\frac{785}{60} \\approx 13{,}08\\). Hari ke-14 airnya tidak cukup, jadi <b>13 hari</b> (bulatkan ke bawah).</li><li>(b) \\(\\frac{785}{10} = 78{,}5\\), jadi paling banyak <b>78,5 liter</b> per hari.</li></ol>
        </div></details>
        <details class="contoh"><summary>Contoh soal: biaya mengecat kubah</summary><div class="isi">
          <div class="soal-contoh">Kubah berbentuk belahan bola berdiameter 14 m dicat bagian luarnya dengan biaya Rp25.000 per m². Berapa biayanya? (π = \\(\\frac{22}{7}\\))</div>
          <ol class="langkah"><li>r = 7 m. Yang dicat hanya kulit lengkung: 2πr² = 2 × 154 = 308 m².</li><li>Biaya = 308 × 25.000 = <b>Rp7.700.000</b>.</li></ol>
        </div></details>`;
      },
      mount(el) {
        const DATA = {
          kapsul: [["Selimut tabung", true], ["Dua lingkaran ujung tabung", false, "Ujung tabung tertutup belahan bola, jadi tidak terlihat."], ["Kulit lengkung dua belahan bola (= satu kulit bola utuh)", true], ["Dua alas datar belahan bola", false, "Alas datar belahan bola menempel pada ujung tabung."]],
          tugu: [["Selimut tabung", true], ["Tutup tabung", false, "Tutup tabung tertutup alas kerucut."], ["Alas tabung", false, "Alas tabung menempel di lantai."], ["Selimut kerucut", true], ["Alas kerucut", false, "Alas kerucut menempel pada tutup tabung."]],
          padat: [["Selimut tabung", true], ["Alas tabung", true, "Bangun tidak diletakkan di lantai, jadi alas tabung terlihat dan dihitung."], ["Tutup tabung", false, "Tutup tabung tertutup alas kerucut."], ["Selimut kerucut", true], ["Alas kerucut", false, "Alas kerucut menempel pada tutup tabung."]],
          kaleng: [["Alas kaleng", true], ["Selimut kaleng", true], ["Tutup kaleng", false, "Kaleng terbuka tidak punya tutup."]],
          belahan: [["Kulit lengkung (2πr²)", true], ["Alas lingkaran datar (πr²)", true, "Belahan bola padat punya alas datar. Totalnya 3πr²."]],
        };
        let jenis = "kapsul";
        const parts = $("#gb-parts", el), fb = $("#gb-fb", el);
        const up = () => {
          $("#gb-fig", el).innerHTML = Gambar.gabungan(jenis);
          parts.innerHTML = DATA[jenis].map((p, i) => `<label class="part" data-i="${i}"><input type="checkbox" id="gb-${jenis}-${i}"> ${p[0]}</label>`).join("");
          fb.innerHTML = "";
        };
        segBind(el, "#gb-pilih", (b) => { jenis = b.dataset.g; up(); });
        $("#gb-cek", el).addEventListener("click", () => {
          let benar = 0;
          const catatan = [];
          $$(".part", parts).forEach((lab) => {
            const p = DATA[jenis][+lab.dataset.i], c = $("input", lab).checked;
            lab.classList.remove("ok", "no");
            lab.classList.add(c === p[1] ? "ok" : "no");
            if (c === p[1]) benar++; else catatan.push(p[2] || (p[1] ? `${p[0]} terlihat dari luar, jadi dihitung.` : ""));
          });
          const semua = benar === DATA[jenis].length;
          fb.innerHTML = `<div class="umpan ${semua ? "ok" : "no"}"><div class="judul">${semua ? "Tepat semua!" : `${benar} dari ${DATA[jenis].length} tepat`}</div>${catatan.filter(Boolean).map((c) => `<div>${c}</div>`).join("")}${semua ? "" : `<div class="mis-tag"><span>Kemungkinan penyebab: <b>${MISKONSEPSI.M3.nama.toLowerCase()}</b></span></div>`}</div>`;
        });
        up();
      },
    },
    {
      id: "perubahan", judul: "Perubahan ukuran", dot: "var(--ink)",
      render() {
        return `
        <div class="bab-head"><span class="eyebrow">Bab 5</span><h2>Perubahan ukuran dan perbandingan volume</h2>
          <p class="lead">Soal penalaran sering bertanya "menjadi berapa kali lipat?" Jawabannya bisa ditemukan tanpa menghitung ulang, cukup dengan melihat pangkat pada rumus.</p></div>
        <section class="card"><h3>Prediksi dulu, baru lihat</h3>
          <div class="lab">
            <div class="ctrl">
              <div class="seg" id="pu-bangun" role="group" aria-label="Pilih perubahan">
                <button type="button" data-b="bola" aria-pressed="true">Bola: r × k</button><button type="button" data-b="tr" aria-pressed="false">Tabung: r × k</button><button type="button" data-b="tt" aria-pressed="false">Tabung: t × k</button><button type="button" data-b="semua" aria-pressed="false">Kerucut: r dan t × k</button>
              </div>
              <div class="slider"><label for="pu-k"><span>Faktor pengali k</span><output id="pu-k-o">2</output></label><input type="range" id="pu-k" min="0.5" max="4" step="0.5" value="2"></div>
              <div class="card" style="background:var(--surface-2)"><p id="pu-tanya"></p>
                <div class="btns" id="pu-opsi"></div><div id="pu-fb"></div></div>
            </div>
            <div class="hasil" id="pu-hasil"></div>
          </div>
        </section>
        <section class="card"><h3>Aturan umumnya</h3>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Perubahan</th><th>Luas menjadi</th><th>Volume menjadi</th></tr></thead><tbody>
            <tr><td>Bola: r × k</td><td class="num">k² kali</td><td class="num">k³ kali</td></tr>
            <tr><td>Tabung/kerucut: hanya r × k</td><td class="num">tidak sederhana</td><td class="num">k² kali</td></tr>
            <tr><td>Tabung/kerucut: hanya t × k</td><td class="num">tidak sederhana</td><td class="num">k kali</td></tr>
            <tr><td>Semua ukuran panjang × k (sebangun)</td><td class="num">k² kali</td><td class="num">k³ kali</td></tr>
          </tbody></table></div>
        </section>
        ${awas("M4", "Perubahan ukuran tidak linear. Jari-jari 2 kali membuat volume bola 2³ = 8 kali dan luasnya 2² = 4 kali. Pada tabung, jari-jari 2 kali (tinggi tetap) membuat volume 2² = 4 kali.")}
        <section class="card"><h3>Simulasi menuang: kerucut, bola, dan tabung</h3>
          <p>Tabung, kerucut, dan bola berjari-jari sama r. Tinggi tabung dan kerucut sama dengan 2r. <b>Tebak dulu:</b> berapa kerucut penuh air untuk mengisi tabung? Lalu coba tuang.</p>
          <div class="tuang">
            <div class="fig" id="tg-fig"></div>
            <div class="ctrl">
              <div class="btns"><button class="btn" type="button" id="tg-k"><span class="c-kerucut">▲</span> Tuang 1 kerucut</button><button class="btn" type="button" id="tg-b"><span class="c-bola">●</span> Tuang 1 bola</button><button class="btn ghost" type="button" id="tg-x">Kosongkan</button></div>
              <div class="hasil" id="tg-hasil" aria-live="polite"></div>
              <p class="muted">Kesimpulan: V kerucut : V bola : V tabung = 1 : 2 : 3. Satu kerucut ditambah satu bola tepat mengisi satu tabung.</p>
            </div>
          </div>
        </section>`;
      },
      mount(el) {
        const st = { b: "bola", k: 2 };
        const FAK = {
          bola: { tanya: "Jari-jari bola dikali k. Volumenya menjadi berapa kali?", vol: (k) => k ** 3, luas: (k) => k ** 2, rumus: "V ∝ r³, L ∝ r²" },
          tr: { tanya: "Jari-jari tabung dikali k, tinggi tetap. Volumenya menjadi berapa kali?", vol: (k) => k ** 2, luas: null, rumus: "V = πr²t ∝ r²" },
          tt: { tanya: "Tinggi tabung dikali k, jari-jari tetap. Volumenya menjadi berapa kali?", vol: (k) => k, luas: null, rumus: "V = πr²t ∝ t" },
          semua: { tanya: "Jari-jari dan tinggi kerucut sama-sama dikali k. Volumenya menjadi berapa kali?", vol: (k) => k ** 3, luas: (k) => k ** 2, rumus: "V ∝ r²t ∝ k² × k = k³" },
        };
        let tebak = false;
        const up = () => {
          const f = FAK[st.b], k = st.k;
          $("#pu-k-o", el).textContent = fmt(k);
          $("#pu-tanya", el).innerHTML = `<b>${f.tanya.replace("k", "k = " + fmt(k))}</b>`;
          const benar = f.vol(k);
          const cand = [...new Set([k, k ** 2, k ** 3, 2 * k].map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
          $("#pu-opsi", el).innerHTML = cand.map((c) => `<button type="button" class="btn sm" data-c="${c}">${fmt(c, 3)} kali</button>`).join("");
          $("#pu-fb", el).innerHTML = "";
          tebak = false;
          renderHasil(false);
          $$("#pu-opsi button", el).forEach((b) => b.addEventListener("click", () => {
            const c = +b.dataset.c, ok = Math.abs(c - benar) < 1e-6;
            tebak = true;
            $("#pu-fb", el).innerHTML = `<div class="umpan ${ok ? "ok" : "no"}" style="margin-top:10px"><div class="judul">${ok ? "Prediksimu tepat!" : "Belum tepat"}</div><div>${f.rumus}, jadi volumenya menjadi ${fmt(benar, 3)} kali.</div>${ok ? "" : `<div class="mis-tag"><span>Kemungkinan penyebab: <b>${MISKONSEPSI.M4.nama.toLowerCase()}</b></span></div>`}</div>`;
            renderHasil(true);
          }));
        };
        const renderHasil = (buka) => {
          const f = FAK[st.b], k = st.k;
          $("#pu-hasil", el).innerHTML = buka
            ? row("Ukuran panjang", `× ${fmt(k)}`, "faktor yang kamu ubah") +
              (f.luas ? row("Luas menjadi", `× ${fmt(f.luas(k), 3)}`, `k² = ${fmt(k)}²`) : "") +
              row("Volume menjadi", `× ${fmt(f.vol(k), 3)}`, f.rumus)
            : `<div class="empty">Pilih prediksimu dulu. Hasilnya muncul di sini setelah kamu menebak.</div>`;
        };
        segBind(el, "#pu-bangun", (b) => { st.b = b.dataset.b; up(); });
        $("#pu-k", el).addEventListener("input", (e) => { st.k = +e.target.value; up(); });
        up();

        // Simulasi menuang (dalam pertiga volume tabung)
        let isi = 0, log = [];
        const upT = () => {
          $("#tg-fig", el).innerHTML = Gambar.wadah(isi);
          const tumpah = isi > 3;
          $("#tg-hasil", el).innerHTML =
            row("Isi tabung", `${Math.min(isi, 3)}/3`, log.length ? "dituang: " + log.join(" + ") : "masih kosong") +
            (isi === 3 ? row("Penuh!", "✓", log.every((x) => x === "kerucut") ? "3 kerucut = 1 tabung" : log.includes("bola") && log.includes("kerucut") ? "1 kerucut + 1 bola = 1 tabung" : "") : "") +
            (tumpah ? row("Tumpah", "✗", "air melebihi tabung, kosongkan lalu coba lagi") : "");
          $("#tg-k", el).disabled = isi >= 3; $("#tg-b", el).disabled = isi >= 3;
        };
        $("#tg-k", el).addEventListener("click", () => { isi += 1; log.push("kerucut"); upT(); });
        $("#tg-b", el).addEventListener("click", () => { isi += 2; log.push("bola"); upT(); });
        $("#tg-x", el).addEventListener("click", () => { isi = 0; log = []; upT(); });
        upT();
      },
    },
  ];
  const BAB_NAMA = Object.fromEntries(BAB.map((b) => [b.id, b.judul]));

  function babSelesai(id) {
    const d = CEK[id];
    if (!d || !d.length) return false;
    const st = store.get("cek", {});
    return d.every((q) => st[q.id]);
  }
  function tandaiNav() {
    $$(".bab-nav a").forEach((a) => {
      const id = a.dataset.bab;
      const d = $(".done", a);
      if (d) d.textContent = babSelesai(id) ? "✓" : "";
    });
  }

  function renderBelajar(babId) {
    const bab = BAB.find((b) => b.id === babId) || BAB[0];
    const main = $("#main");
    main.innerHTML = "";
    const wrap = h(`<div class="wrap belajar"></div>`);
    const nav = h(`<nav class="bab-nav" aria-label="Daftar bab"><div class="lbl">Daftar bab</div></nav>`);
    BAB.forEach((b) => nav.append(h(`<a href="#belajar-${b.id}" data-bab="${b.id}" aria-current="${b.id === bab.id}"><span class="dot" style="background:${b.dot}"></span>${b.judul}<span class="done"></span></a>`)));
    const isi = h(`<article class="bab"></article>`);
    isi.innerHTML = bab.render();
    wrap.append(nav, isi);
    main.append(wrap);
    bab.mount && bab.mount(isi);
    const cek = blokCek(bab.id);
    if (cek) isi.append(cek);
    const idx = BAB.indexOf(bab);
    const next = BAB[idx + 1];
    isi.append(h(`<div class="btns" style="justify-content:space-between">${idx > 0 ? `<a class="btn" href="#belajar-${BAB[idx - 1].id}">← ${BAB[idx - 1].judul}</a>` : "<span></span>"}${next ? `<a class="btn primary" href="#belajar-${next.id}">${next.judul} →</a>` : `<a class="btn primary" href="#latihan">Mulai Latihan Mandiri →</a>`}</div>`));
    $$(".btns a.btn", isi).forEach((a) => (a.style.textDecoration = "none"));
    tandaiNav();
    const cur = $('.bab-nav a[aria-current="true"]');
    if (cur && window.matchMedia("(max-width: 900px)").matches) cur.scrollIntoView({ block: "nearest", inline: "center" });
  }

  /* ================= Tab Latihan Mandiri ================= */
  const SOAL_BY_ID = Object.fromEntries(SOAL.map((q) => [q.id, q]));
  let kuis = null, timerId = null;

  function unitSoal(daftar) {
    // kelompokkan soal grup agar tetap berurutan
    const units = [], seen = {};
    daftar.forEach((q) => {
      if (q.grup) {
        if (!seen[q.grup]) { seen[q.grup] = []; units.push(seen[q.grup]); }
        seen[q.grup].push(q);
      } else units.push([q]);
    });
    return units;
  }

  function buatKuis(mode, opsi = {}) {
    let daftar;
    if (mode === "topik") daftar = SOAL.filter((q) => opsi.topik.includes(q.topik));
    else if (mode === "ulang") daftar = SOAL.filter((q) => (store.get("salah", [])).includes(q.id));
    else daftar = SOAL.slice();
    let units = acak(unitSoal(daftar));
    if (mode === "sumatif") {
      // ambil bergilir per topik sampai 30 soal, grup tetap utuh
      const perTopik = {};
      units.forEach((u) => (perTopik[u[0].topik] = perTopik[u[0].topik] || []).push(u));
      const pilih = []; let n = 0;
      const keys = acak(Object.keys(perTopik));
      while (n < 30 && keys.some((k) => perTopik[k].length)) {
        for (const k of keys) {
          const u = perTopik[k].shift();
          if (!u) continue;
          if (n + u.length > 30) continue;
          pilih.push(u); n += u.length;
          if (n >= 30) break;
        }
      }
      units = acak(pilih);
    }
    const items = units.flat().map((q) => q.id);
    const urutan = {};
    items.forEach((id) => { const q = SOAL_BY_ID[id]; if (q.opsi) urutan[id] = acak(q.opsi.map((_, i) => i)); });
    kuis = {
      mode, items, i: 0, jawaban: {}, cek: {}, ragu: [], urutan,
      umpan: mode === "sumatif" ? "akhir" : opsi.umpan || "langsung",
      mulai: Date.now(), durasi: mode === "sumatif" ? 75 * 60 : 0, selesai: false,
    };
    simpanKuis();
  }
  const simpanKuis = () => store.set("kuis", kuis);

  function renderLatihan() {
    const main = $("#main");
    main.innerHTML = "";
    clearInterval(timerId);
    const tersimpan = store.get("kuis", null);
    if (tersimpan && !tersimpan.selesai && tersimpan.items && tersimpan.items.every((id) => SOAL_BY_ID[id])) kuis = tersimpan;
    if (kuis && !kuis.selesai) return renderKuis();
    if (kuis && kuis.selesai) return renderHasilKuis();
    renderMenu();
  }

  function renderMenu() {
    const main = $("#main");
    const salah = store.get("salah", []);
    const riwayat = store.get("riwayat", []);
    const hitung = (t) => SOAL.filter((q) => q.topik === t).length;
    const wrap = h(`<div class="wrap latihan">
      <div class="bab-head"><span class="eyebrow">Latihan Mandiri · persiapan sumatif akhir semester</span><h2>Pilih cara berlatih</h2>
        <p class="lead">Bank soal berisi ${SOAL.length} soal dengan bentuk yang sama seperti sumatif dan TKA. Setiap pilihan yang salah mewakili satu kesalahan yang sering terjadi, jadi umpan baliknya memberi tahu letak kesulitanmu.</p></div>
      <div class="mode-grid">
        <section class="card mode"><h3>Latihan per topik</h3>
          <p class="muted">Pilih topik, kerjakan, dan lihat pembahasan langsung setelah setiap soal.</p>
          <div class="topik-pilih" id="m-topik">${Object.entries(TOPIK).map(([k, v]) => `<label><input type="checkbox" value="${k}" id="mt-${k}" checked> ${v} <span class="muted">(${hitung(k)})</span></label>`).join("")}</div>
          <label class="chk"><input type="checkbox" id="m-akhir"> Tampilkan pembahasan di akhir saja</label>
          <button class="btn primary" id="m-mulai-topik" type="button">Mulai latihan</button>
        </section>
        <section class="card mode"><h3>Simulasi sumatif</h3>
          <p class="muted">30 soal acak dari semua topik, 75 menit, seperti format TKA SMP. Nilai, perkiraan level, dan pembahasan muncul setelah selesai.</p>
          <div class="format"><div><b>30 soal</b><span>campuran PG, PG kompleks, Benar/Salah, isian</span></div><div><b>75 menit</b><span>waktu berjalan; jawaban tersimpan otomatis</span></div></div>
          <button class="btn primary" id="m-mulai-sumatif" type="button">Mulai simulasi</button>
        </section>
        <section class="card mode"><h3>Ulangi soal yang salah</h3>
          <p class="muted">${salah.length ? `Ada <b>${salah.length}</b> soal yang terakhir kali kamu jawab salah. Soal yang sudah benar akan keluar dari daftar ini.` : "Belum ada soal yang salah. Daftar ini terisi setelah kamu berlatih."}</p>
          <button class="btn" id="m-mulai-ulang" type="button" ${salah.length ? "" : "disabled"}>Ulangi ${salah.length || ""} soal</button>
          <h4 style="margin-top:8px">Riwayat latihan</h4>
          <div class="riwayat">${riwayat.length ? riwayat.slice(0, 5).map((r) => `<div><span>${r.tgl} · ${r.mode}</span><span class="n">${r.benar}/${r.total} (${r.skor})</span></div>`).join("") : `<p class="empty">Belum ada riwayat di perangkat ini.</p>`}</div>
        </section>
      </div>
      <section class="card"><h3>Bentuk soal yang akan kamu temui</h3>
        <div class="format">
          <div><b>Pilihan ganda</b><span>satu jawaban benar dari empat pilihan</span></div>
          <div><b>PG kompleks</b><span>jawaban benar bisa lebih dari satu; semua harus tepat</span></div>
          <div><b>Benar / Salah</b><span>tentukan benar atau salah tiap pernyataan; semua harus tepat</span></div>
          <div><b>Isian singkat</b><span>tulis bilangannya; pakai koma untuk desimal</span></div>
          <div><b>Soal grup</b><span>satu stimulus (gambar/cerita) untuk beberapa soal</span></div>
        </div>
      </section>
      <p class="foot">Kemajuan latihan disimpan di peramban perangkat ini saja.</p>
    </div>`);
    main.append(wrap);
    $("#m-mulai-topik").addEventListener("click", () => {
      const topik = $$("#m-topik input:checked").map((i) => i.value);
      if (!topik.length) { $("#m-mulai-topik").textContent = "Pilih minimal satu topik"; return; }
      buatKuis("topik", { topik, umpan: $("#m-akhir").checked ? "akhir" : "langsung" });
      renderKuis();
    });
    $("#m-mulai-sumatif").addEventListener("click", () => { buatKuis("sumatif"); renderKuis(); });
    $("#m-mulai-ulang").addEventListener("click", () => { buatKuis("ulang", { umpan: "langsung" }); renderKuis(); });
  }

  function sisaDetik() { return Math.max(0, kuis.durasi - Math.floor((Date.now() - kuis.mulai) / 1000)); }
  const mmss = (d) => `${String(Math.floor(d / 60)).padStart(2, "0")}:${String(d % 60).padStart(2, "0")}`;

  function renderKuis() {
    const main = $("#main");
    main.innerHTML = "";
    clearInterval(timerId);
    const total = kuis.items.length;
    const id = kuis.items[kuis.i], q = SOAL_BY_ID[id];
    const judul = { topik: "Latihan per topik", sumatif: "Simulasi sumatif", ulang: "Ulangi soal yang salah" }[kuis.mode];
    const terjawab = kuis.items.filter((x) => !nilai(SOAL_BY_ID[x], kuis.jawaban[x]).kosong).length;
    const wrap = h(`<div class="wrap latihan"><div class="kuis">
      <div class="kuis-main">
        <div class="cek-head"><h3>${judul}</h3><span class="muted">Soal ${kuis.i + 1} dari ${total}</span></div>
        <div class="bar" aria-hidden="true"><i style="width:${(terjawab / total) * 100}%"></i></div>
        <section class="card" id="k-soal"></section>
        <div class="kuis-nav">
          <div class="grow"><button class="btn" id="k-prev" type="button" ${kuis.i === 0 ? "disabled" : ""}>← Sebelumnya</button>
          ${kuis.umpan === "langsung" ? `<button class="btn primary" id="k-cek" type="button">Periksa</button>` : `<button class="btn" id="k-ragu" type="button">${kuis.ragu.includes(id) ? "Batal ragu-ragu" : "Ragu-ragu"}</button>`}</div>
          <div class="grow"><button class="btn ${kuis.umpan === "langsung" ? "" : "primary"}" id="k-next" type="button">${kuis.i === total - 1 ? "Ke ringkasan" : "Berikutnya →"}</button></div>
        </div>
        <div id="k-konfirmasi"></div>
      </div>
      <aside class="kuis-side card">
        ${kuis.durasi ? `<div><div class="muted">Sisa waktu</div><div class="timer" id="k-timer">${mmss(sisaDetik())}</div></div>` : ""}
        <div class="muted" id="k-terjawab">${terjawab} dari ${total} terjawab</div>
        <div class="nomor" id="k-nomor"></div>
        <div class="legend"><span><i style="background:var(--surface-2);border-color:var(--muted)"></i>sudah dijawab</span>${kuis.umpan === "langsung" ? `<span><i style="background:var(--ok-soft);border-color:var(--ok)"></i>benar</span><span><i style="background:var(--bad-soft);border-color:var(--bad)"></i>salah</span>` : `<span><i style="box-shadow:inset 0 -3px 0 var(--mark)"></i>ragu-ragu</span>`}</div>
        <button class="btn" id="k-selesai" type="button">Selesai &amp; lihat hasil</button>
        <button class="btn ghost sm" id="k-keluar" type="button">Keluar ke menu</button>
      </aside></div></div>`);
    main.append(wrap);

    const nomor = $("#k-nomor");
    kuis.items.forEach((x, i) => {
      const cls = [];
      const r = nilai(SOAL_BY_ID[x], kuis.jawaban[x]);
      if (!r.kosong) cls.push("jawab");
      if (kuis.cek[x]) cls.push(kuis.cek[x].benar ? "benar" : "salah");
      if (kuis.ragu.includes(x)) cls.push("ragu");
      if (i === kuis.i) cls.push("now");
      const b = h(`<button type="button" class="${cls.join(" ")}" aria-label="Soal ${i + 1}">${i + 1}</button>`);
      b.addEventListener("click", () => { kuis.i = i; simpanKuis(); renderKuis(); });
      nomor.append(b);
    });

    const aktif = nomor.children[kuis.i];
    if (aktif) nomor.scrollLeft = aktif.offsetLeft - nomor.clientWidth / 2;
    const s = elSoal(q, {
      nomor: kuis.i + 1, urutan: kuis.urutan[id], jawaban: kuis.jawaban[id],
      onJawab: (a) => { kuis.jawaban[id] = a; simpanKuis(); segarkanNomor(); },
      onEnter: () => { const c = $("#k-cek"); if (c) c.click(); else $("#k-next").click(); },
    });
    $("#k-soal").append(s.el);
    if (kuis.cek[id]) { s.tampilkan(kuis.cek[id]); const c = $("#k-cek"); if (c) c.hidden = true; }

    function segarkanNomor() {
      const r = nilai(q, kuis.jawaban[id]);
      nomor.children[kuis.i].classList.toggle("jawab", !r.kosong);
      const tj = kuis.items.filter((x) => !nilai(SOAL_BY_ID[x], kuis.jawaban[x]).kosong).length;
      $("#k-terjawab", wrap).textContent = `${tj} dari ${total} terjawab`;
      $(".bar i", wrap).style.width = `${(tj / total) * 100}%`;
    }

    $("#k-prev").addEventListener("click", () => { kuis.i--; simpanKuis(); renderKuis(); });
    $("#k-next").addEventListener("click", () => {
      if (kuis.i < total - 1) { kuis.i++; simpanKuis(); renderKuis(); } else konfirmasi();
    });
    const cek = $("#k-cek");
    if (cek) cek.addEventListener("click", () => {
      const r = nilai(q, kuis.jawaban[id]);
      if (r.kosong) { cek.textContent = "Isi jawaban dulu"; setTimeout(() => (cek.textContent = "Periksa"), 1400); return; }
      kuis.cek[id] = r; simpanKuis();
      s.tampilkan(r); cek.hidden = true;
      nomor.children[kuis.i].classList.add(r.benar ? "benar" : "salah");
      $("#k-next").classList.add("primary");
    });
    const ragu = $("#k-ragu");
    if (ragu) ragu.addEventListener("click", () => {
      kuis.ragu = kuis.ragu.includes(id) ? kuis.ragu.filter((x) => x !== id) : [...kuis.ragu, id];
      simpanKuis(); renderKuis();
    });
    $("#k-selesai").addEventListener("click", konfirmasi);
    $("#k-keluar").addEventListener("click", () => {
      $("#k-konfirmasi").innerHTML = `<div class="umpan no"><div class="judul">Keluar dari latihan ini?</div><div>Jawabanmu tidak dinilai dan latihan ini dihapus.</div><div class="btns"><button class="btn sm" type="button" id="kk-ya">Ya, keluar</button><button class="btn primary sm" type="button" id="kk-tidak">Lanjutkan mengerjakan</button></div></div>`;
      $("#kk-ya").addEventListener("click", () => { kuis = null; store.del("kuis"); renderMenu(); });
      $("#kk-tidak").addEventListener("click", () => ($("#k-konfirmasi").innerHTML = ""));
      $("#k-konfirmasi").scrollIntoView({ block: "nearest" });
    });

    function konfirmasi() {
      const kosong = kuis.items.filter((x) => nilai(SOAL_BY_ID[x], kuis.jawaban[x]).kosong).length;
      const ragu = kuis.ragu.length;
      $("#k-konfirmasi").innerHTML = `<div class="umpan ${kosong ? "no" : "ok"}"><div class="judul">Selesai sekarang?</div>
        <div>${kosong ? `Masih ada <b>${kosong}</b> soal yang belum dijawab.` : "Semua soal sudah dijawab."}${ragu ? ` Ada <b>${ragu}</b> soal yang ditandai ragu-ragu.` : ""}</div>
        <div class="btns"><button class="btn primary sm" type="button" id="kf-ya">Ya, lihat hasil</button><button class="btn sm" type="button" id="kf-tidak">Periksa lagi</button></div></div>`;
      $("#kf-ya").addEventListener("click", selesaikan);
      $("#kf-tidak").addEventListener("click", () => ($("#k-konfirmasi").innerHTML = ""));
      $("#k-konfirmasi").scrollIntoView({ block: "nearest", behavior: "smooth" });
    }

    if (kuis.durasi) {
      timerId = setInterval(() => {
        const d = sisaDetik();
        const t = $("#k-timer");
        if (t) { t.textContent = mmss(d); t.classList.toggle("low", d < 300); }
        if (d <= 0) { clearInterval(timerId); selesaikan(); }
      }, 1000);
    }
  }

  function selesaikan() {
    clearInterval(timerId);
    kuis.selesai = true;
    kuis.hasil = {};
    kuis.items.forEach((id) => (kuis.hasil[id] = nilai(SOAL_BY_ID[id], kuis.jawaban[id])));
    const benar = kuis.items.filter((id) => kuis.hasil[id].benar).length;
    const salahLama = new Set(store.get("salah", []));
    kuis.items.forEach((id) => (kuis.hasil[id].benar ? salahLama.delete(id) : salahLama.add(id)));
    store.set("salah", [...salahLama]);
    const riwayat = store.get("riwayat", []);
    const d = new Date();
    riwayat.unshift({
      tgl: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) + " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      mode: { topik: "Per topik", sumatif: "Simulasi sumatif", ulang: "Ulangi yang salah" }[kuis.mode],
      benar, total: kuis.items.length, skor: Math.round((benar / kuis.items.length) * 100),
    });
    store.set("riwayat", riwayat.slice(0, 20));
    simpanKuis();
    renderHasilKuis();
    window.scrollTo({ top: 0 });
  }

  function perkiraanLevel(pct) {
    const { P, A, N } = pct;
    const v = (x) => (x == null ? null : x);
    if (v(N) != null && N >= 75 && (A == null || A >= 75)) return 3;
    if (A != null ? A >= 70 : (N != null && N >= 60)) return 2;
    if ((P != null && P >= 60) || (A != null && A >= 40)) return 1;
    return 0;
  }
  const LEVEL_SUKSES = [
    { nama: "Mulai berkembang", cls: "lv1", saran: "Ulangi Prasyarat dan bab Tabung, Kerucut, Bola di tab Belajar. Pastikan bisa mengubah diameter ke jari-jari dan memilih rumus yang tepat." },
    { nama: "Berkembang", cls: "lv2", saran: "Rumus dasar sudah dikuasai. Latih luas sebagian (tanpa tutup, belahan bola) dan konversi satuan, lalu lanjut ke bab Gabungan & konteks." },
    { nama: "Cakap", cls: "lv3", saran: "Soal konteks multilangkah sudah baik. Tingkatkan penalaran: perubahan ukuran, perbandingan volume, dan soal Benar/Salah." },
    { nama: "Mendalam", cls: "lv4", saran: "Penalaranmu kuat. Coba simulasi sumatif lagi dengan target waktu lebih cepat, atau jelaskan pembahasan soal ke temanmu." },
  ];

  function renderHasilKuis() {
    const main = $("#main");
    main.innerHTML = "";
    const items = kuis.items, total = items.length;
    const H = kuis.hasil || {};
    const benar = items.filter((id) => H[id] && H[id].benar).length;
    const skor = Math.round((benar / total) * 100);
    const grup = (key) => {
      const o = {};
      items.forEach((id) => { const q = SOAL_BY_ID[id], k = q[key]; o[k] = o[k] || { b: 0, n: 0 }; o[k].n++; if (H[id].benar) o[k].b++; });
      return o;
    };
    const perTopik = grup("topik"), perLvl = grup("lvl");
    const pct = {}; ["P", "A", "N"].forEach((k) => (pct[k] = perLvl[k] ? (perLvl[k].b / perLvl[k].n) * 100 : null));
    const lv = LEVEL_SUKSES[perkiraanLevel(pct)];
    const misCount = {};
    items.forEach((id) => H[id].mis.forEach((m) => (misCount[m] = misCount[m] || []).push(id)));
    const misUrut = Object.entries(misCount).sort((a, b) => b[1].length - a[1].length);
    const nomorDari = (id) => items.indexOf(id) + 1;
    const meter = (obj, nama) => Object.entries(obj).map(([k, v]) => `<div class="m"><span>${nama[k] || k}</span><span class="n">${v.b}/${v.n}</span><div class="bar"><i style="width:${(v.b / v.n) * 100}%"></i></div></div>`).join("");

    const wrap = h(`<div class="wrap latihan">
      <section class="card"><div class="hasil-top">
        <div class="skor" style="background:conic-gradient(var(--accent) ${skor * 3.6}deg, var(--surface-2) 0)"><div style="background:var(--surface);width:78%;height:78%;border-radius:50%;display:grid;place-items:center"><div><b>${skor}</b><span>${benar} dari ${total} benar</span></div></div></div>
        <div style="display:grid;gap:8px;min-width:0">
          <span class="eyebrow">Hasil ${{ topik: "latihan per topik", sumatif: "simulasi sumatif", ulang: "latihan ulang" }[kuis.mode]}</span>
          <h2>Perkiraan level: <span class="lvl-pill ${lv.cls}" style="font-size:1rem">${lv.nama}</span></h2>
          <p>${lv.saran}</p>
          <p class="muted">Perkiraan ini dihitung dari persentase benar pada tiap jenis soal. Gunakan sebagai panduan, bukan nilai rapor.</p>
        </div></div></section>
      <div class="stat-grid">
        <section class="card"><h3>Per topik</h3><div class="meter">${meter(perTopik, TOPIK)}</div></section>
        <section class="card"><h3>Per jenis soal</h3><div class="meter">${meter(perLvl, LEVEL)}</div></section>
      </div>
      <section class="card"><h3>Yang perlu diperbaiki</h3>
        ${misUrut.length ? `<p class="muted">Jawaban salahmu paling banyak cocok dengan kesalahan berikut. Mulailah dari yang teratas.</p><div class="mis-list">${misUrut.map(([m, ids]) => `<div class="mis-item"><div class="h"><b>${MISKONSEPSI[m].nama}</b><span class="cnt">${ids.length} soal (no. ${ids.map(nomorDari).join(", ")})</span></div><p>${MISKONSEPSI[m].jelas}</p><a href="#belajar-${MISKONSEPSI[m].bagian}">Pelajari lagi di bab ${BAB_NAMA[MISKONSEPSI[m].bagian]} →</a></div>`).join("")}</div>` : `<p>${benar === total ? "Tidak ada jawaban salah. Hebat!" : "Jawaban salahmu tidak cocok dengan pola miskonsepsi tertentu. Baca pembahasan di bawah untuk melihat letak kesalahannya."}</p>`}
      </section>
      <section class="card"><h3>Pembahasan tiap soal</h3><p class="muted">Klik soal untuk melihat jawabanmu dan pembahasannya.</p><div class="review" id="h-review"></div></section>
      <div class="btns"><button class="btn primary" id="h-lagi" type="button">Kembali ke menu latihan</button>${store.get("salah", []).length ? `<button class="btn" id="h-ulang" type="button">Ulangi soal yang salah</button>` : ""}</div>
    </div>`);
    main.append(wrap);
    const rv = $("#h-review");
    items.forEach((id, i) => {
      const q = SOAL_BY_ID[id], r = H[id];
      const plain = h(`<div>${q.soal}</div>`).textContent;
      const d = h(`<details><summary><span class="st ${r.benar ? "b" : "s"}">${r.benar ? "✓" : "✗"}</span><span class="t"><b>${i + 1}.</b> ${plain}</span></summary><div class="rq"></div></details>`);
      d.addEventListener("toggle", () => {
        const box = $(".rq", d);
        if (d.open && !box.childElementCount) {
          const s = elSoal(q, { nomor: i + 1, urutan: kuis.urutan[id], jawaban: kuis.jawaban[id] });
          box.append(s.el); s.tampilkan(r);
        }
      }, { once: false });
      rv.append(d);
    });
    $("#h-lagi").addEventListener("click", () => { kuis = null; store.del("kuis"); renderMenu(); window.scrollTo({ top: 0 }); });
    const u = $("#h-ulang");
    if (u) u.addEventListener("click", () => { buatKuis("ulang", { umpan: "langsung" }); renderKuis(); window.scrollTo({ top: 0 }); });
  }

  /* ================= Router ================= */
  function route() {
    const hash = (location.hash || "").replace("#", "");
    const latihan = hash === "latihan";
    $$(".tab").forEach((t) => t.setAttribute("aria-selected", (t.dataset.tab === "latihan") === latihan));
    if (latihan) renderLatihan();
    else renderBelajar(hash.startsWith("belajar-") ? hash.slice(8) : "peta");
    window.scrollTo({ top: 0 });
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => {
    const tujuan = t.dataset.tab === "latihan" ? "#latihan" : "#belajar-" + (store.get("bab", "peta"));
    if (location.hash === tujuan) route(); else location.hash = tujuan;
  }));
  window.addEventListener("hashchange", () => {
    const hs = location.hash.replace("#", "");
    if (hs.startsWith("belajar-")) store.set("bab", hs.slice(8));
    route();
  });
  route();
})();
