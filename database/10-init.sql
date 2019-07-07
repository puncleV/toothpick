CREATE TABLE IF NOT EXISTS pizza_base (
   id UUID PRIMARY KEY,
   name VARCHAR(25) UNIQUE
);

CREATE TABLE IF NOT EXISTS pizza_size (
   id UUID PRIMARY KEY,
   name VARCHAR(25) UNIQUE
);

CREATE TABLE IF NOT EXISTS pizza (
   id UUID PRIMARY KEY,
   name VARCHAR(25) NOT NULL,
   size UUID NOT NULL,
   base UUID NOT NULL,
   description VARCHAR(255),
   CONSTRAINT pizza_pizza_size FOREIGN KEY (size)
    REFERENCES pizza_size (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
   CONSTRAINT pizza_pizza_base FOREIGN KEY (base)
    REFERENCES pizza_base (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customer (
   id UUID PRIMARY KEY,
   name VARCHAR(25) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS customer_order (
   id UUID PRIMARY KEY,
   status VARCHAR(25) NOT NULL,
   created timestamp NOT NULL,
   delivered timestamp,
   customer_id UUID NOT NULL,
   CONSTRAINT customer_order_customer_id FOREIGN KEY (customer_id)
    REFERENCES customer (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customer_order_pizza (
   id UUID PRIMARY KEY,
   customer_order_id UUID NOT NULL,
   pizza_id UUID NOT NULL,
   count smallint DEFAULT 1,
  CONSTRAINT customer_order_pizza_customer_order FOREIGN KEY (customer_order_id)
    REFERENCES customer_order (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT customer_order_pizza_pizza FOREIGN KEY (pizza_id)
    REFERENCES pizza (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
