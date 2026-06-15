const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// GET all items
app.get('/api/items', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items ORDER BY expiry_date ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// GET single item
app.get('/api/items/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

// POST add new item
app.post('/api/items', async (req, res) => {
    const { name, stock, expiry_date } = req.body;
    if (!name || stock === undefined || !expiry_date) {
        return res.status(400).json({ error: 'Name, stock, and expiry_date are required' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO items (name, stock, expiry_date) VALUES (?, ?, ?)',
            [name, stock, expiry_date]
        );
        const [newItem] = await db.query('SELECT * FROM items WHERE id = ?', [result.insertId]);
        res.status(201).json(newItem[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// PUT update stock
app.put('/api/items/:id/stock', async (req, res) => {
    const { change } = req.body;
    try {
        const [rows] = await db.query('SELECT stock FROM items WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
        let newStock = rows[0].stock + change;
        if (newStock < 0) newStock = 0;
        await db.query('UPDATE items SET stock = ? WHERE id = ?', [newStock, req.params.id]);
        const [updated] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update stock' });
    }
});

// PUT update entire item
app.put('/api/items/:id', async (req, res) => {
    const { name, stock, expiry_date } = req.body;
    try {
        await db.query(
            'UPDATE items SET name = ?, stock = ?, expiry_date = ? WHERE id = ?',
            [name, stock, expiry_date, req.params.id]
        );
        const [updated] = await db.query('SELECT * FROM items WHERE id = ?', [req.params.id]);
        res.json(updated[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

