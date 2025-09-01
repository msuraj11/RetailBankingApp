import mongoose from 'mongoose';
import moment from 'moment';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  customerId: {
    type: Number,
    unique: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: moment()
  }
});

const User = mongoose.model('user', UserSchema);

export default User;
