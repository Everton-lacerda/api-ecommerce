module.exports = {
    sercret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'AS&98766756GHGTRQBVNBA6YHUYAYDD55',
    api: process.env.NODE_ENV === 'production' ? 'https//api/loja-teste.com' :  'https//localhost:3000',
    loja: process.env.NODE_ENV === 'production' ? 'https//loja-teste.com' :  'https//localhost:8000',
}