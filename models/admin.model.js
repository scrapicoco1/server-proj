const DB = require('../utils/db');
const bcrypt = require('bcrypt');
const { users } = require('../utils/mockdata');

class AdminModel {

  email;
  password;

  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  static async insertDefaultAdmin() {
    let email = 'admin@admin.com';
    let pass = "Admin@T##23"
    const found = await new DB().FindOne("Admins", { email: email });
    if (found)
      return found;
    const res = await new DB().Insert("Admins", { email: email, password: await bcrypt.hash(pass, 10) })
    return res;
  }

  static async Login(email, password) {
    let query = { email: email.toLowerCase() }
    let user = await new DB().FindOne("Admins", query);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return null;
    return {
      acknowledged: true,
      user: {
        _id: user._id,
        email: user.email
      }
    };
  }


  static async ChangePassword(email, password, newPassword) {
    try {
      let query = { email: email }
      let user = await new DB().FindOne("Admins", query);

      if (!user || !(await bcrypt.compare(password, user.password)))
        return null;

      const result = await new DB().UpdateOne("Admins", query, { password: await bcrypt.hash(newPassword, 10) });

      return result;
    }

    catch (err) {
      console.log(err);
    }

  }

}

module.exports = AdminModel;