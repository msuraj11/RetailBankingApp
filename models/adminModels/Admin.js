import mongoose from 'mongoose';
import moment from 'moment';

const AdminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  personalEmail: {
    type: String,
    required: true,
    unique: true
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
  permissions: {
    type: [String],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  adminBranch: {
    type: String,
    required: true
  },
  adminId: {
    type: Number, // TODO adminId concat with branch and bank-name
    unique: true
  },
  avatar: {
    type: String
  },
  regDate: {
    type: Date,
    default: moment()
  }
});

const Admin = mongoose.model('admin', AdminSchema);

export default Admin;
