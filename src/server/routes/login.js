"use strict";

//DOM-> Document Object Model
const id = document.querySelector('#id'),
    password = document.querySelector('#password'),
    loginBtn = document.querySelector('#login-button'),
    kakaoBtn = document.querySelector('#kakao-login');

loginBtn.addEventListener("click", login);
kakaoBtn.addEventListener("click", kakaoLogin);


function login(e){
    e.preventDefault();

    const req={
        id: id.value,
        password: password.value,
    }
    
    fetch("/auth/login",{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req)
    }).then((res) => res.json())
    .then((res) => {

        if(res.success){
            location.href = "/post/private";
            setheader("x-auth-token",res.token);
        }else{
            alert(res.msg);
        }
    })
    .catch((err)=>{
        console.log(err);
        console.error("로그인 중 에러발생");
    })
}

function kakaoLogin(){
    Kakao.Auth.login({
        
        success: function(authObj){
            Kakao.Auth.setAccessToken(authObj.access_token)
            getinfo()
            console.log(Kakao.Auth.getAccessToken())
        },
        fail: function(err){
            console.log(err)
        }
    })
}
function getinfo(){
    Kakao.API.request({
        url: '/v2/user/me',
        success: function(res){
            console.log(res)
            var nickname = res.kakao_account.profil_nickname
            var email = res.kakao_account.email
        },
        fail: function(error){
            alert('ERROR', JSON.stringify(error))
        }
    })
}

function kakaoLogout(){
    if(!Kakao.Auth.getAccessToken()){
        alert('Not logged in')
        return
    }
    var token = Kakao.Auth.getAccessToken()
    Kakao.Auth.logout(function(){
        alert('logout: ' + token)
    })
}
