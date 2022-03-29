const {Router} = require('express')
const router = Router()
const faker = require('faker')

router.get('/', async (req,res)=>{
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