import { TProfile, TRegister } from "../types/api";

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
