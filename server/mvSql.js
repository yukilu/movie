import sqlite3 from "sqlite3";

const db = new sqlite3.Database('mv.db');

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS actor (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(30), name1 CHAR(30), name2 CHAR(30), age INTEGER, tags CHAR(30), desc CHAR(50))', (err, result) => {
    console.log('create', err, result);
    db.close();
  });

  // db.run('CREATE TABLE IF NOT EXISTS subject (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(100))', (err, result) => {
  //   console.log('create', err, result);
  // });

  // db.run('CREATE TABLE IF NOT EXISTS content (id INTEGER PRIMARY KEY AUTOINCREMENT, idx INT, content CHAR(100), link CHAR(200), subject_id INTEGER)', (err, result) => {
  //   console.log('create', err, result);
  // });

  // const sql = `SELECT s.id, c.id AS content_id, name, idx, content, link
  //                 FROM subject AS s
  //                 LEFT JOIN content as c ON s.id = c.subject_id
  //                 ORDER BY name`;
  // const sql = `SELECT p.id, c.id AS content_id, name AS subject, speaker, time, idx, content, link
  //                 FROM plan AS p
  //                 LEFT JOIN subject AS s ON p.subject_id = s.id
  //                 LEFT JOIN content AS c ON s.id = c.subject_id
  //                 ORDER BY time`;

  // const sql = 'SELECT * FROM actor';

  // db.all(sql, (err, rows) => {
  //   console.log('select');
  //   console.log(err, rows);
  // });
});