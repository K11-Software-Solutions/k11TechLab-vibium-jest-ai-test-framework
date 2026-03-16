-- Sample SQLite DB schema and data for Playwright DB utility tests
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT NOT NULL
);

INSERT INTO users (username, email) VALUES ('testuser', 'testuser@example.com');
INSERT INTO users (username, email) VALUES ('admin', 'admin@example.com');
INSERT INTO users (username, email) VALUES ('alice', 'alice@example.com');
INSERT INTO users (username, email) VALUES ('bob', 'bob@example.com');
INSERT INTO users (username, email) VALUES ('charlie', 'charlie@example.com');
