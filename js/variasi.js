/* Soal variasi angka: setiap pemanggilan membuat soal baru dengan angka acak.
 * Kunci, pengecoh (berbasis kesalahan umum), dan pembahasan dihitung ulang
 * dari angka yang terpilih. Format soal sama dengan bank soal (js/soal.js). */
const Variasi = (() => {
  "use strict";
  const pilih = (a) => a[Math.floor(Math.random() * a.length)];
  const acakInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
  const f = (x, dp = 2) => (Math.round(x * 10 ** dp) / 10 ** dp).toLocaleString("id-ID", { maximumFractionDigits: dp });
  const tx = (x) => f(x).replace(",", "{,}");
  const T = (s) => "\\(" + s + "\\)";
  const SEPERTIGA = T("\\frac{1}{3}");
  const EMPAT3 = T("\\frac{4}{3}");
  const DUA3 = T("\\frac{2}{3}");

  // π = 22/7 jika r kelipatan 3,5 (d kelipatan 7), selain itu 3,14
  function piUntuk(r) {
    return Math.abs((2 * r) % 7) < 1e-9 ? { v: 22 / 7, s: T("\\frac{22}{7}") } : { v: 3.14, s: "3,14" };
  }
  const R_22 = [3.5, 7, 10.5, 14, 21];
  const R_314 = [2, 3, 4, 5, 6, 8, 9, 10, 12];
  const jariJari = () => (Math.random() < 0.5 ? pilih(R_22) : pilih(R_314));
  const TRIPEL = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [7, 24, 25], [12, 16, 20], [14, 48, 50]];

  /* Menyusun opsi PG: satu benar + pengecoh yang nilainya berbeda */
  function opsiPG(benar, satuan, salah) {
    const label = (s) => s.label || `${f(s.v)} ${s.sat || satuan}`.trim();
    const seen = new Set([label(benar)]);
    const ops = [{ t: label(benar), benar: true, why: benar.why }];
    for (const s of salah) {
      const k = label(s);
      // lewati pengecoh yang angkanya sama dengan kunci (walau satuannya beda) agar tidak membingungkan
      if (seen.has(k) || (s.v != null && (!(s.v > 0) || f(s.v) === f(benar.v)))) continue;
      seen.add(k);
      ops.push({ t: k, mis: s.mis, why: s.why });
      if (ops.length === 4) break;
    }
    let m = 2;
    while (ops.length < 4) {
      const k = label({ v: benar.v * m });
      if (!seen.has(k)) { seen.add(k); ops.push({ t: k, why: "Periksa kembali rumus dan langkah hitungmu." }); }
      m += 0.5;
    }
    return ops;
  }
  const ukuranR = (r, beriD) => (beriD ? `diameter alas ${f(2 * r)} cm` : `jari-jari alas ${f(r)} cm`);
  const langkahD = (r, beriD) => (beriD ? T(`r = \\frac{${tx(2 * r)}}{2} = ${tx(r)}`) + " cm. " : "");

  /* ---------------- TABUNG ---------------- */
  function tabungVolume() {
    const r = jariJari(), t = acakInt(4, 30), beriD = Math.random() < 0.5, P = piUntuk(r);
    const A = P.v * r * r, V = A * t;
    return {
      topik: "tabung", lvl: "A", tipe: "pg",
      soal: `Sebuah tabung memiliki ${ukuranR(r, beriD)} dan tinggi ${t} cm. Volume tabung tersebut adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: V, why: `Luas alas = ${f(A)} cm², volume = ${f(A)} × ${t} = ${f(V)} cm³.` }, "cm³", [
        beriD ? { v: V * 4, mis: "M1", why: `Ini memakai diameter ${f(2 * r)} cm sebagai jari-jari, sehingga hasilnya 4 kali terlalu besar.` } : null,
        { v: V / 3, mis: "E1", why: `Ini memakai ${SEPERTIGA} seperti rumus kerucut. Volume tabung = πr²t tanpa ${SEPERTIGA}.` },
        { v: 2 * P.v * r * (r + t), sat: "cm²", mis: "E2", why: "Ini luas permukaan 2πr(r + t), bukan volume." },
        { v: 2 * P.v * r * t, sat: "cm²", mis: "E2", why: "Ini luas selimut 2πrt, bukan volume." },
      ].filter(Boolean)),
      pembahasan: `${langkahD(r, beriD)}Luas alas = ${P.s} × ${f(r)}² = ${f(A)} cm². V = luas alas × t = ${f(A)} × ${t} = ${f(V)} cm³.`,
    };
  }

  function tabungLuas() {
    const r = jariJari(), t = acakInt(3, 25), P = piUntuk(r);
    const jenis = pilih(["lengkap", "tanpa tutup", "pipa"]);
    const alas = P.v * r * r, sel = 2 * P.v * r * t;
    const nilai = { lengkap: 2 * alas + sel, "tanpa tutup": alas + sel, pipa: sel };
    const nama = { lengkap: "tabung tertutup", "tanpa tutup": "kaleng berbentuk tabung <b>tanpa tutup</b>", pipa: "pipa berbentuk tabung <b>tanpa alas dan tanpa tutup</b>" };
    const urai = { lengkap: `2 × ${f(alas)} + ${f(sel)}`, "tanpa tutup": `${f(alas)} + ${f(sel)}`, pipa: `selimut saja = ${f(sel)}` };
    const salah = Object.keys(nilai).filter((k) => k !== jenis).map((k) => ({
      v: nilai[k], mis: "M3", why: k === "lengkap" ? "Ini luas tabung lengkap. Perhatikan sisi mana yang benar-benar ada." : k === "pipa" ? "Ini hanya luas selimut. Alas yang ada tetap dihitung." : "Ini menghitung alas + selimut saja. Perhatikan sisi mana yang benar-benar ada.",
    }));
    salah.push({ v: alas * t, sat: "cm³", mis: "E2", why: "Ini volume (πr²t), bukan luas permukaan." });
    return {
      topik: "tabung", lvl: "A", tipe: "pg",
      soal: `Sebuah ${nama[jenis]} memiliki jari-jari ${f(r)} cm dan tinggi ${t} cm. Luas permukaannya adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: nilai[jenis], why: `Luas = ${urai[jenis]} = ${f(nilai[jenis])} cm².` }, "cm²", salah),
      pembahasan: `Luas alas = ${P.s} × ${f(r)}² = ${f(alas)} cm². Luas selimut = 2 × ${P.s} × ${f(r)} × ${t} = ${f(sel)} cm². Untuk ${nama[jenis].replace(/<\/?b>/g, "")}: ${urai[jenis]} = ${f(nilai[jenis])} cm².`,
    };
  }

  function tabungMundur() {
    const r = jariJari(), t = acakInt(3, 30), P = piUntuk(r);
    const A = P.v * r * r, V = A * t;
    return {
      topik: "tabung", lvl: "N", tipe: "isian", satuan: "cm", jawaban: t, tol: 0.01,
      soal: `Volume sebuah tabung ${f(V)} cm³ dan jari-jari alasnya ${f(r)} cm. Tinggi tabung tersebut adalah … cm. (π = ${P.s})`,
      salah: [
        { v: 3 * t, mis: "E1", why: `Ini memakai ${SEPERTIGA} seperti kerucut. Volume tabung tanpa ${SEPERTIGA}.` },
        { v: V / (2 * P.v * r), mis: "E2", why: "Ini membagi volume dengan 2πr (rumus selimut). Bagilah dengan luas alas πr²." },
      ],
      pembahasan: `V = πr²t, jadi ${T(`t = \\frac{V}{\\pi r^2} = \\frac{${tx(V)}}{${tx(A)}} = ${t}`)} cm.`,
    };
  }

  /* ---------------- KERUCUT ---------------- */
  function tripel() {
    const [r, t, s] = pilih(TRIPEL);
    return { r, t, s };
  }

  function kerucutUnsur() {
    const { r, t, s } = tripel();
    if (Math.random() < 0.5) {
      return {
        topik: "kerucut", lvl: "A", tipe: "pg",
        soal: `Sebuah kerucut memiliki jari-jari alas ${r} cm dan tinggi ${t} cm. Panjang garis pelukisnya adalah …`,
        opsi: opsiPG({ v: s, why: `s = √(${r}² + ${t}²) = √${s * s} = ${s} cm.` }, "cm", [
          { v: r + t, mis: "E4", why: "Garis pelukis dihitung dengan Pythagoras, bukan dijumlahkan." },
          { v: t, mis: "M2", why: "Itu tingginya. Garis pelukis selalu lebih panjang dari tinggi." },
          { label: `√${t * t - r * r} cm`, mis: "M2", why: "Ini √(t² − r²), seolah-olah t sisi miringnya. Sisi miringnya s, jadi kuadratnya dijumlahkan." },
        ]),
        pembahasan: `s² = r² + t² = ${r * r} + ${t * t} = ${s * s}, jadi s = ${s} cm.`,
      };
    }
    return {
      topik: "kerucut", lvl: "A", tipe: "pg",
      soal: `Sebuah kerucut memiliki jari-jari alas ${r} cm dan garis pelukis ${s} cm. Tinggi kerucut tersebut adalah …`,
      opsi: opsiPG({ v: t, why: `t = √(${s}² − ${r}²) = √${t * t} = ${t} cm.` }, "cm", [
        { v: s, mis: "M2", why: "Itu garis pelukisnya, bukan tinggi." },
        { label: `√${s * s + r * r} cm`, mis: "M2", why: "Ini √(s² + r²). Garis pelukis sudah sisi miring, jadi kuadratnya dikurangkan." },
        { v: s - r, mis: "E4", why: "Gunakan Pythagoras: t² = s² − r², bukan s − r." },
      ]),
      pembahasan: `t² = s² − r² = ${s * s} − ${r * r} = ${t * t}, jadi t = ${t} cm.`,
    };
  }

  function kerucutVolume() {
    const { r, t, s } = tripel(), P = piUntuk(r), beriDS = Math.random() < 0.5;
    const V = (P.v * r * r * t) / 3;
    const data = beriDS ? `diameter alas ${2 * r} cm dan garis pelukis ${s} cm` : `jari-jari alas ${r} cm dan tinggi ${t} cm`;
    return {
      topik: "kerucut", lvl: "A", tipe: "pg",
      soal: `Sebuah kerucut memiliki ${data}. Volume kerucut tersebut adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: V, why: `V = ${SEPERTIGA} × ${P.s} × ${r}² × ${t} = ${f(V)} cm³.` }, "cm³", [
        { v: V * 3, mis: "E1", why: `Ini πr²t tanpa ${SEPERTIGA}. Volume kerucut = ${SEPERTIGA} volume tabung.` },
        beriDS ? { v: (P.v * r * r * s) / 3, mis: "M2", why: `Ini memakai garis pelukis ${s} cm sebagai tinggi. Volume memakai tinggi t = ${t} cm.` } : null,
        beriDS ? { v: V * 4, mis: "M1", why: `Ini memakai diameter ${2 * r} cm sebagai jari-jari.` } : null,
        { v: P.v * r * (r + s), sat: "cm²", mis: "E2", why: "Ini luas permukaan kerucut, bukan volume." },
        { v: P.v * r * r * t / 2, mis: "E1", why: `Volume kerucut memakai ${SEPERTIGA}, bukan ½.` },
      ].filter(Boolean)),
      pembahasan: `${beriDS ? `r = ${2 * r} : 2 = ${r} cm, lalu t = √(${s}² − ${r}²) = ${t} cm. ` : ""}V = ${SEPERTIGA} × ${P.s} × ${r}² × ${t} = ${f(V)} cm³.`,
    };
  }

  function kerucutLuas() {
    const { r, t, s } = tripel(), P = piUntuk(r);
    const sel = P.v * r * s, lp = P.v * r * (r + s), tanya = pilih(["selimut", "permukaan"]);
    const benar = tanya === "selimut" ? sel : lp;
    return {
      topik: "kerucut", lvl: "A", tipe: "pg",
      soal: `Sebuah kerucut memiliki jari-jari ${r} cm dan tinggi ${t} cm. Luas ${tanya === "selimut" ? "selimut" : "permukaan"} kerucut tersebut adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: benar, why: `s = ${s} cm. ${tanya === "selimut" ? `πrs = ${f(sel)}` : `πr(r + s) = ${f(lp)}`} cm².` }, "cm²", [
        { v: tanya === "selimut" ? P.v * r * t : P.v * r * (r + t), mis: "M2", why: "Ini memakai tinggi t. Luas selimut memakai garis pelukis s." },
        { v: tanya === "selimut" ? lp : sel, mis: "M3", why: tanya === "selimut" ? "Ini luas permukaan (ikut alas). Soal hanya meminta selimut." : "Ini hanya selimut. Luas permukaan kerucut = alas + selimut." },
        { v: 2 * P.v * r * s, mis: "E4", why: "Ini 2πrs seperti selimut tabung. Selimut kerucut adalah juring, luasnya πrs." },
      ]),
      pembahasan: `s = √(${r}² + ${t}²) = ${s} cm. Luas selimut = ${P.s} × ${r} × ${s} = ${f(sel)} cm². Luas permukaan = alas + selimut = ${f(P.v * r * r)} + ${f(sel)} = ${f(lp)} cm².`,
    };
  }

  function kerucutMundur() {
    const { r, t, s } = tripel(), P = piUntuk(r);
    const V = (P.v * r * r * t) / 3;
    return {
      topik: "kerucut", lvl: "N", tipe: "isian", satuan: "cm", jawaban: t, tol: 0.01,
      soal: `Volume sebuah kerucut ${f(V)} cm³ dan jari-jari alasnya ${r} cm. Tinggi kerucut tersebut adalah … cm. (π = ${P.s})`,
      salah: [
        { v: t / 3, mis: "E1", why: `Ini membagi volume dengan πr² tanpa memperhitungkan ${SEPERTIGA}. Karena V = ${SEPERTIGA}πr²t, maka t = 3V : πr².` },
        { v: s, mis: "M2", why: "Itu panjang garis pelukis, bukan tinggi." },
      ],
      pembahasan: `${T(`t = \\frac{3V}{\\pi r^2} = \\frac{3 \\times ${tx(V)}}{${tx(P.v * r * r)}} = ${t}`)} cm.`,
    };
  }

  /* ---------------- BOLA ---------------- */
  const R_BOLA = [3.5, 7, 10.5, 14, 21, 2, 3, 5, 6, 9, 10, 12];

  function bolaVolume() {
    const r = pilih(R_BOLA), P = piUntuk(r), beriD = Math.random() < 0.5;
    const V = (4 / 3) * P.v * r ** 3;
    return {
      topik: "bola", lvl: "A", tipe: "pg",
      soal: `Sebuah bola memiliki ${beriD ? `diameter ${f(2 * r)} cm` : `jari-jari ${f(r)} cm`}. Volume bola tersebut adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: V, why: `V = ${EMPAT3} × ${P.s} × ${f(r)}³ = ${f(V)} cm³.` }, "cm³", [
        beriD ? { v: V * 8, mis: "M1", why: "Ini memakai diameter sebagai jari-jari. Karena r dipangkatkan tiga, hasilnya 8 kali terlalu besar." } : null,
        { v: 4 * P.v * r * r, sat: "cm²", mis: "E2", why: "Ini luas permukaan bola (4πr²), bukan volume." },
        { v: V / 2, mis: "E3", why: "Ini volume belahan bola. Soal menanyakan bola utuh." },
        { v: 4 * P.v * r ** 3, mis: "E4", why: `Rumus volume bola memakai ${EMPAT3}, bukan 4.` },
      ].filter(Boolean)),
      pembahasan: `${beriD ? `r = ${f(2 * r)} : 2 = ${f(r)} cm. ` : ""}V = ${EMPAT3} × ${P.s} × ${f(r)}³ = ${f(V)} cm³.`,
    };
  }

  function bolaLuas() {
    const r = pilih(R_BOLA), P = piUntuk(r), L1 = P.v * r * r;
    const jenis = pilih(["bola", "padat", "kubah"]);
    const nilai = { bola: 4 * L1, padat: 3 * L1, kubah: 2 * L1 };
    const nama = { bola: "bola", padat: "belahan bola <b>padat</b> (setengah bola pejal)", kubah: "kubah berbentuk belahan bola <b>tanpa alas</b>" };
    const rumus = { bola: "4πr²", padat: "3πr² (2πr² lengkung + πr² alas)", kubah: "2πr² (hanya kulit lengkung)" };
    const salah = Object.keys(nilai).filter((k) => k !== jenis).map((k) => ({
      v: nilai[k], mis: k === "bola" ? "E3" : "M3",
      why: k === "bola" ? "Ini luas bola utuh, padahal bangunnya hanya setengah bola." : k === "padat" ? "Ini 3πr², yang ikut menghitung alas datar. Periksa apakah alasnya ada." : "Ini hanya kulit lengkung (2πr²). Periksa apakah ada alas datar yang ikut dihitung.",
    }));
    salah.push({ v: nilai[jenis] * 4, mis: "M1", why: "Ini memakai diameter sebagai jari-jari, sehingga luasnya 4 kali terlalu besar." });
    return {
      topik: "bola", lvl: "A", tipe: "pg",
      soal: `Sebuah ${nama[jenis]} memiliki jari-jari ${f(r)} cm. Luas permukaannya adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: nilai[jenis], why: `Luas = ${rumus[jenis]} = ${f(nilai[jenis])} cm².` }, "cm²", salah),
      pembahasan: `πr² = ${P.s} × ${f(r)}² = ${f(L1)} cm². Luas ${nama[jenis].replace(/<\/?b>/g, "")} = ${rumus[jenis]} = ${f(nilai[jenis])} cm².`,
    };
  }

  function bolaMundur() {
    const r = Math.random() < 0.5 ? pilih([7, 14, 21]) : acakInt(1, 10), P = piUntuk(r);
    const V = (4 / 3) * P.v * r ** 3;
    return {
      topik: "bola", lvl: "N", tipe: "isian", satuan: "cm", jawaban: r, tol: 0.01,
      soal: `Volume sebuah bola ${f(V)} cm³. Jari-jari bola tersebut adalah … cm. (π = ${P.s})`,
      salah: [
        { v: 2 * r, mis: "M1", why: "Itu diameternya. Soal menanyakan jari-jari." },
        { v: r ** 3, mis: "E4", why: `Itu nilai r³. Masih perlu ditarik akar pangkat tiga: ∛${r ** 3} = ${r}.` },
      ],
      pembahasan: `${T(`r^3 = \\frac{3V}{4\\pi} = \\frac{3 \\times ${tx(V)}}{4 \\times ${P.v === 3.14 ? "3{,}14" : "\\frac{22}{7}"}} = ${r ** 3}`)}, jadi r = ∛${r ** 3} = ${r} cm.`,
    };
  }

  /* ---------------- GABUNGAN & KONTEKS ---------------- */
  function kenaikanAir() {
    const r = pilih([3, 6, 9]), R = 2 * r, n = acakInt(1, 4), h0 = acakInt(4, 15);
    const naik1 = r / 3, naik = n * naik1;
    const vb = (4 / 3) * 3.14 * r ** 3;
    return {
      topik: "gabungan", lvl: "A", tipe: "isian", satuan: "cm", jawaban: h0 + naik, tol: 0.01,
      soal: `Sebuah gelas berbentuk tabung berjari-jari ${R} cm berisi air setinggi ${h0} cm. ${n === 1 ? "Sebuah kelereng" : `${n} kelereng`} berjari-jari ${r} cm dimasukkan hingga tenggelam dan air tidak tumpah. Tinggi permukaan air sekarang adalah … cm. (π = 3,14)`,
      salah: [
        { v: naik, mis: "E4", why: `${f(naik)} cm adalah kenaikannya. Tinggi air sekarang = tinggi awal + kenaikan.` },
        n > 1 ? { v: h0 + naik1, mis: "E4", why: `Ini hanya menghitung satu kelereng. Volume yang masuk = ${n} × volume satu kelereng.` } : null,
        { v: h0 + 8 * naik, mis: "M1", why: "Ini memakai diameter kelereng sebagai jari-jari, sehingga volumenya 8 kali terlalu besar." },
      ].filter(Boolean),
      pembahasan: `Volume ${n} kelereng = ${n} × ${EMPAT3} × 3,14 × ${r}³ = ${f(n * vb)} cm³. Luas alas gelas = 3,14 × ${R}² = ${f(3.14 * R * R)} cm². Kenaikan = ${T(`\\frac{${tx(n * vb)}}{${tx(3.14 * R * R)}} = ${tx(naik)}`)} cm. Tinggi air = ${h0} + ${f(naik)} = ${f(h0 + naik)} cm.`,
    };
  }

  function persediaanAir() {
    const r = pilih([14, 21, 28, 35]), t = pilih([50, 60, 70, 80, 100]);
    const V = (22 / 7) * r * r * t, L = V / 1000;
    let pakai = acakInt(3, Math.max(4, Math.floor(L / 3)));
    if (Number.isInteger(L / pakai)) pakai += 1;
    const hari = Math.floor(L / pakai);
    return {
      topik: "gabungan", lvl: "N", tipe: "pg",
      soal: `Sebuah drum berbentuk tabung dengan jari-jari ${r} cm dan tinggi ${t} cm terisi penuh air. Setiap hari dipakai ${pakai} liter. Air dalam drum cukup untuk … hari penuh. (π = ${T("\\frac{22}{7}")})`,
      opsi: opsiPG({ label: `${hari} hari`, v: hari, why: `${f(L)} : ${pakai} = ${f(L / pakai)}, dibulatkan ke bawah menjadi ${hari} hari.` }, "hari", [
        { label: `${hari + 1} hari`, v: hari + 1, mis: "E4", why: `Hasil bagi ${f(L / pakai)} tidak dibulatkan ke atas. Pada hari ke-${hari + 1} airnya sudah kurang dari ${pakai} liter.` },
        { label: `${Math.floor((L * 10) / pakai)} hari`, v: Math.floor((L * 10) / pakai), mis: "M5", why: "Ini menganggap 1 liter = 100 cm³. Yang benar 1 liter = 1.000 cm³." },
        { label: `${Math.floor(V / pakai)} hari`, v: Math.floor(V / pakai), mis: "M5", why: "Volume masih dalam cm³, belum diubah ke liter." },
      ]),
      pembahasan: `V = ${T("\\frac{22}{7}")} × ${r} × ${r} × ${t} = ${f(V)} cm³ = ${f(L)} liter. Banyak hari = ${T(`\\frac{${tx(L)}}{${pakai}} \\approx ${tx(L / pakai)}`)}. Untuk hari penuh, bulatkan ke bawah: ${hari} hari.`,
    };
  }

  function ruangKosong() {
    const r = pilih(R_BOLA), P = piUntuk(r);
    const Vt = P.v * r * r * 2 * r, Vb = (2 / 3) * Vt, kosong = Vt / 3;
    return {
      topik: "gabungan", lvl: "A", tipe: "pg",
      soal: `Sebuah bola berjari-jari ${f(r)} cm dimasukkan ke dalam tabung sehingga bola menyentuh alas, tutup, dan selimut tabung. Volume ruang kosong di dalam tabung adalah … (π = ${P.s})`,
      opsi: opsiPG({ v: kosong, why: `V tabung ${f(Vt)} − V bola ${f(Vb)} = ${f(kosong)} cm³.` }, "cm³", [
        { v: Vb, mis: "E4", why: "Itu volume bolanya. Ruang kosong = volume tabung − volume bola." },
        { v: Vt, mis: "E4", why: "Itu volume tabung seluruhnya. Kurangi dulu dengan volume bola." },
        { v: Vt / 2, mis: "E3", why: `Bola mengisi ${DUA3} tabung, jadi ruang kosongnya ${SEPERTIGA}, bukan ½.` },
      ]),
      pembahasan: `Tinggi tabung = diameter bola = ${f(2 * r)} cm. V tabung = ${P.s} × ${f(r)}² × ${f(2 * r)} = ${f(Vt)} cm³. V bola = ${EMPAT3} × ${P.s} × ${f(r)}³ = ${f(Vb)} cm³. Ruang kosong = ${f(Vt)} − ${f(Vb)} = ${f(kosong)} cm³ (= ${SEPERTIGA} volume tabung).`,
    };
  }

  const GEN = {
    tabung: [tabungVolume, tabungLuas, tabungMundur],
    kerucut: [kerucutUnsur, kerucutVolume, kerucutLuas, kerucutMundur],
    bola: [bolaVolume, bolaLuas, bolaMundur],
    gabungan: [kenaikanAir, persediaanAir, ruangKosong],
  };

  let nomor = 0;
  /* Membuat n soal acak dari topik yang dipilih, bergiliran antar-topik */
  function buat(topik, n) {
    const daftar = topik.filter((t) => GEN[t]);
    const hasil = [];
    for (let i = 0; i < n && daftar.length; i++) {
      const tp = daftar[i % daftar.length];
      const q = pilih(GEN[tp])();
      q.id = `V${Date.now().toString(36)}${(nomor++).toString(36)}`;
      q.variasi = true;
      hasil.push(q);
    }
    return hasil;
  }

  return { buat, topik: Object.keys(GEN), _GEN: GEN };
})();

if (typeof module !== "undefined") module.exports = { Variasi };
