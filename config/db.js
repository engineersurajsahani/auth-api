const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://surajsahani:surajsahani@cluster0.chshyik.mongodb.net/');

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Database connected successfully');
});

db.on('disconnected',()=>{
    console.log('Database disconnected');
});

db.on('error',(error)=>{
    console.log('Database connection error:',error);
});

module.exports=db;