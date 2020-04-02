const mongoose = require('mongoose')
const User = mongoose.model('User')
const sendRecoveryEmail = require('../helpers/email-recovery')

class UserController {
    index(req, res, next) {
        User.findById(req.payload.id).then(user => {
            if (!user) return res.status(401).json({ erros: "Usuário não registrado" })
            return res.json({ user: user.sendToken() })
        }).catch(next)
    }

    show(req, res, next) {
        User.findById(req.params.id).populate({ path: 'store' })
            .then(user => {
                if (!user) return res.status(401).json({ erros: "Usuário não registrado" })
                return res.json({
                    user: {
                        nome: user.name,
                        email: user.email,
                        permissao: user.permission,
                        loja: user.store,

                    }
                })
            }).catch(next)
    }

    store(req, res, next) {

        const { name, email, password } = req.body

        if(!name || !email || !password) return res.status(422).json({ erros: "Preencha todos os campos de cadastro" })

        const user = new User({ name, email })
        user.setPassword(password)

        User.save().then(() => { return res.json({ user: user.sendToken() }) }).catch(next)
    }

    update(req, res, next) {

        const { name, email, password } = req.body

        User.findById(req.payload.id).then(user => {
            
            if (typeof name !== 'undefined') user.name = name
            if (typeof email !== 'undefined') user.name = email
            if (typeof password !== 'undefined') user.setPassword(password)

            User.save().then(() => { return res.json({ user: user.sendToken() }) }).catch(next)

        }).catch(next)
    }

    remove(req, res, next) {
        user.findById(req.payload.id).then(user => {
            if (!user) return res.status(401).json({ erros: "Usuário não registrado" })
            return user.remove().then(() => {
                return res.json({ remove: true })
            }).catch(next)
        }).catch(next)
    }

    login(req, res, next) {
        const { name, email, password } = req.body
        if(!email) return res.status(422).json({erros: { email: 'Não pode ser vazio' }})
        if(!password) return res.status(422).json({erros: { password: 'Não pode ser vazio' }})
        User.findOne({ email }).then((user) => {
            if (!user) return res.status(401).json({ erros: "Usuário não registrado" })

            if(!user.validatorPassword(password)) return res.status(401).json({erros: { erros: 'Senha invalida' }})

            return res.json({user: user.sendToken() })

        }).catch(next)
    }

    showRecovery(req, res, next) {
        return res.render('recovery', { erros: null, success: null })
    }

    createRecovery(req, res, next) {
        const { email } = req.body
        if(!email) return res.render('recovery', { error: "Preencha com o seu email", success: null })

        User.findOne({ email }).then((user) => {
            if (!user) return res.render('recovery', { error: "Nenhum usuario com esta email", success: null })
            const recoveryData = user.create.generateRecoveryPassword()
            return user.save().then(() => {
                return res.render('recovery', { error: null, success: true })
            }).catch(next)
        }).catch(next)
    }

    showCompleteRecovery(req, res, next) {
        if(!req.query.token) return res.render('recovery', { error: "Token não identificado", success: null })
        user.findOne({ 'recovery-token': req.query.token }).then(user => {
            if (!user) return res.render('recovery', { error: "Nenhum usuario com esta token", success: null })
            if( new Date(user.recovery.date ) < new Date() ) return res.render('recovery', { error: "Token expirado. Tente novamente", success: null })
            return res.render('recovery/store,', { error: null, success: true,  token: req.query.token })
        }).catch(next)
    }

    completeRecovery(req, res, next) {
        const { token, password } = req.body
        if(!token || !password) return res.render('recovery/store,', { error: 'Preencha novamente com sua nova senha', success: null,  token: req.query.token })
        user.findOne({'recovery.token': token}).then(user => {
            if(!user) return res.render('recovery', { error: "Usuario não identificado", success: null })

            user.clearTokenRecoveryPassword()
            user.setPassword(password)
            return user.save().then(() => {
                return res.render('recovery/store,', {
                    error: null,
                    success: "Senha alterada com sucesso. Tente novamente fazer login",
                    token: null
                })
            }).catch(next)
        })

    }
}