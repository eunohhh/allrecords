import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

// downloadImageMO와 downloadImagePC는 DOM과 fetch에 의존하므로 별도로 테스트
describe("Utils", () => {
  describe("cn", () => {
    it("클래스명을 올바르게 병합해야 한다", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("조건부 클래스명을 올바르게 처리해야 한다", () => {
      expect(cn("base", true && "conditional")).toBe("base conditional");
      expect(cn("base", false && "conditional")).toBe("base");
    });

    it("중복 클래스명을 올바르게 병합해야 한다", () => {
      expect(cn("p-2 p-4")).toBe("p-4"); // tailwind-merge가 작동
    });

    it("빈 값들을 올바르게 처리해야 한다", () => {
      expect(cn("", null, undefined, "valid")).toBe("valid");
    });
  });
});
