export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 space-y-2">
          <p className="text-sm text-muted-foreground">시행일: 2026-04-17</p>
          <h1 className="text-3xl font-bold tracking-tight">개인정보 처리방침</h1>
          <p className="text-sm text-muted-foreground">
            allrecords 앱(이하 &quot;서비스&quot;)은 가족 구성원 간의 일정과 정보를 공유하기 위한
            비공개 서비스입니다. 본 개인정보 처리방침은 서비스 이용과 관련하여 어떤 정보를 어떻게
            수집하고 사용하는지 안내합니다.
          </p>
        </header>

        <section className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">1. 수집하는 개인정보</h2>
            <p className="text-sm text-muted-foreground">
              서비스 제공을 위해 아래 정보를 수집할 수 있습니다.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>계정 정보: 이름, 이메일, 프로필 사진(선택)</li>
              <li>가족 구성원 정보: 닉네임, 관계, 생년월일(선택)</li>
              <li>이용 정보: 앱 사용 기록, 접속 로그, 오류 기록</li>
              <li>기기 정보: OS/버전, 기기 식별자(비식별), 푸시 알림 토큰</li>
              <li>
                Google Calendar 데이터: 사용자가 Google Calendar 연동을 허용한 경우, 사용자가
                소유한 캘린더의 일정 정보(제목, 날짜/시간, 설명 등)를 수집합니다.
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              사용자가 직접 입력하거나 업로드하는 메모, 일정, 사진 등 콘텐츠도 서비스 제공을 위해
              저장됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">2. 개인정보의 이용 목적</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>계정 생성 및 본인 확인</li>
              <li>가족 간 일정/메모 공유 기능 제공</li>
              <li>알림 발송 및 서비스 운영</li>
              <li>오류 분석 및 서비스 개선</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">3. Google Calendar 연동 및 Google 사용자 데이터</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 사용자가 명시적으로 Google 계정 연동에 동의한 경우에 한하여, Google OAuth
              2.0을 통해 Google Calendar 데이터에 접근합니다.
            </p>
            <h3 className="text-base font-medium">3-1. 접근 범위</h3>
            <p className="text-sm text-muted-foreground">
              서비스는{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                https://www.googleapis.com/auth/calendar.events.owned
              </code>{" "}
              범위만을 요청하며, 이는 사용자가 소유한 Google Calendar의 일정에 대한
              조회/생성/수정/삭제 권한입니다. 사용자가 소유하지 않은 캘린더나 다른 사용자의 일정에는
              접근하지 않습니다.
            </p>
            <h3 className="text-base font-medium">3-2. 데이터 사용 목적</h3>
            <p className="text-sm text-muted-foreground">
              수집된 Google Calendar 데이터는 오직 다음 목적에만 사용됩니다:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>앱 내에서 사용자의 Google Calendar 일정을 조회하여 표시</li>
              <li>앱에서 생성한 일정을 사용자의 Google Calendar에 추가</li>
              <li>앱에서 기존 일정을 수정하여 Google Calendar에 반영</li>
              <li>앱에서 사용자가 삭제 요청한 일정을 Google Calendar에서 삭제</li>
            </ul>
            <h3 className="text-base font-medium">3-3. 데이터 저장 및 공유</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>
                Google Calendar 데이터는 서비스 제공에 필요한 최소한의 범위에서만 서버에
                저장됩니다.
              </li>
              <li>
                Google 사용자 데이터를 광고, 사용자 프로파일링, 제3자 판매 또는 기타 서비스 제공과
                무관한 목적으로 사용하지 않습니다.
              </li>
              <li>
                Google 사용자 데이터를 제3자에게 제공하지 않습니다. 단, 법적 의무가 있는 경우 또는
                사용자의 명시적 동의가 있는 경우는 예외입니다.
              </li>
            </ul>
            <h3 className="text-base font-medium">3-4. 접근 권한 철회</h3>
            <p className="text-sm text-muted-foreground">
              사용자는 언제든지 다음 방법으로 Google Calendar 접근 권한을 철회할 수 있습니다:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>앱 내 설정에서 Google Calendar 연동 해제</li>
              <li>
                Google 계정 설정(
                <a
                  href="https://myaccount.google.com/permissions"
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://myaccount.google.com/permissions
                </a>
                )에서 앱의 접근 권한 삭제
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              접근 권한이 철회되면 서비스는 더 이상 Google Calendar 데이터에 접근하지 않으며, 기존에
              저장된 관련 데이터는 지체 없이 삭제됩니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">4. 보관 및 파기</h2>
            <p className="text-sm text-muted-foreground">
              개인정보는 목적 달성 후 지체 없이 파기합니다. 다만 관련 법령에 따라 보관이 필요한 경우
              해당 기간 동안 보관 후 파기합니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">5. 제3자 제공 및 처리 위탁</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 원칙적으로 개인정보를 제3자에게 제공하지 않습니다. 서비스 운영을 위해 필요한
              경우 최소한의 범위에서 개인정보 처리를 위탁할 수 있으며, 이 경우 본 방침에 공개합니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">6. 이용자 권리</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>개인정보 열람, 정정, 삭제 요청</li>
              <li>처리 정지 요청</li>
              <li>동의 철회</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              위 요청은 아래 문의처로 연락하시면 지체 없이 처리하겠습니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">7. 보안</h2>
            <p className="text-sm text-muted-foreground">
              서비스는 개인정보 보호를 위해 합리적인 기술적/관리적 보호조치를 시행합니다.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">8. 문의처</h2>
            <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              <p>운영자: 오은</p>
              <p>이메일: bdohhhhh@gmail.com</p>
            </div>
            <p className="text-sm text-muted-foreground">
              본 방침은 필요에 따라 업데이트될 수 있으며, 변경 시 앱 내 공지로 안내드립니다.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
