DROP DATABASE IF EXISTS pricing;

CREATE DATABASE pricing;

\connect pricing;

DROP TABLE IF EXISTS quotes;

CREATE TABLE quotes(
  calculation_id INT NOT NULL PRIMARY KEY,
  calculation_time TIMESTAMP NOT NULL,
  instantaneous_price DECIMAL NOT NULL,
  quoted_price DECIMAL NOT NULL,
  total_users INT NOT NULL,
  waiting_users INT NOT NULL,
  total_drivers INT NOT NULL,
  available_drivers INT NOT NULL,
  accepted BOOLEAN
);
