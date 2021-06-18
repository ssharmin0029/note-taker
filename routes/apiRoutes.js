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

router.post('/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json(err);
    }
    const notes = JSON.parse(data);
    const newNote = {...req.body, id:uuidv4()};
    const updatedNotes = [...notes, newNote];

    fs.writeFile(dbPath, JSON.stringify(updatedNotes), err => {
      if (err) {
        res.status(500).json(err);
      }
    });
    res.json(newNote);
  });
});

module.exports = router;