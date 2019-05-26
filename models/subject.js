const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teachers",
    required: true
  },

  teacherName: {
    type: String
  },

  field: {
    type: String
  },

  sem: {
    type: Number
  },

  subjName: {
    type: String
  },

  subjExams: [
    {
      examName: {
        type: String
      },

      examQues: [
        {
          que: {
            type: String
          },
          options: [
            {
              optionNum: {
                type: Number
              },
              val: {
                type: String
              }
            }
          ]
        }
      ],

      examSubmissions: [
        {
          studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "students"
          },

          studentName: {
            type: String
          },

          solutions: [
            {
              queNo: {
                type: Number
              },
              solution: {
                type: Number
              }
            }
          ],

          studentResult: {
            isAvailable: {
              type: Boolean,
              default: false
            },
            percent: { type: String }
          }
        }
      ]
    }
  ]
});

const Subject = mongoose.model("subject", subjectSchema);

module.exports = { Subject };
