# Bangun Ruang Sisi Lengkung

Media belajar interaktif Matematika Kelas IX (Fase D) untuk materi tabung, kerucut, dan bola, sebagai persiapan sumatif akhir semester dan soal standar TKA SMP.

## Cara membuka

Buka `index.html` di peramban (klik dua kali sudah cukup, tidak perlu server). Media ini juga bisa dipasang di GitHub Pages. Fon diambil dari Google Fonts; tanpa internet tampilan memakai fon bawaan dan semua fitur tetap jalan.

## Isi

**Tab Belajar**

| Bab | Isi |
|---|---|
| Peta materi | ringkasan rumus, kriteria sukses 4 level, daftar 5 miskonsepsi |
| Prasyarat | lingkaran, juring, Pythagoras, tangga satuan, pengubah satuan volume |
| Tabung | lab interaktif (slider r dan t, pilihan π, tanpa tutup, jaring-jaring) |
| Kerucut | lab interaktif dengan segitiga r–t–s dan jaring-jaring juring (sudut pusat otomatis) |
| Bola | lab interaktif, belahan bola, peraga "kulit = 4 lingkaran" |
| Gabungan & konteks | latihan memilih sisi yang dihitung (kapsul, tugu, kaleng, belahan bola padat), contoh soal konteks |
| Perubahan ukuran | prediksi k, k², k³ sebelum hasil ditampilkan, simulasi menuang kerucut : bola : tabung = 1 : 2 : 3 |

Setiap bab punya kotak **Awas** (miskonsepsi), contoh soal bertahap, dan **Cek pemahaman** dengan umpan balik langsung.

**Tab Latihan Mandiri**

- Latihan per topik (umpan balik langsung atau di akhir)
- Simulasi sumatif: 30 soal acak, 75 menit, seperti format TKA SMP
- Ulangi soal yang salah
- Hasil: nilai, perkiraan level kriteria sukses, skor per topik dan per level kognitif, diagnosis miskonsepsi, pembahasan tiap soal

Bentuk soal: pilihan ganda, PG kompleks, Benar/Salah, isian singkat, dan soal grup (satu stimulus untuk beberapa soal).

## Bank soal

Semua soal ada di `js/soal.js`. Setiap pengecoh diberi kode miskonsepsi sehingga umpan balik menyebut letak kesalahannya:

| Kode | Miskonsepsi |
|---|---|
| M1 | Tertukar jari-jari dan diameter |
| M2 | Tinggi kerucut dianggap sama dengan garis pelukis |
| M3 | Luas permukaan selalu dihitung lengkap |
| M4 | Perubahan ukuran dianggap linear |
| M5 | Kesalahan satuan dan konversi |
| E1–E4 | lupa ⅓, tertukar rumus luas/volume, belahan vs bola utuh, salah unsur/jaring-jaring |

Untuk menambah soal, salin salah satu objek di `SOAL` dan isi `id`, `topik`, `ind` (indikator 1–6), `lvl` (`P`, `A`, `N`), `tipe`, teks soal, opsi beserta `why` dan `mis`, serta `pembahasan`.

Kemajuan siswa disimpan di `localStorage` peramban masing-masing.

## Struktur

```
index.html
css/style.css
js/soal.js     bank soal, miskonsepsi, stimulus
js/gambar.js   gambar SVG bangun dan jaring-jaring
js/app.js      tab Belajar, mesin soal, tab Latihan Mandiri
```
