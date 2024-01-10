const connection = require("../config/connection");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Review = require("../models/Review");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const dayjs = require("dayjs");

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bitesBySabrownieDB"
    );
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.log(err);
  }
};

connectDB();

connection.on("error", (err) => console.log(err));

connection.once("open", async () => {
  console.log("You have successfully connected to the Bites By Sabrownie DB!");

  await Admin.deleteMany({});
  await Customer.deleteMany({});
  await Product.deleteMany({});
  // await Order.deleteMany({});
  // await Review.deleteMany({});

  // Create Admins
  const admins = [];
  for (let i = 0; i < 1; i++) {
    admins.push({
      userType: 'Admin',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: "@Abcd4321_",
    });
  }

 // Create Customers
 const customers = [];
 for (let i = 0; i < 5; i++) {
   customers.push({
      userType: 'Customer',
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbr: true }),
      zip: faker.location.zipCode(),
   });
 }

// Create Products
const products = [];

products.push({
  name: "Sabrownie's Brownie Bites",
  description: faker.lorem.paragraph(),
  price: 12.99,
  stock: "IN_STOCK",
  category: "BROWNIE_BITES",
});

products.push({
  name: "Sabrownie's Cookies Dough Bites",
  description: faker.lorem.paragraph(),
  price: 12.99,
  stock: "IN_STOCK",
  category: "COOKIE_DOUGH_BITES",
});





const saltRounds = 10;

  Admin.schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });

  Customer.schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  });

  // Insert admin and customer data after setting up pre-save hooks
  await Admin.insertMany(admins);
  await Customer.insertMany(customers);

  // Insert orders, products, and reviews
  await Product.insertMany(products);
  // await Order.insertMany(orders);
  // await Review.insertMany(reviews);

  console.table(admins);
  console.table(customers);
  console.table(products);
  // console.table(orders);
  // console.table(reviews);

  console.info(`Successfully seeded ${admins.length} Admins`);
  console.info(`Successfully seeded ${customers.length} Customers`);
  console.info(`Successfully seeded ${products.length} Products`);
  // console.info(`Successfully seeded ${orders.length} Orders`);
  // console.info(`Successfully seeded ${reviews.length} Reviews`);
  process.exit(0);
});
