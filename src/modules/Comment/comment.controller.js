import commentModel from "../../../DB/models/comment.model.js"
import productModel from "../../../DB/models/product.model.js"

import axios from 'axios'


//======================  add comment ======================//
export const addComment = async (req, res, next) => {
    const { content } = req.body
    const { _id } = req.authUser
    const { productId } = req.params

    // check productId
    const product = await productModel.findById(productId)
    if (!product) return next(new Error('product not found', { cause: 404 }))

    // create comment
    const comment = await commentModel.create({ content, addedBy: _id, productId })

    res.status(201).json({ message: 'comment added successfully', comment })
}


//========================== like comment ======================//
export const likeOrUnlikeComment = async (req, res, next) => {
    /* 
     * step 4
     * step 5
     * step 6 
     * logic of likeOrUnlike
     */
    const { commentId } = req.params
    const { onModel } = req.body
    const { accesstoken } = req.headers

    axios({
        method: 'post',
        url: `http://localhost:3000/like/${commentId}`,
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

