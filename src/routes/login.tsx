import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { Error, Form, Input, Switcher, Title, Wrapper } from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (isLoading || email === "" || password === "") return;

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  const onClick = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email)
      alert("비밀번호 재설정 이메일을 보냈습니다.");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      } else {
        console.error("Not FirebaseError: ");
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <Wrapper>
      <Title>로그인 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "로그인"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으신가요? <Link to="/create-account">가입하기 &rarr;</Link>
        <br/>
        <br/>
        비밀번호를 잊으셨나요? <Link to="#" onClick={(e) => {e.preventDefault(); onClick();}}>재설정 &rarr;</Link>
      </Switcher>
      <GithubButton/>
    </Wrapper>
  );
}