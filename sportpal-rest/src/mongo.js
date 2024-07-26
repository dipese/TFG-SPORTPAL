import mongoose from 'mongoose'


const {model, Schema} = mongoose
const password = "admin"

const conectionString = "mongodb+srv://dipese:"+password+"@cluster0.7mqkuj4.mongodb.net/SportPal?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(conectionString)
    .then(() => {
        console.log('Database connected')

    }).catch (err => {
        console.error (err)
    })

const userSchema = new Schema({     
    email: String,
    username: String, 
    password: String, 
    nombre: String,
    apellidos: String,
    elo: Number
})

const User = model ('User', userSchema)

const prueba = new User ({
    email: "prueba@gmail.com",
    username: "prueba", 
    password: "prueba", 
    nombre: "prueba",
    apellidos: "pruebez",
    elo: 0
})

prueba.save()
    .then(result => {
        console.log (result)
        mongoose.connection.close()
    })
    .catch(err => {
        console.error(err)
    })