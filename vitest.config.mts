import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

const emptyModule = fileURLToPath(
  new URL("./tests/helpers/empty-module.ts", import.meta.url)
);

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    // Next 16의 server-only/client-only 가드는 런타임 stub일 뿐이라 node 테스트 환경엔
    // 패키지가 없다(번들러가 주입). 테스트에서는 빈 모듈로 대체해 import 사슬을 살린다.
    alias: {
      "server-only": emptyModule,
      "client-only": emptyModule,
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // 단위 테스트는 소스 옆에 co-locate(예: src/lib/utils.test.ts).
    // tests/integration** 는 통합 테스트 전용이라 단위 스위트에서 제외한다
    // (vitest.config.integration.mts 참조).
    exclude: [...configDefaults.exclude, "tests/integration/**"],
    env: {
      // env.ts의 strict 검증 우회
      CI: "true",
    },
  },
});
