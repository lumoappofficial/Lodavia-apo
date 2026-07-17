import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  arrayUnion, 
  increment 
} from 'firebase/firestore';
import { Post } from '../types';
import { initialHomePosts } from '../data';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

export const postService = {
  getPosts: async (communityId?: string): Promise<Post[]> => {
    if (isFirebaseConfigured && db) {
      const postsColPath = 'posts';
      try {
        const postsCol = collection(db, postsColPath);
        let q;
        if (communityId) {
          q = query(postsCol, where('communityId', '==', communityId), orderBy('timestamp', 'desc'));
        } else {
          q = query(postsCol, orderBy('timestamp', 'desc'), limit(50));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Post[];
      } catch (err) {
        console.warn("Firestore post fetching error, using fallback helper:", err);
        try {
          handleFirestoreError(err, OperationType.LIST, postsColPath);
        } catch (wrappedErr) {
          console.error("Firestore Error Wrapped:", wrappedErr);
        }
        return storage.load<Post[]>('lumo_posts', initialHomePosts);
      }
    } else {
      const posts = storage.load<Post[]>('lumo_posts', initialHomePosts);
      if (communityId) {
        return posts.filter((p: any) => p.communityId === communityId);
      }
      return posts;
    }
  },

  createPost: async (post: Post, userId: string): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `posts/${post.id}`;
      try {
        await setDoc(doc(db, 'posts', post.id), {
          ...post,
          authorId: userId,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, path);
      }
    } else {
      const posts = storage.load<Post[]>('lumo_posts', initialHomePosts);
      posts.unshift(post);
      storage.save('lumo_posts', posts);
    }
  },

  likePost: async (postId: string, userId: string, isLiked: boolean): Promise<number> => {
    if (isFirebaseConfigured && db) {
      const path = `posts/${postId}`;
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likes: increment(isLiked ? -1 : 1)
        });
        const updatedDoc = await getDoc(postRef);
        return updatedDoc.data()?.likes || 0;
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const posts = storage.load<Post[]>('lumo_posts', initialHomePosts);
      const postIdx = posts.findIndex((p: any) => p.id === postId);
      if (postIdx !== -1) {
        posts[postIdx].likes = posts[postIdx].likes + (isLiked ? -1 : 1);
        posts[postIdx].likedByMe = !isLiked;
        storage.save('lumo_posts', posts);
        return posts[postIdx].likes;
      }
      return 0;
    }
  },

  addComment: async (postId: string, comment: any): Promise<void> => {
    if (isFirebaseConfigured && db) {
      const path = `posts/${postId}`;
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          comments: arrayUnion(comment),
          commentsCount: increment(1)
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } else {
      const posts = storage.load<Post[]>('lumo_posts', initialHomePosts);
      const postIdx = posts.findIndex((p: any) => p.id === postId);
      if (postIdx !== -1) {
        if (!posts[postIdx].comments) posts[postIdx].comments = [];
        posts[postIdx].comments.push(comment);
        posts[postIdx].commentsCount = (posts[postIdx].commentsCount || 0) + 1;
        storage.save('lumo_posts', posts);
      }
    }
  }
};
