import mongoose from 'mongoose';

const AdminActionLogsSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  },
  logs: [
    {
      actionType: {
        type: String
      },
      updatedChanges: {
        type: String
      },
      userDetails: {
        userAvatar: {
          type: String
        },
        accNumber: {
          type: String
        },
        userName: {
          type: String
        },
        userBranch: {
          type: String
        },
        userIFSC: {
          type: String
        }
      },
      updatedOn: {
        type: Date
      }
    }
  ]
});

const AdminActionLogs = mongoose.model('adminActionLogs', AdminActionLogsSchema);

export default AdminActionLogs;
