const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading data:', err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data), 'utf8');
    } catch (err) {
        console.error('Error writing data:', err);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

app.get('/api/data/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const item = data.users.find(d => d.id === id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

app.post('/api/data', express.json(), (req, res) => {
    const data = readData();
    const body = req.body;
    if (!data || !body) {
        return res.status(400).json({ error: 'Invalid data format' });
    }
    const newUser ={
        id: data.users.length ? data.users[data.users.length - 1].id + 1 : 1,
        name: body.name
    }
    data.users.push(newUser);
    writeData(data);
    res.status(201).json(data);
});

app.listen(port, () => {
    console.log(`Servidor escuchando ol en http://localhost:${port}`);
});