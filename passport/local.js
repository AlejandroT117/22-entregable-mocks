const LocalStrategy = require('passport-local').Strategy
const userModel = require('../models/user')
/* logger */
const logger = require('../log')

module.exports = (passport) =>{
  const authenticateUser = async (email, password, done)=>{
    try{
      if(!await userModel.existsByEmail(email)){
        return done(null, false, { message: 'El usuario no existe'})
      }

      if(!await userModel.isPasswordValid(email, password)){
        return done(null, false, { message: 'Constraseña incorrecta'})
      }

      const user = await userModel.getByEmail(email)

      done(null, user)
    }catch(e){
      done(e)
    }
  }

  const registerUser = async (req, email, password, done)=>{
    const {firstname, lastname} = req.body
    try{
      if(await userModel.existsByEmail(email)){
        return done(null, false, {message: 'El usuario ya existe'})
      }

      const user = await userModel.save({
        email, 
        firstname, 
        lastname, 
        password
      })
      done(null, {
        ...user,
        id: user._id
      })
    }catch(e){
      done(e)
    }
  }

  passport.use('login', new LocalStrategy({usernameField: 'email', passwordField: 'pwd'}, authenticateUser))
  passport.use('register', new LocalStrategy({usernameField: 'email', passwordField: 'pwd', passReqToCallback: true}, registerUser))

  passport.serializeUser((user, done)=> done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.getById(id);
    logger.log(`Acceso a id: ${id}`)
    done(null, {
      id: user._id.toString(),
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    })
  })


}