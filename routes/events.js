
/*  Rutas de Usuario / Auth
    host + /api/events
*/

const { Router } = require('express');
const { createEvents,deleteEvents,getEvents,updateEvents } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');
const router = Router();

//Todas tienes que pasar por la validacion del JWT

router.use( validarJWT );

//Obtener eventos

router.get('/',
[
    check()
],
getEvents );

//Crear nuevo evento
router.post('/new',
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos
],
createEvents );

//Actualizar nuevo evento
router.put('/:id',
[
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos
],
updateEvents );

//Eliminar nuevo evento
router.delete('/:id', deleteEvents );

module.exports = router; 