import jwt from 'jsonwebtoken';
import config from 'config';
import {getCleanRequestBody} from '../utils/helpers.js';

export default function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({msg: 'No token, authorization denied'});
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    const cleanUser = getCleanRequestBody(decoded.user);
    req.user = cleanUser;
    next();
  } catch (err) {
    res.status(401).json({msg: 'Token is not valid'});
  }
}
