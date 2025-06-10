require('dotenv').config({ path: '.env' });
const mongoose= require('mongoose')

const connect=()=>mongoose.connect(process.env.MONGODB_URI, {
            dbName: "tic-tac-toe",
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(()=>{
    console.log("DB Connected")
})

module.exports=connect