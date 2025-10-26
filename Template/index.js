import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Configurar dotenv (variables de entorno)
dotenv.config();

// Necesario para obtener __dirname con ES Modules   (direccion de trabajo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware  (accesibilidad a la web)
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos

// Ruta principal    (donde se carga ni bien se entra a la web)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "carrito.html"))
});

app.get("/:nombre/p/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "producto.html"))
})


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
