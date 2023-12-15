const {admin} = require("../models"),
    bcrypt = require("bcrypt"),
    utils = require("../utils")
    jwt = require("jsonwebtoken")
require('dotenv').config
const secret_key = process.env.JWT_KEY || "no_secret"

module.exports = {
    register: async(req, res, next)=>{
        console.log('====================================');
        console.log(req.body);
        console.log('====================================');
        try {
            const adminUser   = await admin.create({
                data : {
                   username: req.body.username,
                   password: await utils.cryptPassword(req.body.password)
                } 
            })

            return res.status(201).json({
                data : utils.exlcude(adminUser, ['password'])
            })
        } catch (error) {
            return  next(error)
        }
    },
    login: async(req, res, next)=>{
        try {
            const findAdminUser = await admin.findFirst({
                where:{
                    username : req.body.username
                }
            });

            if(!findAdminUser){
                return res.status(404).jsom({
                    error: "Your Username is not registered in our system"
                })
            }

            if(bcrypt.compareSync(req.body.password, findAdminUser.password)){
                const token = jwt.sign({id: findAdminUser.id}, secret_key, {expiresIn: '6h'})

                return res.status(200).json({
                    data :{
                        token
                    }
                })

                

            }
        } catch (error) {
            return  next(error)
        }
    }
}