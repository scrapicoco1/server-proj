const MenuModel = require('../models/menu.model');

const MenuRoute = require('express').Router();

//Create (using http post)
MenuRoute.post('/', async (req, res) => {
    try {
      const { name, description, price, image, category } = req.body;
  
      // Validate the required fields
      if (!name || !description || !price || !image || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newItem = {
        name,
        description,
        price,
        image,
        category,
        quantity: 0
      };
  
      const createdItem = await MenuModel.CreateItem(newItem);
  
      res.status(201).json(createdItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
//Read (using http get)
MenuRoute.get('/', async (req, res) => {
    try {
        let data = await MenuModel.GetAllItems();
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