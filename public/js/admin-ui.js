document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector(".app-nav-collapse");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  const search = document.querySelector("[data-admin-search]");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("[data-admin-row]").forEach((row) => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
    });
  });

  const form = document.querySelector("[data-admin-form]");
  if (!form) return;
  const endpoint = form.dataset.endpoint;
  const heading = document.querySelector("[data-form-heading]");
  const label = document.querySelector("[data-submit-label]");
  const status = document.querySelector("[data-form-status]");
  const reset = document.querySelector("[data-form-reset]");
  let recordId = "";

  const setForm = (record = {}) => {
    for (const field of form.elements) {
      if (!field.name) continue;
      const value = record[field.name];
      if (field.type === "checkbox") field.checked = Boolean(value);
      else if (field.multiple) {
        const values = Array.isArray(value) ? value.map(String) : [];
        [...field.options].forEach((option) => { option.selected = values.includes(option.value); });
      } else field.value = value == null ? "" : String(value);
    }
  };
  const clear = () => {
    form.reset();
    recordId = "";
    heading.textContent = "Add a record";
    label.textContent = "Add record";
    reset.hidden = true;
    status.textContent = "";
  };
  reset?.addEventListener("click", clear);

  document.querySelectorAll("[data-edit-record]").forEach((button) => button.addEventListener("click", () => {
    try {
      const record = JSON.parse(button.dataset.editRecord || "{}");
      recordId = button.closest("tr")?.dataset.recordId || "";
      setForm(record);
      heading.textContent = "Update record";
      label.textContent = "Save changes";
      reset.hidden = false;
      status.textContent = "Editing this record";
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch {
      status.textContent = "Could not load this record for editing.";
    }
  }));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Saving…";
    label.disabled = true;
    const data = new FormData(form);
    const payload = {};
    for (const field of form.elements) {
      if (!field.name) continue;
      if (field.type === "checkbox") payload[field.name] = field.checked;
      else if (field.multiple) payload[field.name] = data.getAll(field.name);
      else if (field.value !== "") payload[field.name] = field.type === "number" ? Number(field.value) : field.value;
    }
    try {
      const response = await fetch(recordId ? `${endpoint}/${encodeURIComponent(recordId)}` : endpoint, {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.errors?.map((issue) => issue.message).join(" ") || result.message || "Could not save this record.");
      window.location.reload();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Could not save this record.";
    } finally {
      label.disabled = false;
    }
  });

  document.querySelectorAll("[data-delete-record]").forEach((button) => button.addEventListener("click", async () => {
    if (!window.confirm("Remove this record? This can affect linked records.")) return;
    button.disabled = true;
    try {
      const response = await fetch(`${endpoint}/${encodeURIComponent(button.dataset.deleteRecord)}`, { method: "DELETE", headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not remove this record.");
      window.location.reload();
    } catch (error) {
      status.textContent = error instanceof Error ? error.message : "Could not remove this record.";
      button.disabled = false;
    }
  }));
});
