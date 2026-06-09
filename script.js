const footerMounts = document.querySelectorAll("[data-site-footer]");
const header = document.querySelector("#site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".main-nav a, .mobile-nav a");
const tabGroups = document.querySelectorAll("[data-tabs]");
const accordionGroups = document.querySelectorAll("[data-accordion]");
const statsGroup = document.querySelector(".about-stats");
const revealTitles = document.querySelectorAll("[data-reveal-title]");
const hero = document.querySelector(".hero, .program-hero");

document.documentElement.classList.add("js-enabled");

const renderSiteFooter = (mount) => {
  const isHomeFooter = mount.dataset.footerScope === "home";
  const sectionPrefix = isHomeFooter ? "" : "index.html";

  mount.outerHTML = `
    <footer class="site-footer" id="contacto">
      <div class="site-footer-overlay"></div>
      <div class="container container-2xl site-footer-inner">
        <div class="site-footer-hero">
          <p class="site-footer-kicker">Contacto</p>
          <h2>¿Listo para dar el siguiente paso?</h2>
          <p>
            En Hillbright creemos que tu hijo no llegó a este mundo a ocupar un lugar - llegó a transformarlo. Por eso formamos a cada alumno en los cinco ejes que construyen a una persona completa y extraordinaria: excelencia académica, bilingüismo de alto nivel, inteligencia emocional, fe sólida en Cristo y liderazgo autogestivo.<br /><br />
            Te invitamos a conocernos en persona. Agenda tu visita, camina por nuestros salones, haz tus preguntas - y revisa si este es el ambiente donde tu hijo desarrollará sus habilidades y será honrado y empoderado para tener éxito - los cupos son limitados, y la decisión más importante que tomarás por tu hijo este año no debería esperar. ¡Agenda tu visita!
          </p>
          <a class="site-footer-button" href="https://wa.me/523312272850" target="_blank" rel="noreferrer">Agendar visita</a>
        </div>

        <div class="site-footer-divider"></div>

        <div class="site-footer-links">
          <div>
            <h3>Links rápidos</h3>
            <ul>
              <li><a href="${sectionPrefix}#programas">Sobre Hillbright</a></li>
              <li><a href="${sectionPrefix}#metodologia">Metodología</a></li>
              <li><a href="kinder.html">Kinder</a></li>
              <li><a href="primaria.html">Primaria</a></li>
              <li><a href="secundaria.html">Secundaria</a></li>
              <li><a href="atencion-especializada.html">Atención a Neurodivergentes</a></li>
            </ul>
          </div>

          <div>
            <h3>Contacto</h3>
            <ul>
              <li><a href="mailto:contacto@hillbrightschool.edu">contacto@hillbrightschool.edu</a></li>
              <li><a href="https://wa.me/523312272850" target="_blank" rel="noreferrer">WhatsApp 33-1227-2850</a></li>
              <li>Av. Copernico 3850, col Arboledas, Zapopan, Jalisco, 45070, México</li>
            </ul>
          </div>
        </div>

        <div class="site-footer-bottom">
          <div class="site-footer-brand">
            <img src="images/hillside_logo.png" alt="Hillbright School" />
          </div>
          <p>&copy; 2026 Hillbright School</p>
        </div>
      </div>
    </footer>
  `;
};

footerMounts.forEach(renderSiteFooter);

const syncMobileHeader = () => {
  const isMobile = window.matchMedia("(max-width: 860px)").matches;
  const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
  const isPastHero = isMobile && window.scrollY >= heroBottom - 8;

  header.classList.toggle("mobile-header-solid", isPastHero);
};

syncMobileHeader();
window.addEventListener("scroll", syncMobileHeader, { passive: true });
window.addEventListener("resize", syncMobileHeader);

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  });
});

