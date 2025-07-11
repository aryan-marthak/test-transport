import express from 'express';
import mongoose from 'mongoose';
import Employee from '../models/employee.model.js';
import bcrypt from 'bcrypt';
import createTokenAndSaveCookie from '../jwt/generateToken.js';
import secureRoute from '../middleware/secureRoute.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { employeeId, name, email, password, department } = req.body;
    if (!employeeId || !name || !email || !password || !department) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    const existingEmployee = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (existingEmployee) {
        return res.status(400).json({ error: 'Employee already exists.' });
    }
    try {
        const employee = new Employee({
            employeeId,
            name,
            email,
            password,
            department,
            role: 'employee'
        });
        await employee.save();
        // Create token and save cookie
        createTokenAndSaveCookie(employee._id, res);
        // Only send plain user info
        res.status(201).json({ message: 'Employee created successfully', employeeId: employee.employeeId, name: employee.name, role: employee.role });
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

        // Create token and save cookie
        createTokenAndSaveCookie(employee._id, res);

        // Only send plain user info
        res.status(200).json({ message: 'Login successful', employeeId: employee.employeeId, name: employee.name, role: employee.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error.' });
    }
});

// Get current user info
router.get('/me', secureRoute, (req, res) => {
    res.json({
        employeeId: req.user.employeeId,
        name: req.user.name,
        role: req.user.role,
        department: req.user.department
    });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true, // true in production
        sameSite: 'strict'
    }); 
    res.json({ message: 'Logged out' });
});

export default router;
