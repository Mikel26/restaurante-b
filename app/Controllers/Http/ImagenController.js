'use strict'

class ImagenController {
  async getImageFiles({params, response}) {
    var image_file = params.nombreimagen
    var img = Env.get('RUTA_IMAGENES')
    var res = ''

    const exists = await Drive.exists(image_file)

    if (exists == true) {
      res = img + image_file
    } else {
      res = img + 'no-image.jpg'
    }
    response.attachment(res)
  }

  async uploadImageVisitaExt({request, response}) {

    var fechaActual = moment()
    let transform = sharp()
    var nombreImg = ''

    try {

      request.multipart.file('image', {
        types: ['image'],
        size: '50mb',
        extnames: ['png', 'gif', 'jpg', 'jpeg']
      }, async file => {

        const data = transform
          .resize({
            width: 800
          })
          .jpeg({
            progressive: true,
            force: false
          })
          .png({
            progressive: true,
            force: false
          })

        file.stream.pipe(transform).pipe(file.stream)

        await Drive.disk('visitas_ext').put('ventaExt-' + fechaActual + '.webp', data, {
          ACL: 'public-read',
          ContentType: 'image/jpeg'
        })

        nombreImg = 'ventaExt-' + fechaActual + '.webp'

      })

      await request.multipart.process()

      return response.status(200).send({
        status: true,
        ruta: nombreImg

      })

    } catch (e) {
      console.log(e)
      return response.status(500).send({
        status: false,
        ruta: 'Error al subir la imagen, intente de nuevo'
      })

    }

  }


}

module.exports = ImagenController
