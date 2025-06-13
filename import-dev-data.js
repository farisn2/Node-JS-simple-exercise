const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
dotenv.config({path: './config.env'})

const Movie = require('./Models/movieModel')

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log('DB Connection Succesfull')
}).catch((error) => {
console.log('Some error has occured')
})


const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf8'));

//Delete existing movie from collection
const deleteMovies = async () => {
try{
await Movie.deleteMany();
console.log('Data succesfuly deleted')
}catch(err){
    console.log(err.message)
}
}

//Delete existing movie from collection
const importMovies = async () => {
try{
await Movie.create(movies);
console.log('Data succesfuly imported')
}catch(err){
    console.log(err.message)
}
process.exit()
}

deleteMovies()
importMovies()

if(process.argv[2] === '--import'){
    importMovies()
}
if(process.argv[2] === '--delete'){
    importMovies()
}