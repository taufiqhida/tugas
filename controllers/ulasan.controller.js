const {ulasan}= require("../models")

module.exports = {
    create: async (req, res, next)=>{
        try {
            const buatUlasan = await ulasan.create({
                data: {
                    nama: req.body.nama,
                    tempat: req.body.tempat,
                    ulasan: req.body.ulasan,
                }
            })

            return res.status(201).json({
                data : buatUlasan
            })
        } catch (error) {
            return next(error)
        }
    },
    getUlasan: async(req, res, next)=>{
        try {
            const data = await ulasan.findFirst({
                where : {
                    id : parseInt(req.params.id)
                }
            })

            return res.status(200).json({
                data
            })
        } catch (error) {
            return next(error)
        }
    },
    showAll: async(req, res, next)=>{
        try {
            const data = await ulasan.findMany({
                skip: 0,
                take: 4
            });
            return res.status(200).json({
                data
            })
        } catch (error) {
            return next(error)
        }
    },
    update : async(req, res, next)=>{
        try {
            const updateUlasan = await ulasan.update({
                where : {
                    id : parseInt(req.params.id)
                },
                data:{
                    nama: req.body.nama,
                    tempat: req.body.tempat,
                    ulasan: req.body.ulasan,
                }
            })
            return res.status(200).json({
                updateUlasan
            })
        } catch (error) {
            return next(error)
        }
    },
    destroy: async(req, res, next)=>{
        try {
            const hpsUlasan = await ulasan.delete({
                where : {
                    id : parseInt(req.params.id)
                }
            })

            return res.status(200).json({
                hpsUlasan
            })
        } catch (error) {
            return next(error)
        }
    }
}