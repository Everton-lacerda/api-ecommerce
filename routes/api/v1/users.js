const router = require('express').Router()
const auth = require('../../auth')
const UserController = require('../../../controllers/UserController')

const userController = new UserController()


router.post('/login', userController.login)
router.post('/register', userController.store)
router.put('/',  auth.required, userController.update)
router.delete('/',  auth.required, userController.remove)

// router.get('/passwordRecovery',(req, res) => {
//     res.json({teste: 'ok'})
// })

router.get('/passwordRecovery', userController.showRecovery)
router.post('/passwordRecovery', userController.createRecovery)
router.get('/newPassword', userController.showCompleteRecovery)
router.post('/newPassword', userController.completeRecovery)


router.get('/', auth.required, userController.index)
router.get('/:id', auth.required, userController.show)


module.exports = router