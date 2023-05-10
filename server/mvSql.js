import sqlite3 from "sqlite3";

const db = new sqlite3.Database('mv.db');

db.serialize(function() {
  // db.run('CREATE TABLE IF NOT EXISTS actor (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(30), name1 CHAR(30), name2 CHAR(30), age INTEGER, tags CHAR(30), desc CHAR(50))', (err, result) => {
  //   console.log('create', err, result);
  //   db.close();
  // });

  // db.run('CREATE TABLE IF NOT EXISTS tag (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(30), type CHAR(20), color CHAR(30), desc CHAR(60))', (err, result) => {
  //   console.log('create', err, result);
  // });

  // db.run('CREATE TABLE IF NOT EXISTS series (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(30), full CHAR(150), type CHAR(20), publisher CHAR(60), desc CHAR(60))', (err, result) => {
  //   console.log('create', err, result);
  // });

  // db.run('CREATE TABLE IF NOT EXISTS video (id INTEGER PRIMARY KEY AUTOINCREMENT, name CHAR(150), series INTEGER, idx CHAR(20), actor INTEGER, tags CHAR(60), status CHAR(30), disk CHAR(40), desc CHAR(60))', (err, result) => {
  //   console.log('create', err, result);
  // });

  // db.run('ALTER TABLE video ADD COLUMN date DATE', (err, result) => {
  //   console.log(err, result);
  // });

  db.run('ALTER TABLE video ADD COLUMN actors CHAR(60)', (err, result) => {
    console.log(err, result);
  });

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