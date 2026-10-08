document.addEventListener("DOMContentLoaded", () => {
  const adminToggle = document.querySelector("[data-admin-nav-toggle]");
  const adminSidebar = document.querySelector(".admin-sidebar");
  const adminBackdrop = document.querySelector("[data-admin-nav-close]");
  const closeAdminNav = () => {
    adminSidebar?.classList.remove("is-open");
    adminBackdrop?.classList.remove("is-open");
    adminToggle?.setAttribute("aria-expanded", "false");
  };
  adminToggle?.addEventListener("click", () => {
    const open = adminSidebar?.classList.toggle("is-open") || false;
    adminBackdrop?.classList.toggle("is-open", open);
    adminToggle.setAttribute("aria-expanded", String(open));
  });
  adminBackdrop?.addEventListener("click", closeAdminNav);
  adminSidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeAdminNav));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAdminNav();
  });

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".app-nav-collapse");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const search = document.querySelector("[data-opportunity-search]");
  const cards = [...document.querySelectorAll("[data-opportunity-card]")];
  const category = document.querySelector("[data-opportunity-category]");
  const empty = document.querySelector("[data-empty-results]");
  const updateResults = () => {
    const query = (search?.value || "").trim().toLowerCase();
    const selected = category?.value || "all";
    let count = 0;
    cards.forEach((card) => {
      const matchesText = (card.dataset.search || "").includes(query);
      const matchesCategory = selected === "all" || card.dataset.category === selected;
      const visible = matchesText && matchesCategory;
      card.hidden = !visible;
      if (visible) count += 1;
    });
    if (empty) empty.hidden = count > 0;
  };
  search?.addEventListener("input", updateResults);
  category?.addEventListener("change", updateResults);

  document.querySelectorAll("[data-save-opportunity]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const opportunityId = button.dataset.opportunityId;
      const savedId = button.dataset.savedId;
      button.disabled = true;
      try {
        const response = savedId
          ? await fetch(`/saved-opportunities/${encodeURIComponent(savedId)}`, { method: "DELETE", headers: { Accept: "application/json" } })
          : await fetch("/saved-opportunities", {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({ opportunityId }),
            });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not update saved concours.");
        if (savedId) {
          button.dataset.savedId = "";
          button.setAttribute("aria-pressed", "false");
          if (button.dataset.removeAfterSave !== undefined) {
            button.closest("[data-opportunity-card]")?.remove();
            const empty = document.querySelector("[data-saved-empty]");
            if (empty && !document.querySelector("[data-opportunity-card]")) empty.hidden = false;
          } else {
            button.textContent = "Save concours";
          }
        } else {
          button.dataset.savedId = result.data?._id || "";
          button.setAttribute("aria-pressed", "true");
          button.textContent = "Saved";
        }
        const status = document.querySelector("[data-save-status]");
        if (status) status.textContent = savedId ? "Removed from your saved list." : "Added to your saved list.";
      } catch (error) {
        const status = document.querySelector("[data-save-status]");
        if (status) status.textContent = error instanceof Error ? error.message : "Could not update saved concours.";
      } finally {
        button.disabled = false;
      }
    });
  });
});
