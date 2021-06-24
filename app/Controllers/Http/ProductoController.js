'use strict'

const Database = use('Database')
const moment = require('moment')

class ProductoController {

  async insertarProducto({request, params, response}) {
    try {
      let codigointerno = request.input('codigointerno')
      let codigobarra = request.input('codigobarra')
      let pvp1 = request.input('pvp1')
      let pvp2 = request.input('pvp2')
      let ucosto = request.input('ucosto')
      let existencia = 0
      let descripcion = request.input('descripcion')
      let codmarca = request.input('codmarca')
      let tieneiva = request.input('tieneiva')
      let recargariva = request.input('recargariva')
      let tieneice = request.input('tieneice')
      let recargarice = request.input('recargarice')
      let porcentajeice = request.input('porcentajeice')
      let exis_minima = request.input('exis_minima')
      let exis_maxima = request.input('exis_maxima')
      /* let fechaucompra = request.input('fechaucompra')
      let fechauventa = request.input('fechauventa')  */
      let codmedida = request.input('codmedida')
      let idcategoria = request.input('idcategoria')
      let estado = request.input('estado')
      /* let fechainventario = request.input('fechainventario')
      let inventariado = request.input('inventariado') */
      let fechamod = moment().format('YYYY-MM-DD')
      let multiplos = request.input('multiplos')
      let nota = request.input('nota')
      let costopromedio = request.input('costopromedio')
      let esservicio = request.input('esservicio')
      let peso = request.input('peso')
      let volumen = request.input('volumen')
      let area = request.input('area')
      let dimlargo = request.input('dimlargo')
      let dimalto = request.input('dimalto')
      let dimancho = request.input('dimancho')
      let espadre = request.input('espadre')
      let eshijode = request.input('eshijode')
      let factorconversion = request.input('factorconversion')
      let escompuesto = request.input('escompuesto')
      let usaetiqueta = request.input('usaetiqueta')
      let imagen = request.input('imagen')
      let diasxllegarproducto = request.input('diasxllegarproducto')
      let produccionxfacturar = request.input('produccionxfacturar')
      let resultado = []

      //for await (const x of data) {

      const existe = await Database.raw("select id, codigointerno from public.producto where estado and codigointerno='" + codigointerno + "' ")

      if (existe.rows.length >= 1) {

        return response.status(200).send({
          message: 'Ya existe un producto con el código indicado'
        })


      } else {

        const producto = await Database.raw("insert into public.producto (codigointerno, codigobarra, pvp1, pvp2, ucosto, descripcion, codmarca, tieneiva, recargariva, tieneice, recargarice, porcentajeice, codmedida, idcategoria, estado, multiplos, nota, costopromedio, esservicio, peso, volumen, area, dimlargo, dimalto, dimancho, espadre, eshijode, factorconversion, escompuesto, usaetiqueta, imagen, diasxllegarproducto, produccionxfacturar, existencia, exis_minima, exis_maxima, fechamod  ) values('" + codigointerno + "', '" + codigobarra + "', '" + pvp1 + "', '" + pvp2 + "', '" + ucosto + "', '" + descripcion + "', '" + codmarca + "', '" + tieneiva + "', '" + recargariva + "', " + tieneice + ", " + recargarice + ", " + porcentajeice + ", '" + codmedida + "', " + idcategoria + ", " + estado + ", " + multiplos + ", '" + nota + "', '" + costopromedio + "', '" + esservicio + "', '" + peso + "', '" + volumen + "', '" + area + "', '" + dimlargo + "', '" + dimalto + "', '" + dimancho + "', '" + espadre + "', '" + eshijode + "', '" + factorconversion + "', '" + escompuesto + "', '" + usaetiqueta + "', '" + imagen + "', '" + diasxllegarproducto + "', '" + produccionxfacturar + "', '"+ existencia +"', '"+ exis_minima +"', '"+ exis_maxima +"', '"+ fechamod +"') returning id, trim(descripcion), trim(codigointerno), trim(codigobarra), trim(nota), trim(eshijode) ")


        return response.status(200).send({
          message: 'Se ha registrado el producto correctamente',
          status: true,
          producto: producto.rows
        })



      }

      // }          

    } catch (error) {
      console.log("error: ", error);
      return error

    }
  }

  async consultarProductoFiltro({params, response}) {
    try {

      let codigo = params.codigo

      const producto = await Database.raw("select id, trim(codigointerno), trim(codigobarra), pvp1, pvp2, ucosto, trim(descripcion) from public.producto where codigointerno='" + codigo + "' ")

      return response.status(200).send({
        producto: producto.rows
      })

    } catch (error) {
      return error
    }
  }

