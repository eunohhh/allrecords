import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const emptyModule = fileURLToPath(
  new URL("./tests/helpers/empty-module.ts", import.meta.url)
);

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // 통합 테스트는 route handler를 직접 import하므로 server-only/client-only 가드를 거친다.
    // 이 가드는 런타임 stub일 뿐 node 테스트 환경엔 패키지가 없어 빈 모듈로 대체한다(unit config와 동일).
    alias: {
      "server-only": emptyModule,
      "client-only": emptyModule,
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    testTimeout: 30_000,
    sequence: {
      concurrent: false,
    },
  },
});
