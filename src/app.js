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
             res.redirect('/index.html');
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
            res.redirect('/products.html');
        } else {
            res.status(401).send('Invalid email or password');
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).send('Error interno del servidor');
    }
});


app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows); 
    } catch (error) {
        console.error('Error al consultar productos:', error);
        res.status(500).send('Error al consultar productos');
    }
});

app.get('/cart', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                cart_items.id,
                cart_items.cart_id,
                cart_items.product_id,
                products.name AS product_name,
                cart_items.quantity,
                cart_items.price
            FROM cart_items
            JOIN products ON cart_items.product_id = products.id
        `);

        res.json(rows);
    } catch (error) {
        console.error('Error al consultar el carrito:', error);
        res.status(500).send('Error al consultar el carrito');
    }
});

app.post('/cart', async (req, res) => {
    try {
        const { userId, productId, quantity, price } = req.body;

        let [carts] = await pool.query(
            'SELECT id FROM carts WHERE user_id = ? AND status = "active" LIMIT 1',
            [userId]
        );

        let cartId;
        if (carts.length > 0) {
            cartId = carts[0].id;
        } else {
          
            const [result] = await pool.query(
                'INSERT INTO carts (user_id) VALUES (?)',
                [userId]
            );
            cartId = result.insertId;
        }

        await pool.query(
            'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
            [cartId, productId, quantity || 1, price]
        );
        

        res.send('Producto agregado al carrito');
        
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send('Error al agregar producto al carrito');
    }
});


app.delete('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM cart_items WHERE id = ?', [id]);
        res.send('Producto eliminado del carrito');
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).send('Error al eliminar producto del carrito');
    }
});


app.listen(3000);
console.log("Starting server...");

