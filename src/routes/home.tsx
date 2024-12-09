import PostTweetForm from "../components/post-tweet-form";
import { styled } from "styled-components";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
  display:none;
  }
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}