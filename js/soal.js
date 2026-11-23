/* Bank soal: Bangun Ruang Sisi Lengkung (Kelas IX, Fase D)
 *
 * Bentuk soal mengikuti TKA SMP dan sumatif:
 *   pg     : pilihan ganda (satu jawaban benar)
 *   pgk    : pilihan ganda kompleks (pilih semua yang benar)
 *   bs     : pilihan ganda kompleks kategori (Benar/Salah per pernyataan)
 *   isian  : isian singkat berupa bilangan
 *
 * Setiap pengecoh diberi kode miskonsepsi (mis) agar umpan balik bisa
 * menyebut letak kesalahannya. Kode M1 sampai M5 berasal dari dokumen
 * bedah kompetensi; E1 sampai E4 adalah kesalahan lain yang sering muncul.
 *
 * Level kognitif (lvl): P = Pengetahuan & Pemahaman, A = Aplikasi, N = Penalaran
 * Indikator (ind): 1 unsur & Pythagoras, 2 volume, 3 luas permukaan,
 *   4 gabungan & konteks, 5 perubahan ukuran & perbandingan, 6 penalaran & operasi balik
 */

const MISKONSEPSI = {
  M1: {
    nama: "Tertukar jari-jari dan diameter",
    jelas: "Diameter dimasukkan sebagai r. Hasil volume tabung atau kerucut jadi 4 kali, volume bola 8 kali lebih besar. Selalu cek: data yang diberikan r atau d? Jika d, bagi 2 dulu.",
    bagian: "prasyarat",
  },
  M2: {
    nama: "Tinggi kerucut dianggap sama dengan garis pelukis",
    jelas: "t dipakai untuk luas selimut (seharusnya π·r·s) atau s dipakai untuk volume (seharusnya \\(\\frac{1}{3}\\)·π·r²·t). Bayangkan segitiga siku-siku di dalam kerucut: s adalah sisi miringnya, s² = r² + t².",
    bagian: "kerucut",
  },
  M3: {
    nama: "Luas permukaan selalu dihitung lengkap",
    jelas: "Rumus dihafal sebagai satu paket. Padahal luas permukaan adalah jumlah sisi yang benar-benar ada pada jaring-jaring. Tabung tanpa tutup tidak punya tutup, belahan bola padat punya alas lingkaran (3πr²), dan sisi yang menempel pada bangun gabungan tidak dihitung.",
    bagian: "gabungan",
  },
  M4: {
    nama: "Perubahan ukuran dianggap linear",
    jelas: "Jari-jari 2 kali tidak membuat volume 2 kali. Volume sebanding dengan r² (tabung, kerucut, jika t tetap) atau r³ (bola). Luas sebanding dengan kuadrat ukuran.",
    bagian: "perubahan",
  },
  M5: {
    nama: "Kesalahan satuan dan konversi",
    jelas: "1 liter = 1 dm³ = 1.000 cm³ dan 1 m³ = 1.000 liter. Luas: 1 m² = 10.000 cm². Samakan satuan sebelum menghitung, lalu ubah ke satuan yang diminta.",
    bagian: "prasyarat",
  },
  E1: {
    nama: "Lupa faktor \\(\\frac{1}{3}\\) pada kerucut",
    jelas: "Volume kerucut adalah \\(\\frac{1}{3}\\) volume tabung dengan alas dan tinggi sama. Tanpa \\(\\frac{1}{3}\\) hasilnya 3 kali terlalu besar. Sebaliknya, jangan memakai \\(\\frac{1}{3}\\) untuk tabung.",
    bagian: "kerucut",
  },
  E2: {
    nama: "Tertukar rumus luas dan volume",
    jelas: "Luas memakai satuan persegi (cm²) dan pangkat 2, volume memakai satuan kubik (cm³) dan pangkat 3 (atau r² × t). Cek satuan jawaban untuk mengetahui rumus mana yang dipakai.",
    bagian: "bola",
  },
  E3: {
    nama: "Belahan bola dihitung sebagai bola utuh (atau sebaliknya)",
    jelas: "Volume belahan bola = \\(\\frac{1}{2}\\) × \\(\\frac{4}{3}\\)πr³ = \\(\\frac{2}{3}\\)πr³. Baca soalnya: bola utuh, belahan, atau seperempat?",
    bagian: "bola",
  },
  E4: {
    nama: "Salah unsur atau salah membaca jaring-jaring",
    jelas: "Kenali dulu unsur tiap bangun: jari-jari, diameter, tinggi, garis pelukis, selimut, alas. Selimut tabung terbuka menjadi persegi panjang, selimut kerucut menjadi juring lingkaran.",
    bagian: "tabung",
  },
};

const TOPIK = {
  tabung: "Tabung",
  kerucut: "Kerucut",
  bola: "Bola",
  gabungan: "Gabungan & konteks",
  perubahan: "Perubahan ukuran",
};

const LEVEL = {
  P: "Pengetahuan & Pemahaman",
  A: "Aplikasi",
  N: "Penalaran",
};

/* Stimulus untuk soal grup (satu stimulus, beberapa soal) */
const STIMULUS = {
  eskrim: {
    judul: "Model es krim",
    html: `<p>Sebuah model es krim dari plastik terdiri atas <b>kerucut</b> dengan jari-jari 6 cm dan tinggi 8 cm, dan <b>belahan bola</b> berjari-jari 6 cm yang menempel tepat di atas alas kerucut. Model itu padat (terisi penuh). Gunakan π = 3,14.</p>`,
    gambar: "eskrim",
  },
  tandon: {
    judul: "Tandon air sekolah",
    html: `<p>Tandon air sekolah berbentuk <b>tabung</b> dengan diameter 1,4 m dan tinggi 2 m. Tandon kosong diisi melalui keran dengan debit 7 liter per menit. Gunakan π = \\(\\frac{22}{7}\\).</p>`,
    gambar: "tandon",
  },
  drum: {
    judul: "Drum air kebun sekolah",
    html: `<p>Kebun sekolah memakai drum berbentuk <b>tabung</b> dengan jari-jari alas 28 cm dan tinggi 50 cm untuk menyiram tanaman. Drum diisi penuh, lalu setiap hari dipakai 8 liter air. Gunakan π = \\(\\frac{22}{7}\\).</p>`,
  },
};

