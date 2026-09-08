/**
 * Ejemplo para el desarrollo del item 5 del examen (creacion de imagenes con Docker).
 */

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


let notes = [];
let nextId = 1;


app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: "El campo 'content' es requerido" });
  }

  const note = {
    id: nextId++,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  notes.push(note);
  res.status(201).json(note);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = notes.some((n) => n.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Nota no encontrada" });
  }

  notes = notes.filter((n) => n.id !== id);
  res.status(204).send();
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Notes App corriendo en el puerto ${PORT}`);
});
