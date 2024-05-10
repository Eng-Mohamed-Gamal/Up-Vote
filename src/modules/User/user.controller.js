import User from "../../../DB/models/user.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


//================================= SignUp API =====================//
/***
 * destructuring data from req.body
 * check email is already exists
 * if exists return error
 * hash password
 * create new user
 * return success response
 */
export const SignUpHandeler = async (req, res, next) => {
    const { username, email, password, age, gender } = req.body
    // email check
    const isEmailExists = await User.findOne({ email })
    if (isEmailExists) return next(new Error('Email is already exists', { cause: 409 }))

    // hash password
    const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

    const newUser = await User.create({ username, email, password: hashPass, age, gender })
    return res.status(201).json({ message: 'User created successfully', newUser })
}


//================================= SignIn API =====================//
/**
 * destructuring data from req.body
 * check email is already exists
 * if not exists return error
 * check password is matched or not
 * if not matched return error
 * generate userToken (accessToken) , id , email
 * return success response with token
 */
export const SignInHandeler = async (req, res, next) => {
    const { email, password } = req.body

    // email check
    const isEmailExists = await User.findOne({ email })
    if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))

    // hash password
    const isPasswordMatched = bcrypt.compareSync(password, isEmailExists.password)
    if (!isPasswordMatched) return next(new Error('invalid login credentials', { cause: 404 }))
    const token = jwt.sign(
        { id: isEmailExists._id, userEmail: isEmailExists.email, role: isEmailExists.role },
        process.env.LOGIN_SIGNATURE,
        {
            expiresIn: '1h',
            // algorithm:'ES512'
        }
    )
    return res.status(200).json({ message: 'User LoggedIn successfully', token })
}

//================================= Update Account API =====================//
/**
 * destructuring data from req.body
 * destructuring data from req.authUser ( loggedInUser)
 * if user want to update his email so we need to if the email is already exists
 * if exists return error
 * update user data
 * return success response
*/
export const updateAccount = async (req, res, next) => {
    const { username, email, age } = req.body
    const { _id } = req.authUser

    if (email) {
        // email check
        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) return next(new Error('Email is already exists', { cause: 409 }))
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        username, email, age
    }, {
        new: true
    })
    if (!updatedUser) return next(new Error('update fail'))
    res.status(200).json({ message: 'done', updatedUser })
}


//================================= Delete Account API =====================//
/**
 * destructuring data from req.authUser ( loggedInUser)
 * delete user data
 * return success response
*/
export const deleteAccount = async (req, res, next) => {
    const { _id } = req.authUser
    const deletedUser = await User.findByIdAndDelete(_id)
    if (!deletedUser) return next(new Error('delete fail'))
    res.status(200).json({ message: 'done' })
}

//================================= Get User Profile API =====================//
/**
 * destructuring data from req.authUser ( loggedInUser)
 * return success response
*/
export const getUserProfile = async (req, res, next) => {
    res.status(200).json({ message: "User data:", data: req.authUser })
}




export const fileUpload = async (req, res, next) => {
    console.log(req.file);

    const data = await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: 'upVoteV1/users',
        public_id: req.file.filename,
        use_filename: true,
        unique_filename: false,
    })
    res.status(200).json({ message: "User data:", data })
}


// upload l eh  => local image
// upload fen => host

/**
 * full access destination 
 * full access fileName
 */

/**
 * image  => default for BE
 * video
 * auto  => default for FE
 * raw
 */