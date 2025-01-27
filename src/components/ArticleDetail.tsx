import { useNavigate } from 'react-router-dom';
import { getTimeStamp } from '@/utils/getTimeStamp';
import Avatar from './Avatar';

type ArticleDetailProps = {
  nickname: string;
  postedDate: string;
  profileImage: string;
  postUserId: string;
};

const ArticleDetail = ({ nickname, postedDate, profileImage, postUserId }: ArticleDetailProps) => {
  const timestamp = getTimeStamp(postedDate);
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center w-[23rem] min-h-[5rem] p-1 font-Cafe24SurroundAir text-tricorn-black dark:text-extra-white">
      <div className="flex flex-col w-[22.125rem]">
        <div className="flex w-[22.125rem] h-[1.5rem]">
          <div className="icon cursor-pointer">
            <Avatar
              width={2.5}
              profileImage={profileImage}
              isLoggedIn={false}
              onClick={() => navigate(`/profile/${postUserId}`)}
            />
          </div>
          <div className="ml-3 w-[19.62rem]">
            <div className="text-base">
              <span className="cursor-pointer" onClick={() => navigate(`/profile/${postUserId}`)}>
                {nickname}
              </span>
            </div>
            <div className="text-wall-street text-[10px]">{timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
