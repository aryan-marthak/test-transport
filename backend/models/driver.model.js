import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    driverName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 65
    },
    phoneNo: {
        type: String,
        required: true,
        trim: true
    },
    licenseNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    status: {
        type: String,
        required: true,
        enum: ['assigned', 'available'],
        default: 'available'
    }
}, {
    timestamps: true
});

export default mongoose.model('Driver', driverSchema); 