const SOAL = [
  /* ---------------- TABUNG ---------------- */
  {
    id: "T1", topik: "tabung", ind: 1, lvl: "P", tipe: "pg",
    soal: "Jaring-jaring tabung (lengkap dengan tutup) terdiri atas …",
    opsi: [
      { t: "dua lingkaran dan satu persegi panjang", benar: true, why: "Tepat. Alas dan tutup berbentuk lingkaran, selimutnya terbuka menjadi persegi panjang." },
      { t: "satu lingkaran dan satu juring lingkaran", mis: "E4", why: "Itu jaring-jaring kerucut. Selimut tabung terbuka menjadi persegi panjang, bukan juring." },
      { t: "satu lingkaran dan satu persegi panjang", mis: "M3", why: "Itu jaring-jaring tabung tanpa tutup. Soal meminta tabung lengkap, jadi ada dua lingkaran." },
      { t: "dua lingkaran dan dua persegi panjang", mis: "E4", why: "Selimut tabung hanya satu bidang lengkung, yang jika dibuka menjadi satu persegi panjang." },
    ],
    pembahasan: "Bayangkan kaleng susu: tutup atas dan alas adalah dua lingkaran, label kertasnya (selimut) jika dibuka menjadi persegi panjang.",
  },
  {
    id: "T2", topik: "tabung", ind: 1, lvl: "P", tipe: "pg",
    soal: "Selimut sebuah tabung dibuka menjadi persegi panjang. Jari-jari alas tabung 7 cm dan tingginya 10 cm. Ukuran persegi panjang tersebut adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "44 cm × 10 cm", benar: true, why: "Panjang persegi panjang = keliling alas = 2 × \\(\\frac{22}{7}\\) × 7 = 44 cm, lebarnya = tinggi tabung = 10 cm." },
      { t: "22 cm × 10 cm", mis: "E4", why: "22 cm adalah π × r, bukan keliling lingkaran. Keliling = 2πr = 44 cm." },
      { t: "88 cm × 10 cm", mis: "M1", why: "88 cm didapat jika 14 (diameter) dipakai sebagai jari-jari. Jari-jarinya 7 cm." },
      { t: "154 cm × 10 cm", mis: "E2", why: "154 adalah luas lingkaran alas (πr²), bukan kelilingnya. Panjang selimut sama dengan keliling alas." },
    ],
    pembahasan: "Panjang selimut = keliling alas = 2πr = 2 × \\(\\frac{22}{7}\\) × 7 = 44 cm. Lebar selimut = t = 10 cm.",
  },
  {
    id: "T3", topik: "tabung", ind: 2, lvl: "A", tipe: "pg",
    soal: "Sebuah tabung memiliki diameter alas 14 cm dan tinggi 20 cm. Volume tabung tersebut adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "3.080 cm³", benar: true, why: "\\(r = \\frac{14}{2} = 7\\) cm. V = \\(\\frac{22}{7}\\) × 7 × 7 × 20 = 154 × 20 = 3.080 cm³." },
      { t: "12.320 cm³", mis: "M1", why: "Ini hasil jika diameter 14 cm dipakai sebagai jari-jari, sehingga volumenya 4 kali terlalu besar." },
      { t: "1.188 cm³", mis: "E2", why: "1.188 adalah luas permukaan tabung 2πr(r + t), bukan volume. Satuannya pun seharusnya cm²." },
      { t: "1.026,67 cm³", mis: "E1", why: "Ini memakai \\(\\frac{1}{3}\\) seperti rumus kerucut. Volume tabung = πr²t tanpa \\(\\frac{1}{3}\\)." },
    ],
    pembahasan: "Langkah: (1) \\(r = \\frac{d}{2}\\) = 7 cm. (2) Luas alas = \\(\\frac{22}{7}\\) × 7² = 154 cm². (3) V = luas alas × t = 154 × 20 = 3.080 cm³.",
  },
  {
    id: "T4", topik: "tabung", ind: 3, lvl: "A", tipe: "pg",
    soal: "Sebuah kaleng berbentuk tabung <b>tanpa tutup</b> memiliki jari-jari 7 cm dan tinggi 10 cm. Luas bahan yang diperlukan untuk membuat kaleng itu adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "594 cm²", benar: true, why: "Tanpa tutup berarti hanya alas + selimut: 154 + 440 = 594 cm²." },
      { t: "748 cm²", mis: "M3", why: "748 cm² adalah luas permukaan tabung lengkap (dengan tutup). Kaleng ini tidak bertutup." },
      { t: "440 cm²", mis: "M3", why: "440 cm² hanya luas selimut. Alas kaleng tetap ada dan harus dihitung." },
      { t: "1.540 cm²", mis: "E2", why: "1.540 adalah volume kaleng (πr²t) dalam cm³, bukan luas bahan." },
    ],
    pembahasan: "Luas alas = πr² = 154 cm². Luas selimut = 2πrt = 2 × \\(\\frac{22}{7}\\) × 7 × 10 = 440 cm². Luas tanpa tutup = 154 + 440 = 594 cm².",
  },
  {
    id: "T5", topik: "tabung", ind: 6, lvl: "N", tipe: "isian",
    soal: "Volume sebuah tabung 1.570 cm³ dan jari-jari alasnya 5 cm. Tinggi tabung tersebut adalah … cm. (π = 3,14)",
    jawaban: 20, satuan: "cm",
    salah: [
      { v: 50, mis: "E2", why: "50 didapat jika 1.570 dibagi 2πr (rumus luas selimut). Untuk volume, bagi dengan luas alas πr²." },
      { v: 80, mis: "M1", why: "80 didapat jika jari-jari 5 cm dianggap diameter (r = 2,5 cm). Jari-jarinya sudah 5 cm." },
      { v: 60, mis: "E1", why: "60 didapat jika rumus volume memakai \\(\\frac{1}{3}\\) seperti kerucut. Volume tabung tanpa \\(\\frac{1}{3}\\)." },
    ],
    pembahasan: "Kerja mundur: V = πr²t ⇒ 1.570 = 3,14 × 25 × t = 78,5 × t ⇒ \\(t = \\frac{1.570}{78{,}5} = 20\\) cm.",
  },
  {
    id: "T6", topik: "tabung", ind: 5, lvl: "N", tipe: "bs",
    soal: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm (π = \\(\\frac{22}{7}\\)). Tentukan Benar atau Salah setiap pernyataan berikut.",
    pernyataan: [
      { t: "Luas selimut tabung adalah 440 cm².", benar: true, why: "2πrt = 2 × \\(\\frac{22}{7}\\) × 7 × 10 = 440 cm²." },
      { t: "Jika tingginya dijadikan 2 kali, volumenya menjadi 2 kali.", benar: true, why: "V = πr²t sebanding dengan t, jadi t × 2 membuat V × 2." },
      { t: "Jika jari-jarinya dijadikan 2 kali (tinggi tetap), volumenya menjadi 2 kali.", benar: false, mis: "M4", why: "Salah. V sebanding dengan r², jadi r × 2 membuat V × 2² = 4 kali." },
      { t: "Luas permukaan tabung = 2 × luas alas + luas selimut.", benar: true, why: "Jaring-jaring tabung: dua lingkaran (alas dan tutup) + satu persegi panjang (selimut)." },
    ],
    pembahasan: "Ingat bentuk rumus: V = πr²t. Faktor pengali r dikuadratkan, faktor pengali t tidak.",
  },
  {
    id: "T7", topik: "tabung", ind: 4, lvl: "A", tipe: "pg",
    soal: "Sebuah drum minyak berbentuk tabung dengan diameter 1,4 m dan tinggi 1,5 m terisi penuh. Banyak minyak dalam drum adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "2.310 liter", benar: true, why: "r = 0,7 m. V = \\(\\frac{22}{7}\\) × 0,7 × 0,7 × 1,5 = 2,31 m³ = 2.310 liter." },
      { t: "231 liter", mis: "M5", why: "Ini menganggap 1 m³ = 100 liter. Yang benar 1 m³ = 1.000 liter." },
      { t: "9.240 liter", mis: "M1", why: "Ini memakai diameter 1,4 m sebagai jari-jari, sehingga volumenya 4 kali terlalu besar." },
      { t: "2,31 liter", mis: "M5", why: "2,31 adalah volume dalam m³. Belum diubah ke liter (× 1.000)." },
    ],
    pembahasan: "\\(r = \\frac{1{,}4}{2} = 0{,}7\\) m. Luas alas = \\(\\frac{22}{7}\\) × 0,49 = 1,54 m². V = 1,54 × 1,5 = 2,31 m³. Karena 1 m³ = 1.000 liter, V = 2.310 liter.",
  },
  {
    id: "T8", topik: "tabung", ind: 1, lvl: "P", tipe: "pg",
    soal: "Pada tabung, jarak antara bidang alas dan bidang tutup disebut …",
    opsi: [
      { t: "tinggi tabung", benar: true, why: "Tepat. Tinggi tabung adalah jarak tegak lurus antara alas dan tutup." },
      { t: "garis pelukis", mis: "E4", why: "Garis pelukis adalah unsur kerucut (dari puncak ke tepi alas). Pada tabung, garis pelukis memang sejajar dan sama panjang dengan tinggi, tetapi jarak alas-tutup disebut tinggi." },
      { t: "diameter tabung", mis: "M1", why: "Diameter adalah ruas garis yang melalui pusat lingkaran alas, panjangnya 2r." },
      { t: "selimut tabung", mis: "E4", why: "Selimut adalah bidang lengkung yang mengelilingi tabung, bukan jarak." },
    ],
    pembahasan: "Unsur tabung: alas dan tutup (lingkaran kongruen), selimut (bidang lengkung), jari-jari r, diameter d = 2r, dan tinggi t.",
  },

  /* ---------------- KERUCUT ---------------- */
  {
    id: "K1", topik: "kerucut", ind: 1, lvl: "P", tipe: "pg",
    soal: "Pada kerucut dengan jari-jari r, tinggi t, dan garis pelukis s, hubungan yang benar adalah …",
    opsi: [
      { t: "s² = r² + t²", benar: true, why: "Tepat. r, t, dan s membentuk segitiga siku-siku dengan s sebagai sisi miring." },
      { t: "t² = r² + s²", mis: "M2", why: "Sisi miring segitiga siku-siku di dalam kerucut adalah s, bukan t. Jadi s yang paling panjang." },
      { t: "s = r + t", mis: "E4", why: "Panjang sisi miring bukan jumlah dua sisi lainnya. Gunakan teorema Pythagoras." },
      { t: "r² = s² + t²", mis: "M2", why: "r adalah sisi siku-siku (di alas), bukan sisi miring." },
    ],
    pembahasan: "Potong kerucut tegak melalui puncaknya. Tampak segitiga siku-siku: alas r, tinggi t, sisi miring s. Maka s² = r² + t².",
  },
  {
    id: "K2", topik: "kerucut", ind: 1, lvl: "A", tipe: "pg",
    soal: "Sebuah kerucut memiliki jari-jari alas 5 cm dan tinggi 12 cm. Panjang garis pelukisnya adalah …",
    opsi: [
      { t: "13 cm", benar: true, why: "s = √(5² + 12²) = √169 = 13 cm (tripel 5-12-13)." },
      { t: "17 cm", mis: "E4", why: "17 = 5 + 12. Garis pelukis dihitung dengan Pythagoras, bukan dijumlah." },
      { t: "12 cm", mis: "M2", why: "12 cm adalah tinggi. Garis pelukis selalu lebih panjang dari tinggi." },
      { t: "√119 cm", mis: "M2", why: "√119 = √(12² − 5²). Ini menganggap tinggi sebagai sisi miring. Sisi miringnya s." },
    ],
    pembahasan: "s² = r² + t² = 25 + 144 = 169, s = 13 cm.",
  },
  {
    id: "K3", topik: "kerucut", ind: 3, lvl: "A", tipe: "pg",
    soal: "Sebuah kerucut memiliki jari-jari 7 cm dan tinggi 24 cm. Luas selimut kerucut tersebut adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "550 cm²", benar: true, why: "s = √(49 + 576) = 25 cm. L selimut = πrs = \\(\\frac{22}{7}\\) × 7 × 25 = 550 cm²." },
      { t: "528 cm²", mis: "M2", why: "528 = π × 7 × 24. Ini memakai tinggi, padahal luas selimut memakai garis pelukis s." },
      { t: "704 cm²", mis: "M3", why: "704 adalah luas permukaan lengkap (selimut + alas). Soal hanya meminta selimut." },
      { t: "1.100 cm²", mis: "E4", why: "1.100 = 2πrs, seperti rumus selimut tabung. Selimut kerucut adalah juring, luasnya πrs." },
    ],
    pembahasan: "Cari s dulu: s² = 7² + 24² = 625, s = 25 cm (tripel 7-24-25). L selimut = πrs = 22 × 25 = 550 cm².",
  },
  {
    id: "K4", topik: "kerucut", ind: 2, lvl: "A", tipe: "pg",
    soal: "Sebuah kerucut memiliki diameter alas 12 cm dan garis pelukis 10 cm. Volume kerucut tersebut adalah … (π = 3,14)",
    opsi: [
      { t: "301,44 cm³", benar: true, why: "r = 6 cm, t = √(10² − 6²) = 8 cm. V = \\(\\frac{1}{3}\\) × 3,14 × 36 × 8 = 301,44 cm³." },
      { t: "376,8 cm³", mis: "M2", why: "376,8 didapat jika garis pelukis 10 cm dipakai sebagai tinggi. Volume memakai tinggi t = 8 cm." },
      { t: "904,32 cm³", mis: "E1", why: "904,32 adalah πr²t tanpa \\(\\frac{1}{3}\\). Volume kerucut = \\(\\frac{1}{3}\\) volume tabung." },
      { t: "1.205,76 cm³", mis: "M1", why: "Ini memakai diameter 12 cm sebagai jari-jari (dengan t = 8 cm), sehingga volumenya 4 kali terlalu besar." },
    ],
    pembahasan: "(1) \\(r = \\frac{12}{2} = 6\\) cm. (2) t = √(s² − r²) = √(100 − 36) = 8 cm. (3) V = \\(\\frac{1}{3}\\)πr²t = \\(\\frac{1}{3}\\) × 3,14 × 36 × 8 = 301,44 cm³.",
  },
  {
    id: "K5", topik: "kerucut", ind: 5, lvl: "P", tipe: "pg",
    soal: "Sebuah kerucut dan sebuah tabung memiliki jari-jari alas dan tinggi yang sama. Jika volume tabung 900 cm³, volume kerucut adalah …",
    opsi: [
      { t: "300 cm³", benar: true, why: "Volume kerucut = \\(\\frac{1}{3}\\) volume tabung yang alas dan tingginya sama: \\(\\frac{1}{3}\\) × 900 = 300 cm³." },
      { t: "450 cm³", mis: "E1", why: "Bukan \\(\\frac{1}{2}\\). Tiga kerucut penuh tepat mengisi satu tabung, jadi kerucut = \\(\\frac{1}{3}\\) tabung." },
      { t: "900 cm³", mis: "E1", why: "Kerucut meruncing ke atas, jadi isinya lebih sedikit dari tabung. Tepatnya \\(\\frac{1}{3}\\)." },
      { t: "2.700 cm³", mis: "E1", why: "Terbalik. Tabung yang 3 kali kerucut, bukan kerucut yang 3 kali tabung." },
    ],
    pembahasan: "V kerucut = \\(\\frac{1}{3}\\)πr²t = \\(\\frac{1}{3}\\) × V tabung = \\(\\frac{1}{3}\\) × 900 = 300 cm³. Bisa dibuktikan dengan percobaan menuang air (lihat bagian Perubahan Ukuran di tab Belajar).",
  },
  {
    id: "K6", topik: "kerucut", ind: 1, lvl: "A", tipe: "pgk",
    soal: "Jaring-jaring sebuah kerucut dibuat dari kertas. Jari-jari alasnya 6 cm dan garis pelukisnya 10 cm (π = 3,14). Pilih <b>semua</b> pernyataan yang benar.",
    opsi: [
      { t: "Selimutnya berbentuk juring lingkaran berjari-jari 10 cm.", benar: true, why: "Benar. Jari-jari juring selimut sama dengan garis pelukis s." },
      { t: "Panjang busur juring sama dengan keliling alas, yaitu 37,68 cm.", benar: true, why: "Benar. 2 × 3,14 × 6 = 37,68 cm. Busur juring melingkari tepi alas." },
      { t: "Sudut pusat juring adalah 216°.", benar: true, why: "Benar. Sudut = \\(\\frac{r}{s} \\times 360^\\circ = \\frac{6}{10} \\times 360^\\circ = 216^\\circ\\)." },
      { t: "Jari-jari juring sama dengan jari-jari alas, yaitu 6 cm.", benar: false, mis: "E4", why: "Salah. Jari-jari juring adalah garis pelukis (10 cm), bukan jari-jari alas." },
      { t: "Luas selimutnya 3,14 × 6 × 8 = 150,72 cm².", benar: false, mis: "M2", why: "Salah. 8 cm adalah tinggi. Luas selimut = πrs = 3,14 × 6 × 10 = 188,4 cm²." },
    ],
    pembahasan: "Pada jaring-jaring kerucut, selimut adalah juring berjari-jari s dengan panjang busur 2πr. Sudut pusatnya (r/s) × 360°, dan luasnya πrs.",
  },
  {
    id: "K7", topik: "kerucut", ind: 6, lvl: "N", tipe: "isian",
    soal: "Volume sebuah kerucut 1.232 cm³ dan jari-jari alasnya 7 cm. Tinggi kerucut tersebut adalah … cm. (π = \\(\\frac{22}{7}\\))",
    jawaban: 24, satuan: "cm",
    salah: [
      { v: 8, mis: "E1", why: "8 didapat jika 1.232 hanya dibagi πr² = 154 tanpa memperhitungkan \\(\\frac{1}{3}\\). Karena V = \\(\\frac{1}{3}\\)πr²t, \\(t = \\frac{3V}{\\pi r^2}\\)." },
      { v: 6, mis: "M1", why: "6 didapat jika 7 dianggap diameter lalu r = 3,5. Jari-jarinya sudah 7 cm." },
      { v: 25, mis: "M2", why: "25 cm adalah garis pelukis kerucut ini, bukan tingginya." },
    ],
    pembahasan: "1.232 = \\(\\frac{1}{3}\\) × \\(\\frac{22}{7}\\) × 49 × t = \\(\\frac{1}{3}\\) × 154 × t. Maka \\(t = \\frac{1.232 \\times 3}{154} = \\frac{3.696}{154} = 24\\) cm.",
  },
  {
    id: "K8", topik: "kerucut", ind: 6, lvl: "N", tipe: "bs",
    soal: "Sebuah kerucut memiliki jari-jari 3 cm dan tinggi 4 cm. Tentukan Benar atau Salah setiap pernyataan berikut (biarkan π dalam bentuk π).",
    pernyataan: [
      { t: "Garis pelukis kerucut adalah 5 cm.", benar: true, why: "s = √(9 + 16) = 5 cm (tripel 3-4-5)." },
      { t: "Luas selimut kerucut adalah 12π cm².", benar: false, mis: "M2", why: "Salah. 12π = π × 3 × 4 memakai tinggi. Luas selimut = πrs = π × 3 × 5 = 15π cm²." },
      { t: "Volume kerucut adalah 12π cm³.", benar: true, why: "Benar. \\(\\frac{1}{3}\\) × π × 9 × 4 = 12π cm³. Volume memakai tinggi t." },
      { t: "Luas permukaan kerucut adalah 24π cm².", benar: true, why: "Benar. πr(r + s) = π × 3 × (3 + 5) = 24π cm²." },
    ],
    pembahasan: "Hati-hati: angka 12π muncul dua kali, tetapi hanya volume yang benar 12π. Luas selimut memakai s, volume memakai t.",
  },

  /* ---------------- BOLA ---------------- */
  {
    id: "B1", topik: "bola", ind: 3, lvl: "P", tipe: "pg",
    soal: "Rumus luas permukaan bola dengan jari-jari r adalah …",
    opsi: [
      { t: "4πr²", benar: true, why: "Tepat. Luas kulit bola sama dengan 4 kali luas lingkaran besarnya." },
      { t: "\\(\\frac{4}{3}\\)πr³", mis: "E2", why: "Itu rumus volume bola (pangkat 3, satuan kubik)." },
      { t: "3πr²", mis: "M3", why: "3πr² adalah luas permukaan belahan bola padat (2πr² lengkung + πr² alas)." },
      { t: "2πr²", mis: "E3", why: "2πr² adalah luas permukaan lengkung setengah bola saja." },
    ],
    pembahasan: "Percobaan kulit jeruk: kulit satu jeruk dapat menutupi 4 lingkaran berjari-jari sama dengan jeruk. L = 4πr².",
  },
  {
    id: "B2", topik: "bola", ind: 2, lvl: "A", tipe: "pg",
    soal: "Sebuah bola memiliki diameter 42 cm. Volume bola tersebut adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "38.808 cm³", benar: true, why: "r = 21 cm. V = \\(\\frac{4}{3}\\) × \\(\\frac{22}{7}\\) × 21³ = 38.808 cm³." },
      { t: "310.464 cm³", mis: "M1", why: "Ini memakai diameter 42 sebagai jari-jari. Karena r dipangkatkan 3, hasilnya 8 kali terlalu besar." },
      { t: "5.544 cm²", mis: "E2", why: "5.544 adalah luas permukaan bola (4πr²), bukan volume." },
      { t: "19.404 cm³", mis: "E3", why: "19.404 adalah volume belahan bola. Soal menanyakan bola utuh." },
    ],
    pembahasan: "\\(r = \\frac{42}{2} = 21\\) cm. V = \\(\\frac{4}{3}\\) × \\(\\frac{22}{7}\\) × 21 × 21 × 21 = 4 × 22 × 21 × 21 = 38.808 cm³ (21 dibagi 7 dan 3 lebih dulu supaya hitungan ringan).",
  },
  {
    id: "B3", topik: "bola", ind: 3, lvl: "A", tipe: "pg",
    soal: "Sebuah belahan bola <b>padat</b> (setengah bola pejal) memiliki diameter 14 cm. Luas seluruh permukaannya adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "462 cm²", benar: true, why: "r = 7 cm. L = 2πr² + πr² = 3πr² = 3 × 154 = 462 cm²." },
      { t: "308 cm²", mis: "M3", why: "308 cm² hanya permukaan lengkungnya (2πr²). Belahan bola padat juga punya alas lingkaran datar." },
      { t: "616 cm²", mis: "E3", why: "616 cm² adalah luas permukaan bola utuh." },
      { t: "1.848 cm²", mis: "M1", why: "Ini memakai diameter 14 cm sebagai jari-jari." },
    ],
    pembahasan: "Belahan bola padat = setengah kulit bola (2πr²) + alas lingkaran (πr²) = 3πr² = 3 × \\(\\frac{22}{7}\\) × 49 = 462 cm².",
  },
  {
    id: "B4", topik: "bola", ind: 6, lvl: "N", tipe: "isian",
    soal: "Volume sebuah bola 113,04 cm³. Jari-jari bola tersebut adalah … cm. (π = 3,14)",
    jawaban: 3, satuan: "cm",
    salah: [
      { v: 6, mis: "M1", why: "6 cm adalah diameternya. Soal menanyakan jari-jari." },
      { v: 27, mis: "E4", why: "27 adalah nilai r³. Masih perlu ditarik akar pangkat tiga: ∛27 = 3." },
      { v: 9, mis: "E2", why: "9 didapat jika dianggap r² (seperti rumus luas). Volume bola memakai r³." },
    ],
    pembahasan: "113,04 = \\(\\frac{4}{3}\\) × 3,14 × r³ ⇒ \\(r^3 = \\frac{113{,}04 \\times 3}{4 \\times 3{,}14} = \\frac{339{,}12}{12{,}56} = 27\\) ⇒ r = ∛27 = 3 cm.",
  },
  {
    id: "B5", topik: "bola", ind: 5, lvl: "N", tipe: "bs",
    soal: "Tentukan Benar atau Salah setiap pernyataan tentang bola berikut.",
    pernyataan: [
      { t: "Jika jari-jari bola dijadikan 2 kali, luas permukaannya menjadi 4 kali.", benar: true, why: "L = 4πr² sebanding dengan r², jadi 2² = 4 kali." },
      { t: "Jika jari-jari bola dijadikan 2 kali, volumenya menjadi 2 kali.", benar: false, mis: "M4", why: "Salah. V sebanding dengan r³, jadi 2³ = 8 kali." },
      { t: "Jika jari-jari bola dijadikan 3 kali, volumenya menjadi 27 kali.", benar: true, why: "3³ = 27." },
      { t: "Volume bola sama dengan \\(\\frac{2}{3}\\) volume tabung terkecil yang dapat memuatnya.", benar: true, why: "Tabung itu ber-jari-jari r dan tinggi 2r: πr² × 2r = 2πr³. \\(\\frac{2}{3}\\) × 2πr³ = \\(\\frac{4}{3}\\)πr³." },
    ],
    pembahasan: "Pola umum: jika ukuran panjang dikali k, luas dikali k² dan volume dikali k³.",
  },
  {
    id: "B6", topik: "bola", ind: 4, lvl: "A", tipe: "pg",
    soal: "Atap sebuah gedung berbentuk belahan bola dengan diameter 14 m. Bagian luar atap (tanpa lantai) akan dicat dengan biaya Rp25.000 per m². Biaya pengecatan seluruhnya adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "Rp7.700.000", benar: true, why: "Yang dicat hanya permukaan lengkung: 2πr² = 2 × 154 = 308 m². Biaya = 308 × 25.000 = Rp7.700.000." },
      { t: "Rp11.550.000", mis: "M3", why: "Ini memakai 3πr² (ikut menghitung lantai). Lantai tidak dicat, jadi tidak dihitung." },
      { t: "Rp15.400.000", mis: "E3", why: "Ini memakai luas bola utuh (4πr²). Atapnya hanya setengah bola." },
      { t: "Rp30.800.000", mis: "M1", why: "Ini memakai diameter 14 m sebagai jari-jari." },
    ],
    pembahasan: "r = 7 m. Luas lengkung belahan bola = 2πr² = 2 × \\(\\frac{22}{7}\\) × 49 = 308 m². Biaya = 308 × Rp25.000 = Rp7.700.000. Bandingkan dengan soal belahan bola padat: di sana alas ikut dihitung karena memang ada permukaannya.",
  },
  {
    id: "B7", topik: "bola", ind: 3, lvl: "A", tipe: "pg",
    soal: "Sebuah bola memiliki diameter 28 cm. Luas permukaan bola tersebut adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "2.464 cm²", benar: true, why: "r = 14 cm. L = 4 × \\(\\frac{22}{7}\\) × 196 = 4 × 616 = 2.464 cm²." },
      { t: "9.856 cm²", mis: "M1", why: "Ini memakai diameter 28 sebagai jari-jari, sehingga luasnya 4 kali terlalu besar." },
      { t: "11.498,67 cm³", mis: "E2", why: "Ini volume bola (\\(\\frac{4}{3}\\)πr³), bukan luas permukaan." },
      { t: "1.232 cm²", mis: "E3", why: "1.232 cm² adalah luas setengah kulit bola (2πr²)." },
    ],
    pembahasan: "r = 14 cm, πr² = 616 cm², L = 4 × 616 = 2.464 cm².",
  },

  /* ---------------- GABUNGAN & KONTEKS ---------------- */
  {
    id: "G1", topik: "gabungan", ind: 1, lvl: "A", tipe: "pg", grup: "eskrim",
    soal: "Panjang garis pelukis kerucut pada model es krim adalah …",
    opsi: [
      { t: "10 cm", benar: true, why: "s = √(6² + 8²) = √100 = 10 cm (tripel 6-8-10)." },
      { t: "8 cm", mis: "M2", why: "8 cm adalah tinggi kerucut, bukan garis pelukis." },
      { t: "14 cm", mis: "E4", why: "14 = 6 + 8. Garis pelukis dihitung dengan Pythagoras." },
      { t: "12 cm", mis: "M1", why: "12 cm adalah diameter alas kerucut." },
    ],
    pembahasan: "s² = r² + t² = 36 + 64 = 100, s = 10 cm.",
  },
  {
    id: "G2", topik: "gabungan", ind: 4, lvl: "A", tipe: "pg", grup: "eskrim",
    soal: "Volume seluruh model es krim adalah …",
    opsi: [
      { t: "753,6 cm³", benar: true, why: "Kerucut 301,44 cm³ + belahan bola 452,16 cm³ = 753,6 cm³." },
      { t: "1.205,76 cm³", mis: "E3", why: "Ini menambahkan volume bola utuh (904,32 cm³). Bagian atasnya hanya belahan bola." },
      { t: "1.356,48 cm³", mis: "E1", why: "Ini menghitung kerucut tanpa \\(\\frac{1}{3}\\) (904,32 cm³)." },
      { t: "828,96 cm³", mis: "M2", why: "Ini menghitung volume kerucut dengan garis pelukis 10 cm sebagai tinggi." },
    ],
    pembahasan: "V kerucut = \\(\\frac{1}{3}\\) × 3,14 × 36 × 8 = 301,44 cm³. V belahan bola = \\(\\frac{2}{3}\\) × 3,14 × 216 = 452,16 cm³. Total = 753,6 cm³.",
  },
  {
    id: "G3", topik: "gabungan", ind: 3, lvl: "N", tipe: "pgk", grup: "eskrim",
    soal: "Model es krim itu akan dilapisi cat di seluruh permukaan luarnya. Pilih <b>semua</b> bagian yang luasnya harus dihitung.",
    opsi: [
      { t: "Selimut kerucut", benar: true, why: "Benar. Selimut kerucut terlihat dari luar." },
      { t: "Permukaan lengkung belahan bola", benar: true, why: "Benar. Kubah es krim terlihat dari luar." },
      { t: "Alas lingkaran kerucut", benar: false, mis: "M3", why: "Tidak dihitung. Alas kerucut tertutup oleh belahan bola (sisi yang menempel)." },
      { t: "Alas lingkaran belahan bola", benar: false, mis: "M3", why: "Tidak dihitung. Alas belahan bola menempel pada alas kerucut, jadi tersembunyi." },
    ],
    pembahasan: "Pada bangun gabungan, sisi yang saling menempel tidak terlihat dan tidak dihitung. Yang dihitung: selimut kerucut + kulit lengkung belahan bola.",
  },
  {
    id: "G4", topik: "gabungan", ind: 4, lvl: "N", tipe: "isian", grup: "eskrim",
    soal: "Luas permukaan luar model es krim adalah … cm².",
    jawaban: 414.48, tol: 0.05, satuan: "cm²",
    salah: [
      { v: 527.52, mis: "M3", why: "Ini ikut menghitung satu alas lingkaran (113,04 cm²) yang sebenarnya menempel dan tersembunyi." },
      { v: 640.56, mis: "M3", why: "Ini ikut menghitung dua alas lingkaran yang menempel (atau memakai kulit bola utuh). Yang terlihat dari luar hanya selimut kerucut dan kulit setengah bola." },
      { v: 376.8, mis: "M2", why: "Ini memakai tinggi 8 cm untuk luas selimut kerucut. Selimut memakai s = 10 cm." },
    ],
    pembahasan: "L selimut kerucut = πrs = 3,14 × 6 × 10 = 188,4 cm². L lengkung belahan bola = 2πr² = 2 × 3,14 × 36 = 226,08 cm². Total = 414,48 cm².",
  },
  {
    id: "G5", topik: "gabungan", ind: 4, lvl: "A", tipe: "pg", grup: "tandon",
    soal: "Banyak air yang dapat ditampung tandon sampai penuh adalah …",
    opsi: [
      { t: "3.080 liter", benar: true, why: "V = \\(\\frac{22}{7}\\) × 0,7² × 2 = 3,08 m³ = 3.080 liter." },
      { t: "308 liter", mis: "M5", why: "Ini menganggap 1 m³ = 100 liter. Yang benar 1.000 liter." },
      { t: "12.320 liter", mis: "M1", why: "Ini memakai diameter 1,4 m sebagai jari-jari." },
      { t: "3,08 liter", mis: "M5", why: "3,08 adalah volume dalam m³, belum diubah ke liter." },
    ],
    pembahasan: "r = 0,7 m. V = 1,54 m² × 2 m = 3,08 m³. 1 m³ = 1.000 liter, jadi 3.080 liter.",
  },
  {
    id: "G6", topik: "gabungan", ind: 4, lvl: "N", tipe: "pg", grup: "tandon",
    soal: "Waktu yang diperlukan untuk mengisi tandon kosong sampai penuh adalah …",
    opsi: [
      { t: "7 jam 20 menit", benar: true, why: "\\(\\frac{3.080}{7} = 440\\) menit = 7 jam 20 menit." },
      { t: "44 menit", mis: "M5", why: "Ini berasal dari 308 liter (salah konversi 1 m³ = 100 liter)." },
      { t: "440 jam", mis: "M5", why: "Debitnya liter per menit, jadi 440 adalah menit, bukan jam." },
      { t: "29 jam 20 menit", mis: "M1", why: "Ini berasal dari volume 12.320 liter (diameter dipakai sebagai jari-jari)." },
    ],
    pembahasan: "Waktu = \\(\\dfrac{\\text{volume}}{\\text{debit}} = \\dfrac{3.080 \\text{ liter}}{7 \\text{ liter/menit}}\\) = 440 menit = 7 jam 20 menit.",
  },
  {
    id: "G7", topik: "gabungan", ind: 4, lvl: "N", tipe: "pg",
    soal: "Sebuah gelas berbentuk tabung dengan diameter 12 cm berisi air. Sebuah kelereng besi berbentuk bola berjari-jari 3 cm dimasukkan hingga tenggelam seluruhnya, dan air tidak tumpah. Kenaikan tinggi permukaan air adalah … (π = 3,14)",
    opsi: [
      { t: "1 cm", benar: true, why: "Volume air naik = volume bola = 113,04 cm³. Luas alas gelas = 3,14 × 36 = 113,04 cm². Kenaikan = \\(\\frac{113{,}04}{113{,}04} = 1\\) cm." },
      { t: "0,25 cm", mis: "M1", why: "Ini memakai diameter gelas 12 cm sebagai jari-jari, sehingga luas alasnya 4 kali terlalu besar." },
      { t: "8 cm", mis: "M1", why: "Ini memakai diameter bola (6 cm) sebagai jari-jari, sehingga volume bola 8 kali terlalu besar." },
      { t: "3 cm", mis: "E4", why: "Kenaikan air tidak sama dengan jari-jari bola. Kenaikan = \\(\\dfrac{\\text{volume bola}}{\\text{luas alas gelas}}\\)." },
    ],
    pembahasan: "Air naik setinggi h sehingga πR²h = volume bola. 3,14 × 6² × h = \\(\\frac{4}{3}\\) × 3,14 × 3³ ⇒ 113,04h = 113,04 ⇒ h = 1 cm.",
  },
  {
    id: "G8", topik: "gabungan", ind: 4, lvl: "A", tipe: "pg",
    soal: "Label kertas menutupi seluruh selimut kaleng susu berbentuk tabung dengan jari-jari 7 cm dan tinggi 10 cm. Luas kertas yang diperlukan untuk 50 kaleng adalah … (π = \\(\\frac{22}{7}\\))",
    opsi: [
      { t: "2,2 m²", benar: true, why: "Satu label = 2πrt = 440 cm². 50 label = 22.000 cm² = 2,2 m² (1 m² = 10.000 cm²)." },
      { t: "22 m²", mis: "M5", why: "Ini menganggap 1 m² = 1.000 cm². Yang benar 1 m² = 10.000 cm²." },
      { t: "3,74 m²", mis: "M3", why: "Ini memakai luas permukaan lengkap (748 cm²). Label hanya menutupi selimut." },
      { t: "0,22 m²", mis: "M5", why: "Ini menganggap 1 m² = 100.000 cm². Yang benar 1 m² = 10.000 cm²." },
    ],
    pembahasan: "Label = selimut = 2 × \\(\\frac{22}{7}\\) × 7 × 10 = 440 cm². Untuk 50 kaleng: 22.000 cm² = \\(\\frac{22.000}{10.000}\\) m² = 2,2 m².",
  },
  {
    id: "G9", topik: "gabungan", ind: 4, lvl: "A", tipe: "isian",
    soal: "Sebuah tablet obat berbentuk kapsul, yaitu tabung dengan belahan bola di kedua ujungnya. Jari-jari kapsul 7 mm dan panjang bagian tabungnya 20 mm. Volume kapsul adalah … mm³. (π = \\(\\frac{22}{7}\\), bulatkan ke bilangan bulat terdekat)",
    jawaban: 4517, tol: 1, satuan: "mm³",
    salah: [
      { v: 3080, mis: "E3", why: "3.080 mm³ hanya volume tabungnya. Dua belahan bola di ujung = satu bola utuh, jangan lupa ditambahkan." },
      { v: 3799, mis: "E3", why: "Ini hanya menambahkan satu belahan bola. Kedua ujung kapsul masing-masing setengah bola." },
      { v: 5955, mis: "E3", why: "Ini menambahkan dua bola utuh. Dua belahan bola sama dengan satu bola." },
    ],
    pembahasan: "V tabung = 154 × 20 = 3.080 mm³. Dua belahan bola = satu bola = \\(\\frac{4}{3}\\) × \\(\\frac{22}{7}\\) × 343 = 1.437,33 mm³. Total ≈ 4.517 mm³.",
  },

  /* ---------------- UNSUR & KONTEKS TAMBAHAN ---------------- */
  {
    id: "K9", topik: "kerucut", ind: 1, lvl: "P", tipe: "pg",
    soal: "Unsur-unsur kerucut adalah …",
    opsi: [
      { t: "satu sisi datar berbentuk lingkaran, satu sisi lengkung, dan satu titik puncak", benar: true, why: "Tepat. Alas kerucut lingkaran, selimutnya sisi lengkung, dan semua garis pelukis bertemu di titik puncak." },
      { t: "dua sisi datar berbentuk lingkaran dan satu sisi lengkung", mis: "E4", why: "Itu unsur tabung. Kerucut hanya punya satu sisi datar (alas)." },
      { t: "satu sisi lengkung saja, tanpa titik puncak", mis: "E4", why: "Itu ciri bola. Kerucut punya alas datar dan titik puncak." },
      { t: "satu sisi datar berbentuk segitiga dan satu sisi lengkung", mis: "E4", why: "Segitiga hanya tampak jika kerucut dipotong tegak melalui puncaknya. Sisi datar kerucut adalah lingkaran." },
    ],
    pembahasan: "Bandingkan: tabung 2 sisi datar + 1 sisi lengkung, kerucut 1 sisi datar + 1 sisi lengkung + 1 titik puncak, bola hanya 1 sisi lengkung.",
  },
  {
    id: "B8", topik: "bola", ind: 1, lvl: "P", tipe: "bs",
    soal: "Tentukan Benar atau Salah setiap pernyataan tentang unsur bangun ruang sisi lengkung berikut.",
    pernyataan: [
      { t: "Bola tidak memiliki titik sudut.", benar: true, why: "Benar. Bola hanya dibatasi satu sisi lengkung, tanpa rusuk dan titik sudut." },
      { t: "Tabung memiliki satu sisi lengkung.", benar: true, why: "Benar. Sisi lengkung tabung adalah selimutnya." },
      { t: "Kerucut memiliki dua sisi datar.", benar: false, mis: "E4", why: "Salah. Kerucut hanya punya satu sisi datar, yaitu alas berbentuk lingkaran." },
      { t: "Garis pelukis kerucut adalah garis dari titik puncak ke pusat alas.", benar: false, mis: "M2", why: "Salah. Garis dari puncak ke pusat alas adalah tinggi. Garis pelukis menghubungkan puncak dengan titik pada keliling alas." },
    ],
    pembahasan: "Tinggi kerucut: puncak → pusat alas (tegak lurus). Garis pelukis: puncak → keliling alas. Jari-jari: pusat alas → keliling alas.",
  },
  {
    id: "G10", topik: "gabungan", ind: 4, lvl: "A", tipe: "pg",
    soal: "Sebuah bangun padat terdiri atas tabung dan kerucut di atasnya. Diameter alas keduanya 12 cm, tinggi tabung 5 cm, dan tinggi <b>seluruh</b> bangun 13 cm. Luas permukaan bangun tersebut adalah … (π = 3,14)",
    opsi: [
      { t: "489,84 cm²", benar: true, why: "t kerucut = 13 − 5 = 8 cm, s = 10 cm. Luas = alas tabung 113,04 + selimut tabung 188,4 + selimut kerucut 188,4 = 489,84 cm²." },
      { t: "452,16 cm²", mis: "M2", why: "Ini memakai tinggi kerucut (8 cm) untuk luas selimut kerucut. Selimut memakai garis pelukis s = 10 cm." },
      { t: "602,88 cm²", mis: "M3", why: "Ini ikut menghitung tutup tabung, padahal tutup tabung tertutup alas kerucut." },
      { t: "± 571,18 cm²", mis: "E4", why: "Ini memakai tinggi seluruh bangun (13 cm) sebagai tinggi kerucut. Tinggi kerucut = tinggi seluruh − tinggi tabung." },
    ],
    pembahasan: "r = 6 cm. Tinggi kerucut = 13 − 5 = 8 cm, s = " + "\\(\\sqrt{6^2 + 8^2} = 10\\)" + " cm. Bagian yang terlihat: alas tabung (πr² = 113,04), selimut tabung (2πrt = 188,4), selimut kerucut (πrs = 188,4). Total 489,84 cm².",
  },
  {
    id: "G11", topik: "gabungan", ind: 4, lvl: "A", tipe: "isian",
    soal: "Gelas berbentuk tabung berjari-jari 6 cm berisi air setinggi 5 cm. Dua kelereng berjari-jari 3 cm dimasukkan hingga tenggelam dan air tidak tumpah. Tinggi permukaan air sekarang adalah … cm. (π = 3,14)",
    jawaban: 7, satuan: "cm",
    salah: [
      { v: 2, mis: "E4", why: "2 cm adalah kenaikannya. Tinggi air sekarang = tinggi awal + kenaikan = 5 + 2." },
      { v: 6, mis: "E4", why: "Ini hanya menghitung satu kelereng. Volume yang masuk = 2 × volume satu kelereng." },
      { v: 21, mis: "M1", why: "Ini memakai diameter kelereng (6 cm) sebagai jari-jari, sehingga volumenya 8 kali terlalu besar." },
    ],
    pembahasan: "Volume 2 kelereng = 2 × \\(\\frac{4}{3}\\) × 3,14 × 27 = 226,08 cm³. Luas alas gelas = 3,14 × 36 = 113,04 cm². Kenaikan = \\(\\frac{226{,}08}{113{,}04} = 2\\) cm. Tinggi air = 5 + 2 = 7 cm.",
  },
  {
    id: "G12", topik: "gabungan", ind: 4, lvl: "A", tipe: "pg",
    soal: "Sebuah bola berjari-jari 6 cm dimasukkan ke dalam tabung sehingga bola menyentuh alas, tutup, dan selimut tabung. Ruang kosong di dalam tabung akan diisi serbuk kayu. Volume serbuk kayu yang diperlukan adalah … (π = 3,14)",
    opsi: [
      { t: "452,16 cm³", benar: true, why: "Tabung r = 6, t = 12: 1.356,48 cm³. Bola: 904,32 cm³. Ruang kosong = 1.356,48 − 904,32 = 452,16 cm³." },
      { t: "904,32 cm³", mis: "E4", why: "Itu volume bolanya. Yang ditanya ruang kosong = volume tabung − volume bola." },
      { t: "1.356,48 cm³", mis: "E4", why: "Itu volume tabung seluruhnya. Kurangi dulu dengan volume bola." },
      { t: "678,24 cm³", mis: "M1", why: "Ini volume tabung jika tingginya hanya 6 cm (jari-jari). Bola menyentuh alas dan tutup, jadi tinggi tabung = diameter bola = 12 cm." },
    ],
    pembahasan: "Bola yang pas di dalam tabung: t tabung = 2r. Ruang kosong = πr²(2r) − \\(\\frac{4}{3}\\)πr³ = \\(\\frac{2}{3}\\)πr³ = \\(\\frac{1}{3}\\) volume tabung = \\(\\frac{1.356{,}48}{3} = 452{,}16\\) cm³.",
  },
  {
    id: "G13", topik: "gabungan", ind: 4, lvl: "N", tipe: "pg", grup: "drum",
    soal: "Jika drum awalnya penuh, air di drum cukup untuk menyiram tanaman selama … hari penuh.",
    opsi: [
      { t: "15 hari", benar: true, why: "Volume drum = 123.200 cm³ = 123,2 liter. 123,2 : 8 = 15,4, jadi cukup untuk 15 hari penuh (hari ke-16 airnya kurang)." },
      { t: "16 hari", mis: "E4", why: "15,4 tidak dibulatkan ke atas. Pada hari ke-16 air hanya tersisa 3,2 liter, kurang dari 8 liter." },
      { t: "154 hari", mis: "M5", why: "Ini menganggap 1 liter = 100 cm³. Yang benar 1 liter = 1.000 cm³." },
      { t: "1,54 hari", mis: "M5", why: "Ini menganggap 1 liter = 10.000 cm³. Yang benar 1 liter = 1.000 cm³." },
    ],
    pembahasan: "V = " + "\\(\\frac{22}{7}\\)" + " × 28 × 28 × 50 = 123.200 cm³ = 123,2 liter. Banyak hari = \\(\\frac{123{,}2}{8} = 15{,}4\\). Untuk banyak hari penuh, bulatkan ke bawah: 15 hari.",
  },
  {
    id: "G14", topik: "gabungan", ind: 6, lvl: "N", tipe: "isian", grup: "drum",
    soal: "Agar air dalam drum penuh cukup untuk 14 hari, pemakaian air paling banyak setiap hari adalah … liter.",
    jawaban: 8.8, tol: 0.01, satuan: "liter",
    salah: [
      { v: 88, mis: "M5", why: "Satuan tertukar. 123.200 cm³ = 123,2 liter, bukan 1.232 liter." },
      { v: 8, mis: "E4", why: "8 liter adalah pemakaian semula. Bagi volume drum dengan 14 hari." },
    ],
    pembahasan: "Pemakaian maksimal per hari = \\(\\frac{\\text{volume drum}}{\\text{banyak hari}} = \\frac{123{,}2}{14} = 8{,}8\\) liter.",
  },

  /* ---------------- PERUBAHAN UKURAN & PERBANDINGAN ---------------- */
  {
    id: "P1", topik: "perubahan", ind: 5, lvl: "N", tipe: "pg",
    soal: "Jari-jari sebuah bola dijadikan 3 kali jari-jari semula. Volume bola menjadi … volume semula.",
    opsi: [
      { t: "27 kali", benar: true, why: "V sebanding dengan r³, jadi 3³ = 27 kali." },
      { t: "3 kali", mis: "M4", why: "Perubahan volume tidak linear. Jari-jari dipangkatkan tiga dalam rumus volume." },
      { t: "9 kali", mis: "M4", why: "9 = 3² berlaku untuk luas permukaan. Volume memakai pangkat tiga." },
      { t: "6 kali", mis: "M4", why: "Tidak ada aturan dikali 2. Volume bola berubah sebesar k³." },
    ],
    pembahasan: "V baru = \\(\\frac{4}{3}\\)π(3r)³ = \\(\\frac{4}{3}\\)π × 27r³ = 27 × V lama.",
  },
  {
    id: "P2", topik: "perubahan", ind: 5, lvl: "N", tipe: "pg",
    soal: "Jari-jari sebuah tabung dijadikan 2 kali semula, sedangkan tingginya dijadikan \\(\\frac{1}{2}\\) kali semula. Volume tabung yang baru adalah … volume semula.",
    opsi: [
      { t: "2 kali", benar: true, why: "V = πr²t. Faktor r dikuadratkan (2² = 4) lalu dikali faktor t (\\(\\frac{1}{2}\\)): 4 × \\(\\frac{1}{2}\\) = 2." },
      { t: "sama dengan", mis: "M4", why: "Ini menganggap 2 × \\(\\frac{1}{2}\\) = 1, padahal faktor jari-jari harus dikuadratkan." },
      { t: "4 kali", mis: "M4", why: "Perubahan tinggi juga berpengaruh. 4 × \\(\\frac{1}{2}\\) = 2." },
      { t: "8 kali", mis: "M4", why: "Pangkat tiga hanya untuk bola. Pada tabung, r dikuadratkan dan t tidak." },
    ],
    pembahasan: "V baru = π(2r)²(\\(\\frac{1}{2}\\)t) = π × 4r² × \\(\\frac{1}{2}\\)t = 2πr²t = 2 × V lama.",
  },
  {
    id: "P3", topik: "perubahan", ind: 5, lvl: "N", tipe: "pgk",
    soal: "Sebuah tabung, kerucut, dan bola memiliki jari-jari r yang sama. Tinggi tabung dan tinggi kerucut sama dengan 2r. Pilih <b>semua</b> pernyataan yang benar.",
    opsi: [
      { t: "V tabung : V kerucut = 3 : 1", benar: true, why: "Benar. Alas dan tinggi sama, jadi kerucut = \\(\\frac{1}{3}\\) tabung." },
      { t: "V bola = \\(\\frac{2}{3}\\) × V tabung", benar: true, why: "Benar. V tabung = 2πr³, V bola = \\(\\frac{4}{3}\\)πr³ = \\(\\frac{2}{3}\\) × 2πr³." },
      { t: "V kerucut + V bola = V tabung", benar: true, why: "Benar. \\(\\frac{2}{3}\\)πr³ + \\(\\frac{4}{3}\\)πr³ = 2πr³." },
      { t: "V bola = V tabung", benar: false, mis: "E3", why: "Salah. Bola tidak mengisi penuh tabung, tersisa sudut-sudut di atas dan bawah. V bola hanya \\(\\frac{2}{3}\\) V tabung." },
      { t: "V tabung = 2 × V bola", benar: false, mis: "M4", why: "Salah. V tabung : V bola = 3 : 2, jadi V tabung = 1,5 × V bola." },
    ],
    pembahasan: "Dengan r sama dan t = 2r: V kerucut = \\(\\frac{2}{3}\\)πr³, V bola = \\(\\frac{4}{3}\\)πr³, V tabung = 2πr³. Perbandingan kerucut : bola : tabung = 1 : 2 : 3.",
  },
  {
    id: "P4", topik: "perubahan", ind: 5, lvl: "N", tipe: "bs",
    soal: "Sebuah kerucut memiliki jari-jari r dan tinggi t. Tentukan Benar atau Salah setiap pernyataan berikut.",
    pernyataan: [
      { t: "Jika r dan t sama-sama dijadikan 2 kali, volumenya menjadi 8 kali.", benar: true, why: "Benar. r² × t berubah 2² × 2 = 8 kali." },
      { t: "Jika hanya t yang dijadikan 3 kali, volumenya menjadi 3 kali.", benar: true, why: "Benar. Volume sebanding dengan t." },
      { t: "Jika hanya r yang dijadikan 3 kali, volumenya menjadi 3 kali.", benar: false, mis: "M4", why: "Salah. Volume sebanding dengan r², jadi 3² = 9 kali." },
      { t: "Jika r dan t sama-sama dijadikan 2 kali, luas permukaannya menjadi 4 kali.", benar: true, why: "Benar. s juga menjadi 2 kali, dan luas πr(r + s) berubah 2 × 2 = 4 kali." },
    ],
    pembahasan: "Jika semua ukuran panjang dikali k, bangunnya sebangun: luas dikali k², volume dikali k³. Jika hanya satu ukuran yang berubah, lihat pangkatnya di rumus.",
  },
  {
    id: "P5", topik: "perubahan", ind: 5, lvl: "N", tipe: "pg",
    soal: "Perbandingan jari-jari dua bola adalah 2 : 3. Perbandingan volume kedua bola itu adalah …",
    opsi: [
      { t: "8 : 27", benar: true, why: "Perbandingan volume = (perbandingan jari-jari)³ = 2³ : 3³ = 8 : 27." },
      { t: "2 : 3", mis: "M4", why: "Volume tidak sebanding langsung dengan jari-jari." },
      { t: "4 : 9", mis: "M4", why: "4 : 9 adalah perbandingan luas permukaannya (pangkat dua)." },
      { t: "6 : 9", mis: "M4", why: "Perbandingan volume didapat dengan memangkatkan tiga, bukan mengalikan dengan 3." },
    ],
    pembahasan: "V₁ : V₂ = \\(\\frac{4}{3}\\)πr₁³ : \\(\\frac{4}{3}\\)πr₂³ = r₁³ : r₂³ = 8 : 27.",
  },
  {
    id: "P6", topik: "perubahan", ind: 6, lvl: "N", tipe: "pg",
    soal: "Rani menghitung volume kerucut berdiameter 14 cm dan tinggi 9 cm sebagai berikut:<br><span class=\"f\">V = \\(\\frac{1}{3}\\) × \\(\\frac{22}{7}\\) × 14 × 14 × 9 = 1.848 cm³</span><br>Pernyataan yang tepat tentang pekerjaan Rani adalah …",
    opsi: [
      { t: "Rani salah karena memakai diameter sebagai jari-jari. Volume yang benar 462 cm³.", benar: true, why: "Tepat. r = 7 cm, V = \\(\\frac{1}{3}\\) × 154 × 9 = 462 cm³." },
      { t: "Rani salah karena seharusnya tanpa \\(\\frac{1}{3}\\). Volume yang benar 5.544 cm³.", mis: "E1", why: "Kerucut memang memakai \\(\\frac{1}{3}\\). Kesalahan Rani ada pada jari-jari." },
      { t: "Rani salah karena seharusnya memakai π = 3,14.", mis: "E4", why: "\\(\\frac{22}{7}\\) justru tepat karena 14 kelipatan 7. Pilihan π bukan sumber kesalahannya." },
      { t: "Pekerjaan Rani sudah benar.", mis: "M1", why: "Angka 14 adalah diameter. Rumus memerlukan r = 7 cm." },
    ],
    pembahasan: "Menemukan kesalahan: cek data (r atau d?), cek rumus (\\(\\frac{1}{3}\\) ada?), cek satuan. Di sini \\(r = \\frac{14}{2} = 7\\) cm, jadi V = \\(\\frac{1}{3}\\) × \\(\\frac{22}{7}\\) × 49 × 9 = 462 cm³.",
  },
  {
    id: "P7", topik: "perubahan", ind: 6, lvl: "N", tipe: "bs",
    soal: "Tentukan Benar atau Salah setiap pernyataan berikut.",
    pernyataan: [
      { t: "Jika jari-jari bola dikali k, volumenya dikali k³.", benar: true, why: "Benar. Ini generalisasi dari V = \\(\\frac{4}{3}\\)πr³." },
      { t: "1 m³ = 1.000 liter.", benar: true, why: "Benar. 1 m³ = 1.000 dm³ dan 1 dm³ = 1 liter." },
      { t: "1 liter = 100 cm³.", benar: false, mis: "M5", why: "Salah. 1 liter = 1 dm³ = 1.000 cm³." },
      { t: "Luas permukaan belahan bola padat adalah 2πr².", benar: false, mis: "M3", why: "Salah. Belahan bola padat punya alas lingkaran, jadi luasnya 2πr² + πr² = 3πr²." },
    ],
    pembahasan: "Hafalkan tangga satuan volume: 1 m³ = 1.000 dm³ = 1.000.000 cm³, dan 1 dm³ = 1 liter = 1.000 ml = 1.000 cm³.",
  },
  {
    id: "P8", topik: "perubahan", ind: 5, lvl: "A", tipe: "isian",
    soal: "Sebuah tabung berisi penuh air. Air itu akan dituang ke gelas-gelas berbentuk kerucut yang jari-jari dan tingginya sama dengan tabung. Banyak gelas kerucut yang dapat diisi penuh adalah … gelas.",
    jawaban: 3, satuan: "gelas",
    salah: [
      { v: 2, mis: "E1", why: "Volume kerucut \\(\\frac{1}{3}\\) tabung, bukan \\(\\frac{1}{2}\\). Satu tabung mengisi tepat 3 kerucut." },
      { v: 1, mis: "E1", why: "Kerucut lebih sedikit isinya daripada tabung dengan alas dan tinggi sama. Tepatnya \\(\\frac{1}{3}\\)." },
    ],
    pembahasan: "V tabung : V kerucut = πr²t : \\(\\frac{1}{3}\\)πr²t = 3 : 1. Jadi isi satu tabung cukup untuk 3 kerucut.",
  },
];

