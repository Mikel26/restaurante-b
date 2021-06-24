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
Route.post('productos/eliminarProducto/:codigo', 'ProductoController.eliminarProducto')
Route.get('productos/consultarProducto/:codigo', 'ProductoController.consultarProductoFiltro')
Route.get('productos/consultarProducto/', 'ProductoController.consultarProducto')

/* CATEGORIA */
Route.get('categorias/consultarCategoria', 'CategoriaController.consultarCategorias')
Route.get('categorias/consultarCategoria/:idcategoria', 'CategoriaController.consultarCategoriasFiltro')
Route.post('categorias/insertarCategoria', 'CategoriaController.insertarCategoria')
Route.put('categorias/modificarCategoria/:idcategoria', 'CategoriaController.modificarCategoria')
Route.get('categorias/eliminarCategoria/:idcategoria', 'CategoriaController.eliminarCategoria')

/* MARCA */
Route.get('marcas/consultarMarca', 'MarcaController.consultarMarcas')
Route.post('marcas/insertarMarca', 'MarcaController.insertarMarca')
Route.put('marcas/modificarMarca/:idmarca', 'MarcaController.modificarMarca')
Route.get('marcas/eliminarMarca/:idmarca', 'MarcaController.eliminarMarca')
Route.get('marcas/consultarMarca/:descripcion', 'MarcaController.consultarMarcaFiltro')

/* MEDIDA */
Route.get('medidas/consultarMedida', 'MedidaController.consultarMedidas')
Route.post('medidas/insertarMedida', 'MedidaController.insertarMedida')
Route.put('medidas/modificarMedidas/:idmedida', 'MedidaController.modificarMedida')
Route.get('medidas/eliminarMedidaId/:idmedida', 'MedidaController.eliminarMedidaId')
Route.get('medidas/consultarMedida/:descripcion', 'MedidaController.consultarMedidaFiltro')
