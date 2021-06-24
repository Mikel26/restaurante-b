'use strict'

const Database = use('Database')

class MedidaController {

  async consultarMedidas({response}) {
    try {
      const medida = await Database.raw("select * from public.medida")

      return response.status(200).send({
        medidas: medida.rows
      })

    } catch (error) {
      return error
    }
  }

  async consultarMedidaFiltro({params, response}) {
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

  async eliminarMedidaId({params, response}) {
    try {
      let idmedida = params.idmedida

      const medida = await Database.raw("update public.medida set estado = false where id = '" + idmedida + "'returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion")

      return response.status(200).send({
        message: 'Se ha eliminado la medida correctamente',
        medida: medida.rows
      })

    } catch (error) {
      return error
    }
  }

  async insertarMedida({request, response}) {
    try {
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')
      let estado = true
      const existe = await Database.raw("select id, descripcion from public.medida where descripcion='" + descripcion + "' ")
      if (existe.rows.length >= 1) {

        return response.status(200).send({
          message: 'Ya existe un medida con esa descripción'
        })

      } else {
        const medida = await Database.raw("insert into public.medida (descripcion, estado, abreviacion) values (trim('" + descripcion + "'), '" + estado + "', trim('" + abreviacion + "')) returning id, trim(descripcion) as descripcion, trim(abreviacion) as abreviacion")
        return response.status(200).send({
          message: 'Se ha registrado la medida correctamente',
          medida: medida.rows
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async modificarMedida({request, response, params}) {
    try {
      let idmedida = params.idmedida
      let descripcion = request.input('descripcion')
      let abreviacion = request.input('abreviacion')

      const medida = await Database.raw("update public.medida set descripcion = '" + descripcion + "', abreviacion = '" + abreviacion + "' where id = '" + idmedida + "' returning id, trim(descripcion) as descripcion, estado, trim(abreviacion) as abreviacion")
      
      return response.status(200).send({
        message: 'Se ha modificado la medida correctamente',
        medida: medida.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }
}

module.exports = MedidaController
