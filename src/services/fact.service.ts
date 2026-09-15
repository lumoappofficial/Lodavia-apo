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
import { Fact, FactComment } from '../types';
import { storage } from '../utils/storage';
import { handleFirestoreError, OperationType } from '../utils/firestore-error';

// Preseeded historical facts to show in archive or as fallback
const preseededFacts: Fact[] = [
  {
    id: 'fact-preseeded-1',
    date: '2026-07-20',
    textAr: 'يوم واحد على كوكب الزهرة أطول من سنة كاملة عليه! يدور كوكب الزهرة حول الشمس في 225 يوماً أرضياً، بينما يستغرق الأمر 243 يوماً أرضياً ليدور الكوكب حول محوره مرة واحدة فقط.',
    textEn: 'A day on Venus is longer than a year on Venus! It takes Venus 225 Earth days to orbit the Sun, but 243 Earth days to rotate once on its axis.',
    category: 'Space',
    sourceName: 'NASA Solar System Exploration',
    sourceUrl: 'https://solarsystem.nasa.gov/planets/venus/in-depth/',
    likesCount: 24,
    commentsCount: 1,
    usefulCount: 45,
    notUsefulCount: 1,
    likesBy: [],
    savedBy: [],
    usefulBy: [],
    notUsefulBy: [],
    comments: [
      {
        id: 'comm-1',
        userId: 'explorer-1',
        userName: 'أحمد الفلكي',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'معلومة مذهلة جداً! كيف يعيش المرء هناك هههه',
        timestamp: '2026-07-20T10:00:00.000Z'
      }
    ]
  },
  {
    id: 'fact-preseeded-2',
    date: '2026-07-19',
    textAr: 'جسم الإنسان يحتوي على حوالي 37.2 تريليون خلية! تعمل هذه الخلايا بشكل متناغم مذهل لأداء الوظائف الحيوية اليومية، وكل خلية تحتوي على نسختها الكاملة من الحمض النووي الخاص بك.',
    textEn: 'The human body is made up of approximately 37.2 trillion cells! These cells work in breathtaking harmony to perform daily life functions, and each cell contains a complete copy of your DNA.',
    category: 'Human Body',
    sourceName: 'National Institutes of Health (NIH)',
    sourceUrl: 'https://www.nih.gov/',
    likesCount: 18,
    commentsCount: 0,
    usefulCount: 32,
    notUsefulCount: 0,
    likesBy: [],
    savedBy: [],
    usefulBy: [],
    notUsefulBy: [],
    comments: []
  },
  {
    id: 'fact-preseeded-3',
    date: '2026-07-18',
    textAr: 'في عام 1957، أطلق الاتحاد السوفيتي "سبوتنيك 1"، وهو أول قمر صناعي من صنع الإنسان يدور حول الأرض، معلناً بداية عصر الفضاء والسباق التكنولوجي الكوني.',
    textEn: 'In 1957, the Soviet Union launched Sputnik 1, the first artificial satellite to orbit Earth, marking the official beginning of the Space Age and the cosmic technological race.',
    category: 'History',
    sourceName: 'Encyclopaedia Britannica',
    sourceUrl: 'https://www.britannica.com/topic/Sputnik',
    likesCount: 35,
    commentsCount: 0,
    usefulCount: 50,
    notUsefulCount: 2,
    likesBy: [],
    savedBy: [],
    usefulBy: [],
    notUsefulBy: [],
    comments: []
  }
];

