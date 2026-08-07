(() => {
  const config = window.ENTRELACOS_CONFIG || {};
  const whatsapp = String(config.whatsapp || "").replace(/\D/g, "");
  const instagram = String(config.instagram || "").trim().replace(/^@/, "");
  const toast = document.querySelector("#toast");
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 4200);
  };

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector(".menu-button");
  const menu = document.querySelector(".main-nav");

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menu?.classList.toggle("open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("visible"));
  }

  document.querySelectorAll("details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll("details[open]").forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  document.querySelectorAll("[data-interest]").forEach((link) => {
    link.addEventListener("click", () => {
      const wanted = link.dataset.interest;
      document.querySelectorAll('input[name="interest"]').forEach((input) => {
        input.checked = input.value === wanted;
      });
    });
  });

  const defaultMessage = "Oi, Mi! Vim pelo site da Entrelaços de Minas e quero conhecer a próxima remessa 💛";

  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    if (whatsapp.length >= 12) {
      const message = link.dataset.message || defaultMessage;
      link.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
      link.target = "_blank";
      link.rel = "noopener";
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#encomenda")?.scrollIntoView({ behavior: "smooth" });
      showToast("A lista está sendo preparada. Preencha seu interesse para deixar a mensagem prontinha 💛");
    });
  });

  document.querySelectorAll(".instagram-link").forEach((link) => {
    if (instagram) {
      link.href = `https://instagram.com/${instagram}`;
      link.target = "_blank";
      link.rel = "noopener";
      return;
    }

    link.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("O Instagram oficial será anunciado em breve. Fica pertinho da gente 💛");
    });
  });

  const orderForm = document.querySelector("#order-form");
  orderForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(orderForm);
    const name = String(data.get("name") || "").trim();
    const city = String(data.get("city") || "").trim();
    const note = String(data.get("note") || "").trim();
    const interests = data.getAll("interest");
    const interestText = interests.length ? interests.join(", ") : "quero conhecer a seleção completa";

    const message = [
      `Oi, Mi! Eu sou ${name} e vim pelo site da Entrelaços de Minas 💛`,
      `Falo de ${city}.`,
      `Tenho interesse em: ${interestText}.`,
      note ? `Observação: ${note}` : "",
      "Quero saber mais sobre a próxima remessa!",
    ]
      .filter(Boolean)
      .join("\n");

    if (whatsapp.length >= 12) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
      showToast("Mensagem montada! Abrindo sua conversa com a Mi…");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      showToast("Mensagem copiada! Assim que o WhatsApp for ativado, é só colar e enviar para a Mi 💛");
    } catch {
      showToast("Seu interesse foi montado. O WhatsApp da marca será ativado em breve 💛");
    }
  });
})();
