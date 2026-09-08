const form = document.getElementById("note-form");
const contentInput = document.getElementById("note-content");
const notesList = document.getElementById("notes-list");

async function loadNotes() {
  const res = await fetch("/api/notes");
  const notes = await res.json();
  renderNotes(notes);
}

function renderNotes(notes) {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = '<p class="empty-state">Aun no hay notas. Agrega la primera 👆</p>';
    return;
  }

  
  [...notes].reverse().forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";

    const date = new Date(note.createdAt).toLocaleString();

    card.innerHTML = `
      <p class="note-content"></p>
      <span class="note-date">${date}</span>
      <button class="delete-btn" data-id="${note.id}">✕</button>
    `;

    card.querySelector(".note-content").textContent = note.content;

    notesList.appendChild(card);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = contentInput.value.trim();
  if (!content) return;

  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  contentInput.value = "";
  loadNotes();
});

notesList.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;
  const id = e.target.dataset.id;

  await fetch(`/api/notes/${id}`, { method: "DELETE" });
  loadNotes();
});

loadNotes();
