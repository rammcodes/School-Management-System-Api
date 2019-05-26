const router = require("express").Router();

//-------------------
const { Student, Teacher, Parent } = require("../models/register");
const {
  TeacherProfile,
  StudentProfile,
  ParentProfile
} = require("../models/profile");

//-------------------
router.post("/student", (req, res) => {
  const { name, email, password } = req.body;
  const student = new Student({ name, email, password });
  student.save();
  const studentProfile = new StudentProfile({
    studentId: student._id,
    studentName: name
  });
  studentProfile.save();
  res.json("success...!");
});

//-------------------
router.post("/teacher", (req, res) => {
  const { name, email, password } = req.body;
  const teacher = new Teacher({ name, email, password });
  teacher.save();
  const teacherProfile = new TeacherProfile({
    teacherId: teacher._id,
    teacherName: teacher.name
  });
  teacherProfile.save();
  res.json("success...!");
});

//-------------------
router.post("/parent", (req, res) => {
  const { name, email, password } = req.body;
  const parent = new Parent({ name, email, password });
  parent.save();
  const parentProfile = new ParentProfile({
    parentId: parent._id
  });
  parentProfile.save();
  res.json("success...!");
});

//-------------------
module.exports = router;
