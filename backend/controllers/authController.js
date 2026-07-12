const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Helper to sign access token
const getAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'transitops_super_secret_jwt_key_12345',
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

// Helper to sign refresh token
const getRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'transitops_super_secret_refresh_key_56789',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Cookie response helper
const sendTokenResponse = async (user, statusCode, res) => {
  const token = getAccessToken(user);
  const refreshToken = getRefreshToken(user);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save();

  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user
    user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      verificationToken,
      isVerified: false, // Default false until they verify
    });

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;
    const message = `Welcome to TransitOps! Please verify your email by clicking the link: \n\n ${verificationUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'TransitOps Email Verification Required',
        message,
        html: `<h3>TransitOps Registration Verification</h3>
               <p>Please click the link below to verify your email address:</p>
               <a href="${verificationUrl}" target="_blank">${verificationUrl}</a>`,
      });
    } catch (mailErr) {
      console.error('Verification email send failed:', mailErr.message);
    }

    // Return session directly (some apps require verification first; we will allow access but log verified status)
    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email token
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(444).json({ success: false, error: 'There is no user with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset url
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Please click the link: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'TransitOps Password Reset Request',
        message,
        html: `<h3>TransitOps Password Reset</h3>
               <p>Please click the link below to reset your account password. This link expires in 10 minutes:</p>
               <a href="${resetUrl}" target="_blank">${resetUrl}</a>`,
      });

      res.status(200).json({ success: true, data: 'Email sent successfully' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, error: 'Token and password are required' });
    }

    // Hash token to compare
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired password reset token' });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Refresh token is required' });
    }

    // Check user matching token
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'transitops_super_secret_refresh_key_56789');
    } catch (jwtErr) {
      return res.status(401).json({ success: false, error: 'Expired/Invalid refresh token' });
    }

    // Generate new access token
    const accessToken = getAccessToken(user);

    res.status(200).json({
      success: true,
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};
