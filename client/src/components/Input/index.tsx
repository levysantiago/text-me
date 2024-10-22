import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { InputContainer, InputItem } from "./styles";

interface IInputProps
  extends DetailedHTMLProps<
    // eslint-disable-next-line no-undef
    InputHTMLAttributes<HTMLInputElement>,
    // eslint-disable-next-line no-undef
    HTMLInputElement
  > {
  placeholder?: string;
}

export function Input({ placeholder, ...inputProps }: IInputProps) {
  return (
    <InputContainer>
      <InputItem placeholder={placeholder} {...inputProps} />
    </InputContainer>
  );
}
