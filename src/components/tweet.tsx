import { useState } from "react";
import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
// import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;
const Column = styled.div`
  // &:last-child {
  //   place-self: end;
  // }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;
const Payload = styled.p`
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  padding: 10px;
  margin: 10px 0px;
  font-size: 18px;
  white-space: pre-line;
  line-height: 1.5;
`;
const DeleteButton = styled.button`
  margin-top: 10px;
  background-color: transparent;
  color: tomato;
  border: 0;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
`;
const EditButton = styled.button`
  margin-top: 10px;
  background-color: transparent;
  color: grey;
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
// const AddFileBtn = styled.label`
//   padding: 10px 0px;
//   color: #1d9bf0;
//   text-align: center;
//   border-radius: 20px;
//   border: 1px solid #1d9bf0;
//   font-size: 14px;
//   font-weight: 600;
//   cursor: pointer;
// `;
// const AddFileInput = styled.input`
//   display: none;
// `;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;
  const [editMode, setEditMode] = useState(false);
  const [newTweet, setNewTweet] = useState(tweet);
  // const [newPhoto, setNewPhoto] = useState<File | null>(null);

  const onDelete = async () => {
    const ok = confirm("트윗을 삭제하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onEdit = async () => {
    if (user?.uid !== userId) return;
    setEditMode(!editMode);
  };

  const onSaveEdit = async () => {
    if (user?.uid !== userId) return;

    try {
      // let photoUrl = photo; // 새로 사진을 업로드하지 않으면 기존 사진을 유지
      // if (newPhoto) {
      //   // 새 사진을 Firebase Storage에 업로드. 파일검증추가해야함
      //   const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
      //   await uploadBytes(photoRef, newPhoto);
      //   photoUrl = await getDownloadURL(photoRef); // 새 사진 URL 가져오기
      // } else if (newPhoto === null) {
      //   // 새로운 사진이 없으면, 기존 사진을 그대로 유지하거나 삭제
      //   photoUrl = null; // photoUrl을 null로 설정하여 해당 필드를 삭제하려면 이렇게 처리
      // }
      await updateDoc(doc(db, "tweets", id), {
        tweet: newTweet,
        // photo: photoUrl,
      });
      setEditMode(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editMode ? (
          <>
            <TextArea
            required
            rows={5}
            maxLength={180}
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="새 트윗을 입력하세요"
            />
            {/* <AddFileBtn htmlFor="file">
              {newPhoto ? "첨부완료✅" : "사진첨부"}
            </AddFileBtn>
            <AddFileInput
            onChange={(e) => e.target.files && setNewPhoto(e.target.files[0])}
            type="file"
            id="file"
            accept="image/*"
            /> */}
            <Column>
            <EditButton onClick={onEdit} style={{ color: 'tomato' }}>취소</EditButton>
            <SaveButton onClick={onSaveEdit}>저장</SaveButton>
            </Column>
          </>
        ) : (
          <Column>
            <Payload>{tweet}</Payload>
            {photo && <Photo src={photo} />}
            {user?.uid === userId && (
              <>
                <DeleteButton onClick={onDelete}>삭제</DeleteButton>
                <EditButton onClick={onEdit}>수정</EditButton>
              </>
            )}
          </Column>
        )}
      </Column>
    </Wrapper>
  );
}