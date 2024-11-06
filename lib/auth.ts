export const loginUser = (token: string) => {
  if (token) {
    localStorage.setItem("token", token);
    console.log("Login successful");
    return true;
  }
  return false;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("Logout successful");
};
