export const navBgColor = (theme: string = "light") => {
  let navBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  return navBgColor;
};

export const bgColor = (theme: string = "light") => {
  let bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  return bgColor;
};

export const secondaryBgColor = (theme: string = "light") => {
  let secondaryBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  return secondaryBgColor;
};

export const borderColor = (theme: string = "light") => {
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  return borderColor;
};

export const boardColor = (theme: string = "light") => {
  const boardColor = theme === "dark" ? "bg-gray-800" : "bg-gray-200";
  return boardColor;
};

export const textColor = (theme: string = "light") => {
  let textColor = theme === "dark" ? "text-gray-900" : "text-gray-100";
  return textColor;
};
export const listTextColor = (theme: string = "light") => {
  let textColor = "text-black";
  return textColor;
};
