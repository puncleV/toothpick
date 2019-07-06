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
   pizzaSize UUID NOT NULL,
   pizzaBase UUID NOT NULL,
   description VARCHAR(255),
   CONSTRAINT pizza_pizza_size FOREIGN KEY (pizzaSize)
    REFERENCES pizza_size (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
   CONSTRAINT pizza_pizza_base FOREIGN KEY (pizzaBase)
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
   created VARCHAR(25) NOT NULL,
   delivered UUID NOT NULL,
   customerId UUID NOT NULL,
   CONSTRAINT customer_order_customer_id FOREIGN KEY (customerId)
    REFERENCES customer (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS customer_order_pizza (
   id UUID PRIMARY KEY,
   customerOrderId UUID NOT NULL,
   pizzaId UUID NOT NULL,
   count smallint DEFAULT 1,
  CONSTRAINT customer_order_pizza_customer_order FOREIGN KEY (customerOrderId)
    REFERENCES customer_order (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT customer_order_pizza_pizza FOREIGN KEY (pizzaId)
    REFERENCES pizza (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);
