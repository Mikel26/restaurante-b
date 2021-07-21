'use strict'

const Database = use('Database')

class CategoriaController {

  async consultarCategorias({ response }) {
    try {
      const categoria = await Database.raw("select id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion from public.categoria where estado = true")

      return response.status(200).send({
        categorias: categoria.rows
      })

    } catch (error) {
      return error
    }
  }

  async consultarCategoriasFiltro({ response, params }) {
    let idcategoria = params.idcategoria
    try {
      const categoria = await Database.raw("select * from public.categoria where id = '" + idcategoria + "'")

      return response.status(200).send({
        categorias: categoria.rows
      })
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async insertarCategoria({ request, response }) {
    try {
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')
      let estado = true
      const existe = await Database.raw("select id, descripcion from public.categoria where descripcion='" + descripcion + "' ")
      if (existe.rows.length >= 1) {

        return response.status(200).send({
          message: 'Ya existe un categoría con esa abreviación',
          status: false
        })

      } else {
        const categoria = await Database.raw("insert into public.categoria (descripcion, abreviacion, estado) values (trim('" + descripcion + "'), trim('" + abreviacion + "'), '" + estado + "') returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion")
        return response.status(200).send({
          message: 'Se ha registrado la categoría correctamente',
          categoria: categoria.rows,
          status: true
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async modificarCategoria({request, params, response}) {
    try {
      let idcategoria = params.idcategoria
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')

      const categoria = await Database.raw("update public.categoria set descripcion = '" + descripcion + "', abreviacion = '" + abreviacion + "' where id = '" + idcategoria + "' returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion, estado")
      return response.status(200).send({
        message: 'Se ha modificado la categoría correctamente',
        status: true,
        categoria: categoria.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async eliminarCategoria({ params, response }) {
    try {
      let idcategoria = params.idcategoria
      const existe = await Database.raw("select * from public.categoria where id='" + idcategoria + "'")
      if (existe.rows.length > 0) {
        const categoria = await Database.raw("update public.categoria set estado = false where id = '" + idcategoria + "'")

        return response.status(200).send({
          message: 'Se ha eliminado la categoría correctamente',
          status: true,
          categoria: categoria.rows
        })

      } else {
        return response.status(200).send({
          message: 'No existe la categoría a eliminar',
          status: false
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }
}

module.exports = CategoriaController
