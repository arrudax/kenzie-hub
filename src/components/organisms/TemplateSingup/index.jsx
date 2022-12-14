import { useHistory } from "react-router-dom";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { apiKenzieHub } from "../../../services/api.js";

import { toast } from "react-toastify";

import { Conteiner, Content } from "./style.js";

import { LogoKenzieHub } from "../../atoms/LogoKenzieHub";
import { StyleButton } from "../../atoms/StyleButton";
import { Singup } from "../../molecules/Singup";

export const TemplateSingup = () => {
  const history = useHistory();

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required("Campo obrigatório")
      .matches(/[^0-9]/, "Não pode conter números"),
    email: yup.string().required("Campo obrigatório").email("E-mail inválido"),
    password: yup
      .string()
      .required("Campo obrigatório")
      .min(8, "Mínimo 8 digitos")
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Sua senha deve conter letra maiúsculas, minúsculas, caracter especial e numeros"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "diferente de senha"),
    bio: yup.string(),
    contact: yup
      .string()
      .matches(
        /^\s*(\d{2}|\d{0})[-. ]?(\d{5}|\d{4})[-. ]?(\d{4})[-. ]?\s*$/,
        "Seu telefone deve conter 11 números e sem letras"
      ),
    course_module: yup.string().required("Campo obrigatório"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const goBackPage = () => {
    history.goBack();
  };

  function singup({ name, email, password, bio, contact, course_module }) {
    const createUser = { name, email, password, bio, contact, course_module };
    apiKenzieHub
      .post("/users", createUser)
      .then((_) => {
        toast.success("Sucesso ao criar a conta");
        return history.push("/login");
      })
      .catch((_) => toast.error("Erro ao criar a conta, tente outro e-mail"));
  }

  return (
    <Conteiner positionLogin="space-between">
      <div className="position">
        <form onSubmit={handleSubmit(singup)}>
          <div className="form__header">
            <LogoKenzieHub />

            <StyleButton
              onClick={() => goBackPage()}
              colorSchema="grey"
              sizeButton="5rem"
            >
              Voltar
            </StyleButton>
          </div>

          <Content>
            <Singup register={register} errors={errors} />
          </Content>
        </form>
      </div>
    </Conteiner>
  );
};
