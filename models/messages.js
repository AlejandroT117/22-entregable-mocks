const path = require('path')
const fs = require('fs').promises
const mongoose = require("mongoose");

class Cont_Mensajes{
  constructor(){
    const schema = new mongoose.Schema(
      {
        email: {type: String},
        mensaje: {type: String},
        fecha: {type:String}
      }
    )

    
    //modelo: representaciön en js
    this.model = mongoose.model("mensaje", schema);
  }

  async save(new_object){
    try{      
      const result = await this.model.create(new_object);

      return result[0]
    }catch(e){
      console.log(`Error creando producto: ${e}`);
    }

  }

  async getById(id){
    try{
      const obj = await this.model.findOne({ _id: id });

      if(!obj){
        return null
      }

      return obj
    }catch(e){
      console.log(`Error en get by id: ${e}`);
    }
  }

  async loadData(){
    try{  
      const raw = await fs.readFile(path.join(__dirname,this.filename), 'utf-8')
      const mensajes = JSON.parse(raw)
      let i = 0;
      for(const m of mensajes){
        console.log(m)
        await this.model.create(m);
        i++;
      }
  
      console.log('data cargada a db')
      return i;
    }catch(e){
      console.log(`Error cargando datos: ${e}`);
      throw e;
    }
  }

  async getAll() {
    try{
      const data = await this.model.find();
      console.log(`No. de mensajes: ${data.length}`);

      return data
    }catch(e){
      console.log(e)
    }
  }

  async uptadeById(id, mensaje){
    try{
      const msg = await this.model.updateOne(
          { _id: id },
          { $set: { ...mensaje } }
        );
    return msg
    }catch(e){
      console.log(e);
    }

  }

  async deleteById(id){
    try{
      const borrado = await this.model.deleteOne({ _id: id });
      return borrado;
    }catch(e){  
      console.log(`Error en borrado por id ${e}`);
    }
  }

  async deleteAll(){
    try{
      const producto = await this.model.deleteMany({});
      console.log('nueva tabla vacía creada')
      return producto;

    }catch(e){
      console.log(`Error borrando todos los productos ${e}`);
    }
  }

}


module.exports = new Cont_Mensajes()