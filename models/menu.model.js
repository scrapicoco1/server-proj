const DB = require('../utils/db');

class MenuModel {
    name;
    price;

    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    //פעולות נוספות

    //הוספה 
    static async AddMenuItem(newItem) {
        try {
          const result = await new DB().Insert('Menu', newItem);
          return result;
        } catch (error) {
          console.error('Error adding menu item:', error);
          throw error;
        }
      }
      
    //עריכה
    static async EditMenuItem(itemId, updatedData) {
        try {
          const result = await new DB().Update('Menu', { _id: itemId }, updatedData);
          return result;
        } catch (error) {
          console.error('Error editing menu item:', error);
          throw error;
        }
      }
      
    //מחיקה
     static async DeleteMenuItem(itemId) {
        return await new DB().Delete('Menu', { _id: itemId });
      }
      
    //שליפה
    static async GetAllItems() {
        console.log(2);
        return await new DB().FindAll('Menu');
    }

    static async FindByPrice(max_price) {
        let query = { price: { $lte: max_price } };
        return await new DB().FindAll('Menu', query);
    }

    static async UpdateItemPrice(id, doc) {
        return await new DB().UpdateById('Menu', id, doc);
    }


}

module.exports = MenuModel;