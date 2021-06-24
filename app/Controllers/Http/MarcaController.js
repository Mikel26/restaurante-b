'use strict'

const Database = use('Database')

class MarcaController {

  async consultarMarcas({response}) {
    try {
      const marca = await Database.raw("select * from public.marca")

      return response.status(200).send({
        marcas: marca.rows
      })

    } catch (error) {
      return error
    }
  }

  async insertarMarca({request, response}) {
    try {
      let descripcion = request.input('descripcion')
      let estado = true
      const existe = await Database.raw("select id, descripcion from public.marca where estado and descripcion='" + descripcion + "' ")
      if (existe.rows.length > 0) {
        return response.status(200).send({
          message: 'Ya existe una marca con esa descripción'
        })
      } else {
        const marca = await Database.raw("insert into public.marca (descripcion, estado) values ('" + descripcion + "', '" + estado + "') returning id, trim(descripcion)")
        return response.status(200).send({
          message: 'Se ha registrado la marca correctamente',
          marca: marca.rows
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async modificarMarca({request, response, params}) {
    try {
      let idmarca = params.idmarca
      let descripcion = request.input('descripcion')

      const marca = await Database.raw("update public.marca set descripcion = '" + descripcion + "' where id = '" + idmarca + "' returning id, trim(descripcion) as descripcion, estado")
      return response.status(200).send({
        message: 'Se ha modificado la marca correctamente',
        marca: marca.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async consultarMarcaFiltro({params, response}) {
    try {
      let descripcion = params.descripcion
      const marca = await Database.raw("select * from public.marca where descripcion like '%" + descripcion + "%'")
      return response.status(200).send({
        marca: marca.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async eliminarMarca({params, response}) {
    try {
      let idmarca = params.idmarca
      const existe = await Database.raw("select * from public.marca where id='"+idmarca+"'")
      if (existe.rows.length > 0) {
        const marca = await Database.raw("update public.marca set estado = false where id = '" + idmarca + "'")
  
        return response.status(200).send({
          message: 'Se ha eliminado la marca correctamente',
          marca: marca.rows
        })
      } else {
        return response.status(200).send({
          message: 'No existe la marca a eliminar',
          status: false
        })
      }

    } catch (error) {
      return error
    }
  }

}

module.exports = MarcaController
