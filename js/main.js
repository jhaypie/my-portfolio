document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  history.replaceState(null, "", "#home");
  window.scrollTo(0, 0);
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navbar = document.querySelector(".navbar");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navItems = [...document.querySelectorAll(".nav-links a")];

  const updateThemeButton = () => {
    const isDark = root.dataset.theme === "dark";
    themeToggle?.setAttribute("aria-pressed", String(isDark));
    themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };

  updateThemeButton();
  themeToggle?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("portfolio-theme", root.dataset.theme);
    updateThemeButton();
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navItems.forEach((item) => item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      const active = navItems.find((item) => item.getAttribute("href") === "#" + entry.target.id);
      if (active) navItems.forEach((item) => item.classList.toggle("active", item === active));
    });
  }, { threshold: 0.12, rootMargin: "-15% 0px -65% 0px" });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  sections.forEach((section) => observer.observe(section));

  const revealHashTarget = () => {
    const targetId = window.location.hash.slice(1);
    if (!targetId) return;
    document
      .getElementById(targetId)
      ?.querySelectorAll(".reveal")
      .forEach((element) => element.classList.add("is-visible"));
  };

  revealHashTarget();
  window.addEventListener("hashchange", revealHashTarget);

  const handleScroll = () => navbar?.classList.toggle("scrolled", window.scrollY > 12);
  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  document.querySelector(".back-top")?.addEventListener("click", (event) => {
    event.preventDefault();
    const root = document.documentElement;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    history.replaceState(null, "", "#home");
  });

  const certificateLightbox = document.getElementById("certificateLightbox");
  const certificateLightboxImage = document.getElementById("certificateLightboxImage");
  const certificateLightboxClose = document.getElementById("certificateLightboxClose");
  const certificateCards = [...document.querySelectorAll(".certificate-card")];
  let lastCertificateCard = null;

  const openCertificateLightbox = (card) => {
    if (!certificateLightbox || !certificateLightboxImage) return;
    lastCertificateCard = card;
    certificateLightboxImage.src = card.dataset.certificate;
    certificateLightboxImage.alt = card.dataset.certificateAlt || "Certificate preview";
    certificateLightbox.hidden = false;
    document.body.style.overflow = "hidden";
    certificateLightboxClose?.focus();
  };

  const closeCertificateLightbox = () => {
    if (!certificateLightbox) return;
    certificateLightbox.hidden = true;
    document.body.style.overflow = "";
    lastCertificateCard?.focus();
  };

  certificateCards.forEach((card) => {
    card.addEventListener("click", () => openCertificateLightbox(card));
  });

  document.addEventListener("click", (event) => {
    const projectScreenshot = event.target.closest?.(".project-screenshot-trigger");
    if (projectScreenshot) openCertificateLightbox(projectScreenshot);
  });

  document.addEventListener("keydown", (event) => {
    const projectScreenshot = event.target.closest?.(".project-screenshot-trigger");
    if (!projectScreenshot || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    openCertificateLightbox(projectScreenshot);
  });

  certificateLightboxClose?.addEventListener("click", closeCertificateLightbox);
  certificateLightbox?.addEventListener("click", (event) => {
    if (event.target === certificateLightbox) closeCertificateLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certificateLightbox && !certificateLightbox.hidden) {
      closeCertificateLightbox();
    }
  });
});
