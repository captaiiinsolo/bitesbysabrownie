const { AuthenticationError } = require('apollo-server-express');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
      getAdminById: async (_, { id }) => await Admin.findById(id),
      getAllAdmins: async () => await Admin.find(),
  
      getCustomerById: async (_, { id }) => await Customer.findById(id),
      getAllCustomers: async () => await Customer.find(),
  
      getOrderById: async (_, { id }) => await Order.findById(id),
      getAllOrders: async () => await Order.find(),
  
      getProductById: async (_, { id }) => await Product.findById(id),
      getAllProducts: async () => await Product.find(),
      getProductsByStockStatus: async (_, { status }) => await Product.find({ stock: status }),
  
      getReviewById: async (_, { id }) => await Review.findById(id),
      getAllReviews: async () => await Review.find().populate('customer'),

      searchProducts: async (_, { input }) => await Product.find({ $text: { $search : input.name } }),
      searchCustomers: async (_, { input }) => {

        if (input.query) {
          const regex = new RegExp(input.query, 'i'); // Create a case-insensitive regex
          const customer = await Customer.find({
            $or: [
              { firstName: regex },
              { lastName: regex },
              { email: regex },
              { phone: regex },
              { 'address.city': regex },
              { 'address.state': regex },
              { 'address.zip': regex },
            ]
          });
          return customer.length > 0 ? customer : [];
        }
      
        // If no query is provided, return all customers
        return await Customer.find();
      }
      
    },
  
    Mutation: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }
    
            const correctPassword = await user.isCorrectPassword(password);
    
            if (!correctPassword) {
                throw new AuthenticationError('Invalid credentials');
            }
    
            const token = signToken(user);
            return { token, userType: user.userType, user };
        },

      // Admin mutations
      createAdmin: async (_, { input }) => await Admin.create(input),
      updateAdmin: async (_, { id, input }) => await Admin.findByIdAndUpdate(id, input, { new: true }),
      deleteAdmin: async (_, { id }) => await Admin.findByIdAndDelete(id),
  
      // Customer mutations
      createCustomer: async (_, { input }) => await Customer.create(input),
      updateCustomer: async (_, { id, input }) => await Customer.findByIdAndUpdate(id, input, { new: true }),
      deleteCustomer: async (_, { id }) => await Customer.findByIdAndDelete(id),
  
      // Order mutations
      createOrder: async (_, { input }) => {
        const createOrder = await Order.create(input);
        const customerID = input.customer;
        
        await Customer.findByIdAndUpdate(
          customerID,
          { $push: { orders: createOrder._id } },
          { new: true }
        );

        return createOrder;
      },
      updateOrder: async (_, { id, input }) => await Order.findByIdAndUpdate(id, input, { new: true }),
      deleteOrder: async (_, { id }) => await Order.findByIdAndDelete(id),
  
      // Product mutations
      createProduct: async (_, { input }) => await Product.create(input),
      updateProduct: async (_, { id, input }) => await Product.findByIdAndUpdate(id, input, { new: true }),
      deleteProduct: async (_, { id }) => await Product.findByIdAndDelete(id),
  
      // Review mutations
      createReview: async (_, { input }) => {
        const createReview = await Review.create(input);
        const productID = input.product;
        const customerID = input.customer;
        
        const product = await Product.findByIdAndUpdate(
          productID,
          { $push: { reviews: createReview._id } },
          { new: true }
        );

        await product.calculateAvgRating();

        await Customer.findByIdAndUpdate(
          customerID,
          { $push: { reviews: createReview._id } },
          { new: true }
        );

        return createReview;
      },
      updateReview: async (_, { id, input }) => {
        const review = await Review.findByIdAndUpdate(id, input, { new: true });

        const product = await Product.findById(review.product);
        await product.calculateAvgRating();

        return review;
      },
      deleteReview: async (_, { id }) => {
        const review = await Review.findById(id);
        const product = await Product.findById(review.product);

        await review.remove();
        await product.calculateAvgRating();

        return review;
      },
  },

  Admin: {
    // Resolve nested relationships for Admin
    customers: async (admin) => await Customer.find({ _id: { $in: admin.customers } }),
    orders: async (admin) => await Order.find({ _id: { $in: admin.orders } }),
    products: async (admin) => await Product.find({ _id: { $in: admin.products } }),
    reviews: async (admin) => await Review.find({ _id: { $in: admin.reviews } }),
  },
  Customer: {
    // Resolve nested relationships for Customer
    orders: async (customer) => await Order.find({ _id: { $in: customer.orders } }),
    reviews: async (customer) => await Review.find({ _id: { $in: customer.reviews } }),
  },
  Order: {
    // Resolve nested relationships for Order
    products: async (order) => await Product.find({ _id: { $in: order.products } }),
    customer: async (order) => await Customer.findById(order.customer),
  },
  Product: {
    // Resolve nested relationships for Product
    reviews: async (product) => await Review.find({ _id: { $in: product.reviews } }),
    avgRating: async (product) => {
      const reviews = await Review.find({ _id: { $in: product.reviews } });
      if (reviews.length === 0) {
        return 0;
      }
      const sum = reviews.reduce((a, b) => a + b.rating, 0);
      return sum / reviews.length;
    },
  },
  Review: {
    // Resolve nested relationships for Review
    product: async (review) => await Product.findById(review.product),
  },

};
  
  module.exports = resolvers;