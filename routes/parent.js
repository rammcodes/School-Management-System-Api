const router = require("express").Router();

//--------------------
const { Student } = require("../models/register");
const {
  TeacherProfile,
  StudentProfile,
  ParentProfile
} = require("../models/profile");
const { Subject } = require("../models/subject");
//--------------------
router.post("/getAllChilds", async (req, res) => {
  let allChilds = await Student.find();
  return res.json(allChilds);
});

//--------------------
router.post("/my-childs", async (req, res) => {
  setTimeout(async () => {
    const { parentId } = req.body;

    let parentProfile = await ParentProfile.findOne({ parentId });
    let myChildrens = [];

    for (i = 0; i < parentProfile.myChilds.length; i++) {
      let childProfile = await StudentProfile.findOne({
        studentId: parentProfile.myChilds[i].childId
      });
      if (childProfile) myChildrens.push(childProfile);
    }

    res.json(myChildrens);
  }, 3000);
});

//--------------------
router.post("/add-child", async (req, res) => {
  const { parentId, childId } = req.body;
  let parentProfile = await ParentProfile.findOne({ parentId });
  parentProfile.myChilds.unshift({ childId });
  parentProfile.save();
  res.json(parentProfile);
});

//--------------------
router.post("/remove-child", async (req, res) => {
  const { parentId, childId } = req.body;
  let parentProfile = await ParentProfile.findOne({ parentId });
  parentProfile.myChilds = parentProfile.myChilds.filter(
    c => c.childId.toString() !== childId.toString()
  );
  parentProfile.save();
  res.json(parentProfile);
});

//--------------------
router.post("/allTeacherNotifis", async (req, res) => {
  const { childId } = req.body;
  let childProfile = await StudentProfile.findOne({ studentId: childId });

  let allTeachersNotifi = childProfile.parentNotifications.map(async t => {
    let teacherProfile = await TeacherProfile.findOne({
      teacherId: t.teacherId
    });

    return {
      teacherId: teacherProfile.teacherId,
      teacherName: teacherProfile.teacherName
    };
  });
  allTeachersNotifi = await Promise.all(allTeachersNotifi);

  res.json(allTeachersNotifi);
});

//--------------------
router.post("/getTeacherNotifis", async (req, res) => {
  const { childId, teacherId } = req.body;

  let childProfile = await StudentProfile.findOne({ studentId: childId });

  let currentData = childProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];

  res.json(currentData);
});

//--------------------
router.post("/replyToNotifi", async (req, res) => {
  const { parentId, childId, teacherId, msg } = req.body;
  let childProfile = await StudentProfile.findOne({ studentId: childId });
  let communicationObj = childProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];

  let index = childProfile.parentNotifications.indexOf(communicationObj);

  childProfile.parentNotifications[index].messages.push({
    senderId: parentId.toString(),
    msg
  });

  childProfile.save();

  let currentData = childProfile.parentNotifications.filter(
    noti => noti.teacherId.toString() === teacherId.toString()
  )[0];
  res.json(currentData);
});

//--------------------
router.post("/getChildrenSubjects", async (req, res) => {
  const { childrenId } = req.body;

  let studentProfile = await StudentProfile.findOne({ studentId: childrenId });
  if (!studentProfile.studentField || !studentProfile.studentSem) {
    return res.json(false);
  }

  let allSubjects = await Subject.find({
    field: studentProfile.studentField,
    sem: studentProfile.studentSem
  });

  res.json(allSubjects);
});

//--------------------
router.post("/getChildrenSubjectResult", async (req, res) => {
  const { studentId, subjId } = req.body;

  let subject = await Subject.findById(subjId);
  console.log(subject, "dumm", req.body);
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

//--------------------
module.exports = router;
