"use strict";

//DOM-> Document Object Model
const id = document.querySelector('#id'),
    password = document.querySelector('#password'),
    loginBtn = document.querySelector('#login-button');

loginBtn.addEventListener("click", login);

function login(){
    const req={
        id: id.value,
        password: password.value,
    };
    
    fetch("/auth/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    }).then((res) => res.json())
    .then((res) => {
        console.log(res);
        console.log("hihihihihi");
        if(res.success){
            location.href = "/post/private";
        }else{
            alert(res.msg);
        }
    })
    .catch((err)=>{
        console.log("ksdgjlasgkfl");
        // console.error(new Error("로그인 중 에러발생"));
        // console.error("로그인 중 에러발생");
    })
}