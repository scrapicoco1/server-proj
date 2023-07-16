const DB = require('../utils/db');
const bcrypt = require('bcrypt');
const { users } = require('../utils/mockdata');

class UserModel {

    _id;
    username;
    email;
    password;

    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }


    //פעולות נוספות

    //הוספה 
    static async Register(email, password, visaDetails, cardNumber, idCard, cardHolderName, expiryDate, cvv ) {        
        let query = { email: email.toLowerCase() }
        let user = await new DB().FindOne("Users", query);
        if (user && user.email)
            return {message:'Email Already Exists!'};

        this.email = email.toLowerCase();
        this.password = await bcrypt.hash(password, 10);
        this.visaDetails = visaDetails
        this.cardNumber = cardNumber
        this.idCard = idCard
        this.cardHolderName = cardHolderName 
        this.expiryDate = expiryDate
        this.cvv = cvv 
        return await new DB().Insert('Users', { ...this });
    }

    //עריכה
    static async Add(collectionName, document) {
        try {
          const db = new DB();
          const result = await db.InsertOne(collectionName, document);
      
          if (result.insertedCount === 1) {
            console.log('Document added successfully');
            return result.insertedId;
          } else {
            console.log('Failed to add document');
            return null;
          }
        } catch (error) {
          console.error('Error occurred during add:', error);
          throw error;
        }
      }
      
    //מחיקה
    static async Edit(collectionName, query, update) {
        try {
          const db = new DB();
          const result = await db.UpdateOne(collectionName, query, update);
      
          if (result.modifiedCount > 0) {
            console.log('Document updated successfully');
            return result;
          } else {
            console.log('No document found matching the query');
            return null;
          }
        } catch (error) {
          console.error('Error occurred during edit:', error);
          throw error;
        }
      }
      
    //שליפה
    static async Login(email, password) {
        let query = { email: email.toLowerCase() }
        let user = await new DB().FindOne("Users", query);
        if (!user || !(await bcrypt.compare(password, user.password)))
            return null;

        return {
            acknowledged:true,
            user: {
              _id: user._id,
              email: user.email
            }
        };
    }



    // static async FindAllUsers() {
    //     return await new DB().FindAll('users');
    // }

    // static async FindByCity(city) {
    //     let query = { "address.city": city }
    //     return await new DB().FindAll('users', query);
    // }
}

module.exports = UserModel;