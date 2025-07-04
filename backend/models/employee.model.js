import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    department: {
        type: String,
        required: true,
        enum: ['HR', 'ER', 'MECHANICAL', 'CIVIL', 'IT', 'CHEMICAL']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        default: 'employee'
    }
}, {
    timestamps: true
});

employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


export default mongoose.model('Employee', employeeSchema); 