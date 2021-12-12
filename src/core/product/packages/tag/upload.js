// const multer = require('fastify-multer')
//
// /**
//  * @typedef TagIconFile
//  * @type {multerConfig.File|null}
//  */
//
// module.exports.tagIcon = multer(
//         {
//             storage: multer.diskStorage({
//                 destination: (_, __, next) => void next(null, multerConfig.imgDir + '/tag'),
//                 filename: multerConfig.filename
//             }),
//             fileFilter: multerConfig.defaultFileFilter,
//             limits: multerConfig.defaultLimit
//         }
//     )
//     .single('icon')