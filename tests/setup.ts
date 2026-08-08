// Vitest 글로벌 셋업. 두 config(setupFiles)에서 모든 테스트 파일 실행 전 1회 로드된다.
// server-only/client-only 대체는 vitest.config.mts의 resolve.alias에서 처리한다.
// 전역 훅·커스텀 매처·테스트 환경 준비가 필요해지면 여기에 추가한다.
export {};