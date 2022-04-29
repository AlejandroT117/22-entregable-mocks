const tbodyTable = document.getElementById('tbody')

//Producto
const nombreInput = document.getElementById('nombre')
const precioInput = document.getElementById('precio')
const urlInput = document.getElementById('img')
const stockInput = document.getElementById('stock')
const codigoInput = document.getElementById('codigo')
const submitBtn = document.getElementById('submit-product')
const form = document.getElementById('form-new-product')

//Mensaje
const emailInput = document.getElementById('email-msg')
const nombreMsgInput = document.getElementById('nombre-msg')
const apellidoMsgInput = document.getElementById('apellido-msg')
const edadMsgInput = document.getElementById('edad-msg')
const aliasMsgInput = document.getElementById('alias-msg')
const avatarMsgInput = document.getElementById('img-avatar')

const mensajeInput = document.getElementById('mensaje')
const mesForm = document.getElementById('mensajes-form')

const macroCard = document.getElementById('macro-card')

const compressionSpan = document.getElementById('compression')

const user = {}
//iniciar socket i
user.socket = io()


//deploy products on data.json
user.socket.on('producto', renderProduct)

function renderProduct(p) {
  //console.log(p)
  const trEl = document.createElement('tr')
  //nombre
  const thNombre = document.createElement('th')
  thNombre.innerHTML = p.nombre
  //precio
  const thPrecio = document.createElement('td')
  thPrecio.innerHTML = p.precio
  //img
  const thImg = document.createElement('td')
  const thUrlImg = document.createElement('img')
  thUrlImg.src=p.img
  thImg.appendChild(thUrlImg)

  trEl.appendChild(thNombre)
  trEl.appendChild(thPrecio)
  trEl.appendChild(thImg)

  tbodyTable.appendChild(trEl)
  
  window.scrollTo(0,document.body.scrollHeight);

}

form.addEventListener('submit', (e)=>{
  e.preventDefault()

  const new_product = {
    nombre:nombreInput.value, 
    precio:precioInput.value,
    img:urlInput.value,
    stock: stockInput.value,
    codigo: codigoInput.value
  }

  nombreInput.value = null
  precioInput.value= null
  urlInput.value= null
  stockInput.value= null
  codigoInput.value = null

  user.socket.emit('new_product', new_product)
})

/* Mensajes */


user.socket.on('mensaje', renderMensaje)

function renderMensaje(m) {
  //body Div
  const bodyDiv = document.createElement('div')
  bodyDiv.classList.add('card-body')
  //avatar 
  const avatarDiv = document.createElement('img')
  avatarDiv.classList.add('rounded-circle')
  avatarDiv.style.width = '30px'
  avatarDiv.src = m.avatar
  //title
  const titleDiv = document.createElement('h5')
  titleDiv.classList.add('card-title')
  titleDiv.innerHTML = `${m.email} - ${m.fecha}`
  titleDiv.style.display = 'inline-block'
  //message
  const pDiv = document.createElement('p')
  pDiv.classList.add('card-text')
  pDiv.innerHTML = m.mensaje
  
  bodyDiv.appendChild(avatarDiv)
  bodyDiv.appendChild(titleDiv)
  bodyDiv.appendChild(pDiv)

  macroCard.appendChild(bodyDiv)

}

mesForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  const new_message = {
    author:{
      email: emailInput.value,
      nombre: nombreMsgInput.value,
      apellido: apellidoMsgInput.value,
      edad: edadMsgInput.value,
      alias: aliasMsgInput.value,
      avatar: avatarMsgInput.value,
    },
    mensaje: mensajeInput.value,
    fecha: moment().format('DD/MM/YYYY HH:mm:ss'),
  }
  emailInput.value = null
  nombreMsgInput.value = null
  apellidoMsgInput.value = null
  edadMsgInput.value = null
  aliasMsgInput.value = null
  avatarMsgInput.value = null
  mensajeInput.value = null

  user.socket.emit('new_message', new_message)
})

user.socket.on('normalizeMsgs', renderNormalize)

function renderNormalize (normalizedData){
  console.log(normalizedData)
  /* Normalizr para mensajes*/
  const author = new normalizr.schema.Entity("authors", {}, { idAttribute: "email" });
  const post = new normalizr.schema.Entity(
    "posts",
    {
      author: author,
    },
    { idAttribute: "_id" }
  );

  const blogSchema = new normalizr.schema.Entity("blogs", {
    posts: [post],
  });

  //
  const denormalizedData = normalizr.denormalize('62425b5256ca08ed3fde8b05', post, normalizedData.entities)

  console.log(denormalizedData)
}

user.socket.on('calculation', renderLengths)

function renderLengths(lengths) {
  const percentage= Math.floor(lengths.normalized/lengths.denormalized*100)

 compressionSpan.innerHTML  = percentage
}