/* Soal cek pemahaman singkat di tab Belajar (umpan balik langsung) */
const CEK = {
  prasyarat: [
    {
      id: "C-P1", tipe: "isian", lvl: "P", topik: "prasyarat",
      soal: "Keliling lingkaran berjari-jari 7 cm adalah … cm. (π = \\(\\frac{22}{7}\\))",
      jawaban: 44, satuan: "cm",
      salah: [
        { v: 154, mis: "E2", why: "154 cm² adalah luas lingkaran (πr²). Keliling = 2πr." },
        { v: 22, mis: "E4", why: "22 = π × 7. Keliling = 2πr atau πd = \\(\\frac{22}{7}\\) × 14." },
        { v: 88, mis: "M1", why: "88 didapat jika 7 dianggap diameter lalu dikali 2 lagi. Keliling = 2 × \\(\\frac{22}{7}\\) × 7 = 44." },
      ],
      pembahasan: "K = 2πr = 2 × \\(\\frac{22}{7}\\) × 7 = 44 cm.",
    },
    {
      id: "C-P2", tipe: "isian", lvl: "P", topik: "prasyarat",
      soal: "Luas juring dengan sudut pusat 90° pada lingkaran berjari-jari 14 cm adalah … cm². (π = \\(\\frac{22}{7}\\))",
      jawaban: 154, satuan: "cm²",
      salah: [
        { v: 616, mis: "E4", why: "616 cm² adalah luas lingkaran penuh. Juring 90° = \\(\\frac{1}{4}\\) lingkaran." },
        { v: 22, mis: "E2", why: "22 cm adalah panjang busurnya (\\(\\frac{1}{4}\\) × 88), bukan luas." },
      ],
      pembahasan: "L juring = \\(\\frac{90^\\circ}{360^\\circ}\\) × πr² = \\(\\frac{1}{4}\\) × \\(\\frac{22}{7}\\) × 196 = \\(\\frac{1}{4}\\) × 616 = 154 cm².",
    },
    {
      id: "C-P3", tipe: "pg", lvl: "P", topik: "prasyarat",
      soal: "Segitiga siku-siku memiliki sisi siku-siku 8 cm dan 15 cm. Panjang sisi miringnya adalah …",
      opsi: [
        { t: "17 cm", benar: true, why: "√(64 + 225) = √289 = 17 cm (tripel 8-15-17)." },
        { t: "23 cm", mis: "E4", why: "23 = 8 + 15. Sisi miring dihitung dengan Pythagoras." },
        { t: "√161 cm", mis: "M2", why: "√161 = √(15² − 8²). Untuk sisi miring, kuadratnya dijumlahkan." },
        { t: "13 cm", mis: "E4", why: "13 berasal dari tripel 5-12-13, bukan 8-15-17." },
      ],
      pembahasan: "c² = a² + b² = 64 + 225 = 289, c = 17 cm.",
    },
    {
      id: "C-P4", tipe: "pg", lvl: "P", topik: "prasyarat",
      soal: "2,5 liter sama dengan …",
      opsi: [
        { t: "2.500 cm³", benar: true, why: "1 liter = 1.000 cm³, jadi 2,5 liter = 2.500 cm³." },
        { t: "250 cm³", mis: "M5", why: "Ini memakai 1 liter = 100 cm³. Yang benar 1.000 cm³." },
        { t: "25 dm³", mis: "M5", why: "1 liter = 1 dm³, jadi 2,5 liter = 2,5 dm³." },
        { t: "0,25 m³", mis: "M5", why: "1 m³ = 1.000 liter, jadi 2,5 liter = 0,0025 m³." },
      ],
      pembahasan: "1 liter = 1 dm³ = 1.000 cm³ = 1.000 ml.",
    },
  ],
  tabung: [
    {
      id: "C-T1", tipe: "pg", lvl: "A", topik: "tabung",
      soal: "Sebuah tabung berjari-jari 10 cm dan tinggi 5 cm. Volume tabung itu adalah … (π = 3,14)",
      opsi: [
        { t: "1.570 cm³", benar: true, why: "3,14 × 100 × 5 = 1.570 cm³." },
        { t: "6.280 cm³", mis: "M1", why: "Ini memakai r = 20 cm. Jari-jarinya 10 cm." },
        { t: "942 cm²", mis: "E2", why: "942 cm² adalah luas permukaan 2πr(r + t), bukan volume." },
        { t: "523,33 cm³", mis: "E1", why: "Ini memakai \\(\\frac{1}{3}\\) seperti kerucut. Tabung tidak memakai \\(\\frac{1}{3}\\)." },
      ],
      pembahasan: "V = πr²t = 3,14 × 10² × 5 = 1.570 cm³.",
    },
    {
      id: "C-T2", tipe: "pg", lvl: "A", topik: "tabung",
      soal: "Sebuah pipa berbentuk tabung tanpa alas dan tanpa tutup berjari-jari 7 cm dan panjang 50 cm. Luas permukaan pipa adalah … (π = \\(\\frac{22}{7}\\))",
      opsi: [
        { t: "2.200 cm²", benar: true, why: "Pipa hanya selimut: 2 × \\(\\frac{22}{7}\\) × 7 × 50 = 2.200 cm²." },
        { t: "2.508 cm²", mis: "M3", why: "Ini menambahkan dua lingkaran (alas dan tutup). Pipa terbuka di kedua ujung." },
        { t: "2.354 cm²", mis: "M3", why: "Ini menambahkan satu lingkaran. Pipa tidak punya alas maupun tutup." },
        { t: "7.700 cm²", mis: "E2", why: "7.700 adalah volume pipa (πr²t) dalam cm³." },
      ],
      pembahasan: "Pipa = selimut tabung saja. L = 2πrt = 44 × 50 = 2.200 cm².",
    },
  ],
  kerucut: [
    {
      id: "C-K1", tipe: "pg", lvl: "A", topik: "kerucut",
      soal: "Sebuah kerucut berjari-jari 6 cm dan garis pelukis 10 cm. Tinggi kerucut itu adalah …",
      opsi: [
        { t: "8 cm", benar: true, why: "t = √(10² − 6²) = √64 = 8 cm." },
        { t: "10 cm", mis: "M2", why: "10 cm adalah garis pelukis, bukan tinggi." },
        { t: "√136 cm", mis: "M2", why: "√136 = √(10² + 6²). Garis pelukis sudah sisi miring, jadi kuadratnya dikurangkan." },
        { t: "4 cm", mis: "E4", why: "4 = 10 − 6. Gunakan Pythagoras: t² = s² − r²." },
      ],
      pembahasan: "t² = s² − r² = 100 − 36 = 64, t = 8 cm.",
    },
    {
      id: "C-K2", tipe: "isian", lvl: "A", topik: "kerucut",
      soal: "Volume kerucut berjari-jari 7 cm dan tinggi 15 cm adalah … cm³. (π = \\(\\frac{22}{7}\\))",
      jawaban: 770, satuan: "cm³",
      salah: [
        { v: 2310, mis: "E1", why: "2.310 cm³ adalah πr²t tanpa \\(\\frac{1}{3}\\), yaitu volume tabung." },
        { v: 3080, mis: "M1", why: "Ini memakai r = 14 cm. Jari-jarinya 7 cm." },
      ],
      pembahasan: "V = \\(\\frac{1}{3}\\) × 154 × 15 = 154 × 5 = 770 cm³.",
    },
  ],
  bola: [
    {
      id: "C-B1", tipe: "isian", lvl: "A", topik: "bola",
      soal: "Volume bola berjari-jari 3 cm adalah … cm³. (π = 3,14)",
      jawaban: 113.04, tol: 0.01, satuan: "cm³",
      salah: [
        { v: 113.04 * 8, mis: "M1", why: "Ini memakai r = 6 cm. Hasilnya 8 kali terlalu besar." },
        { v: 113.04 / 2, mis: "E3", why: "Ini volume belahan bola." },
      ],
      pembahasan: "V = \\(\\frac{4}{3}\\) × 3,14 × 27 = 4 × 3,14 × 9 = 113,04 cm³. (Kebetulan luas permukaannya juga 113,04 cm², karena r = 3.)",
    },
    {
      id: "C-B2", tipe: "pg", lvl: "A", topik: "bola",
      soal: "Sebuah mangkuk berbentuk belahan bola <b>tanpa tutup</b> (berongga) dengan jari-jari 7 cm. Luas permukaan luar mangkuk adalah … (π = \\(\\frac{22}{7}\\))",
      opsi: [
        { t: "308 cm²", benar: true, why: "Mangkuk terbuka hanya kulit lengkung: 2πr² = 2 × 154 = 308 cm²." },
        { t: "462 cm²", mis: "M3", why: "462 = 3πr² berlaku untuk belahan bola padat. Mangkuk terbuka di atas, tidak punya tutup datar." },
        { t: "616 cm²", mis: "E3", why: "616 cm² adalah luas bola utuh." },
        { t: "718,67 cm³", mis: "E2", why: "Ini volume belahan bola, bukan luas." },
      ],
      pembahasan: "Bandingkan: mangkuk (berongga, terbuka) = 2πr², belahan bola padat = 3πr².",
    },
  ],
  gabungan: [
    {
      id: "C-G1", tipe: "pg", lvl: "A", topik: "gabungan",
      soal: "Sebuah tugu terdiri atas tabung (r = 7 cm, t = 10 cm) dengan kerucut (r = 7 cm, t = 24 cm) di atasnya. Tugu berdiri di lantai. Bagian luar tugu, kecuali alas yang menempel di lantai, dicat. Luas yang dicat adalah … (π = \\(\\frac{22}{7}\\))",
      opsi: [
        { t: "990 cm²", benar: true, why: "Selimut tabung 440 + selimut kerucut 550 = 990 cm². Tutup tabung tertutup kerucut, alas tabung menempel di lantai." },
        { t: "1.144 cm²", mis: "M3", why: "Ini menambahkan satu lingkaran (154 cm²). Alas tabung di lantai dan tutup tabung di bawah kerucut tidak terlihat." },
        { t: "1.298 cm²", mis: "M3", why: "Ini menambahkan dua lingkaran. Keduanya tidak terlihat dari luar." },
        { t: "968 cm²", mis: "M2", why: "Ini memakai tinggi kerucut (24 cm) untuk luas selimut kerucut. Seharusnya s = 25 cm." },
      ],
      pembahasan: "s kerucut = √(49 + 576) = 25 cm. Selimut kerucut = \\(\\frac{22}{7}\\) × 7 × 25 = 550 cm². Selimut tabung = 2 × \\(\\frac{22}{7}\\) × 7 × 10 = 440 cm². Total = 990 cm².",
    },
  ],
  perubahan: [
    {
      id: "C-U1", tipe: "pg", lvl: "N", topik: "perubahan",
      soal: "Diameter sebuah bola diperkecil menjadi \\(\\frac{1}{2}\\) kali semula. Luas permukaannya menjadi … semula.",
      opsi: [
        { t: "\\(\\frac{1}{4}\\) kali", benar: true, why: "Jari-jari juga \\(\\frac{1}{2}\\) kali. Luas sebanding dengan r², jadi (\\(\\frac{1}{2}\\))² = \\(\\frac{1}{4}\\)." },
        { t: "\\(\\frac{1}{2}\\) kali", mis: "M4", why: "Luas tidak berubah secara linear. Faktornya dikuadratkan." },
        { t: "\\(\\frac{1}{8}\\) kali", mis: "M4", why: "(\\(\\frac{1}{2}\\))³ = \\(\\frac{1}{8}\\) berlaku untuk volume, bukan luas." },
        { t: "2 kali", mis: "M4", why: "Diperkecil berarti hasilnya lebih kecil. Faktornya (\\(\\frac{1}{2}\\))² = \\(\\frac{1}{4}\\)." },
      ],
      pembahasan: "L baru = 4π(\\(\\frac{1}{2}\\)r)² = 4π × \\(\\frac{1}{4}\\)r² = \\(\\frac{1}{4}\\) × L lama.",
    },
  ],
};

if (typeof module !== "undefined") module.exports = { SOAL, CEK, MISKONSEPSI, TOPIK, LEVEL, STIMULUS };
