document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  const navLinks = document.querySelectorAll(".nav-link, .nav-cta");

  function closeMobileMenu() {
    primaryNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú de navegación");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          closeMobileMenu();
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && primaryNav.classList.contains("open")) {
        closeMobileMenu();
        navToggle.focus();
      }
    });
  }

  const sections = document.querySelectorAll("main section[id]");
  const menuLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            menuLinks.forEach((link) => {
              link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
            });
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((sec) => observer.observe(sec));
  }

  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('[role="tabpanel"]');

  function activateTab(selectedBtn) {
    tabButtons.forEach((btn) => {
      const isSelected = btn === selectedBtn;
      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-selected", String(isSelected));
    });

    tabPanels.forEach((panel) => {
      const match = panel.id === selectedBtn.getAttribute("aria-controls");
      panel.classList.toggle("active", match);
      panel.hidden = !match;
    });
  }

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener("click", () => activateTab(btn));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const nextIdx = (idx + 1) % tabButtons.length;
        tabButtons[nextIdx].focus();
        activateTab(tabButtons[nextIdx]);
      }
    });
  });

  const programCtas = document.querySelectorAll(".program-cta");
  const programSelect = document.getElementById("programSelect");
  const sumateSection = document.getElementById("sumate");

  programCtas.forEach((cta) => {
    cta.addEventListener("click", () => {
      const targetProgram = cta.getAttribute("data-program");
      if (programSelect && targetProgram) {
        programSelect.value = targetProgram;
      }
      if (sumateSection) {
        sumateSection.scrollIntoView({ behavior: "smooth" });
      }
      const nameInput = document.getElementById("fullName");
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 450);
      }
    });
  });

  const compareRange = document.getElementById("compareRange");
  const compareOverlay = document.getElementById("compareOverlay");
  const compareDivider = document.getElementById("compareDivider");
  const compareCaption = document.getElementById("compareCaption");
  const comparePresets = document.querySelectorAll(".compare-preset");

  function updateComparison(value) {
    const clamped = Math.max(0, Math.min(100, Number(value)));
    if (compareOverlay) compareOverlay.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    if (compareDivider) compareDivider.style.left = `${clamped}%`;
    if (compareRange) compareRange.value = String(clamped);

    if (compareCaption) {
      if (clamped >= 90) {
        compareCaption.textContent = "Vista ANTES: Espacio urbano en abandono, con maleza seca y bardas deterioradas antes de la intervención.";
      } else if (clamped <= 10) {
        compareCaption.textContent = "Vista DESPUÉS: Parque limpio, arbolado y con mural comunitario participativo pintado por voluntarios y familias.";
      } else {
        compareCaption.textContent = `Comparativa interactiva (${clamped}% Antes / ${100 - clamped}% Después): limpieza, reforestación y murales comunitarios.`;
      }
    }
  }

  if (compareRange) {
    compareRange.addEventListener("input", (e) => updateComparison(e.target.value));
  }

  comparePresets.forEach((btn) => {
    btn.addEventListener("click", () => {
      updateComparison(btn.getAttribute("data-val"));
    });
  });

  const form = document.getElementById("volunteerForm");
  const formSuccess = document.getElementById("formSuccess");
  const successDetails = document.getElementById("successDetails");
  const resetFormBtn = document.getElementById("resetFormBtn");

  function setError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(`error-${fieldId}`);
    if (field) {
      field.classList.toggle("is-invalid", Boolean(message));
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }
    if (errEl) {
      errEl.textContent = message;
    }
  }

  function validateForm() {
    let valid = true;

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phoneRaw = document.getElementById("phone").value.replace(/\D/g, "");
    const modality = document.getElementById("modality").value;
    const program = document.getElementById("programSelect").value;
    const privacy = document.getElementById("privacyCheck").checked;

    if (fullName.length < 3) {
      setError("fullName", "Por favor ingresa tu nombre completo (mínimo 3 caracteres).");
      valid = false;
    } else {
      setError("fullName", "");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("email", "Ingresa un correo electrónico válido.");
      valid = false;
    } else {
      setError("email", "");
    }

    if (phoneRaw.length !== 10) {
      setError("phone", "Ingresa un número telefónico de 10 dígitos (ej. 4771234567).");
      valid = false;
    } else {
      setError("phone", "");
    }

    if (!modality) {
      setError("modality", "Selecciona una modalidad de participación.");
      valid = false;
    } else {
      setError("modality", "");
    }

    if (!program) {
      setError("programSelect", "Selecciona el programa de tu interés.");
      valid = false;
    } else {
      setError("programSelect", "");
    }

    if (!privacy) {
      setError("privacyCheck", "Debes marcar esta casilla para completar el pre-registro local.");
      valid = false;
    } else {
      setError("privacyCheck", "");
    }

    return valid;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const fullName = document.getElementById("fullName").value.trim();
      const modality = document.getElementById("modality").value;
      const program = document.getElementById("programSelect").value;
      const folio = `COM-${Math.floor(1000 + Math.random() * 9000)}`;

      try {
        const prev = JSON.parse(localStorage.getItem("comuntia_registros") || "[]");
        prev.push({ folio, fullName, modality, program, fecha: new Date().toISOString() });
        localStorage.setItem("comuntia_registros", JSON.stringify(prev));
      } catch (_) {
      }

      form.hidden = true;
      successDetails.innerHTML = `Gracias, <strong>${fullName}</strong>. Tu folio local es <strong>${folio}</strong> para la modalidad <strong>${modality}</strong> en <strong>${program}</strong>. Nos pondremos en contacto contigo vía WhatsApp antes de la próxima jornada.`;
      formSuccess.hidden = false;
      formSuccess.focus();
    });
  }

  if (resetFormBtn && form && formSuccess) {
    resetFormBtn.addEventListener("click", () => {
      form.reset();
      formSuccess.hidden = true;
      form.hidden = false;
      document.getElementById("fullName").focus();
    });
  }

  const waModal = document.getElementById("waModal");
  const openWaBtns = [document.getElementById("openWaModal"), document.getElementById("openWaFromContact")];
  const closeWaBtns = [document.getElementById("closeWaModal"), document.getElementById("closeWaModalBtn"), document.getElementById("waGoToForm")];

  function openModal() {
    if (!waModal) return;
    waModal.hidden = false;
    document.getElementById("closeWaModal").focus();
  }

  function closeModal() {
    if (!waModal) return;
    waModal.hidden = true;
  }

  openWaBtns.forEach((btn) => {
    if (btn) btn.addEventListener("click", openModal);
  });

  closeWaBtns.forEach((btn) => {
    if (btn) btn.addEventListener("click", closeModal);
  });

  if (waModal) {
    waModal.addEventListener("click", (e) => {
      if (e.target === waModal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !waModal.hidden) closeModal();
    });
  }
});
