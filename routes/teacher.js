const router = require("express").Router();

//-------------------
const { Student } = require("../models/register");
const { TeacherProfile, StudentProfile } = require("../models/profile");
const Announcement = require("../models/announcement");
const { Subject } = require("../models/subject");

//-------------------
router.get("/allStudents", async (req, res) => {
  let allStudents = await Student.find();
  return res.json(allStudents);
});

//-------------------
router.post("/announcements", async (req, res) => {
  setTimeout(async () => {
    const { teacherId } = req.body;
    let teacherProfile = await TeacherProfile.findOne({ teacherId });
    let announcements = [];
    for (i = 0; i < teacherProfile.announcements.length; i++) {
      let announcement = await Announcement.findById(
        teacherProfile.announcements[i].id
      );
      if (announcement) announcements.push(announcement);
    }

    res.json(announcements);
  }, 3000);
});

//-------------------
router.post("/announcement", async (req, res) => {
  const { teacherId, text } = req.body;
  const teacherProfile = await TeacherProfile.findOne({ teacherId });

  if (req.body.announcementId) {
    let announcement = await Announcement.findById(req.body.announcementId);
    announcement.text = text;
    announcement.save();
    res.json("success...!");
  } else {
    const announcement = new Announcement({
      teacherId,
      text,
      name: teacherProfile.teacherName
    });
    announcement.save();
    teacherProfile.announcements.unshift({ id: announcement._id });
    teacherProfile.save();

    for (i = 0; i < teacherProfile.students.length; i++) {
      let studentProfile = await StudentProfile.findOne({
        studentId: teacherProfile.students[i].studentId
      });
      studentProfile.teacherAnnouncements.unshift({
        teacherId,
        announcementId: announcement._id
      });
      studentProfile.save();
    }

    res.json("success...!");
  }
});

//--------------------
router.post("/add-student", async (req, res) => {
  const { studentId, teacherId } = req.body;
  let teacherProfile = await TeacherProfile.findOne({ teacherId });
  teacherProfile.students.unshift({ studentId });
  teacherProfile.save();
  let studentProfile = await StudentProfile.findOne({ studentId });
  studentProfile.teachers.unshift({ teacherId });
  studentProfile.save();
  return res.json(teacherProfile);
});

//--------------------
router.post("/remove-student", async (req, res) => {
  const { studentId, teacherId } = req.body;
  let teacherProfile = await TeacherProfile.findOne({ teacherId });
  teacherProfile.students = teacherProfile.students.filter(
    s => s.studentId.toString() !== studentId.toString()
  );

  teacherProfile.save();
  let studentProfile = await StudentProfile.findOne({ studentId });
  studentProfile.teacherAnnouncements = studentProfile.teacherAnnouncements.filter(
    ann => ann.teacherId.toString() !== teacherId.toString()
  );
  studentProfile.teachers = studentProfile.teachers.filter(
    obj => obj.teacherId.toString() !== teacherId.toString()
  );
  studentProfile.save();
  return res.json(teacherProfile);
});

//--------------------
router.post("/my-students", async (req, res) => {
  setTimeout(async () => {
    const { teacherId } = req.body;
    let teacherProfile = await TeacherProfile.findOne({ teacherId });
    let myStudents = [];
    for (i = 0; i < teacherProfile.students.length; i++) {
      let student = await StudentProfile.findOne({
        studentId: teacherProfile.students[i].studentId
      });
      if (student) myStudents.push(student);
    }
    res.json(myStudents);
  }, 3000);
});

//--------------------
router.post("/getTeacherComm", async (req, res) => {
  const { teacherId, studentId } = req.body;
  let studentProfile = await StudentProfile.findOne({ studentId });
  let communicationObj = studentProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];
  if (!communicationObj) {
    let data = { teacherId };
    studentProfile.parentNotifications.unshift(data);
    studentProfile.save();
  }

  let currentData = studentProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];
  res.json(currentData);
});

