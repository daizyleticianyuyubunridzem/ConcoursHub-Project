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

  document.querySelectorAll("[data-toggle-publish]").forEach((button) => button.addEventListener("click", async () => {
    const isPublished = button.dataset.published === "true";
    const action = isPublished ? "unpublish" : "publish";
    if (!window.confirm(`Are you sure you want to ${action} this session?`)) return;

    button.disabled = true;
    try {
      const response = await fetch(`/application-sessions/${encodeURIComponent(button.dataset.togglePublish)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ isPublished: !isPublished }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.errors?.map((issue) => issue.message).join(" ") || result.message || `Could not ${action} this session.`);
      window.location.reload();
    } catch (error) {
      const status = document.querySelector("[data-form-status]");
      if (status) status.textContent = error instanceof Error ? error.message : `Could not ${action} this session.`;
      button.disabled = false;
    }
  }));

  const form = document.querySelector("[data-admin-form]");
  if (!form) return;
  const endpoint = form.dataset.endpoint;
  const heading = document.querySelector("[data-form-heading]");
  const label = document.querySelector("[data-submit-label]");
  const status = document.querySelector("[data-form-status]");
  const reset = document.querySelector("[data-form-reset]");
  let recordId = "";

  const requirementPage = form.dataset.page === "requirements";
  const subjectRepeater = form.querySelector("[data-subject-repeater]");
  const subjectRows = form.querySelector("[data-subject-rows]");
  const addSubjectButton = form.querySelector("[data-add-subject]");
  const subjectRowTemplate = subjectRows?.querySelector("[data-subject-row]")?.cloneNode(true);
  const subjectType = form.querySelector('[name="type"]');
  const nameField = form.querySelector('[name="name"]');

  const refreshSubjectRows = () => {
    const rows = [...(subjectRows?.querySelectorAll("[data-subject-row]") || [])];
    rows.forEach((row) => {
      const removeButton = row.querySelector("[data-remove-subject]");
      if (removeButton) removeButton.hidden = recordId !== "" || rows.length < 2;
      row.querySelectorAll("input, select").forEach((field) => { field.disabled = subjectRepeater.hidden; });
    });
    if (addSubjectButton) addSubjectButton.hidden = recordId !== "";
  };

  const addSubjectRow = (subject = "", grade = "") => {
    if (!subjectRows || !subjectRowTemplate) return;
    const row = subjectRowTemplate.cloneNode(true);
    row.querySelector("[data-subject-name]").value = subject;
    row.querySelector("[data-subject-grade]").value = grade;
    subjectRows.appendChild(row);
    refreshSubjectRows();
  };

  const updateRequirementMode = () => {
    if (!requirementPage) return;
    const isSubject = subjectType?.value === "subject";
    subjectRepeater.hidden = !isSubject;
    const nameWrapper = nameField?.closest("[data-admin-field]");
    if (nameWrapper) nameWrapper.hidden = isSubject;
    if (nameField) nameField.required = !isSubject;
    refreshSubjectRows();
  };

  if (requirementPage) {
    subjectRows?.addEventListener("click", (event) => {
      const removeButton = event.target.closest("[data-remove-subject]");
      if (!removeButton || recordId) return;
      removeButton.closest("[data-subject-row]").remove();
      refreshSubjectRows();
    });
    addSubjectButton?.addEventListener("click", () => addSubjectRow());
    subjectType?.addEventListener("change", updateRequirementMode);
    updateRequirementMode();
  }

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
    if (requirementPage && subjectRows) {
      subjectRows.innerHTML = "";
      addSubjectRow(record.subject || "", record.minimumGrade || "");
      updateRequirementMode();
    }
  };
  const clear = () => {
    form.reset();
    recordId = "";
    if (requirementPage && subjectRows) {
      subjectRows.innerHTML = "";
      addSubjectRow();
      updateRequirementMode();
    }
    heading.textContent = "Add a record";
    label.textContent = requirementPage ? "Save requirements" : "Add record";
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
    if (!form.reportValidity()) return;
    status.textContent = "Saving…";
    label.disabled = true;
    const data = new FormData(form);
    const payload = {};
    for (const field of form.elements) {
      if (!field.name) continue;
      if (field.type === "checkbox") payload[field.name] = field.checked;
      else if (field.multiple) payload[field.name] = data.getAll(field.name);
      else if (field.value !== "" || field.name === "requiredBackground") payload[field.name] = field.type === "number" ? Number(field.value) : field.value;
    }
    let requestUrl = recordId ? `${endpoint}/${encodeURIComponent(recordId)}` : endpoint;
    let requestPayload = payload;
    if (requirementPage && subjectType?.value === "subject") {
      const subjects = [...subjectRows.querySelectorAll("[data-subject-row]")].map((row) => ({
        subject: row.querySelector("[data-subject-name]").value.trim(),
        minimumGrade: row.querySelector("[data-subject-grade]").value,
      }));
      if (subjects.some((item) => !item.subject || !item.minimumGrade)) {
        status.textContent = "Enter each subject and minimum grade.";
        label.disabled = false;
        return;
      }
      const shared = { ...payload, type: "subject", name: "" };
      if (recordId) {
        requestPayload = { ...shared, ...subjects[0], name: subjects[0].subject };
      } else {
        requestUrl = `${endpoint}/bulk`;
        requestPayload = subjects.map((item) => ({ ...shared, ...item, name: item.subject }));
      }
    }
    try {
      const response = await fetch(requestUrl, {
        method: recordId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(requestPayload),
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
