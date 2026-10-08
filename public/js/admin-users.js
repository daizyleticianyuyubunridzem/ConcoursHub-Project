document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-create-admin-form]");
  const status = document.querySelector("[data-admin-create-status]");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = form.querySelector("button[type='submit']");
    button.disabled = true;
    status.textContent = "Creating account…";
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || result.errors?.map((issue) => issue.message).join(" ") || "Could not create the administrator account.");
      window.location.reload();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Could not create the administrator account.";
      button.disabled = false;
    }
  });

  document.querySelectorAll("[data-student-status]").forEach((button) => {
    button.addEventListener("click", async () => {
      const isActive = button.dataset.nextActive === "true";
      const action = isActive ? "restore access for" : "remove access for";
      if (!window.confirm(`Are you sure you want to ${action} ${button.dataset.userName}? Their saved profile and concours records will be kept.`)) return;

      button.disabled = true;
      try {
        const response = await fetch(`/users/${encodeURIComponent(button.dataset.userId)}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ isActive }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || "Could not update this student account.");
        window.location.reload();
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Could not update this student account.");
        button.disabled = false;
      }
    });
  });
});