  async consultarProducto({response}) {
    try {
      const producto = await Database.raw("select * from public.producto")
      return response.status(200).send({
        producto: producto.rows
      })

    } catch (error) {
      return error
    }
  }

  async eliminarProducto({params, response}) {
    let codigo = params.codigo
    try {
      const existe = await Database.raw("select id, codigointerno from public.producto where codigointerno='" + codigo + "' ")
      if (existe.rows.length > 1) {
        const producto = await Database.raw("update public.producto set estado = false where codigointerno = '" + codigo + "'")

        return response.status(200).send({
          message: 'Se ha eliminado el producto correctamente',
          status: true,
          producto: producto.rows
        })

      } else {
        return response.status(200).send({
          message: 'No existe el producto a eliminar',
          status: false
        })
      }
    } catch (error) {
      console.log("error: ", error);
      return error
    }
  }

  async modificarProducto({request, params, response}) {
    try {
      let idproducto = params.idproducto
      let codigointerno = request.input('codigointerno')
      let codigobarra = request.input('codigobarra')
      let pvp1 = request.input('pvp1')
      let pvp2 = request.input('pvp2')
      let ucosto = request.input('ucosto')
      /*  let existencia = request.input('existencia') */
      let descripcion = request.input('descripcion')
      let codmarca = request.input('codmarca')
      let tieneiva = request.input('tieneiva')
      let recargariva = request.input('recargariva')
      let tieneice = request.input('tieneice')
      let recargarice = request.input('recargarice')
      let porcentajeice = request.input('porcentajeice')
      let exis_minima = request.input('exis_minima')
      let exis_maxima = request.input('exis_maxima') 
      /* let fechaucompra = request.input('fechaucompra')
      let fechauventa = request.input('fechauventa')  */
      let codmedida = request.input('codmedida')
      let idcategoria = request.input('idcategoria')
      let estado = request.input('estado')
      /* let fechainventario = request.input('fechainventario')
      let inventariado = request.input('inventariado') */
      let fechamod = request.input('fechamod')
      let multiplos = request.input('multiplos')
      let nota = request.input('nota')
      let costopromedio = request.input('costopromedio')
      let esservicio = request.input('esservicio')
      let peso = request.input('peso')
      let volumen = request.input('volumen')
      let area = request.input('area')
      let dimlargo = request.input('dimlargo')
      let dimalto = request.input('dimalto')
      let dimancho = request.input('dimancho')
      let espadre = request.input('espadre')
      let eshijode = request.input('eshijode')
      let factorconversion = request.input('factorconversion')
      let escompuesto = request.input('escompuesto')
      let usaetiqueta = request.input('usaetiqueta')
      let imagen = request.input('imagen')
      let diasxllegarproducto = request.input('diasxllegarproducto')
      let produccionxfacturar = request.input('produccionxfacturar')

      const producto = await Database.raw("update public.producto set codigointerno ='" + codigointerno + "', codigobarra = '" + codigobarra + "', pvp1 = '" + pvp1 + "', pvp2 = '" + pvp2 + "', ucosto = '" + ucosto + "', descripcion = '" + descripcion + "', codmarca = '" + codmarca + "', tieneiva = '" + tieneiva + "', recargariva = '" + recargariva + "', tieneice = '" + tieneice + "', recargarice = '" + recargarice + "', porcentajeice = '" + porcentajeice + "', codmedida = '" + codmedida + "', idcategoria = '" + idcategoria + "', estado = '" + estado + "', multiplos = '" + multiplos + "', nota = '" + nota + "', costopromedio = '" + costopromedio + "', esservicio = '" + esservicio + "', peso = '" + peso + "', volumen = '" + volumen + "', area = '" + area + "', dimlargo = '" + dimlargo + "', dimalto = '" + dimalto + "', dimancho = '" + dimancho + "', espadre = '" + espadre + "', eshijode = '" + eshijode + "', factorconversion = '" + factorconversion + "', escompuesto = '" + escompuesto + "', usaetiqueta = '" + usaetiqueta + "', imagen = '" + imagen + "', diasxllegarproducto = '" + diasxllegarproducto + "', produccionxfacturar = '" + produccionxfacturar + "' where id = '" + idproducto + "'")
      return response.status(200).send({
        producto: producto.rows
      })
    } catch (error) {
      return error
    }
  }

}

module.exports = ProductoController
