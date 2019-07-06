CREATE TABLE IF NOT EXISTS pizza_base (
   name VARCHAR(25) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS pizza_size (
   name VARCHAR(25) PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS pizza (
   id UUID PRIMARY KEY,
   name VARCHAR(25) NOT NULL,
   pizza_size VARCHAR(25) NOT NULL,
   pizza_base VARCHAR(25) NOT NULL,
   description VARCHAR(255),
   CONSTRAINT pizza_pizza_size FOREIGN KEY (pizza_size)
    REFERENCES pizza_size (name)
    ON UPDATE CASCADE ON DELETE RESTRICT,
   CONSTRAINT pizza_pizza_base FOREIGN KEY (pizza_base)
    REFERENCES pizza_base (name)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customer (
   id UUID PRIMARY KEY,
   name VARCHAR(25) NOT NULL,
   email VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_order (
   id UUID PRIMARY KEY,
   status VARCHAR(25) NOT NULL,
   created VARCHAR(25) NOT NULL,
   delivered UUID NOT NULL,
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
