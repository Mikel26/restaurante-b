'use strict'

const moment = require('moment')
const Database = use('Database')

class CompraController {
    async consultarCompra({request, params, response}){
        try {
            const compras = await Database.raw("select * from public.compras where estado = true")
            return response.status(200).send({compras: compras.rows})
        } catch (error) {
            console.log("error: ", error);
            return error
        }
    }

    async consultarCompraId({request, params, response}){
        try {
            let idcompra = params.idcompra
            var cabecera = await Database.raw("select * from public.compras where id = '"+idcompra+"'")
            var detalles = await Database.raw("select * from public.detacompra where idipedido = '"+idcompra+"'")
            return response.status(200).send({cabecera: cabecera.rows, detalles: detalles.rows})
        } catch (error) {
            console.log("error: ", error);
            return error
        }
    }

    async insertarCompra({request, params, response}){
        try {
            var listadetalles = []
            let cabecera = request.input('cabecera')            
            let detalle = request.input('detalle')
            let idprovee = cabecera.idprovee
            let fecha = moment().format('YYYY-MM-DD')
            let nota = cabecera.nota
            let usuario = cabecera.usuario
            let formapago = cabecera.formapago
            let total = cabecera.total
            let idusuario = cabecera.idusuario
            let descuento = cabecera.descuento
            let idopedido = cabecera.idopedido
            let idpreimp = cabecera.idpreimp
            let estado = true
            let hora = moment().format('HH:mm:ss')
            let tienefactura = cabecera.tienefactura
            let serie1 = cabecera.serie1
            let serie2 = cabecera.serie2
            let autori = cabecera.autori
            let ivavigente = cabecera.ivavigente
            let idusuariomodi = cabecera.idusuariomodi
            let tipodcosri = cabecera.tipodcosri

            const compras = await Database.raw("insert into public.compras (idprovee, fecha, nota, usuario, formapago, total, idusuario, descuento, idopedido, idpreimp, estado, hora, tienefactura, serie1, serie2, autori, ivavigente, idusuariomodi, tipodcosri) values('"+idprovee+"', '"+fecha+"', '"+nota+"', '"+usuario+"', '"+formapago+"', '"+total+"', '"+idusuario+"', '"+descuento+"', '"+idopedido+"', '"+idpreimp+"', '"+estado+"', '"+hora+"', '"+tienefactura+"', '"+serie1+"', '"+serie2+"', '"+autori+"', '"+ivavigente+"', '"+idusuariomodi+"', '"+tipodcosri+"') returning id, idprovee,fecha, trim(nota) as nota, formapago, trim(usuario) as usuario, total, idusuario, descuento, idopedido, idpreimp, estado, hora, tienefactura , serie1, serie2, trim(autori) as autori, ivavigente, idusuariomodi, tipodcosri ")
            
            let idipedido = compras.rows[0].id

            console.log("reg compra: ", compras.rows);  
            console.log("id actual: ", idipedido);

            for (let deta of detalle){
                console.log("detalle iteracion: ", deta);
                let cantidad = deta.cantidad
                let pvp = deta.pvp
                let gravariva = deta.gravariva
                let idproducto = deta.idproducto
                let codmedida = deta.codmedida
                let cantdevuelta = deta.cantdevuelta
                let cantrecibida = deta.cantrecibida
                let descuentodetalle = deta.descuento
                let pvpproveedor = deta.pvpproveedor
                let cantidadproveedor = deta.cantidadproveedor
                let nlote = deta.nlote

                var producto = await Database.raw("select * from public.producto where id = "+idproducto+"")
                console.log("producto reg: ", producto.rows);
                if(producto.rows[0].existencia <= 0){
                    //existencia es = 0
                    let prodexistencia = cantrecibida
                    let costopromedio = pvpproveedor
                    let ucosto = costopromedio
                    //asignar existencia del producto a cantidad recibida, costo promedio el pvpproveedor, el ucosto igual al costo promedio
                    //insertar el detacompra con el costopromedio = pvpproveedor y luego actualizar el producto
                    var detacompra = await Database.raw("insert into public.detacompra (idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio) values ('"+idipedido+"', '"+cantidad+"', '"+pvp+"', '"+gravariva+"', '"+idproducto+"', '"+codmedida+"', '"+cantdevuelta+"', '"+cantrecibida+"', '"+descuentodetalle+"', '"+pvpproveedor+"', '"+cantidadproveedor+"', '"+nlote+"', '"+costopromedio+"') returning id, idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio")

                    listadetalles.push(detacompra.rows[0])

                    var productoactualizado = await Database.raw("update public.producto set existencia = '"+prodexistencia+"', costopromedio = '"+costopromedio+"', ucosto = '"+ucosto+"' where id = '"+idproducto+"' returning id, codigointerno, existencia, costopromedio, ucosto")
                    console.log("productos afectados: ", productoactualizado.rows);
                    
                }else{

                    let prodexistencia = producto.rows[0].existencia
                    let prodcostopromedio = producto.rows[0].costopromedio
                    let valortotalpromedio = prodexistencia * prodcostopromedio
                    let valorcompratotal = cantidad * pvpproveedor //es la cantidad por el costo de compra, puede que sea el pvp
                    let nuevaexistencias = prodexistencia + cantrecibida //esta nueva existencia se actualiza al producto
                    valortotalpromedio = valortotalpromedio + valorcompratotal
                    let costopromedio = valortotalpromedio/nuevaexistencias //este nuevo costopromedio se actualiza al producto
                    
                    //ingresar esto a detacompra y actualizar el producto con los dos nuevos campos
                    var detacompra = await Database.raw("insert into public.detacompra (idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio) values ('"+idipedido+"', '"+cantidad+"', '"+pvp+"', '"+gravariva+"', '"+idproducto+"', '"+codmedida+"', '"+cantdevuelta+"', '"+cantrecibida+"', '"+descuentodetalle+"', '"+pvpproveedor+"', '"+cantidadproveedor+"', '"+nlote+"', '"+costopromedio+"') returning id, idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio")
                    
                    listadetalles.push(detacompra.rows[0])
    
                    var productoactualizado = await Database.raw("update public.producto set existencia = '"+nuevaexistencias+"', costopromedio = '"+costopromedio+"' where id = '"+idproducto+"' returning id, codigointerno, existencia, costopromedio")
                    console.log("productos afectados: ", productoactualizado.rows);

                }
            }
            return response.status(200).send({
                message: 'Se ha registrado la compra correctamente', 
                compra: compras.rows, 
                status: true,
                detacompra: listadetalles
            })
                                                                                          
        } catch (error) {
            console.log("error: ", error);
            return error
        }
    }

