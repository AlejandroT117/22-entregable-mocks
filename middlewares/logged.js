module.exports=(req,res, next)=>{
  if(!req.session.user){
    console.log('session expired')
    return res.redirect('/login')
  }
  
  next()
}