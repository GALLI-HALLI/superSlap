//DOM-> Document Object Model
const id = document.querySelector("#id"),
  password = document.querySelector("#password"),
  loginBtn = document.querySelector("#login-button"),
  kakaoBtn = document.querySelector("#kakao-login");

loginBtn.addEventListener("click", login);
kakaoBtn.addEventListener("click", kakaoLogin);

function login(e) {
  e.preventDefault();

  const req = {
    id: id.value,
    password: password.value,
  };

  fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        location.href = "/post/public";
        setheader("x-auth-token", res.token);
      } else {
        alert(res.msg);
      }
    })
    .catch((err) => {
      console.log(err);
      console.error("로그인 중 에러발생");
    });
}
