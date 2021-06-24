'use strict'

class PruebaController {
    async Prueba({params, response}){

        try {
            
            var variable = params.variable
    
            console.log(variable)
    
            return response.send({status: true, message: 'Msg' + variable})
        
        } catch (error) {
            console.log(error)
            return 'ok'
        }
        
    }
}

module.exports = PruebaController
