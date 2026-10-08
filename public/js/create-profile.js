document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentProfileForm");
  const parseInitial = (value) => {
    try { return JSON.parse(value || "[]"); } catch { return []; }
  };
  const oLevelResults = parseInitial(form?.dataset.initialOLevel);
  const aLevelResults = parseInitial(form?.dataset.initialALevel);

  const renderResults = (items, listId, level) => {
    const list = document.getElementById(listId);
    if (!list) return;
    list.replaceChildren();
    items.forEach(({ subject, grade }, index) => {
      const row = document.createElement("div");
      row.className = "result-row";
      const label = document.createElement("span");
      label.textContent = `${subject} — ${grade}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.removeResult = level;
      remove.dataset.index = String(index);
      remove.textContent = "Remove";
      remove.setAttribute("aria-label", `Remove ${subject} result`);
      row.append(label, remove);
      list.append(row);
    });
  };

  const addResult = (level, results, listId) => {
    const subjectInput = document.getElementById(`${level}Subject`);
    const gradeInput = document.getElementById(`${level}Grade`);
    const subject = subjectInput?.value.trim();
    const grade = gradeInput?.value.trim();
    if (!subject || !grade) {
      (subject ? gradeInput : subjectInput)?.focus();
      return;
    }
    results.push({ subject, grade });
    subjectInput.value = "";
    gradeInput.value = "";
    renderResults(results, listId, level);
    subjectInput.focus();
  };

  document.getElementById("addOLevel")?.addEventListener("click", () => addResult("oLevel", oLevelResults, "oLevelResultList"));
  document.getElementById("addALevel")?.addEventListener("click", () => addResult("aLevel", aLevelResults, "aLevelResultList"));
  renderResults(oLevelResults, "oLevelResultList", "oLevel");
  renderResults(aLevelResults, "aLevelResultList", "aLevel");

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-result]");
    if (!button) return;
    const results = button.dataset.removeResult === "oLevel" ? oLevelResults : aLevelResults;
    const listId = button.dataset.removeResult === "oLevel" ? "oLevelResultList" : "aLevelResultList";
    results.splice(Number(button.dataset.index), 1);
    renderResults(results, listId, button.dataset.removeResult);
  });

  form?.addEventListener("submit", () => {
    form.querySelectorAll("input[data-result-input]").forEach((input) => input.remove());
    const appendResults = (results, subjectName, gradeName) => results.forEach(({ subject, grade }) => {
      [[subjectName, subject], [gradeName, grade]].forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        input.dataset.resultInput = "true";
        form.append(input);
      });
    });
    appendResults(oLevelResults, "oLevelSubject[]", "oLevelGrade[]");
    appendResults(aLevelResults, "aLevelSubject[]", "aLevelGrade[]");
  });
});
