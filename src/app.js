import express from "express";
import { pool } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos (carpeta public):
app.use(express.static(path.join(__dirname, "../public")));

// Ruta principal de la pagina:
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
})

    app.post('/register', async (req, res) => {
        try {
            const { registerEmail, registerPassword } = req.body;
            await pool.query('INSERT INTO usuarios (email, password) VALUES (?, ?)', [registerEmail, registerPassword]);
            res.send('User registered successfully');
        } catch (error) {
            console.error('Error in the register', error);
            res.status(500).send('Error in the register user');
        }
    });


app.post("/login", async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        const [user] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ? AND password = ?',
            [loginEmail, loginPassword]
        );
        if (user) {
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(3000);
console.log("Starting server...");