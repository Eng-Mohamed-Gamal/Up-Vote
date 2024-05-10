import commentModel from "../../../DB/models/comment.model.js"
import likesModel from "../../../DB/models/likes.model.js"
import productModel from "../../../DB/models/product.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import generateUniqueString from "../../utils/generateUniqueString.js"

import axios from 'axios'

//========================= add product =======================//
export const addproduct = async (req, res, next) => {
    const { title, caption } = req.body
    const { _id } = req.authUser


    // images
    if (!req.files?.length) return next(new Error('please upload images', { cause: 400 }))

    let Images = []
    let publicIdsArr = []
    const folderId = generateUniqueString(5)
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: `upVoteV1/products/${_id}/${folderId}`,
            use_filename: true,
            unique_filename: true
        })
        publicIdsArr.push(public_id)
        Images.push({ secure_url, public_id, folderId })
    }

    // create product
    const product = await productModel.create({ title, caption, addedBy: _id, Images })
    if (!product) {
        const deletedData = await cloudinaryConnection().api.delete_resources(publicIdsArr)
        // console.log(deletedData);
        return next(new Error('add product fail'))
    }
    res.status(201).json({ message: 'done', product })
}


//========================== like product ======================//
export const likeOrUnlikeProduct = async (req, res, next) => {
    /**
     * step 1
     * step 2
     * step 3 
     * logic of likeOrUnlike  => send request to likeOrUnlike router
     */
    const { productId } = req.params
    const { onModel } = req.body
    const { accesstoken } = req.headers

    axios({
        method: 'post',
        url: `http://localhost:3000/like/${productId}`,
        data: {
            onModel
        },
        headers: {
            accesstoken
        }
    }).then((response) => {
        // console.log(response.data);
        res.status(200).json({ response: response.data })
    }).catch((err) => {
        // console.log(err);
        res.status(500).json({ catch: err.data })
    })

}


//============================= get all likes for product =====================//
export const getAllLikesForProduct = async (req, res, next) => {
    const { productId } = req.params

    const likes = await likesModel.find({
        likeDoneOnId: productId,
    }).populate([
        {
            path: 'likeDoneOnId'
        }
    ]).select('likedBy likeDoneOnId onModel -_id')

    res.status(200).json({ message: 'done', likes })
}

//=============================== update product ===========================//
export const updateProduct = async (req, res, next) => {
    const { title, caption, oldPublicId } = req.body
    const { _id } = req.authUser
    const { productId } = req.params

    // check product
    const product = await productModel.findOne({ addedBy: _id, _id: productId })
    if (!product) return next(new Error('product not found', { cause: 404 }))

    // update product
    if (title) product.title = title
    if (caption) product.caption = caption

    if (oldPublicId) {
        if (!req.file) return next(new Error('please upload the new image', { cause: 400 }))

        // delete old image from cloudinary
        await cloudinaryConnection().uploader.destroy(oldPublicId)
        // upload the new image to cloudinary
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(req.file.path, {
            folder: `upVoteV1/products/${_id}/${product.Images[0].folderId}`,
        })

        product.Images.map(image => {
            if (image.public_id === oldPublicId) {
                image.public_id = public_id
                image.secure_url = secure_url
            }
        })
    }

    await product.save()
    res.status(200).json({ message: 'Updated Done', product })
}

//=========================== delete product ========================//
export const deleteProduct = async (req, res, next) => {
    const { _id } = req.authUser
    const { productId } = req.params

    // check product
    const product = await productModel.findOneAndDelete({ addedBy: _id, _id: productId })
    if (!product) return next(new Error('product not found', { cause: 404 }))

    let publicIdsArr = []
    // delete images from cloudinary
    for (const image of product.Images) {
        publicIdsArr.push(image.public_id)
    }

    // TODO: delete folder from cloudinary
    await cloudinaryConnection().api.delete_resources(publicIdsArr)

    res.status(200).json({ message: 'Deleted Done' })
}

export const getAllProducts = async (req, res, next) => {
    // const products = await productModel.find().lean()
    // db mongoDB => return BSON  , Binary JSON
    // for (const product of products) {
    // const comments = await commentModel.find({ productId: product._id })
    // // console.log(comments);
    // product.comments = comments
    // }
    //============================ Curosr Method ===============//
    const products = await productModel.find().cursor()
    let finalResult = []
    for (let doc = await products.next(); doc != null; doc = await products.next()) {
        const comments = await commentModel.find({ productId: doc._id })
        const docObject = doc.toObject()
        docObject.comments = comments
        finalResult.push(docObject)
    }
    res.status(200).json({ message: 'done', products: finalResult })
}

