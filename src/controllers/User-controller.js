const Users = require("../models/User-model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const SECRET = process.env.SECRET

require('dotenv').config()

module.exports = {
    async createUser(req,res){
        const {name, email, password} = req.body
        

        let user = await Users.findOne({ email })
        if(user){
            return res.status(400).json('User already exists in database')
        }
        else {
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
          
            user = await Users.create({name, email, password: passwordHash})

            return res.status(201).json(user)
        }
    },

    async list(req,res){
        const user = await Users.find()

        return res.json(user)
    },


    async login(req,res){
        const {email, password} = req.body
        const user = await Users.findOne({email})
        if(!user){
            return res.status(404).json("User not found")
        }
       
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            return res.status(404).json("Wrong password")
        }
        
        const token = jwt.sign({id: user._id}, SECRET, {expiresIn: 1000})

        res.status(200).json({"User authenticated": token} )

    },

    async checkToken(req,res,next){
        const token = req.headers['x-access-token']
        if(!token){
            return res.status(401).json("Access Denied")
        }

        try{
            
            jwt.verify(token, SECRET)
            next()

        }catch(error){
            res.status(400).json("Invalid token")
        }
    },


    async delete (req,res){
        try{
        const {_id} = req.params
        const user= await Users.findByIdAndDelete({_id})
        return res.status(200).json(user)
        } catch(error) {
            return res.json({message: "Error, user not found"})
        }
    }

}