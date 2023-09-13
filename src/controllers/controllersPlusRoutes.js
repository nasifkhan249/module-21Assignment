const express = require('express');
const router = express.Router();
const Sales = require('./models/sales'); // Import your Mongoose model

// Your route definitions here...





app.get('/api/sales/total-revenue', async (req, res) => {
    try {
        const totalRevenue = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                },
            },
        ]);
        res.json({ totalRevenue: totalRevenue[0].totalRevenue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/sales/quantity-by-product', async (req, res) => {
    try {
        const quantityByProduct = await Sales.aggregate([
            {
                $group: {
                    _id: '$product',
                    totalQuantity: { $sum: '$quantity' },
                },
            },
        ]);
        res.json(quantityByProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/sales/top-products', async (req, res) => {
    try {
        const topProducts = await Sales.aggregate([
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
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/sales/average-price', async (req, res) => {
    try {
        const averagePrice = await Sales.aggregate([
            {
                $group: {
                    _id: null,
                    averagePrice: { $avg: '$price' },
          },
        },
    ]);
    res.json({ averagePrice: averagePrice[0].averagePrice });
} catch (err) {
    res.status(500).json({ error: err.message });
}
});



app.get('/api/sales/revenue-by-month', async (req, res) => {
    try {
        const revenueByMonth = await Sales.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' },
                    },
                    totalRevenue: { $sum: { $multiply: ['$quantity', '$price'] } },
                },
            },
        ]);
        res.json(revenueByMonth);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/api/sales/highest-quantity-sold', async (req, res) => {
    try {
        const highestQuantitySold = await Sales.aggregate([
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
    res.json(highestQuantitySold[0]);
} catch (err) {
    res.status(500).json({ error: err.message });
}
});



// Assuming you have a collection named 'employees' with department and salary fields
app.get('/api/sales/department-salary-expense', async (req, res) => {
    try {
        const departmentSalaryExpense = await Employees.aggregate([
            {
                $group: {
                    _id: '$department',
                    totalSalaryExpense: { $sum: '$salary' },
          },
        },
    ]);
    res.json(departmentSalaryExpense);
} catch (err) {
    res.status(500).json({ error: err.message });
}
});




module.exports = router; // Export the router




