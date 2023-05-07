import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbName = 'mv.db';

function selectAll(sql) {
  return new Promise(function (resolve, reject) {
    const db = new sqlite3.Database(dbName);
    db.serialize(function() {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
        db.close();
      });
    });
  });
}

function run(sql, values) {
  return new Promise(function (resolve, reject) {
    const db = new sqlite3.Database(dbName);
    db.serialize(function() {
      db.run(sql, values, (err, result) => {
        if (err) reject(err);
        else resolve(result);
        db.close();
      });
    });
  });
}

app.get('/node/actor-list', (req, res) => {
  const sql = `SELECT * From actor ORDER BY name`;
  selectAll(sql).then(rows => {
    res.json({ code: 200, data: rows, message: 'success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.post('/node/actor', (req, res) => {
  const { name, name1, name2, age, tags, desc } = req.body;
  const sql = 'INSERT INTO actor (name, name1, name2, age, tags, desc) VALUES (?, ?, ?, ?, ?, ?)';
  run(sql, [name, name1, name2, age, tags, desc]).then(result => {
    res.json({ code: 200, data: result, message: 'actor add success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.put('/node/actor/:id', (req, res) => {
  const { id } = req.params;
  const { name, name1, name2, age, tags, desc } = req.body;
  const sql = 'UPDATE actor SET name = ?, name1 = ?, name2 = ?, age = ?, tags = ?, desc = ? WHERE id = ?';
  run(sql, [name, name1, name2, age, tags, desc, id]).then(result => {
    res.json({ code: 200, data: result, message: 'actor edit success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.delete('/node/actor/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM actor WHERE id = ?';
  run(sql, [id]).then(result => {
    res.json({ code: 200, data: result, message: 'actor delete success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.listen(3030, () => {
  console.log('server start');
});