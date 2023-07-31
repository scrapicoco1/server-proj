const { ObjectId } = require('mongodb');
const DB = require('../utils/db');

class MenuModel {
  name;
  price;
  description;
  image;
  category;
  quantity;

  constructor(name, price, description, image, category, quantity) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.image = image;
    this.category = category;
    this.quantity = quantity;
  }

  static async LoadMenuToDB() {
    const result = await new DB().FindOne('menu');
    // console.log(result, 'Initial menu')
    if (!result) {
      const data = require('./../data/dishes.json');
      for (let i in data) {
        MenuModel.AddMenuItem({
          ...data[i]
        })
      }

    }
  }


  //פעולות נוספות

  //הוספה 
  static async AddMenuItem(newItem) {
    try {
      const result = await new DB().Insert('menu', newItem);
      return result;
    } catch (error) {
      console.error('Error adding menu item:', error);
      throw error;
    }
  }

  //עריכה
  static async EditMenuItem(itemId, updatedData) {
    try {
      const result = await new DB().Update('menu', { _id: itemId }, updatedData);
      return result;
    } catch (error) {
      console.error('Error editing menu item:', error);
      throw error;
    }
  }

  //מחיקה
  static async DeleteMenuItem(itemId) {
    return await new DB().DeleteById('menu', itemId);
  }

  //שליפה
  static async GetAllItems() {
    return await new DB().FindAll('menu');
  }

  static async FindByPrice(max_price) {
    let query = { price: { $lte: max_price } };
    return await new DB().FindAll('menu', query);
  }

  static async FindById(id) {
    let query = { "_id": new ObjectId(id) };
    // console.log('Query', query);
    return await new DB().FindOne('menu', query);
  }

  static async UpdateItem(id) {
    let query = { "_id": new ObjectId(id) };
    // console.log('Query', query);
    return await new DB().FindOne('menu', query);
  }

  static async UpdateItemPrice(id, doc) {
    return await new DB().UpdateById('menu', id, doc);
  }

  static async UpdateItemById(id, doc) {
    let data = { ...doc };
    // console.log(doc,id,'<<< doc')
    delete data._id;
    delete data.id;
    return await new DB().UpdateOne('menu', { _id: new ObjectId(id) }, { ...data });
  }

}

module.exports = MenuModel;