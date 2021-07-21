'use strict'

const Database = use('Database')

class MedidaController {

  async consultarMedidas({ response }) {
    try {
      const medida = await Database.raw("select id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion from public.medida where estado = true")

      return response.status(200).send({
        medidas: medida.rows
      })

    } catch (error) {
      return error
    }
  }

  async consultarMedidaFiltro({ params, response }) {
    try {
      let descripcion = params.descripcion
      const medida = await Database.raw("select * from public.medida where descripcion = '" + descripcion + "'")
      return response.status(200).send({
        medida: medida.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async consultarMedidaId({ params, response }) {
    try {
      let codmedida = params.codmedida
      const medida = await Database.raw("select * from public.medida where id = '" + codmedida + "'")
      return response.status(200).send({
        medida: medida.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async eliminarMedida({ params, response }) {
    try {
      let idmedida = params.idmedida

      const existe = await Database.raw("select * from public.marca where id='" + idmedida + "'")

      if (existe.rows.length > 0) {
        const medida = await Database.raw("update public.medida set estado = false where id = '" + idmedida + "'returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion")

        return response.status(200).send({
          message: 'Se ha eliminado la medida correctamente',
          status: true,
          medida: medida.rows
        })
      } else {
        return response.status(200).send({
          message: 'No existe la medida a eliminar',
          status: false
        })
      }

    } catch (error) {
      return error
    }
  }

  async insertarMedida({ request, response }) {
    try {
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')
      let estado = true
      const existe = await Database.raw("select id, descripcion from public.medida where descripcion='" + descripcion + "' ")
      if (existe.rows.length >= 1) {

        return response.status(200).send({
          message: 'Ya existe un medida con esa descripción',
          status: false
        })

      } else {
        const medida = await Database.raw("insert into public.medida (descripcion, estado, abreviacion) values (trim('" + descripcion + "'), '" + estado + "', trim('" + abreviacion + "')) returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion")
        return response.status(200).send({
          message: 'Se ha registrado la medida correctamente',
          medida: medida.rows,
          status: true
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async modificarMedida({ request, response, params }) {
    try {
      let idmedida = params.idmedida
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')

      const medida = await Database.raw("update public.medida set descripcion = '" + descripcion + "', abreviacion = '" + abreviacion + "' where id = '" + idmedida + "' returning id, trim(descripcion) as descripcion, estado, trim(abreviacion) as abreviacion")

      return response.status(200).send({
        message: 'Se ha modificado la medida correctamente',
        status: true,
        medida: medida.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }
}

module.exports = MedidaController
