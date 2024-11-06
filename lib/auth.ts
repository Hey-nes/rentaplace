import { jwtDecode } from "jwt-decode";

export const loginUser = (token: string) => {
  if (token && token.split(".").length === 3) {
    const decodedToken = jwtDecode<{ id: string }>(token);
    if (decodedToken && typeof decodedToken === "object") {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", decodedToken.id);
      console.log("Login successful");
      return true;
    }
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  console.log("Logout successful");
};
