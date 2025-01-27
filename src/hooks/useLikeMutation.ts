import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteLikePost, likePost } from '@/api/common/Like';

export const useLikeCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: (like) =>
      Promise.all([
        queryClient.invalidateQueries(['article', like.post]),
        queryClient.invalidateQueries(['newestArticles']),
        queryClient.invalidateQueries(['articles']),
        queryClient.invalidateQueries(['user']),
      ]),
  });
};

export const useLikeDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLikePost,
    onSuccess: (like) =>
      Promise.all([
        queryClient.invalidateQueries(['article', like.post]),
        queryClient.invalidateQueries(['newestArticles']),
        queryClient.invalidateQueries(['articles']),
        queryClient.invalidateQueries(['user']),
      ]),
  });
};
