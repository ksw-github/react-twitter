import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where, updateDoc, doc } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;
const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;
const EditButton = styled.button`
  margin-top: 10px;
  background-color: transparent;
  color: gray;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
`;
const SaveButton = styled.button`
  margin-top: 10px;
  background-color: transparent;
  color: white;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
`;
const TextArea = styled.textarea`
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  margin: 10px 0px;
  border-radius: 3px;
  font-size: 16px;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

// 닉네임수정기능 추가해야함
export default function Profile({ userId, id }: ITweet) {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState<ITweet[]>([]);
  const onUsernameChange = async () => {
    if (user?.uid !== userId) return;
    try {
      await updateDoc(doc(db, "tweets", id), {
        username: newName,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
  };
  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setEditMode(!editMode);
  };
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    });
    setTweets(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      {editMode ? (
      <Name>
        <TextArea
        required
        rows={1}
        maxLength={80}
        // value={newName}
        // onChange={(e) => setNewName(e.target.value)}
        placeholder={user?.displayName ?? "이름없음"}
        />
        <EditButton onClick={onEdit} style={{ color: 'tomato' }}>취소</EditButton>
        <SaveButton onClick={onUsernameChange}>저장</SaveButton>
      </Name>
      ) : (
        <Name>
        {user?.displayName ?? "이름없음"}
        <EditButton onClick={onEdit}>수정</EditButton>
        </Name>
      )}
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}