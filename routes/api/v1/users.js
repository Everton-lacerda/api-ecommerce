const router = require('express').Router()
const auth = require('../../auth')
const UserController = require('../../../controllers/UserController')

const userController = new UserController()


router.get('/', auth.required, userController.index)
router.get('/:id', auth.required, userController.show)

router.post('/login', userController.login)
router.post('/register', userController.store)
router.put('/',  auth.required, userController.update)
router.delete('/',  auth.required, userController.remove)

router.get('/passwordRecovery', userController.showRecovery)
router.post('/passwordRecovery', userController.createRecovery)
router.get('/newPassword', userController.showCompleteRecovery)
router.post('/passwordRecovery', userController.completeRecovery)





module.exports = router