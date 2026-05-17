import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { UserPayload } from '..'

const generateToken = (payload: UserPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  } as jwt.SignOptions)
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' })
      return
    }

    const user = await User.create({ name, email, password, role: role || 'sales' })

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration' })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login' })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request & { user?: UserPayload }, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
