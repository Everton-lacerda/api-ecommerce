const transporter = require('nodemailer').createTransport(require('../config/email'))
const { root: link } = require('../config/index')


module.exports = ({ user, recovery }, cb) => {
    const message  = `
        <h1 style="text-align: center;">Recuperacao de Senha</h1>
        <br />
        <p>
            Aqui está o link para redefinir a sua senha. Acesse ele e digite sua nova senha:
        </p>
        <a href="${link}/v1/api/user/passwordRecovery?token=${recovery.token}">
            ${link}/v1/api/user/passwordRecovery?token=${recovery.token}
        </a>
        <br /><br /><hr />
        <p>
            Obs.: Se você não solicitou a redefinicao, apenas ignore esse email.
        </p>
        <br />
        <p>Atenciosamente, Loja TI</p>
    `;

    const optionsEmail = {
        from: "naoresponder@lojati.com",
        to: user.email,
        subject: "Redefinicao de Senha - Loja TI",
        html: message
    }

    if( process.env.NODE_ENV === "production" ){
        transporter.sendMail(optionsEmail, (error, info) => {
            if(error){
                console.log(error);
                return cb("Aconteceu um erro no envio do email, tente novamente.");
            } else {
                return cb(null, "Link para redefinicao de senha foi enviado com sucesso para seu email.");
            }
        });
    } else {
        console.log(optionsEmail);
        return cb(null, "Link para redefinicao de senha foi enviado com sucesso para seu email.");
    }
}