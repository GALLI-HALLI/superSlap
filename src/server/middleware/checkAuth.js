// 프론트엔드와 합칠 때 수정 예정

const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (token) => {
  //현재 토큰에는 id만 들어있지만 곧 수정 예정
  try {
    let user = await JWT.verify(token, process.env.JWT_KEY);
    return user;
  } catch (error) {
    return false; //false일때 어떻게 처리해야할 지 생각해봐야할듯
  }
};

// module.exports = async (req, res, next) => {
//   const token = req.header('x-auth-token');

//   if (!token) {
//     return res.status(403).json({
//       errors: [
//         {
//           msg: "no token found",
//         },
//       ],
//     });
//   }
//   try {
//     let user = await JWT.verify(token, process.env.JWT_KEY);
//     req.user = user.id;
//     next();
//   } catch (error) {
//     return res.status(400).json({
//       errors: [
//         {
//           msg: "유효하지 않은 토큰",
//         },
//       ],
//     });
//   }
// };
