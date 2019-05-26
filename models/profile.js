const mongoose = require("mongoose");

const teacherProfile = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
    required: true
  },
  teacherName: {
    type: String,
    required: true
  },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "students" }
    }
  ],
  announcements: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "announcements"
      }
    }
  ],
  subjects: [
    {
      subjId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subjects",
        required: true
      }
    }
  ]
});

const studentProfile = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "students",
    required: true
  },
  studentName: {
    type: String,
    required: true
  },

  studentField: {
    type: String
  },

  studentSem: {
    type: String
  },

  teachers: [
    {
      teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teachers" }
    }
  ],
  teacherAnnouncements: [
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teachers"
      },
      announcementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "announcements"
      }
    }
  ],
  parentNotifications: [
    {
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      messages: [
        {
          senderId: {
            type: String
          },
          msg: {
            type: String
          }
        }
      ]
    }
  ]
});

const parentProfile = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "parents",
    required: true
  },
  myChilds: [
    {
      childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students"
      }
    }
  ]
});

const TeacherProfile = mongoose.model("teacherProfile", teacherProfile);
const StudentProfile = mongoose.model("studentProfile", studentProfile);
const ParentProfile = mongoose.model("parentProfile", parentProfile);

module.exports = { TeacherProfile, StudentProfile, ParentProfile };
