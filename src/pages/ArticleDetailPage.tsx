import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsTrash } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import Confirm from '@/components/Modals/Confirm';
import useModal from '@/hooks/useModal';
import { useNotification } from '@/hooks/useNotification';
import ArticleDetail from '@components/ArticleDetail';
import ArticleInfoIcon from '@components/ArticleInfoIcon';
import BackButton from '@components/BackButton';
import Loader from '@components/Loader';
import SubButton from '@components/SubButton';
import { BUTTON, MESSAGE } from '@constants/ArticleDetail';
import { useArticleDetail } from '@hooks/useArticleDetail';
import useAuthQuery from '@hooks/useAuthQuery';
import { useLikeCreateMutation, useLikeDeleteMutation } from '@hooks/useLikeMutation';
import CommentInput from './ArticleDetailPage/CommentInput';
import Comments from './ArticleDetailPage/Comments';

const ArticleDetailPage = () => {
  const navigate = useNavigate();
  const { showModal, modalOpen, modalClose } = useModal();

  const {
    userQuery: { data: user },
  } = useAuthQuery();
  const { data: article, isLoading, addComment, deletePostArticle } = useArticleDetail();
  const { mutate: likeCreateMutate, isLoading: isLikeCreateLoading } = useLikeCreateMutation();
  const { mutate: likeDeleteMutate, isLoading: isLikeDeleteLoading } = useLikeDeleteMutation();
  const { mutate: likeNotificationMutate, isLoading: isLikeNotificationLoading } =
    useNotification();
  const [isBigImage, setIsBigImage] = useState(false);

  if (isLoading) {
    return <Loader />;
  }

  const { _id, title, author, createdAt, likes, image, comments } = article!;
  const { fullName, _id: postUserId, image: authorProfileImage } = author;
  const { title: articleTitle, body: articleBody } = JSON.parse(title);

  const isMyPost = user ? user._id === postUserId : false;
  const myLike = likes.find((like) => (user ? like.user === user._id : false));
  const isLoginUser = !!user;

  const toggleLikeMutate = () => {
    if (myLike) {
      likeDeleteMutate(myLike._id);
    } else {
      likeCreateMutate(_id, {
        onSuccess: (newLike) => {
          likeNotificationMutate({
            notificationType: 'LIKE',
            notificationTypeId: newLike._id,
            userId: postUserId,
            postId: newLike.post,
          });
        },
      });
    }
  };

  const handleLikeButtonClick = () => {
    if (isLikeCreateLoading || isLikeDeleteLoading || isLikeNotificationLoading) {
      return;
    }
    if (!isLoginUser) {
      alert('로그인 후에 누를 수 있습니다!');
    } else {
      toggleLikeMutate();
    }
  };

  const handleDeletePost = async () => {
    deletePostArticle(_id);
  };

  const handleImageSize = () => {
    setIsBigImage(!isBigImage);
  };

  return (
    <div className="flex flex-col items-center max-w-[25.875rem] mx-auto h-[56rem] pt-[2.75rem] font-Cafe24SurroundAir">
      {showModal && (
        <Confirm
          theme="negative"
          title="게시물을 삭제하겠습니까?"
          onClose={modalClose}
          onConfirm={handleDeletePost}
        />
      )}
      <section className="post-field max-w-[22rem] w-full">
        <div className="flex justify-between">
          <BackButton onClick={() => navigate(-1)} />
          {isMyPost && (
            <div id="isMine" className="flex items-center justify-between w-[3rem]">
              <button
                type="button"
                name="edit"
                onClick={() => {
                  navigate(`/news/edit`, { state: { article } });
                }}
              >
                <FiEdit className="w-[1rem] h-[1rem]" />
              </button>
              <button type="button" name="delete" onClick={modalOpen}>
                <BsTrash className="w-[1rem] h-[1rem]" />
              </button>
            </div>
          )}
        </div>
        <div>
          <ArticleDetail
            nickname={fullName}
            postedDate={createdAt}
            profileImage={authorProfileImage ? authorProfileImage : ''}
            postUserId={postUserId}
          />
          <div className="my-3 text-lg text-tricorn-black dark:text-extra-white font-Cafe24Surround">
            {articleTitle}
          </div>
          <div className="flex items-center justify-center">
            {image && (
              <img
                src={image}
                className={isBigImage ? 'w-full m-5' : 'w-[14rem] m-5 rounded-lg'}
                onClick={handleImageSize}
              />
            )}
          </div>
          <div className="text-base text-tricorn-black dark:text-extra-white">{articleBody}</div>
          <div className="flex justify-between mt-6">
            <SubButton
              label={BUTTON.CHEER_UP}
              onClick={() => handleLikeButtonClick()}
              color="blue"
              type={myLike ? 'fill' : 'outline'}
              icon="good"
            />
            <ArticleInfoIcon
              //likes={likesCount ? likesCount : likes.length}
              likes={likes.length}
              comments={comments.length}
              mode="post"
              color={myLike ? 'blue' : 'gray'}
            />
          </div>
        </div>
        <div className="banner mt-[10%] mb-[5%] border-b-[0.01rem] border-lazy-gray" />
      </section>
      <section>
        {comments.length === 0 ? (
          <div className="flex justify-start w-[22rem] mt-[3%]">
            <span className="text-xs text-gray-400">{MESSAGE.NO_COMMENT}</span>
          </div>
        ) : (
          <div className="mb-[6rem]">
            <Comments comments={comments} userId={user ? user._id : null} />
          </div>
        )}
      </section>
      {isLoginUser && (
        <CommentInput
          onAddComment={addComment}
          postId={_id}
          userId={postUserId}
          userImage={user ? (user.image ? user.image : '') : ''}
        />
      )}
    </div>
  );
};

export default ArticleDetailPage;
