const {mongoose, Schema, model} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const secret = require('../config').secret

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Nome não pode ser vazio']
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Email não pode ser vazio'],
        index: true,
        match: [/\S+@\S+\.\S+/, 'email inválido']
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: [true,"não pode ficar vazia."]
    },
    permission: {
        type: Array,
        default: ['client']
    },
    hash: { type: String },
    salt: { type: String },
    recovery: {
        type: {
            token: String,
            date: Date
        },
        default: {}
    }
}, {
    timestamps: true
})


UserSchema.plugin(uniqueValidator, {message: 'Email já esta sendo utilizado'})

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt,  1000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validatorPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt,  1000, 512, 'sha512').toString('hex')
    return hash === this.hash
}

UserSchema.methods.generateToken = function() {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 15)

    return jwt.sign({
        id: this._id,
        email: this.email,
        name: this.name,
        exp: parseFloat(exp.getTime() / 1000, 10)
    }, secret)

}

UserSchema.methods.sendToken = function() {
    return {
        _id: this._id,
        email: this.email,
        name: this.name,
        store: this.store,
        role: this.permission,
        token: this.generateToken()
    }
}

UserSchema.methods.generateRecoveryPassword = function() {
    this.recovery = {}
    this.recovery = crypto.randomBytes(16).toString('hex')
    this.recovery.date = new Date( new Date().getTime() + 24*60*60*1000 )
    return this.recovery
}

UserSchema.methods.clearTokenRecoveryPassword = function() {
    this.recovery = {token: null, date: null}
    return this.recovery
}

module.exports = model('User', UserSchema)