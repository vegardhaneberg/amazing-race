import { Button, Stack, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <Stack
      align="center"
      justify="center"
      w={"100%"}
      h={"100%"}
      style={{ overflow: "hidden" }}
    >
      <TextInput
        type="text"
        required
        placeholder="Kode"
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        variant="initial"
        type="submit"
        onClick={() => {
          checkCode(code);
        }}
      >
        Neste
      </Button>
    </Stack>
  );
}