if (statsGroup) {
  const statItems = Array.from(statsGroup.querySelectorAll(".stat-item"));
  const countNumbers = (item) => {
    const value = item.querySelector("[data-count]");
    if (!value || value.dataset.counted === "true") return;

    const target = Number(value.dataset.count);
    if (!Number.isFinite(target)) return;

    const duration = 1200;
    const startTime = performance.now();
    value.dataset.counted = "true";
    value.textContent = "0";

    const updateValue = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      value.textContent = String(Math.round(target * easedProgress));

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        value.textContent = String(target);
      }
    };

    requestAnimationFrame(updateValue);
  };

  if ("IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          statItems.forEach((item, index) => {
            item.style.setProperty("--stat-delay", `${index * 130}ms`);
            item.classList.add("is-visible");
            window.setTimeout(() => countNumbers(item), index * 130);
          });

          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.2,
      }
    );

    statsObserver.observe(statsGroup);
  } else {
    statItems.forEach((item) => {
      item.classList.add("is-visible");
      countNumbers(item);
    });
  }
}

if (revealTitles.length > 0) {
  if ("IntersectionObserver" in window) {
    const titleObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -18% 0px",
        threshold: 0.25,
      }
    );

    revealTitles.forEach((title) => titleObserver.observe(title));
  } else {
    revealTitles.forEach((title) => title.classList.add("is-visible"));
  }
}

tabGroups.forEach((group) => {
  const tabs = Array.from(group.querySelectorAll("[role='tab']"));
  const panels = Array.from(group.querySelectorAll("[role='tabpanel']"));
  const isSoulTabs = group.classList.contains("soul-tabs");
  const soulShowcaseImage = group.querySelector("[data-soul-image]");
  let soulAnimationTimer;
  let soulAnimationToken = 0;

  const syncSoulShowcaseImage = () => {
    if (!soulShowcaseImage) return;

    const activeTab = tabs.find((tab) => tab.classList.contains("is-active")) ?? tabs[0];
    const imageKey = activeTab?.dataset.soulImage;
    soulShowcaseImage.classList.toggle("soul-showcase-image-honor", imageKey === "honor");
    soulShowcaseImage.classList.toggle("soul-showcase-image-kingdom", imageKey === "kingdom");
  };

  const resetSoulAnimation = () => {
    if (!isSoulTabs) return;

    window.clearTimeout(soulAnimationTimer);
    group.classList.remove("is-flipping-next", "is-flipping-prev");
    panels.forEach((panel) => {
      panel.classList.remove("is-entering", "is-exiting");
    });
  };

  const prepareSoulAnimation = (selectedTab) => {
    if (!isSoulTabs) return;

    const currentTab = tabs.find((tab) => tab.classList.contains("is-active"));
    if (!currentTab || currentTab === selectedTab) return;

    const currentPanel = panels.find((item) => item.id === currentTab.getAttribute("aria-controls"));
    const selectedPanel = panels.find((item) => item.id === selectedTab.getAttribute("aria-controls"));
    if (!currentPanel || !selectedPanel) return;

    resetSoulAnimation();
    soulAnimationToken += 1;

    const currentIndex = tabs.indexOf(currentTab);
    const selectedIndex = tabs.indexOf(selectedTab);
    const directionClass = selectedIndex > currentIndex ? "is-flipping-next" : "is-flipping-prev";
    const currentAnimationToken = soulAnimationToken;

    currentPanel.classList.add("is-exiting");
    selectedPanel.classList.add("is-entering");
    group.classList.add(directionClass);

    let didClean = false;
    const cleanup = () => {
      if (currentAnimationToken !== soulAnimationToken) return;
      if (didClean) return;
      didClean = true;
      resetSoulAnimation();
    };

    selectedPanel.addEventListener("animationend", cleanup, { once: true });
    soulAnimationTimer = window.setTimeout(cleanup, 620);
  };

  const activateTab = (selectedTab) => {
    if (selectedTab.classList.contains("is-active")) return;

    prepareSoulAnimation(selectedTab);

    tabs.forEach((tab) => {
      const isActive = tab === selectedTab;
      const panel = panels.find((item) => item.id === tab.getAttribute("aria-controls"));

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      if (panel) {
        panel.classList.toggle("is-active", isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      }
    });

    syncSoulShowcaseImage();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      const lastIndex = tabs.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === "ArrowLeft") nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = lastIndex;

      if (nextIndex !== index) {
        event.preventDefault();
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      }
    });
  });

  syncSoulShowcaseImage();
});

