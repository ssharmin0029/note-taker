const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');
// const uuidv1 = require('uuid/v1');

const dbPath = path.join(__dirname, '../db/db.json');

router.get('/notes', (req, res) => {
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
          res.status(500).json(err);
        }
        const notes = JSON.parse(data);
        res.json(notes); 
    });
});


module.exports = router;
