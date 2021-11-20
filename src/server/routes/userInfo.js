const router = require("express").Router();
const asyncHandler = require("express-async-handler");
const checkAuth = require("../middleware/checkAuth");
const User = require("../models/User");
// const mongoose = require("mongoose");

//닉네임 수정 버튼 눌렀을 때(/api/user-info/rename)
router.put(
  "/rename",
  checkAuth.headerToUserId,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const id = req.user;
    await User.findOneAndUpdate({ id: id }, { $set: { name: name } });
    return res.json({
      id: id,
      success: true,
    });
  })
);

module.exports = router;
