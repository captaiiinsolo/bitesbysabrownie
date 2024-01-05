const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type Admin {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        customers: [Customer]
        orders: [Order]
        products: [Product]
        reviews: [Review]

    }
  
    type Customer {
        _id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        phone: String
        address: String!
        city: String!
        state: String!
        zip: String!
        orders: [Order]
    }

    type Order {
        _id: ID!
        products: [Product]
        customer: Customer
        quantity: Int
        price: Float
        orderDate: String
        pickUp: Boolean!
        pickUpDate: String
        deliveryDate: String
        deliveryAddress: String
        deliveryCity: String
        deliveryState: String
        deliveryZip: String
        status: OrderStatus
        notes: String
    }

    type Product {
        _id: ID!
        name: String
        description: String
        price: Float
        stock: StockStatus
        reviews: [Review]
        avgRating: Float
        category: Category

    }

    type Review {
        _id: ID!
        author: String
        content: String
        rating: Int
        date: String
        product: Product
    }

    enum OrderStatus {
        PENDING
        SHIPPED
        READY_FOR_PICKUP
        DELIVERED
        PICKED_UP
        CANCELLED
    }

    enum StockStatus {
        IN_STOCK
        OUT_OF_STOCK
    }

    enum Category {
        BROWNIE_BITES
        COOKIE_DOUGH_BITES
    }

    input CustomerSearchInput {
        firstName: String
        lastName: String
        email: String
        phone: String
        address: String
        city: String
        state: String
        zip: String
    }

    input ProductSearchInput {
        name: String
        stock: StockStatus
        category: Category

    }

    type Query {
        getCustomerById(id: ID!): Customer
        getAllCustomers: [Customer]
        getOrdersById(id: ID!): Order
        getOrdersByCustomer(id: ID!): [Order]
        getOrdersByOrderStatus(status: OrderStatus!): [Order]
        getAllOrders: [Order]
        getProductById(id: ID!): Product
        getProductsByCategory(category: Category!): [Product]
        getAllProducts: [Product]
        getProductsByPrice(min: Float, max: Float): [Product]
        getProductsByStockStatus(status: StockStatus!): [Product]
        searchProducts(input: ProductSearchInput!): [Product]
        searchCustomers(input: CustomerSearchInput!): [Customer]

    }
`