accordionGroups.forEach((group) => {
  const items = Array.from(group.querySelectorAll(".methodology-accordion-item"));
  const panelInners = Array.from(group.querySelectorAll(".methodology-accordion-panel-inner"));
  const methodologyContainer = group.closest(".methodology-container");
  const methodologyHeading = methodologyContainer?.querySelector(".methodology-heading");
  const methodologyFeature = methodologyContainer?.querySelector(".methodology-feature");

  const syncAccordionLayout = () => {
    let maxHeight = 0;

    panelInners.forEach((panelInner) => {
      const panel = panelInner.closest(".methodology-accordion-panel");
      if (!panel) return;

      const wasHidden = panel.hidden;
      const hadOpenClass = panel.classList.contains("is-open");

      if (wasHidden) {
        panel.hidden = false;
        panel.classList.add("is-open");
      }

      panelInner.style.minHeight = "0px";
      maxHeight = Math.max(maxHeight, panelInner.scrollHeight);

      if (wasHidden) {
        panel.hidden = true;
      }

      if (!hadOpenClass) {
        panel.classList.remove("is-open");
      }
    });

    if (methodologyHeading && methodologyFeature && window.innerWidth > 860) {
      const featureHeight = Math.ceil(methodologyHeading.offsetHeight);
      methodologyFeature.style.height = `${featureHeight}px`;
      methodologyFeature.style.minHeight = `${featureHeight}px`;

      const triggersHeight = items.reduce((total, item) => {
        const trigger = item.querySelector(".methodology-accordion-trigger");
        return total + (trigger ? trigger.offsetHeight : 0);
      }, 0);

      const availablePanelHeight = Math.max(featureHeight - triggersHeight, 120);
      const panelHeight = maxHeight > 0 ? Math.min(Math.ceil(maxHeight), availablePanelHeight) : availablePanelHeight;
      group.style.setProperty("--methodology-accordion-panel-height", `${panelHeight}px`);
    } else if (methodologyFeature) {
      methodologyFeature.style.height = "";
      methodologyFeature.style.minHeight = "";
      if (maxHeight > 0) {
        group.style.setProperty("--methodology-accordion-panel-height", `${Math.ceil(maxHeight)}px`);
      }
    }
  };

  const setOpenItem = (selectedItem) => {
    items.forEach((item) => {
      const trigger = item.querySelector(".methodology-accordion-trigger");
      const panel = item.querySelector(".methodology-accordion-panel");
      const isOpen = item === selectedItem;

      item.classList.toggle("is-open", isOpen);
      trigger?.setAttribute("aria-expanded", String(isOpen));

      if (!panel) return;

      panel.classList.toggle("is-open", isOpen);
      panel.hidden = !isOpen;
    });
  };

  items.forEach((item, index) => {
    const trigger = item.querySelector(".methodology-accordion-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      if (item.classList.contains("is-open")) return;
      setOpenItem(item);
    });

    trigger.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

      event.preventDefault();
      const lastIndex = items.length - 1;
      let nextIndex = index;

      if (event.key === "ArrowDown") nextIndex = index === lastIndex ? 0 : index + 1;
      if (event.key === "ArrowUp") nextIndex = index === 0 ? lastIndex : index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = lastIndex;

      items[nextIndex].querySelector(".methodology-accordion-trigger")?.focus();
    });
  });

  syncAccordionLayout();
  window.addEventListener("resize", syncAccordionLayout);
});
