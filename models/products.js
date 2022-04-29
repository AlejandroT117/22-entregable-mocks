const mongoose = require("mongoose");
const fs = require("fs").promises;
const path = require("path");
/* logger */
const logger = require('../log')

class Contenedor {
  constructor() {
    const schema = new mongoose.Schema(
      {
        nombre: { type: String, default: "Sin nombre" },
        descripcion: { type: String, default: "Sin descripción" },
        descuento: { type: Number, default: 0 },
        codigo: {
          type: String,
          unique: true,
          required: [true, "Se requiere codigo"],
        },
        img: String,
        precio: Number,
        stock: { type: Number, default: 0 },
      },
      { timestamps: true }
    );

    //modelo: representaciön en js
    this.model = mongoose.model("product", schema);
  }

  async loadData(filename) {
    try {
      const raw = await fs.readFile(path.join(__dirname, filename), "utf-8");
      const productos = JSON.parse(raw);
      let i = 0;
      for (const p of productos) {
        await this.model.create(p);
        i++;
      }

      logger.log("data cargada en db");
      return i;
    } catch (e) {
      logger.error(`Error cargando datos: ${e}`);
    }
  }

  async save(new_object) {
    try {
      const producto = await this.model.create(new_object);
      logger.log(`Nuevo producto: ${JSON.stringify(producto, null, 2)}`);

      return producto;
    } catch (e) {
      logger.error(`Error creando producto: ${e}`);
      return e;
    }
  }

  async getById(id) {
    try {
      const producto = await this.model.findOne({ _id: id });

      if (!producto) {
        return null;
      }

      return producto;
    } catch (e) {
      logger.error(`Error en get by id: ${e}`);
    }
  }

  async editById(id, new_object) {
    try {
      const producto = await this.model.updateOne(
        { _id: id },
        { $set: { ...new_object } }
      );

      return producto;
    } catch (e) {
      logger.error(e);
    }
  }

  async getAll(orderBy = "", search = "") {
    try {
      let productos = [];
      let find = search ? { nombre: { $regex: search, $options: "i" } } : {};
      if (orderBy) {
        const SORT = {};
        SORT[orderBy] = 1;
        productos = await this.model.find(find).sort(SORT);
      } else {
        productos = await this.model.find(find);
      }
      logger.info(`No. de productos: ${productos.length}`);

      return productos.map((p) => {
        return {
          id: p["_id"],
          nombre: p.nombre,
          descripcion: p.descripcion,
          codigo: p.codigo,
          img: p.img,
          precio: p.precio,
        };
      });
    } catch (e) {
      logger.error(`Error en get all ${e}`);
    }
  }

  async deleteById(id) {
    try {
      const borrado = await this.model.deleteOne({ _id: id });
      return borrado;
    } catch (e) {
      logger.error(`Error en borrado por id ${e}`);
    }
  }

  async deleteAll() {
    try {
      const producto = await this.model.deleteMany({});
      return producto;
    } catch (e) {
      logger.error(`Error borrando todos los productos ${e}`);
    }
  }
}

module.exports = new Contenedor();
