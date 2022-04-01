const {Router} = require('express')
const router = Router()
const faker = require('faker')

const counter = require("../middlewares/counter");
const isLogged = require("../middlewares/logged");

router.get('/', counter,isLogged,  async (req,res)=>{
  let lista = []
    for (let i = 0; i < 5; i++) {
      const producto={
        nombre: faker.commerce.productName(),
        precio: faker.commerce.price(),
        img: faker.image.image()
      };
      lista.push(producto)
    }

  res.render('list', {lista})

})


module.exports = router