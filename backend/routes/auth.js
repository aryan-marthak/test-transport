import express from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { employeeId, name, email, password, department } = req.body;
    if (!employeeId || !name || !email || !password || !department) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        const employee = new Employee({
            employeeId,
            name,
            email,
            password,
            department,
            role: 'employee' // default role for new signups
        });
        await employee.save();
        res.status(201).json({ message: 'Employee created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, employeeId, password } = req.body;
    if ((!email && !employeeId) || !password) {
        return res.status(400).json({ error: 'Email or employeeId and password are required.' });
    }
    try {
        const query = email ? { email } : { employeeId };
        const employee = await Employee.findOne(query);
        if (!employee) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful', employeeId: employee.employeeId, name: employee.name, role: employee.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});



export default router;
