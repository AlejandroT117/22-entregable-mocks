const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")

class UserModel {
  constructor() {
    const schema = new Schema({
      email: String,
      firstname: String,
      lastname: String,
      password: String
    })

    this.model = model("user", schema)
  }

  // guardar usuario
  async save(obj) {
    obj.password = await bcrypt.hash(obj.password, 10)
    return await this.model.create(obj)
  }

  // existe por email

  existsByEmail(email) {
    return this.model.exists({ email })
  }

  async getById(id) {
    return await this.model.findById(id)
  }


  // obtener un usuario por email
  async getByEmail(email) {
    const user = await this.model.findOne({ email })

    return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      name: `${user.firstname} ${user.lastname}`,
      email: user.email
    }
  }

  // checa que las passwords coincidan
  async isPasswordValid(email, pwd) {
    const user = await this.model.findOne({ email })

    return await bcrypt.compare(pwd, user.password)
  }

  findOrCreateByEmail(email, user, done){
    this.model.findOneAndUpdate({ email }, user, {upsert: true, new: true}, (err, createdUser)=>{
      done(err, {
        id:createdUser._id.toString(),
        email: createdUser.email,
        firstname: createdUser.firstname,
        lastname: createdUser.firstname,
      })
    })
  }

}

module.exports = new UserModel()