//--------------------
router.post("/notifiToPar", async (req, res) => {
  const { teacherId, studentId, msg } = req.body;
  let studentProfile = await StudentProfile.findOne({ studentId });
  let communicationObj = studentProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];

  let index = studentProfile.parentNotifications.indexOf(communicationObj);

  studentProfile.parentNotifications[index].messages.push({
    senderId: teacherId.toString(),
    msg
  });

  studentProfile.save();

  let currentData = studentProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];
  res.json(currentData);
});

//--------------------
router.post("/teacherSubjects", async (req, res) => {
  const { teacherId } = req.body;

  let subjects = await Subject.find({ teacherId });

  res.json(subjects);
});

//--------------------
router.post("/new-subject", async (req, res) => {
  const { teacherId, field, sem, subjName } = req.body;

  let teacherProfile = await TeacherProfile.findOne({ teacherId });
  let subject = new Subject({
    teacherId,
    teacherName: teacherProfile.teacherName,
    field,
    sem,
    subjName
  });
  subject.save();
  teacherProfile.subjects.push({ subjId: subject._id });
  teacherProfile.save();
  res.json(true);
});

//--------------------
router.post("/remove-subject", async (req, res) => {
  const { teacherId, subjId } = req.body;
  await Subject.findByIdAndRemove(subjId);
  let subjects = await Subject.find({ teacherId });
  res.json(subjects);
});

//--------------------
router.post("/new-exam", async (req, res) => {
  const { teacherId, subjId, examName, examQues } = req.body;
  let subject = await Subject.findById(subjId);
  let exam = { examName, examQues };
  subject.subjExams.unshift(exam);
  subject.save();
  res.json(true);
});

//--------------------
router.post("/getSubjExamLists", async (req, res) => {
  const { subjId } = req.body;
  let subject = await Subject.findById(subjId);
  res.json(subject.subjExams);
});

//--------------------
router.post("/exam-submission", async (req, res) => {
  const { subjId, examId, studentId, solutions } = req.body;

  let subject = await Subject.findById(subjId);
  let studentProfile = await StudentProfile.findOne({ studentId });

  let exam = subject.subjExams.filter(
    ex => ex._id.toString() === examId.toString()
  )[0];

  let examIndex = subject.subjExams.indexOf(exam);

  let submission = {
    studentId,
    studentName: studentProfile.studentName,
    solutions
  };
  subject.subjExams[examIndex].examSubmissions.unshift(submission);
  subject.save();
  res.json(true);
});

//--------------------
router.post("/getStudExamSubmissions", async (req, res) => {
  const { subjId, examId } = req.body;

  let subject = await Subject.findById(subjId);
  let exam = subject.subjExams.filter(
    ex => ex._id.toString() === examId.toString()
  )[0];
  let submissions = exam.examSubmissions.filter(
    sub => sub.studentResult.isAvailable === false
  );
  res.json(submissions);
});

//--------------------
router.post("/post-result", async (req, res) => {
  const { subjId, examId, studentId, percent } = req.body;

  let subject = await Subject.findById(subjId);
  let exam = subject.subjExams.filter(
    ex => ex._id.toString() === examId.toString()
  )[0];

  let examIndex = subject.subjExams.indexOf(exam);
  let studentSubmission = subject.subjExams[examIndex].examSubmissions.filter(
    sub => sub.studentId.toString() === studentId.toString()
  )[0];

  let studentSubmissionIndex = subject.subjExams[
    examIndex
  ].examSubmissions.indexOf(studentSubmission);

  subject.subjExams[examIndex].examSubmissions[
    studentSubmissionIndex
  ].studentResult.percent = `${percent}%`;

  subject.subjExams[examIndex].examSubmissions[
    studentSubmissionIndex
  ].studentResult.isAvailable = true;

  subject.save();

  let newExam = subject.subjExams.filter(
    ex => ex._id.toString() === examId.toString()
  )[0];
  let submissions = newExam.examSubmissions.filter(
    sub => sub.studentResult.isAvailable === false
  );
  res.json(submissions);
});

//--------------------
router.post("/del-announcement", async (req, res) => {
  const { announcementId } = req.body;
  await Announcement.findByIdAndDelete(announcementId);
  res.json("success...!");
});

module.exports = router;
