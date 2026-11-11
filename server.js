const express = require("express");
const os = require("node:os");

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 3000;

let services = [
  { id: 1, name: "Хранение файлов", category: "storage" },
  { id: 2, name: "Виртуальная машина", category: "compute" },
  { id: 3, name: "Среда разработки", category: "development" }
];

app.get("/", (req, res) => {
  res.send(`
    <html lang="ru">
    <meta charset="utf-8">
    <title>Cloud Lab</title>
    <h1>Cloud Lab</h1>
    <p>Приложение запущено на удалённом сервере.</p>
    <a href="/api/status">Состояние сервера</a>
    

    <a href="/api/services">Список сервисов</a>
    

    <a href="/api/hello?name=Anna">Приветствие</a>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({
    app: process.env.APP_NAME || "Cloud Lab",
    status: "ok",
    time: new Date().toISOString(),
    hostname: os.hostname()
  });
});
app.get("/api/hello", (req, res) => {
  const name = req.query.name || "Гость";

  res.json({
    message: `Привет, ${name}!`
  });
});

app.get("/api/services", (req, res) => {
  res.json(services);
});

app.get("/api/services/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = services.find(s => s.id === id);

  if (!item) {
    return res.status(404).json({
      error: "Сервис не найден"
    });
  }

  res.json(item);
});

app.post("/api/services", (req, res) => {
  const { name, category } = req.body;

  if (
    typeof name !== "string" ||
    typeof category !== "string" ||
    !name.trim() ||
    !category.trim()
  ) {
    return res.status(400).json({
      error: "Название и категория обязательны"
    });
  }

  const newService = {
    id: services.length > 0
      ? Math.max(...services.map(s => s.id)) + 1
      : 1,
    name: name.trim(),
    category: category.trim()
  };

  services.push(newService);

  res.status(201).json(newService);
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server: http://localhost:${port}`);
});