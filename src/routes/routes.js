// routes/salesRoutes.js
const express = require('express');
const router = express.Router();
const Sale = require('../models/salesModel');

// Define your API endpoints here (implement them later)
router.get('/total-revenue', async (req, res) => {
    try {
      const totalRevenue = await Sale.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
      ]);
      if (totalRevenue.length === 0) {
        return res.status(404).json({ error: 'No sales data found.' });
      }
      res.json({ totalRevenue: totalRevenue[0].totalRevenue });
    } catch (err) {
      res.status(500).json({ error: 'Unable to calculate total revenue.' });
    }
  });
  

  router.get('/quantity-by-product', async (req, res) => {
    try {
      const quantityByProduct = await Sale.aggregate([
        {
          $group: {
            _id: '$product',
            totalQuantity: { $sum: '$quantity' },
          },
        },
      ]);
      res.json(quantityByProduct);
    } catch (err) {
      res.status(500).json({ error: 'Unable to calculate quantity by product.' });
    }
  });
  

  router.get('/top-products', async (req, res) => {
    try {
      const topProducts = await Sale.aggregate([
        {
          $group: {
            _id: '$product',
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
        {
          $sort: { totalRevenue: -1 },
        },
        {
          $limit: 5,
        },
      ]);
      res.json(topProducts);
    } catch (err) {
      res.status(500).json({ error: 'Unable to retrieve top products.' });
    }
  });
  

  router.get('/average-price', async (req, res) => {
    try {
      const averagePrice = await Sale.aggregate([
        {
          $group: {
            _id: null,
            averagePrice: { $avg: '$price' },
          },
        },
      ]);
      if (averagePrice.length === 0) {
        return res.status(404).json({ error: 'No sales data found.' });
      }
      res.json({ averagePrice: averagePrice[0].averagePrice });
    } catch (err) {
      res.status(500).json({ error: 'Unable to calculate average price.' });
    }
  });
  
  router.get('/revenue-by-month', async (req, res) => {
    try {
      const revenueByMonth = await Sale.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m', date: '$date' },
            },
            totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);
      res.json(revenueByMonth);
    } catch (err) {
      res.status(500).json({ error: 'Unable to calculate revenue by month.' });
    }
  });
  

  router.get('/highest-quantity-sold', async (req, res) => {
    try {
      const highestQuantitySold = await Sale.aggregate([
        {
          $group: {
            _id: '$product',
            maxQuantity: { $max: '$quantity' },
          },
        },
        {
          $sort: { maxQuantity: -1 },
        },
        {
          $limit: 1,
        },
      ]);
      if (highestQuantitySold.length === 0) {
        return res.status(404).json({ error: 'No sales data found.' });
      }
      res.json(highestQuantitySold[0]);
    } catch (err) {
      res.status(500).json({ error: 'Unable to find highest quantity sold.' });
    }
  });
  

  router.get('/department-salary-expense', async (req, res) => {
    try {
      // Assuming you have a "department" field in your sales data
      const departmentSalaryExpense = await Sale.aggregate([
        {
          $group: {
            _id: '$department',
            totalSalaryExpense: { $sum: '$salary' }, // Change to match your actual field name
          },
        },
      ]);
      res.json(departmentSalaryExpense);
    } catch (err) {
      res.status(500).json({ error: 'Unable to calculate department salary expense.' });
    }
  });
  

// POST /api/sales/add-sale: Add a new sale to the database
router.post('/add-sale', async (req, res) => {
  try {
    const { product, quantity, price } = req.body;

    // Perform validation on the incoming data (e.g., check for required fields)
    if (!product || !quantity || !price) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create a new Sale document using the Sale model
    const newSale = new Sale({ product, quantity, price});

    // Save the new sale to the database
    await newSale.save();

    res.status(201).json({ message: 'Sale added successfully', sale: newSale });
  } catch (err) {
    res.status(500).json({ error: 'Unable to add the sale.' });
  }
});

module.exports = router;