export const factService = {
  // Fetch fact of the day for a specific date (deterministically via API/Gemini, then stored)
  getDailyFact: async (userId: string, date: string): Promise<Fact> => {
    if (isFirebaseConfigured && db) {
      const path = `facts/fact-${date}`;
      try {
        const docRef = doc(db, 'facts', `fact-${date}`);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
          const data = snap.data() as Fact;
          return {
            ...data,
            id: snap.id,
            isLiked: data.likesBy?.includes(userId) || false,
            isSaved: data.savedBy?.includes(userId) || false,
            votedUseful: data.usefulBy?.includes(userId) ? 'useful' : data.notUsefulBy?.includes(userId) ? 'notUseful' : undefined
          } as any;
        }

        // If not exists in Firestore, generate it via Express backend API using Gemini!
        const response = await fetch('/api/ai/fact-of-the-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, forceAnother: false })
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate daily fact from Gemini API');
        }

        const generated: any = await response.json();
        
        const newFact: Fact = {
          id: `fact-${date}`,
          date,
          textAr: generated.textAr,
          textEn: generated.textEn,
          category: generated.category || 'Science',
          sourceName: generated.sourceName || 'NASA',
          sourceUrl: generated.sourceUrl || 'https://www.nasa.gov/',
          likesCount: 0,
          commentsCount: 0,
          usefulCount: 0,
          notUsefulCount: 0,
          likesBy: [],
          savedBy: [],
          usefulBy: [],
          notUsefulBy: [],
          comments: []
        };

        // Save to Firestore
        await setDoc(doc(db, 'facts', `fact-${date}`), newFact);
        return newFact;

      } catch (err) {
        console.warn("Firestore error fetching daily fact, fallback to local storage:", err);
        return factService.getDailyFactLocal(userId, date);
      }
    } else {
      return factService.getDailyFactLocal(userId, date);
    }
  },

  // Helper for Local Storage get/generate
  getDailyFactLocal: async (userId: string, date: string): Promise<Fact> => {
    const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
    let fact = facts.find(f => f.date === date);

    if (!fact) {
      // Try generating via Express server if running (Gemini API fallback)
      try {
        const response = await fetch('/api/ai/fact-of-the-day', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, forceAnother: false })
        });
        if (response.ok) {
          const generated = await response.json();
          fact = {
            id: `fact-${date}`,
            date,
            textAr: generated.textAr,
            textEn: generated.textEn,
            category: generated.category || 'Science',
            sourceName: generated.sourceName || 'NASA',
            sourceUrl: generated.sourceUrl || 'https://www.nasa.gov/',
            likesCount: 0,
            commentsCount: 0,
            usefulCount: 0,
            notUsefulCount: 0,
            likesBy: [],
            savedBy: [],
            usefulBy: [],
            notUsefulBy: [],
            comments: []
          };
          facts.unshift(fact);
          storage.save('lumo_facts', facts);
        }
      } catch (e) {
        console.error("Local fetch generate error:", e);
      }
    }

    // Still not found? Use first preseeded or create a default
    if (!fact) {
      fact = {
        ...preseededFacts[0],
        id: `fact-${date}`,
        date
      };
      facts.unshift(fact);
      storage.save('lumo_facts', facts);
    }

    return {
      ...fact,
      isLiked: fact.likesBy?.includes(userId) || false,
      isSaved: fact.savedBy?.includes(userId) || false,
      votedUseful: fact.usefulBy?.includes(userId) ? 'useful' : fact.notUsefulBy?.includes(userId) ? 'notUseful' : undefined
    } as any;
  },

  // Get Another Fact (Randomly from Gemini and saved)
  getRandomFact: async (userId: string): Promise<Fact> => {
    try {
      const response = await fetch('/api/ai/fact-of-the-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceAnother: true })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate random fact from Gemini');
      }

      const generated = await response.json();
      const randId = `fact-rand-${Date.now()}`;
      
      const newFact: Fact = {
        id: randId,
        date: new Date().toISOString().split('T')[0],
        textAr: generated.textAr,
        textEn: generated.textEn,
        category: generated.category || 'Science',
        sourceName: generated.sourceName || 'NASA',
        sourceUrl: generated.sourceUrl || 'https://www.nasa.gov/',
        likesCount: 0,
        commentsCount: 0,
        usefulCount: 0,
        notUsefulCount: 0,
        likesBy: [],
        savedBy: [],
        usefulBy: [],
        notUsefulBy: [],
        comments: []
      };

      if (isFirebaseConfigured && db) {
        await setDoc(doc(db, 'facts', randId), newFact);
      } else {
        const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
        facts.unshift(newFact);
        storage.save('lumo_facts', facts);
      }

      return newFact;
    } catch (error) {
      console.error("Error generating random fact:", error);
      // Fallback: pick a random preseeded fact
      const randomIndex = Math.floor(Math.random() * preseededFacts.length);
      const chosen = preseededFacts[randomIndex];
      return {
        ...chosen,
        id: `fact-fallback-${Date.now()}`
      };
    }
  },

  // Get past facts
  getArchiveFacts: async (): Promise<Fact[]> => {
    if (isFirebaseConfigured && db) {
      const path = 'facts';
      try {
        const colRef = collection(db, 'facts');
        const snap = await getDocs(colRef);
        const docs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Fact[];
        // Sort by date or id descending
        return docs.sort((a, b) => b.date.localeCompare(a.date));
      } catch (err) {
        console.warn("Firestore archive facts error, using fallback:", err);
        return storage.load<Fact[]>('lumo_facts', preseededFacts);
      }
    } else {
      return storage.load<Fact[]>('lumo_facts', preseededFacts);
    }
  },

  // Helper for Local Storage actions
  likeFactLocal: (factId: string, userId: string, isLiked: boolean): number => {
    const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
    const idx = facts.findIndex(f => f.id === factId);
    if (idx !== -1) {
      let likesBy = facts[idx].likesBy || [];
      if (isLiked) {
        likesBy = likesBy.filter(uid => uid !== userId);
      } else {
        likesBy.push(userId);
      }
      facts[idx].likesBy = likesBy;
      facts[idx].likesCount = likesBy.length;
      storage.save('lumo_facts', facts);
      return likesBy.length;
    }
    return 0;
  },

  saveFactLocal: (factId: string, userId: string, isSaved: boolean): void => {
    const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
    const idx = facts.findIndex(f => f.id === factId);
    if (idx !== -1) {
      let savedBy = facts[idx].savedBy || [];
      if (isSaved) {
        savedBy = savedBy.filter(uid => uid !== userId);
      } else {
        savedBy.push(userId);
      }
      facts[idx].savedBy = savedBy;
      storage.save('lumo_facts', facts);
    }
  },

  voteUsefulLocal: (factId: string, userId: string, type: 'useful' | 'notUseful', cancel: boolean): {usefulCount: number, notUsefulCount: number} => {
    const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
    const idx = facts.findIndex(f => f.id === factId);
    if (idx !== -1) {
      let usefulBy = facts[idx].usefulBy || [];
      let notUsefulBy = facts[idx].notUsefulBy || [];

      usefulBy = usefulBy.filter(uid => uid !== userId);
      notUsefulBy = notUsefulBy.filter(uid => uid !== userId);

      if (!cancel) {
        if (type === 'useful') {
          usefulBy.push(userId);
        } else {
          notUsefulBy.push(userId);
        }
      }

      facts[idx].usefulBy = usefulBy;
      facts[idx].notUsefulBy = notUsefulBy;
      facts[idx].usefulCount = usefulBy.length;
      facts[idx].notUsefulCount = notUsefulBy.length;
      
      storage.save('lumo_facts', facts);
      return { usefulCount: usefulBy.length, notUsefulCount: notUsefulBy.length };
    }
    return { usefulCount: 0, notUsefulCount: 0 };
  },

  addCommentLocal: (factId: string, comment: FactComment): void => {
    const facts = storage.load<Fact[]>('lumo_facts', preseededFacts);
    const idx = facts.findIndex(f => f.id === factId);
    if (idx !== -1) {
      if (!facts[idx].comments) facts[idx].comments = [];
      facts[idx].comments.push(comment);
      facts[idx].commentsCount = (facts[idx].commentsCount || 0) + 1;
      storage.save('lumo_facts', facts);
    }
  },

  // Toggle Like
  likeFact: async (factId: string, userId: string, isLiked: boolean): Promise<number> => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'facts', factId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return factService.likeFactLocal(factId, userId, isLiked);
        
        const data = snap.data() as Fact;
        let likesBy = data.likesBy || [];
        if (isLiked) {
          likesBy = likesBy.filter(uid => uid !== userId);
        } else {
          likesBy.push(userId);
        }

        await updateDoc(docRef, {
          likesBy,
          likesCount: likesBy.length
        });
        return likesBy.length;
      } catch (err) {
        console.warn("Firestore error liking fact, using local fallback:", err);
        return factService.likeFactLocal(factId, userId, isLiked);
      }
    } else {
      return factService.likeFactLocal(factId, userId, isLiked);
    }
  },

  // Toggle Save
  saveFact: async (factId: string, userId: string, isSaved: boolean): Promise<void> => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'facts', factId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          factService.saveFactLocal(factId, userId, isSaved);
          return;
        }
        
        const data = snap.data() as Fact;
        let savedBy = data.savedBy || [];
        if (isSaved) {
          savedBy = savedBy.filter(uid => uid !== userId);
        } else {
          savedBy.push(userId);
        }

        await updateDoc(docRef, { savedBy });
      } catch (err) {
        console.warn("Firestore error saving fact, using local fallback:", err);
        factService.saveFactLocal(factId, userId, isSaved);
      }
    } else {
      factService.saveFactLocal(factId, userId, isSaved);
    }
  },

  // Vote useful or notUseful
  voteUseful: async (factId: string, userId: string, type: 'useful' | 'notUseful', cancel: boolean): Promise<{usefulCount: number, notUsefulCount: number}> => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'facts', factId);
        const snap = await getDoc(docRef);
        if (!snap.exists()) return factService.voteUsefulLocal(factId, userId, type, cancel);
        
        const data = snap.data() as Fact;
        let usefulBy = data.usefulBy || [];
        let notUsefulBy = data.notUsefulBy || [];

        // Clear existing votes for this user
        usefulBy = usefulBy.filter(uid => uid !== userId);
        notUsefulBy = notUsefulBy.filter(uid => uid !== userId);

        if (!cancel) {
          if (type === 'useful') {
            usefulBy.push(userId);
          } else {
            notUsefulBy.push(userId);
          }
        }

        const counts = {
          usefulCount: usefulBy.length,
          notUsefulCount: notUsefulBy.length,
          usefulBy,
          notUsefulBy
        };

        await updateDoc(docRef, counts);
        return { usefulCount: counts.usefulCount, notUsefulCount: counts.notUsefulCount };
      } catch (err) {
        console.warn("Firestore error voting useful, using local fallback:", err);
        return factService.voteUsefulLocal(factId, userId, type, cancel);
      }
    } else {
      return factService.voteUsefulLocal(factId, userId, type, cancel);
    }
  },

  // Add Comment
  addComment: async (factId: string, comment: FactComment): Promise<void> => {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'facts', factId);
        await updateDoc(docRef, {
          comments: arrayUnion(comment),
          commentsCount: increment(1)
        });
      } catch (err) {
        console.warn("Firestore error adding comment, using local fallback:", err);
        factService.addCommentLocal(factId, comment);
      }
    } else {
      factService.addCommentLocal(factId, comment);
    }
  }
};
