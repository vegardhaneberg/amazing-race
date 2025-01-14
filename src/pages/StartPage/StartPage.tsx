import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomInput from "../../components/CustomInput/CustomInput";
import { getCookie, setCookie } from "../../helpers/CookieHelper";
import { validateTeamCode } from "../../helpers/firebaseHelper";

export function StartPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const team = getCookie("team");
    if (team) {
      navigate("/");
    }
  }, []);

  const checkCode = async (code: string) => {
    const teamId = await validateTeamCode(code);
    if (teamId) {
      setCookie("team", teamId);
      navigate("/");
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
      <div className="join-game-form">
        <CustomInput
          type="text"
          required
          placeholder="Kode"
          onChange={(e) => setCode(e.target.value)}
        />
        <CustomButton
          label="Neste"
          variant="initial"
          type="submit"
          onClick={() => {
            checkCode(code);
          }}
        />
      </div>
    </div>
  );
}
