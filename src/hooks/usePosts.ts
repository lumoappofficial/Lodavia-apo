import { useApp } from '../contexts/AppContext';
import { postService } from '../services/post.service';
import { Post } from '../types';

export function usePosts() {
  const { 
    homePosts, 
    setHomePosts, 
    commentInputs, 
    setCommentInputs,
    newPostText,
    setNewPostText,
    newPostMedia,
    setNewPostMedia,
    handleLikeHomePost,
    handleSaveHomePost,
    handleAddHomeComment,
    handleCreateHomePost
  } = useApp();

  return {
    posts: homePosts,
    setPosts: setHomePosts,
    commentInputs,
    setCommentInputs,
    newPostText,
    setNewPostText,
    newPostMedia,
    setNewPostMedia,
    likePost: handleLikeHomePost,
    savePost: handleSaveHomePost,
    addComment: handleAddHomeComment,
    createPost: handleCreateHomePost,
    fetchPosts: async (communityId?: string): Promise<Post[]> => {
      const posts = await postService.getPosts(communityId);
      setHomePosts(posts);
      return posts;
    }
  };
}
