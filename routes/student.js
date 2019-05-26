const router = require("express").Router();

//-------------------
const Announcement = require("../models/announcement");
const { TeacherProfile, StudentProfile } = require("../models/profile");
const { Subject } = require("../models/subject");

//-------------------
router.post("/studentNotifications", async (req, res) => {
  const { studentId } = req.body;
  const studentProfile = await StudentProfile.findOne({ studentId });
  let studentNotifications = [];
  for (i = 0; i < studentProfile.teacherAnnouncements.length; i++) {
    let announcement = await Announcement.findById(
      studentProfile.teacherAnnouncements[i].announcementId
    );
    if (announcement) studentNotifications.push(announcement);
  }
  res.json(studentNotifications);
});

//-------------------
router.post("/getStudentSubjects", async (req, res) => {
  const { studentId } = req.body;

  let studentProfile = await StudentProfile.findOne({ studentId });
  if (!studentProfile.studentField || !studentProfile.studentSem) {
    return res.json(false);
  }

  let allSubjects = await Subject.find({
    field: studentProfile.studentField,
    sem: studentProfile.studentSem
  });

  res.json(allSubjects);
});

//-------------------
router.post("/addStudEduDetails", async (req, res) => {
  const { studentId, field, sem } = req.body;
  let studentProfile = await StudentProfile.findOne({ studentId });
  studentProfile.studentField = field;
  studentProfile.studentSem = sem;
  studentProfile.save();

  let allSubjects = await Subject.find({
    field: studentProfile.studentField,
    sem: studentProfile.studentSem
  });

  res.json(allSubjects);
});

//-------------------
router.post("/getNewExams", async (req, res) => {
  const { studentId, subjId } = req.body;

  let subject = await Subject.findById(subjId);

  let exams = [];

  for (i = 0; i < subject.subjExams.length; i++) {
    let isAttempted = false;
    if (subject.subjExams[i].examSubmissions.length) {
      for (j = 0; j < subject.subjExams[i].examSubmissions.length; j++) {
        if (
          subject.subjExams[i].examSubmissions[j].studentId.toString() ===
          studentId.toString()
        ) {
          isAttempted = true;
        }
      }
    }

    if (!isAttempted) {
      exams.push(subject.subjExams[i]);
    }
  }

  res.json(exams);
});

//-------------------
router.post("/getIndiExam", async (req, res) => {
  const { subjId, examId } = req.body;
  let subject = await Subject.findById(subjId);

  let exam = subject.subjExams.filter(
    ex => ex._id.toString() === examId.toString()
  )[0];
  res.json(exam);
});

//-------------------
router.post("/getStudentResult", async (req, res) => {
  const { studentId, subjId } = req.body;

  let subject = await Subject.findById(subjId);

  let result = [];
  for (i = 0; i < subject.subjExams.length; i++) {
    let resData = {};

    for (j = 0; j < subject.subjExams[i].examSubmissions.length; j++) {
      if (
        subject.subjExams[i].examSubmissions[j].studentId.toString() ===
          studentId.toString() &&
        subject.subjExams[i].examSubmissions[j].studentResult.isAvailable
      ) {
        resData.examName = subject.subjExams[i].examName;
        resData.percentage =
          subject.subjExams[i].examSubmissions[j].studentResult.percent;
        result.push(resData);
      }
    }
  }

  res.json(result);
});

//-------------------
module.exports = router;
