const router = require("express").Router();

//-------------------
const { Student, Teacher, Parent } = require("../models/register");
const {
  TeacherProfile,
  StudentProfile,
  ParentProfile
} = require("../models/profile");

//-------------------
router.post("/student", async (req, res) => {
  const { email, password } = req.body;
  let student = await Student.findOne({ email, password });
  if (student) {
    let studentProfile = await StudentProfile.findOne({
      studentId: student._id
    });
    return res.json({ data: student, profile: studentProfile });
  } else return res.status(404).json("student not found :(");
});

//-------------------
router.post("/teacher", async (req, res) => {
  const { email, password } = req.body;
  let teacher = await Teacher.findOne({ email, password });
  if (teacher) {
    let teacherProfile = await TeacherProfile.findOne({
      teacherId: teacher._id
    });
    return res.json({ data: teacher, profile: teacherProfile });
  } else return res.status(404).json("teacher not found :(");
});

//-------------------
router.post("/parent", async (req, res) => {
  const { email, password } = req.body;
  let parent = await Parent.findOne({ email, password });
  if (parent) {
    let parentProfile = await ParentProfile.findOne({
      parentId: parent._id
    });
    return res.json({ data: parent, profile: parentProfile });
  } else return res.status(404).json("parent not found :(");
});

//-------------------
module.exports = router;
