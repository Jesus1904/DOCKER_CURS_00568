"""
API REST simple de gestion de tareas (To-Do List).
 * Ejemplo para el desarrollo del item 5 del examen (creacion de imagenes con Docker).
"""

import os
from datetime import datetime, timezone
from flask import Flask, jsonify, request, abort


def create_app():
    app = Flask(__name__)

    
    tasks = {}
    next_id = {"value": 1}

    @app.get("/health")
    def health():
        
        return jsonify(status="ok"), 200

    @app.get("/tasks")
    def list_tasks():
        return jsonify(list(tasks.values())), 200

    @app.get("/tasks/<int:task_id>")
    def get_task(task_id):
        task = tasks.get(task_id)
        if task is None:
            abort(404, description="Tarea no encontrada")
        return jsonify(task), 200

    @app.post("/tasks")
    def create_task():
        data = request.get_json(silent=True) or {}
        title = data.get("title")
        if not title:
            abort(400, description="El campo 'title' es requerido")

        task_id = next_id["value"]
        next_id["value"] += 1

        task = {
            "id": task_id,
            "title": title,
            "done": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        tasks[task_id] = task
        return jsonify(task), 201

    @app.put("/tasks/<int:task_id>")
    def update_task(task_id):
        task = tasks.get(task_id)
        if task is None:
            abort(404, description="Tarea no encontrada")

        data = request.get_json(silent=True) or {}
        if "title" in data:
            task["title"] = data["title"]
        if "done" in data:
            task["done"] = bool(data["done"])

        return jsonify(task), 200

    @app.delete("/tasks/<int:task_id>")
    def delete_task(task_id):
        if task_id not in tasks:
            abort(404, description="Tarea no encontrada")
        del tasks[task_id]
        return "", 204

    @app.errorhandler(404)
    def not_found(e):
        return jsonify(error=str(e.description)), 404

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify(error=str(e.description)), 400

    return app


app = create_app()

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
