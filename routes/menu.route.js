const MenuModel = require('../models/menu.model');

const MenuRoute = require('express').Router();

//Create (using http post)

//Read (using http get)
MenuRoute.get('/', async (req, res) => {
    try {
        console.log(1);
        let data = await MenuModel.GetAllItems();
        console.log(5, data)
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});

MenuRoute.get('/:max_price', async (req, res) => {
    try {
        let { max_price } = req.params;
        let data = await MenuModel.FindByPrice(Number(max_price));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update (using http put)
MenuRoute.put('/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let { price } = req.body;
        
        let data = await MenuModel.UpdateItemPrice(id, { price });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});


//Delete (using http delete)
MenuRoute.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await MenuModel.DeleteItem(id);
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
  
      res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  



module.exports = MenuRoute;