/* Notasi matematika (LaTeX) dengan MathJax.
 * Teks berisi \( ... \) di #main dirender otomatis setiap kali isi halaman berubah.
 * Jika MathJax gagal dimuat (misalnya offline), TeX diubah menjadi teks biasa
 * seperti 22/7 supaya tetap terbaca. */
(() => {
  "use strict";
  let siap = false, gagal = false, antre = false, observer = null;
  const main = document.getElementById("main");

  window.MathJax = {
    tex: { inlineMath: [["\\(", "\\)"]], displayMath: [] },
    svg: { fontCache: "global" },
    options: { enableMenu: false, renderActions: { assistiveMml: [] } },
    startup: {
      typeset: false,
      ready() {
        window.MathJax.startup.defaultReady();
        window.MathJax.startup.promise.then(() => { siap = true; jadwal(); });
      },
    },
  };

  /* Cadangan tanpa MathJax: \frac{a}{b} -> a/b dan simbol umum ke Unicode */
  function polos(tex) {
    let t = tex;
    for (let i = 0; i < 4; i++) {
      t = t.replace(/\\d?frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, a, b) => {
        const k = (x) => (/^[\w.,]+$/.test(x.replace(/\{,\}/g, ",")) ? x : "(" + x + ")");
        return k(a) + "/" + k(b);
      });
    }
    return t
      .replace(/\\text\{([^}]*)\}/g, "$1").replace(/\{,\}/g, ",")
      .replace(/\\times/g, "×").replace(/\\pi/g, "π").replace(/\\alpha/g, "α")
      .replace(/\^\\circ/g, "°").replace(/\^2/g, "²").replace(/\^3/g, "³")
      .replace(/\\ /g, " ").replace(/\\,/g, " ").replace(/[{}]/g, "");
  }
  function cadangan(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) if (w.currentNode.nodeValue.includes("\\(")) nodes.push(w.currentNode);
    nodes.forEach((n) => { n.nodeValue = n.nodeValue.replace(/\\\((.*?)\\\)/g, (_, x) => polos(x)); });
  }

  function jadwal() {
    if (antre) return;
    antre = true;
    requestAnimationFrame(render);
  }
  function render() {
    antre = false;
    if (!main.textContent.includes("\\(")) return;
    observer.disconnect();
    const sambung = () => observer.observe(main, { childList: true, subtree: true, characterData: true });
    if (siap) {
      window.MathJax.typesetPromise([main]).catch(() => cadangan(main)).finally(sambung);
    } else if (gagal) {
      cadangan(main); sambung();
    } else sambung(); // tunggu MathJax siap
  }

  observer = new MutationObserver(jadwal);
  observer.observe(main, { childList: true, subtree: true, characterData: true });

  window.__mathGagal = () => { if (!siap) { gagal = true; jadwal(); } };
  setTimeout(window.__mathGagal, 8000);
})();
