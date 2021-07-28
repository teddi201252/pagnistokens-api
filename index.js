const express = require('express');
const app = express();

app.listen(8080, () => console.log('Connected'));

app.get('/prova', (req, res) => {
    res.sendStatus(200);
});