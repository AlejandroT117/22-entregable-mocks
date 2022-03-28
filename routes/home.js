const { Router } = require('express')

const productos = require('../models/products')

const router = Router()

/* GET DATA */


router.get('/', async (req, res)=>{

  res.render('main')
})


router.get('/:id', async(req, res)=>{
  const {id} = req.params

  const producto= await productos.getById(id)
  console.log(producto)

  res.render('unique', {
    nombre: producto.nombre,
    precio: producto.precio,
    img: producto.img,
    descuento: producto.descuento
  })
})



module.exports = router