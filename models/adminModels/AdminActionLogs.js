const mongoose = require('mongoose');

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

module.exports = AdminActionLogs = mongoose.model('adminActionLogs', AdminActionLogsSchema);
