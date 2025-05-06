const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');

const app = express();
const prisma = new PrismaClient();
app.use(bodyParser.json());

// CREATE
app.post('/items', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const item = await prisma.item.create({ data: { name } });
    res.status(201).json(item);
});

// READ ALL
app.get('/items', async (req, res) => {
    const items = await prisma.item.findMany();
    res.json(items);
});

// READ ONE
app.get('/items/:id', async (req, res) => {
    const item = await prisma.item.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
});

// UPDATE
app.put('/items/:id', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    try {
        const item = await prisma.item.update({ where: { id: parseInt(req.params.id) }, data: { name } });
        res.json(item);
    } catch {
        res.status(404).json({ error: 'Item not found' });
    }
});

// DELETE
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await prisma.item.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Item deleted', item });
    } catch {
        res.status(404).json({ error: 'Item not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});