    async eliminarCompraId({request, params, response}){
        try {
            let idcompra = params.idcompra            
            const compra = await Database.raw("update public.compras set estado = false where id = '"+idcompra+"'")            
            return response.status(200).send({
                compra: compra.rows,
                message: 'Se ha eliminado la compra correctamente',
                status: true
            })

        } catch (error) {
            console.log("error: ", error);
            return error
        }
    }

    async modificarCompra({request, params, response}){
        try {
            var listadetalles = []
            let cabecera = request.input('cabecera')            
            let detalle = request.input('detalle')
            let idcompra = params.idcompra
            let idprovee = cabecera.idprovee
            let fecha = moment().format('YYYY-MM-DD')
            let nota = cabecera.nota
            let usuario = cabecera.usuario
            let formapago = cabecera.formapago
            let total = cabecera.total
            let idusuario = cabecera.idusuario
            let descuento = cabecera.descuento
            let idopedido = cabecera.idopedido
            let idpreimp = cabecera.idpreimp
            let hora = moment().format('HH:mm:ss')
            let tienefactura = cabecera.tienefactura
            let serie1 = cabecera.serie1
            let serie2 = cabecera.serie2
            let autori = cabecera.autori
            let ivavigente = cabecera.ivavigente
            let idusuariomodi = cabecera.idusuariomodi
            let tipodcosri = cabecera.tipodcosri

            const compras = await Database.raw("update public.compras set idprovee = '"+idprovee+"', fecha = '"+fecha+"', nota = '"+nota+"', usuario = '"+usuario+"', formapago = '"+formapago+"', total = '"+total+"', idusuario = '"+idusuario+"', descuento = '"+descuento+"', idopedido = '"+idopedido+"', idpreimp = '"+idpreimp+"', hora = '"+hora+"', tienefactura = '"+tienefactura+"', serie1 = '"+serie1+"', serie2 = '"+serie2+"', autori = '"+autori+"', ivavigente = '"+ivavigente+"', idusuariomodi = '"+idusuariomodi+"', tipodcosri = '"+tipodcosri+"' where id = '"+idcompra+"' returning id, idprovee, fecha, trim(nota) as nota, formapago, trim(usuario) as usuario, total, idusuario, descuento, idopedido, idpreimp, estado, hora, tienefactura , serie1, serie2, trim(autori) as autori, ivavigente, idusuariomodi, tipodcosri ")
            
            let idipedido = idcompra //con este idcompra buscar todos los detalles de esta compra, para devolver las existencias y costos promedios de los productos al punto antes ingresar la compra 

            var detallescompra = await Database.raw("select * from public.detacompra where idipedido = '"+idipedido+"'")
            console.log("detallescompra: ", detallescompra.rows);
            for (let details of detallescompra.rows) {
                console.log('deta compra: ', details);
                let cantidad = details.cantidad
                let pvp = details.pvp
                let gravariva = details.gravariva
                let idproducto = details.idproducto
                let codmedida = details.codmedida
                let cantdevuelta = details.cantdevuelta
                let cantrecibida = details.cantrecibida
                let descuentodetalle = details.descuento
                let pvpproveedor = details.pvpproveedor
                let cantidadproveedor = details.cantidadproveedor
                let nlote = details.nlote
                let detallecostopromedio = details.costopromedio 

                var productodetalle = await Database.raw("select * from public.producto where id = "+idproducto+"")
                if(cantidad > cantrecibida){ //quiere decir que no se recibió toda la merca
                    let diferencia = cantidad - cantrecibida
                    let totalinventario = productodetalle.rows[0].existencia + diferencia
                    let sumatoriacosto = totalinventario * productodetalle.rows[0].costopromedio
                    let sumatoriacompra = cantidad *  pvpproveedor
                    let nuevasumatoria = sumatoriacosto - sumatoriacompra
                    totalinventario = totalinventario - cantidad //esta será la existencia del producto
                    let costopromedioantescompra = nuevasumatoria / totalinventario //este será el costopromedio del producto
                    var productobase = await Database.raw("update public.producto set existencia = '"+totalinventario+"', costopromedio = '"+costopromedioantescompra+"' where id = '"+idproducto+"' returning id, costopromedio, existencia")
                    console.log("productobase (if)", productobase.rows);
                }else{
                    let totalinventario = productodetalle.rows[0].existencia
                    let sumatoriacosto = totalinventario * productodetalle.rows[0].costopromedio
                    let sumatoriacompra = cantidad *  pvpproveedor
                    let nuevasumatoria = sumatoriacosto - sumatoriacompra
                    totalinventario = totalinventario - cantidad //esta será la existencia del producto
                    let costopromedioantescompra = nuevasumatoria / totalinventario //este será el costopromedio del producto
                    var productobase = await Database.raw("update public.producto set existencia = '"+totalinventario+"', costopromedio = '"+costopromedioantescompra+"' where id = '"+idproducto+"' returning id, costopromedio, existencia")
                    console.log("productobase (else)", productobase.rows);
                }
                //eliminar los detalles 
                var deletecompra = await Database.raw("delete from public.detacompra where idipedido = '"+idipedido+"'")
                console.log("delete compra: ", deletecompra.rows);

            }
            for (let detall of detalle){
                console.log("detalle iteracion: ", detall);
                let cantidad = detall.cantidad
                let pvp = detall.pvp
                let gravariva = detall.gravariva
                let idproducto = detall.idproducto
                let codmedida = detall.codmedida
                let cantdevuelta = detall.cantdevuelta
                let cantrecibida = detall.cantrecibida
                let descuentodetalle = detall.descuento
                let pvpproveedor = detall.pvpproveedor
                let cantidadproveedor = detall.cantidadproveedor
                let nlote = detall.nlote

                var producto = await Database.raw("select * from public.producto where id = "+idproducto+"")
                console.log("producto reg: ", producto.rows);

                if(producto.rows[0].existencia <= 0){
                    //existencia es = 0
                    let prodexistencia = cantrecibida
                    let costopromedio = pvpproveedor
                    let ucosto = costopromedio
                    //asignar existencia del producto a cantidad recibida, costo promedio el pvpproveedor, el ucosto igual al costo promedio
                    //insertar el detacompra con el costopromedio = pvpproveedor y luego actualizar el producto
                    var detacompra = await Database.raw("insert into public.detacompra (idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio) values ('"+idipedido+"', '"+cantidad+"', '"+pvp+"', '"+gravariva+"', '"+idproducto+"', '"+codmedida+"', '"+cantdevuelta+"', '"+cantrecibida+"', '"+descuentodetalle+"', '"+pvpproveedor+"', '"+cantidadproveedor+"', '"+nlote+"', '"+costopromedio+"') returning id, idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio")

                    listadetalles.push(detacompra.rows[0])

                    var productoactualizado = await Database.raw("update public.producto set existencia = '"+prodexistencia+"', costopromedio = '"+costopromedio+"', ucosto = '"+ucosto+"' where id = '"+idproducto+"' returning id, codigointerno, existencia, costopromedio, ucosto")
                    console.log("productos afectados: ", productoactualizado.rows);
                    
                }else{

                    let prodexistencia = producto.rows[0].existencia
                    let prodcostopromedio = producto.rows[0].costopromedio
                    let valortotalpromedio = prodexistencia * prodcostopromedio
                    let valorcompratotal = cantidad * pvpproveedor //es la cantidad por el costo de compra, puede que sea el pvp
                    let nuevaexistencias = prodexistencia + cantrecibida //esta nueva existencia se actualiza al producto
                    valortotalpromedio = valortotalpromedio + valorcompratotal
                    let costopromedio = valortotalpromedio/nuevaexistencias //este nuevo costopromedio se actualiza al producto

                    //ingresar esto a detacompra y actualizar el producto con los dos nuevos campos
                    var detacompra = await Database.raw("insert into public.detacompra (idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio) values ('"+idipedido+"', '"+cantidad+"', '"+pvp+"', '"+gravariva+"', '"+idproducto+"', '"+codmedida+"', '"+cantdevuelta+"', '"+cantrecibida+"', '"+descuentodetalle+"', '"+pvpproveedor+"', '"+cantidadproveedor+"', '"+nlote+"', '"+costopromedio+"') returning id, idipedido, cantidad, pvp, gravariva, idproducto, codmedida, cantdevuelta, cantrecibida, descuento, pvpproveedor, cantidadproveedor, nlote, costopromedio")
                    
                    listadetalles.push(detacompra.rows[0])
    
                    var productoactualizado = await Database.raw("update public.producto set existencia = '"+nuevaexistencias+"', costopromedio = '"+costopromedio+"' where id = '"+idproducto+"' returning id, codigointerno, existencia, costopromedio")
                    console.log("productos afectados: ", productoactualizado.rows);

                }
            }
            return response.status(200).send({
                message: 'Se ha modificado la compra correctamente', 
                status: true,
                compra: compras.rows, 
                detacompra: listadetalles
            })
                                                                                          
        } catch (error) {
            console.log("error: ", error);
            return error
        }
    }


}

module.exports = CompraController
