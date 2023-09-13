const totalRevenue = async (req, res) => {
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
  };

  const totalQtyForEachProduct = async (req, res) => {
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
  };


  const retrieveTopFive = async (req, res) => {
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
  };


  const averagePrice = async (req, res) => {
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
  };


  const revenueByMonth = async (req, res) => {
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
  };


  const highestQtySold = async (req, res) => {
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
  };

const departmentSalaryExpense = async (req, res) => {
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
  };

  
