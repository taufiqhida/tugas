// const {image} = require("../models")
// const {imageKit} = require("../utils");
//
// module.exports={
//     create : async (req, res, next)=>{
//         try{
//             const fileTostring = req.file.buffer.toString('base64');
//             const uploadFile = await imageKit.upload({
//                     fileName: req.file.originalname,
//                     file: fileTostring
//             })
//
//             const newImage = await image.create({
//                 data:{
//                     nama : uploadFile.url,
//                     hotelId: parseInt(req.body.hotelId),
//                     wisataId: parseInt(req.body.wisataId)
//                 }
//             })
//
//             return res.status(201).json({
//                 newImage
//             })
//         }catch (error){
//             next(error);
//         }
//     },
//     update : async (req, res, next)=>{
//          try{
//              const fileTostring = req.file.buffer.toString('base64');
//
//              const uploadFile = await imageKit.upload({
//                     fileName: req.file.originalname,
//                     file: fileTostring
//              })
//              const  data = await image.update({
//                  where: {
//                      id : parseInt(req.params.id)
//                  },
//                  data : {
//                     nama : uploadFile.url,
//                     hotelId: parseInt(req.body.hotelId),
//                     wisataId: parseInt(req.body.wisataId)
//                  }
//              })
//          }catch (error) {
//              next(error)
//          }
//     },
//     get : async (req, res, next)=>{
//         try{
//             const data = await image.findFirst({
//                 where: {
//                     id : parseInt(req.params.id)
//                 }
//             })
//             return res.status(200).json({
//                 data
//             })
//
//         }catch (error) {
//             next(error)
//         }
//     },
//     destroy : async (req, res, next)=>{
//         try {
//             const data = await image.delete({
//                 where: {
//                     id: parseInt(req.params.id)
//                 }
//             })
//             return res.status(204).json()
//         }catch (error){
//             next(error)
//         }
//     }
// }
