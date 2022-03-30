module.exports=(req,res,next)=>{
  req.session.contador?
    req.session.contador= req.session.contador+1:
    req.session.contador=1

  next()
}