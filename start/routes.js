'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

/* PRODUCTOS */
Route.post('productos/insertarProducto', 'ProductoController.insertarProducto')
Route.put('productos/modificarProducto/:idproducto', 'ProductoController.modificarProducto')
Route.get('productos/eliminarProducto/:codigo', 'ProductoController.eliminarProducto')
Route.get('productos/consultarProducto/:codigo', 'ProductoController.consultarProductoFiltro')
Route.get('productos/consultarProductoID/:codigo', 'ProductoController.consultarProductoFiltroID')
Route.get('productos/consultarProducto/', 'ProductoController.consultarProducto')

/* CATEGORIAS */
Route.get('categorias/consultarCategoria', 'CategoriaController.consultarCategorias')
Route.get('categorias/consultarCategoria/:idcategoria', 'CategoriaController.consultarCategoriasFiltro')
Route.post('categorias/insertarCategoria', 'CategoriaController.insertarCategoria')
Route.put('categorias/modificarCategoria/:idcategoria', 'CategoriaController.modificarCategoria')
Route.get('categorias/eliminarCategoria/:idcategoria', 'CategoriaController.eliminarCategoria')

/* MARCAS */
Route.get('marcas/consultarMarca', 'MarcaController.consultarMarcas')
Route.post('marcas/insertarMarca', 'MarcaController.insertarMarca')
Route.put('marcas/modificarMarca/:idmarca', 'MarcaController.modificarMarca')
Route.get('marcas/eliminarMarca/:idmarca', 'MarcaController.eliminarMarca')
Route.get('marcas/consultarMarca/:descripcion', 'MarcaController.consultarMarcaFiltro')

/* MEDIDAS */
Route.get('medidas/consultarMedida', 'MedidaController.consultarMedidas')
Route.post('medidas/insertarMedida', 'MedidaController.insertarMedida')
Route.put('medidas/modificarMedidas/:idmedida', 'MedidaController.modificarMedida')
Route.get('medidas/eliminarMedida/:idmedida', 'MedidaController.eliminarMedida')
Route.get('medidas/consultarMedida/:descripcion', 'MedidaController.consultarMedidaFiltro')
Route.get('medidas/consultarMedidaId/:codmedida', 'MedidaController.consultarMedidaId')

/* PROVEEDORES */
Route.post('proveedores/insertarProveedor', 'ProveedorController.insertarProveedor')
Route.put('proveedores/modificarProveedor/:idproveedor', 'ProveedorController.modificarProveedor')
Route.get('proveedores/eliminarProveedor/:idproveedor', 'ProveedorController.eliminarProveedor')
Route.get('proveedores/consultarProveedor/:ci', 'ProveedorController.consultarProveedorFiltro')
Route.get('proveedores/consultarProveedorID/:idprov', 'ProveedorController.consultarProveedorFiltroID')
Route.get('proveedores/consultarProveedor', 'ProveedorController.consultarProveedor')

/* COMPRAS */
Route.post('compras/insertarCompra', 'CompraController.insertarCompra')
Route.get('compras/eliminarCompraId/:idcompra', 'CompraController.eliminarCompraId')
Route.get('compras/consultarCompra', 'CompraController.consultarCompra')
Route.get('compras/consultarCompraId/:idcompra', 'CompraController.consultarCompraId')
Route.put('compras/modificarCompra/:idcompra', 'CompraController.modificarCompra')
