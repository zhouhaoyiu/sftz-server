-- Check duplicate household numbers before applying the unique index.
-- Sequelize's existing User model maps to Users. Confirm SHOW TABLES before running.
-- Confirm userId already is an AUTO_INCREMENT primary key; adjust its existing type if needed.
ALTER TABLE Users ADD COLUMN version INT NOT NULL DEFAULT 1, ADD COLUMN archived BOOLEAN NOT NULL DEFAULT FALSE;
CREATE UNIQUE INDEX uq_user_household ON Users (userHh);
CREATE TABLE customer_changes (
 id VARCHAR(36) PRIMARY KEY, userHh VARCHAR(128) NOT NULL,
 actor VARCHAR(255) NOT NULL, action VARCHAR(32) NOT NULL,
 beforeData LONGTEXT NOT NULL, afterData LONGTEXT NOT NULL, reason TEXT NOT NULL,
 createdAt DATETIME NOT NULL, INDEX ix_customer_history (userHh, createdAt)
);
