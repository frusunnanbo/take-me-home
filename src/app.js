const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hej!'));

app.listen(port, () => console.log(`Take-me-home app listening on port ${port}!`));
