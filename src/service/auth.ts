import { TLogin, TProfile, TRegister, TRoomId } from "../types/api";

export const getCurrentUserProfile = (): Promise<TProfile> => {
  return fetch("/api/auth/user", {
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token") ?? "",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    })
    .then(({ user }) => user);
};

export const signUpUser = (user: TRegister): Promise<any> => {
  return fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error("Failed to fetch user register");
    }
    return res.json();
  });
};

export const loginUser = (user: TLogin): Promise<any> => {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error("Failed to fetch user login!");
    }
    return res.json();
  });
};

export const getRoomID = (): Promise<TRoomId> => {
  return fetch("/api/lobby/make", {
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token") ?? "",
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Failed to fetch room Id!!");
      }
      return res.json();
    })
    .then(({ code }) => code);
};

export const searchRoom = (code: TRoomId): Promise<any> => {
  return fetch("/api/lobby/enter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(code),
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error("Failed to fetch join");
    }
    return res.json();
  });
};

export const checkIdVaild = (id: string): Promise<any> => {
  return fetch("/api/auth/checkId", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error("Failed to fetch user register");
    }
    return res.json();
  });
};
