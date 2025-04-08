import {
  navBgColor,
  bgColor,
  secondaryBgColor,
  borderColor,
  boardColor,
  textColor,
  listTextColor,
} from "@/utils/color";

describe("Color Utility Functions", () => {
  describe("navBgColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(navBgColor("dark")).toBe("bg-gray-800");
    });

    it("returns light theme color when theme is light", () => {
      expect(navBgColor("light")).toBe("bg-white");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(navBgColor()).toBe("bg-white");
    });
  });

  describe("bgColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(bgColor("dark")).toBe("bg-gray-900");
    });

    it("returns light theme color when theme is light", () => {
      expect(bgColor("light")).toBe("bg-gray-100");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(bgColor()).toBe("bg-gray-100");
    });
  });

  describe("secondaryBgColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(secondaryBgColor("dark")).toBe("bg-gray-800");
    });

    it("returns light theme color when theme is light", () => {
      expect(secondaryBgColor("light")).toBe("bg-white");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(secondaryBgColor()).toBe("bg-white");
    });
  });

  describe("borderColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(borderColor("dark")).toBe("border-gray-600");
    });

    it("returns light theme color when theme is light", () => {
      expect(borderColor("light")).toBe("border-gray-300");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(borderColor()).toBe("border-gray-300");
    });
  });

  describe("boardColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(boardColor("dark")).toBe("bg-gray-800");
    });

    it("returns light theme color when theme is light", () => {
      expect(boardColor("light")).toBe("bg-gray-200");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(boardColor()).toBe("bg-gray-200");
    });
  });

  describe("textColor", () => {
    it("returns dark theme color when theme is dark", () => {
      expect(textColor("dark")).toBe("text-gray-900");
    });

    it("returns light theme color when theme is light", () => {
      expect(textColor("light")).toBe("text-gray-100");
    });

    it("returns light theme color by default when no theme is provided", () => {
      expect(textColor()).toBe("text-gray-100");
    });
  });

  describe("listTextColor", () => {
    it("always returns black text color regardless of theme", () => {
      expect(listTextColor("dark")).toBe("text-black");
      expect(listTextColor("light")).toBe("text-black");
      expect(listTextColor()).toBe("text-black");
    });
  });
});
