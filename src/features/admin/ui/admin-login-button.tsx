import { Button } from "@/components/ui/button";
import { RiKakaoTalkFill } from "react-icons/ri";

function AdminLoginButton() {
  return (
    <a href="/api/auth/provider?provider=kakao&next=/admin">
      <Button className="cursor-pointer">
        <RiKakaoTalkFill />
        카카오로 로그인하기
      </Button>
    </a>
  );
}

export default AdminLoginButton;
