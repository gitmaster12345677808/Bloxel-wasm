import mysql from 'mysql2/promise';
import { DB } from './config.js';

let pool;

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({ ...DB, waitForConnections: true, connectionLimit: 10 });
    await migrate();
  }
  return pool;
}

export async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.query(sql, params);
  return rows;
}

async function migrate() {
  const p = await getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS users (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      username     VARCHAR(64) NOT NULL UNIQUE,
      email        VARCHAR(255),
      password     VARCHAR(255) NOT NULL,
      auth_token   VARCHAR(128),
      is_admin     TINYINT(1) NOT NULL DEFAULT 0,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS friendships (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_a     INT NOT NULL,
      user_b     INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_pair (user_a, user_b)
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS friend_requests (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      from_user  INT NOT NULL,
      to_user    INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_req (from_user, to_user)
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      from_user   INT NOT NULL,
      to_user     INT NOT NULL,
      content     TEXT NOT NULL,
      is_read     TINYINT(1) NOT NULL DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS invites (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      from_user      INT NOT NULL,
      to_user        INT NOT NULL,
      server_address VARCHAR(255),
      port           INT,
      status         VARCHAR(16) DEFAULT 'pending',
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_inv (from_user, to_user)
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS user_status (
      user_id        INT PRIMARY KEY,
      online         TINYINT(1) DEFAULT 0,
      server_address VARCHAR(255),
      port           INT,
      last_seen      DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS panels (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT NOT NULL,
      username   VARCHAR(64),
      title      VARCHAR(255),
      url        TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_user (user_id)
    )
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS announcements (
      id             INT AUTO_INCREMENT PRIMARY KEY,
      message        TEXT NOT NULL,
      target_user_id INT DEFAULT NULL,
      created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  // Add columns introduced after initial schema (safe on existing tables)
  await p.query(`ALTER TABLE users       ADD COLUMN IF NOT EXISTS banned               TINYINT(1)   NOT NULL DEFAULT 0`);
  await p.query(`ALTER TABLE users       ADD COLUMN IF NOT EXISTS ban_reason           VARCHAR(500) DEFAULT NULL`);
  await p.query(`ALTER TABLE users       ADD COLUMN IF NOT EXISTS voice_disabled       TINYINT(1)   NOT NULL DEFAULT 0`);
  await p.query(`ALTER TABLE user_status ADD COLUMN IF NOT EXISTS last_announcement_id INT          NOT NULL DEFAULT 0`);
}
