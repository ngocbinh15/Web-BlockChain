const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// @route   GET /api/batches
// @desc    Get all batches
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [batches] = await db.query(`
      SELECT b.*, u.username as created_by_username, u.full_name as created_by_name
      FROM batches b
      JOIN users u ON b.created_by = u.id
      ORDER BY b.created_at DESC
    `);

    res.json({
      success: true,
      count: batches.length,
      batches
    });
  } catch (error) {
    console.error('Get batches error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

// @route   GET /api/batches/:batch_code
// @desc    Get batch by code
// @access  Public
router.get('/:batch_code', async (req, res) => {
  try {
    const { batch_code } = req.params;

    const [batches] = await db.query(`
      SELECT b.*, u.username, u.full_name as creator_name
      FROM batches b
      JOIN users u ON b.created_by = u.id
      WHERE b.batch_code = ?
    `, [batch_code]);

    if (batches.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy lô hàng' 
      });
    }

    // Get transactions for this batch
    const [transactions] = await db.query(`
      SELECT t.*, u.username, u.full_name, u.role
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      WHERE t.batch_id = ?
      ORDER BY t.timestamp ASC
    `, [batches[0].id]);

    res.json({
      success: true,
      batch: batches[0],
      transactions
    });
  } catch (error) {
    console.error('Get batch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

// @route   POST /api/batches
// @desc    Create new batch
// @access  Private
router.post('/', [
  authMiddleware,
  body('batch_code').trim().notEmpty().withMessage('Mã lô là bắt buộc'),
  body('product_name').trim().notEmpty().withMessage('Tên sản phẩm là bắt buộc'),
  body('quantity').isFloat({ min: 0 }).withMessage('Số lượng phải lớn hơn 0')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { batch_code, product_name, quantity, unit } = req.body;

    // Check if batch_code already exists
    const [existing] = await db.query(
      'SELECT id FROM batches WHERE batch_code = ?',
      [batch_code]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mã lô đã tồn tại' 
      });
    }

    // Insert batch
    const [result] = await db.query(
      'INSERT INTO batches (batch_code, product_name, quantity, unit, created_by) VALUES (?, ?, ?, ?, ?)',
      [batch_code, product_name, quantity, unit || 'kg', req.user.id]
    );

    // Create initial transaction
    await db.query(
      'INSERT INTO transactions (batch_id, user_id, action, description) VALUES (?, ?, ?, ?)',
      [result.insertId, req.user.id, 'CREATE', `Tạo lô ${batch_code} - ${product_name}`]
    );

    res.status(201).json({
      success: true,
      message: 'Tạo lô hàng thành công',
      batch: {
        id: result.insertId,
        batch_code,
        product_name,
        quantity
      }
    });
  } catch (error) {
    console.error('Create batch error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

// @route   POST /api/batches/:batch_code/transaction
// @desc    Add transaction to batch
// @access  Private
router.post('/:batch_code/transaction', [
  authMiddleware,
  body('action').trim().notEmpty().withMessage('Action là bắt buộc'),
  body('description').trim().notEmpty().withMessage('Description là bắt buộc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { batch_code } = req.params;
    const { action, description, location } = req.body;

    // Get batch
    const [batches] = await db.query(
      'SELECT id FROM batches WHERE batch_code = ?',
      [batch_code]
    );

    if (batches.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy lô hàng' 
      });
    }

    // Insert transaction
    await db.query(
      'INSERT INTO transactions (batch_id, user_id, action, description, location) VALUES (?, ?, ?, ?, ?)',
      [batches[0].id, req.user.id, action, description, location || null]
    );

    res.json({
      success: true,
      message: 'Thêm giao dịch thành công'
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi server' 
    });
  }
});

module.exports = router;
