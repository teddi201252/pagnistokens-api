const express = require('express');
const app = express();

app.listen(process.env.PORT || 5000, () => console.log('Connected'));

app.get('/prova', (req, res) => {
    res.sendStatus(200);
});