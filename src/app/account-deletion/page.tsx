export default function AccountDeletionPage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 space-y-2">
          <p className="text-muted-foreground text-sm">시행일: 2026-10-20</p>
          <h1 className="font-bold text-3xl tracking-tight">
            allrecords 계정 삭제 안내
          </h1>
          <p className="text-muted-foreground text-sm">
            allrecords 앱(개발자: 오은) 계정과 관련 데이터를 삭제하는 방법을
            안내합니다.
          </p>
        </header>

        <section className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">1. 앱에서 바로 삭제하기</h2>
            <ol className="list-decimal space-y-1 pl-5 text-muted-foreground text-sm">
              <li>allrecords 앱에 로그인합니다.</li>
              <li>왼쪽 메뉴에서 설정 → 내 정보로 이동합니다.</li>
              <li>&quot;계정 삭제&quot;를 누르고 확인하면 즉시 삭제됩니다.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-lg">
              2. 앱을 쓸 수 없을 때 요청하기
            </h2>
            <p className="text-muted-foreground text-sm">
              아래 이메일로 가입한 이메일 주소와 함께 계정 삭제를 요청해 주세요.
              본인 확인 후 지체 없이(늦어도 7일 안에) 삭제하고 결과를
              알려드립니다.
            </p>
            <div className="rounded-lg border border-border p-4 text-muted-foreground text-sm">
              <p>이메일: bdohhhhh@gmail.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-lg">3. 삭제되는 데이터</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
              <li>
                계정 정보: 이름, 이메일, 프로필 사진, 로그인 연결(Google·Apple
                등), 푸시 알림 토큰, 알림 설정
              </li>
              <li>위치 공유 정보: 참여 중인 공유와 위치</li>
              <li>돌봄 관리 데이터(사용한 경우)</li>
              <li>
                내가 마지막 구성원인 그룹: 그룹과 그 안의 사진·동영상·가족 기록
                전체
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-semibold text-lg">4. 남는 데이터</h2>
            <ul className="list-disc space-y-1 pl-5 text-muted-foreground text-sm">
              <li>
                다른 가족 구성원이 남아 있는 그룹에 올린 사진·동영상·가족 기록은
                가족의 공동 기록으로 그 그룹에 남습니다. 이 콘텐츠의 삭제를
                원하시면 탈퇴 전에 앱에서 직접 지우거나, 위 이메일로 요청해
                주세요.
              </li>
              <li>
                법령에 따라 보관해야 하는 정보가 있는 경우 해당 기간 동안만
                보관한 뒤 파기합니다.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
