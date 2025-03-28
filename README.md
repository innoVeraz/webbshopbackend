# Instructions

## Watch the recorded lesson
In the recorded lesson we go through:
- ER-diagram to understand the DB tables and the relations between them 
- MySQL in PHPMyAdmin/XAMPP
- The Ecommerce API code.
- Testing the following endpoints of the API, in Insomnia:


## API Docs 
- [PRODUCTS endpoints](https://github.com/sibala/System-och-integration-FSU24D/tree/main/06-lecture#products-endpoints)
- [CUSTOMERS endpoints](https://github.com/sibala/System-och-integration-FSU24D/tree/main/06-lecture#customers-endpoints)
- [ORDERS endpoints](https://github.com/sibala/System-och-integration-FSU24D/tree/main/06-lecture#orders-endpoints)
- [ORDER ITEMS endpoints](https://github.com/sibala/System-och-integration-FSU24D/tree/main/06-lecture#order_items-endpoints)

### PRODUCTS endpoints

  - [GET]    http://localhost:3000/products
---

>Request JSON Body:
`None`

>Response JSON Body:
``` 
[
  {
    "id": 9,
    "name": "Product name",
    "description": "Desc...",
    "price": 423,
    "stock": 234,
    "category": "Graduation Cake",
    "image": "image url",
    "created_at": "2025-03-11T13:59:05.000Z"
  }
]
``` 


  - [GET]    http://localhost:3000/products/:id
---
>Request JSON Body: 
`None`

>Response JSON Body:
``` 
{
  "id": 9,
  "name": "Product name",
  "description": "Desc...",
  "price": 423,
  "stock": 234,
  "category": "Graduation Cake",
  "image": "image url",
  "created_at": "2025-03-11T13:59:05.000Z"
}
``` 
  - [POST]   http://localhost:3000/products
---
>Request JSON Body:
``` 
{
  "name": "Product name",
  "description": "Desc...",
  "price": 423,
  "stock": 234,
  "category": "Graduation Cake",
  "image": "image url",
}
``` 


>Response JSON Body:
``` 
{
  message: "Product created"
  id: 2
}
``` 
  - [PATCH]  http://localhost:3000/products/:id
---
>Request JSON Body:
``` 
{
  "name": "Product name",
  "description": "Desc...",
  "price": 423,
  "stock": 234,
  "category": "Graduation Cake",
  "image": "image url",
}
``` 

>Response JSON Body:
``` 
{
  message: "Product updated"
}
``` 
  - [DELETE] http://localhost:3000/products/:id
---
>Request JSON Body:
`None`

>Response JSON Body:
``` 
{
  message: "Product deleted"
}
``` 

### CUSTOMERS endpoints

- [GET]    http://localhost:3000/customers
---

>Request JSON Body:
`None`

>Response JSON Body:
``` 
[
  {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@gmail.com",
    "password": "234",
    "phone": "53451234",
    "street_address": "Street 123",
    "postal_code": "Postal code",
    "city": "City",
    "country": "Country",
    "created_at": "2025-03-07T07:25:02.000Z"
  }
]
``` 


  - [GET]    http://localhost:3000/customers/:id
---
>Request JSON Body: 
`None`

>Response JSON Body:
``` 
{
  "id": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@gmail.com",
  "password": "234",
  "phone": "53451234",
  "street_address": "Street 123",
  "postal_code": "Postal code",
  "city": "City",
  "country": "Country",
  "created_at": "2025-03-07T07:25:02.000Z"
}
``` 
  - [POST]   http://localhost:3000/customers
---
>Request JSON Body:
``` 
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@gmail.com",
  "password": "234",
  "phone": "53451234",
  "street_address": "Street 123",
  "postal_code": "Postal code",
  "city": "City",
  "country": "Country",
}
``` 


>Response JSON Body:
``` 
{
  message: "Customer created"
  id: 3
}
``` 
  - [PATCH]  http://localhost:3000/customers/:id
---
>Request JSON Body:
``` 
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@gmail.com",
  "password": "234",
  "phone": "53451234",
  "street_address": "Street 123",
  "postal_code": "Postal code",
  "city": "City",
  "country": "Country",
}
``` 

>Response JSON Body:
``` 
{
  message: "Customer updated"
}
``` 
  - [DELETE] http://localhost:3000/customers/:id
---
>Request JSON Body:
`None`

>Response JSON Body:
``` 
{
  message: "Customer deleted"
}
``` 


### ORDERS endpoints
  - [GET]    http://localhost:3000/orders
---

>Request JSON Body:
`None`

>Response JSON Body:
``` 
[
  {
    "id": 21,
    "customer_id": 1,
    "total_price": 1000,
    "payment_status": "paid",
    "payment_id": null,
    "order_status": "Processing",
    "created_at": "2025-03-10T08:52:55.000Z",
    "customer_firstname": "John",
    "customer_lastname": "Doe",
    "customer_email": "john.doe@gmail.com",
    "customer_phone": "5345",
    "customer_street_address": "Street 123",
    "customer_postal_code": "Postal code",
    "customer_city": "City",
    "customer_country": "Country",
    "customers_created_at": "2025-03-07T07:25:02.000Z"
  }
]
``` 


  - [GET]    http://localhost:3000/orders/:id
---

>Request JSON Body:
`None`

>Response JSON Body:
``` 
{
  "id": "25",
  "customer_id": 1,
  "total_price": 669,
  "payment_status": "unpaid",
  "payment_id": null,
  "order_status": "pending",
  "created_at": "2025-03-12T18:25:32.000Z",
  "customer_firstname": "John",
  "customer_lastname": "Doe",
  "customer_email": "john.doe@gmail.com",
  "customer_password": "234",
  "customer_phone": "5345",
  "customer_street_address": "Street 123",
  "customer_postal_code": "Postal code",
  "customer_city": "City",
  "customer_country": "Country",
  "order_items": [
    {
      "id": 51,
      "product_id": 11,
      "product_name": "Test product - changed",
      "quantity": 3,
      "unit_price": 100
    },
    {
      "id": 52,
      "product_id": 10,
      "product_name": "qwe",
      "quantity": 3,
      "unit_price": 123
    }
  ]
}
``` 
  - [POST]   http://localhost:3000/orders
---
>Request JSON Body:
``` 
{
  "customer_id": 1,
  "payment_status": "unpaid",
  "payment_id": null,
  "order_status": "pending",
  "order_items": [
    {
      "product_id": 11,
      "product_name": "Test product - changed",
      "quantity": 3,
      "unit_price": 100
    },
    {
      "product_id": 10,
      "product_name": "qwe",
      "quantity": 3,
      "unit_price": 123
    }
  ]
}
``` 


>Response JSON Body:
``` 
{
  message: "Order created"
  id: 5
}
``` 
  - [PATCH]  http://localhost:3000/orders/:id
---
>Request JSON Body:
``` 
{
  "payment_status": "paid",
  "payment_id": "uh234hk2h3u423h42k34",
  "order_status": "processing"
}
``` 

>Response JSON Body:
``` 
{
  message: "Order updated"
}
``` 
  - [DELETE] http://localhost:3000/orders/:id
---
>Request JSON Body:
`None`

>Response JSON Body:
``` 
{
  message: "Order deleted"
}
``` 

### ORDER_ITEMS endpoints
  - [PATCH]  http://localhost:3000/order-items/:id
---
>Request JSON Body:
``` 
{
  "quantity": 5,
}
``` 

>Response JSON Body:
``` 
{
  message: "Order item updated"
}
``` 
  - [DELETE] http://localhost:3000/order-items/:id
---
>Request JSON Body:
`None`

>Response JSON Body:
``` 
{
  message: "Order item deleted"
}
``` 
