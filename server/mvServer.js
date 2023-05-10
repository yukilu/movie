import express from 'express';
import sqlite3 from 'sqlite3';
import dayjs from 'dayjs';

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


// actor
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

// tag
app.get('/node/tag-list', (req, res) => {
  const sql = `SELECT * From tag ORDER BY name`;
  selectAll(sql).then(rows => {
    res.json({ code: 200, data: rows, message: 'success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.post('/node/tag', (req, res) => {
  const { name, type, color, desc } = req.body;
  const sql = 'INSERT INTO tag (name, type, color, desc) VALUES (?, ?, ?, ?)';
  run(sql, [name, type, color, desc]).then(result => {
    res.json({ code: 200, data: result, message: 'tag add success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.put('/node/tag/:id', (req, res) => {
  const { id } = req.params;
  const { name, type, color, desc } = req.body;
  const sql = 'UPDATE tag SET name = ?, type = ?, color = ?, desc = ? WHERE id = ?';
  run(sql, [name, type, color, desc, id]).then(result => {
    res.json({ code: 200, data: result, message: 'tag edit success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.delete('/node/tag/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM tag WHERE id = ?';
  run(sql, [id]).then(result => {
    res.json({ code: 200, data: result, message: 'tag delete success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

// series
app.get('/node/series-list', (req, res) => {
  const sql = `SELECT * From series ORDER BY name`;
  selectAll(sql).then(rows => {
    res.json({ code: 200, data: rows, message: 'success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.post('/node/series', (req, res) => {
  const { name, full, type, publisher, desc } = req.body;
  const sql = 'INSERT INTO series (name, full, type, publisher, desc) VALUES (?, ?, ?, ?, ?)';
  run(sql, [name, full, type, publisher, desc]).then(result => {
    res.json({ code: 200, data: result, message: 'series add success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.put('/node/series/:id', (req, res) => {
  const { id } = req.params;
  const { name, full, type, publisher, desc } = req.body;
  const sql = 'UPDATE series SET name = ?, full = ?, type = ?, publisher = ?, desc = ? WHERE id = ?';
  run(sql, [name, full, type, publisher, desc, id]).then(result => {
    res.json({ code: 200, data: result, message: 'series edit success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.delete('/node/series/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM series WHERE id = ?';
  run(sql, [id]).then(result => {
    res.json({ code: 200, data: result, message: 'series delete success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

// video
app.get('/node/video-list', (req, res) => {
  const sql = `SELECT * From video ORDER BY date`;
  selectAll(sql).then(rows => {
    res.json({ code: 200, data: rows, message: 'success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.post('/node/video', (req, res) => {
  const date = dayjs().format('YYYY-MM-DD');
  const { name, series, idx, actors, tags, status, disk, desc } = req.body;
  const sql = 'INSERT INTO video (name, series, idx, actors, tags, status, disk, desc, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  run(sql, [name, series, idx, actors, tags, status, disk, desc, date]).then(result => {
    res.json({ code: 200, data: result, message: 'video add success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.put('/node/video/:id', (req, res) => {
  const { id } = req.params;
  const { name, series, idx, actors, tags, status, disk, desc } = req.body;
  const sql = 'UPDATE video SET name = ?, series = ?, idx = ?, actors = ?, tags = ?, status = ?, disk = ?, desc = ? WHERE id = ?';
  run(sql, [name, series, idx, actors, tags, status, disk, desc, id]).then(result => {
    res.json({ code: 200, data: result, message: 'video edit success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.delete('/node/video/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM video WHERE id = ?';
  run(sql, [id]).then(result => {
    res.json({ code: 200, data: result, message: 'video delete success' });
  }, err => {
    res.json({ code: 500, data: null, message: err?.code });
  });
});

app.listen(3030, () => {
  console.log('server start');
});