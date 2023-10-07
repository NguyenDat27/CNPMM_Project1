import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async()=>{
    try{
        const  conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`Ket noi thanh cong den MongoDB ${conn.connection.host}`.bgMagenta.white    )
    }catch (error){
        console.log(`Loi ket noi DB ${error}`.bgRed.white)
    }
}

export default connectDB