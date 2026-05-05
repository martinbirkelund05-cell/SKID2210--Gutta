/* ============================================================
   ROUTER
   ============================================================ */
let currentPage = "home";

function router(page) {
  currentPage = page;
  $$(".page").forEach(p => p.classList.remove("active"));
  const target = $(`#page-${page}`);
  if (target) target.classList.add("active");
  $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.page === page));
  const fns = {
    home: renderHome,
    flashcards: renderFlashcards,
    mcq: renderMcq,
    calc: renderCalc,
    written: renderWritten,
    exam: renderExam,
    analytics: renderAnalytics,
    bank: renderBank
  };
  if (fns[page]) fns[page]();
  // Render KaTeX i hele aktiv side dersom biblioteket er lasta
  setTimeout(() => {
    if (typeof renderMathInElement !== "undefined" && target) {
      try {
        renderMathInElement(target, {
          delimiters: [
            {left: "$$", right: "$$", display: true},
            {left: "$",  right: "$",  display: false}
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  }, 50);
  window.scrollTo(0, 0);
}

loadState();
document.addEventListener("DOMContentLoaded", () => {
  $("#nav").addEventListener("click", e => {
    const it = e.target.closest(".nav-item");
    if (it) router(it.dataset.page);
  });
  router("home");
});
