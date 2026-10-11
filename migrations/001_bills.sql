CREATE TABLE bills (
  id VARCHAR(36) PRIMARY KEY,
  userHh VARCHAR(128) NOT NULL,
  requestHash CHAR(64) NOT NULL,
  snapshot LONGTEXT NOT NULL,
  createdBy VARCHAR(128) NOT NULL,
  createdAt DATETIME NOT NULL,
  INDEX bills_customer_date (userHh, createdAt)
);
