'use strict'

const Database = use('Database')
const moment = require('moment')

class ProveedorController {

  async insertarProveedor({ request, response }) {
    try {

      let nombre = request.input('nombre')
      let ci_ruc = request.input('ci_ruc')
      let direccion = request.input('direccion')
      let telefono = request.input('telefono')
      let contacto = request.input('contacto')
      let nota = request.input('nota')
      let fechaing = moment().format('YYYY-MM-DD')
      let estado = true
      let empresa = request.input('empresa')
      let email = request.input('email')
      let url = request.input('url')
      let hora = moment().format('HH:mm:ss')
      let tipodoc = request.input('tipodoc')

      const existe = await Database.raw("select * from public.proveedores where ci_ruc='" + ci_ruc + "' ")

      if (existe.rows.length >= 1) {

        return response.status(200).send({
          message: 'Ya existe un proveedor con el documento de identidad indicado',
          status: false
        })


      } else {

        const proveedor = await Database.raw("insert into public.proveedores (nombre, ci_ruc, direccion, telefono, contacto, nota, fechaing, estado, empresa, email, url, hora, tipodoc) values('" + nombre + "', '" + ci_ruc + "', '" + direccion + "', '" + telefono + "', '" + contacto + "', '" + nota + "', '" + fechaing + "', '" + estado + "', '" + empresa + "', '" + email + "', '" + url + "', '" + hora + "', '" + tipodoc + "') returning id, trim(nombre) as nombre, trim(ci_ruc) as ci_ruc, trim(direccion) as direccion, trim(telefono) as telefono, trim(contacto) as contacto, trim(nota) as nota, fechaing, estado, trim(empresa) as empresa, trim(email) as email, trim(url) as url, hora, tipodoc")

        return response.status(200).send({
          message: 'Se ha registrado el proveedor correctamente',
          status: true,
          proveedor: proveedor.rows
        })

      }


    } catch (error) {
      console.log("error: ", error);
      return error

    }
  }

  async modificarProveedor({ request, params, response }) {
    try {
      let idproveedor = params.idproveedor
      let nombre = request.input('nombre')
      let ci_ruc = request.input('ci_ruc')
      let direccion = request.input('direccion')
      let telefono = request.input('telefono')
      let contacto = request.input('contacto')
      let nota = request.input('nota')
      let empresa = request.input('empresa')
      let email = request.input('email')
      let url = request.input('url')
      let tipodoc = request.input('tipodoc')

      const proveedor = await Database.raw("update public.proveedores set nombre = '" + nombre + "', ci_ruc = '" + ci_ruc + "', direccion ='" + direccion + "', telefono = '" + telefono + "', contacto = '" + contacto + "', nota = '" + nota + "', empresa = '" + empresa + "', email = '" + email + "', url ='" + url + "', tipodoc = '" + tipodoc + "' where id = '" + idproveedor + "' returning id, trim(nombre) as nombre, trim(ci_ruc) as ci_ruc, trim(direccion) as direccion, trim(telefono) as telefono, trim(contacto) as contacto, trim(nota) as nota, trim(empresa) as empresa, trim(email) as email, trim(url) as url, hora, tipodoc")

      return response.status(200).send({
        message: 'Se ha modificado el proveedor correctamente',
        proveedor: proveedor.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async consultarProveedor({ response }) {
    try {
      const proveedor = await Database.raw("select id, trim(nombre) as nombre, trim(ci_ruc) as ci_ruc, trim(contacto) as contacto, trim(direccion) as direccion, trim(email) as email, trim(empresa) as empresa, trim(telefono) as telefono, trim(url) as url, nota, tipodoc from public.proveedores where estado = true")
      return response.status(200).send({
        proveedor: proveedor.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  //busca todos los que contienen el filtro, si es solo la coincidencia exacta descomenta la línea comentada y comenta la del like
  async consultarProveedorFiltro({ params, response }) {
    try {

      let ci_ruc = params.ci
      const proveedor = await Database.raw("select * from public.proveedores where ci_ruc like '%" + ci_ruc + "%'")
      //   const proveedor = await Database.raw("select * from public.ctproveedores where ci_ruc = '"+ci_ruc+"'")
      return response.status(200).send({
        proveedor: proveedor.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async consultarProveedorFiltroID({ params, response }) {
    try {
      let idprov = params.idprov
      const proveedor = await Database.raw("select * from public.proveedores where id = '" + idprov + "'")
      return response.status(200).send({
        proveedor: proveedor.rows
      })

    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async eliminarProveedor({ params, response }) {
    try {
      let idproveedor = params.idproveedor
      const existe = await Database.raw("select * from public.proveedores where id='" + idproveedor + "' ")

      if (existe.rows.length > 0) {

        const proveedor = await Database.raw("update public.proveedores set estado = false where id = '" + idproveedor + "'")

        return response.status(200).send({
          message: 'Se ha eliminado el proveedor correctamente',
          proveedor: proveedor.rows,
          status: true
        })

      } else {
        return response.status(200).send({
          message: 'No existe el proveedor a eliminar',
          status: false
        })
      }

    } catch (error) {
      return error
    }
  }

}

module.exports = ProveedorController
