const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);
// app.use('/api', require('./routes/apiRoutes'));
// app.use('/', require('./routes/htmlRoutes'));


app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});



