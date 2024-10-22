/* eslint-disable no-undef */
import { WebsiteContainer } from "templates/WebsiteContainer";
import {
  ButtonContainer,
  InputTitleContainer,
  InputsTitle,
  Title,
  TitleContainer,
} from "./styles";
import { Input } from "components/Input";
import { DefaultButton } from "components/buttons/DefaultButton";
import { useContext, useEffect, useState } from "react";
import { signupService } from "services/signupService";
import { useNavigate } from "react-router-dom";
import { AppContext } from "components/context/AppContext";
import { HollowButton } from "components/buttons/HollowButton";

export default function Signup() {
  const { isLogged } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged]);

  async function onSubmit() {
    if (!name || !email || !password) {
      alert("Fill all the fields");
      return;
    }

    if (password !== repeatPassword) {
      alert("Passwords are not the same");
      return;
    }

    try {
      await signupService({ name, email, password });
      alert("User registered!");
      navigate("/login");
    } catch (e) {
      console.log(e);
      alert("Signup failed");
    }
  }

  return (
    <WebsiteContainer>
      <TitleContainer>
        <Title>TextMe</Title>
      </TitleContainer>

      <InputTitleContainer>
        <InputsTitle color="#fafafa">Signup</InputsTitle>
        <Input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <Input
          placeholder="Repeat Password"
          type="password"
          value={repeatPassword}
          onChange={(e) => {
            setRepeatPassword(e.target.value);
          }}
        />
        <ButtonContainer>
          <DefaultButton title="Signup" onClick={onSubmit} />
        </ButtonContainer>
        <ButtonContainer>
          <HollowButton
            title="Login instead"
            onClick={() => {
              navigate("/login");
            }}
          />
        </ButtonContainer>
      </InputTitleContainer>
    </WebsiteContainer>
  );
}
