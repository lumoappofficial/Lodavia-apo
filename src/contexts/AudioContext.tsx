import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  AudioItem, 
  AmbientSoundChannel, 
  AudioPlaylist, 
  AudioQuality,
  LocalUserTrack,
  UserPodcast,
  PodcastEpisodeItem,
  LodaviaStory
} from '../types/audio';
import { 
  AUDIO_ITEMS, 
  AMBIENT_CHANNELS, 
  AUDIO_PLAYLISTS,
  LODAVIA_STORIES,
  INITIAL_USER_PODCASTS
} from '../data/audioData';

interface AudioContextType {
  currentTrack: AudioItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  isRepeat: boolean;
  isShuffle: boolean;
  queue: AudioItem[];
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  likedTrackIds: string[];
  downloadedTrackIds: string[];
  isFullPlayerOpen: boolean;
  audioQuality: AudioQuality;
  
  // Ambient Sound Generator Mixer State
  ambientChannels: AmbientSoundChannel[];
  isAmbientMixerOpen: boolean;
  
  // Playlists State
  createdPlaylists: AudioPlaylist[];

  // Local Tracks (User's device files)
  localTracks: LocalUserTrack[];
  addLocalFiles: (files: FileList | File[]) => void;
  removeLocalTrack: (id: string) => void;

  // Podcasts & Lodavia Stories State
  userPodcasts: UserPodcast[];
  createPodcast: (title: string, description: string, category: string, coverUrl?: string) => void;
  addPodcastEpisode: (podcastId: string, episode: Omit<PodcastEpisodeItem, 'id'>) => void;
  deletePodcast: (podcastId: string) => void;
  stories: LodaviaStory[];
  listeningHistory: AudioItem[];
  continueProgress: Record<string, { seconds: number; duration: number; date: string }>;

  // Actions
  playTrack: (track: AudioItem, newQueue?: AudioItem[]) => void;
  togglePlayPause: () => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seekTo: (seconds: number) => void;
  skipSeconds: (deltaSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (track: AudioItem) => void;
  removeFromQueue: (trackId: string) => void;
  setSleepTimerMinutes: (mins: number | null) => void;
  toggleLikeTrack: (trackId: string) => void;
  toggleDownloadTrack: (trackId: string) => void;
  setIsFullPlayerOpen: (open: boolean) => void;
  setAudioQuality: (quality: AudioQuality) => void;
  
  toggleAmbientChannel: (channelId: string) => void;
  setAmbientChannelVolume: (channelId: string, volume: number) => void;
  setIsAmbientMixerOpen: (open: boolean) => void;
  
  createPlaylist: (title: string, description: string, coverUrl?: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: AudioItem) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  stopAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioItem | null>(null); // Starts as null on load
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(215);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [queue, setQueue] = useState<AudioItem[]>(AUDIO_ITEMS);
  const [sleepTimerMinutes, setSleepTimerMinutesState] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(['track_1', 'track_3', 'ambient_1']);
  const [downloadedTrackIds, setDownloadedTrackIds] = useState<string[]>(['track_1', 'study_1']);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState<boolean>(false);
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('high');

  // Ambient Mixer state
  const [ambientChannels, setAmbientChannels] = useState<AmbientSoundChannel[]>(AMBIENT_CHANNELS);
  const [isAmbientMixerOpen, setIsAmbientMixerOpen] = useState<boolean>(false);

  // Created Playlists
  const [createdPlaylists, setCreatedPlaylists] = useState<AudioPlaylist[]>(() => {
    const saved = localStorage.getItem('lodavia_playlists');
    return saved ? JSON.parse(saved) : AUDIO_PLAYLISTS;
  });

  // Local User Audio Files (Device files only)
  const [localTracks, setLocalTracks] = useState<LocalUserTrack[]>(() => {
    const saved = localStorage.getItem('lodavia_local_tracks_meta');
    return saved ? JSON.parse(saved) : [];
  });

  // User Podcasts (Creator Studio)
  const [userPodcasts, setUserPodcasts] = useState<UserPodcast[]>(() => {
    const saved = localStorage.getItem('lodavia_podcasts');
    return saved ? JSON.parse(saved) : INITIAL_USER_PODCASTS;
  });

  // Lodavia Stories
  const [stories] = useState<LodaviaStory[]>(LODAVIA_STORIES);

  // Listening History
  const [listeningHistory, setListeningHistory] = useState<AudioItem[]>(() => {
    const saved = localStorage.getItem('lodavia_audio_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Continue Listening Progress Record: trackId -> { seconds, duration, date }
  const [continueProgress, setContinueProgress] = useState<Record<string, { seconds: number; duration: number; date: string }>>(() => {
    const saved = localStorage.getItem('lodavia_audio_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Underlying Audio Reference
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('lodavia_playlists', JSON.stringify(createdPlaylists));
  }, [createdPlaylists]);

  useEffect(() => {
    localStorage.setItem('lodavia_podcasts', JSON.stringify(userPodcasts));
  }, [userPodcasts]);

  useEffect(() => {
    localStorage.setItem('lodavia_audio_history', JSON.stringify(listeningHistory.slice(0, 30)));
  }, [listeningHistory]);

  useEffect(() => {
    localStorage.setItem('lodavia_audio_progress', JSON.stringify(continueProgress));
  }, [continueProgress]);

  // Update progress tracking for active track
  useEffect(() => {
    if (currentTrack && currentTime > 0) {
      setContinueProgress(prev => ({
        ...prev,
        [currentTrack.id]: {
          seconds: Math.floor(currentTime),
          duration: Math.floor(duration || currentTrack.duration),
          date: new Date().toISOString()
        }
      }));
    }
  }, [currentTime, currentTrack, duration]);

  // Initialize HTML5 Audio Object
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [isRepeat, queue, currentTrack]);

  // Sync track URL changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.volume = isMuted ? 0 : volume;
      setCurrentTime(0);
      setDuration(currentTrack.duration);

      if (wasPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Fallback timer for preview simulation if audio stream blocked
          setIsPlaying(true);
        });
      }
    }
  }, [currentTrack]);

  // Simulated fallback progress timer if Audio element fails or stays active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (!audioRef.current || audioRef.current.paused) {
          setCurrentTime(prev => {
            if (prev >= duration) {
              if (isRepeat) return 0;
              nextTrack();
              return 0;
            }
            return prev + 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isRepeat]);

  // Handle Sleep Timer Countdowns
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      setSleepTimerRemaining(null);
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      return;
    }

    let remainingSeconds = sleepTimerMinutes * 60;
    setSleepTimerRemaining(remainingSeconds);

    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);

    sleepTimerRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setSleepTimerRemaining(remainingSeconds);

      if (remainingSeconds <= 0) {
        pauseTrack();
        setSleepTimerMinutesState(null);
        setSleepTimerRemaining(null);
        if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      }
    }, 1000);

    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerMinutes]);

  // Actions
  const skipSeconds = (deltaSeconds: number) => {
    const newTime = Math.max(0, Math.min(duration || 300, currentTime + deltaSeconds));
    seekTo(newTime);
  };

  const playTrack = (track: AudioItem, newQueue?: AudioItem[]) => {
    setCurrentTrack(track);
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
    }
    // Add to history
    setListeningHistory(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered];
    });

    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Local file picker handler (files stay strictly local in browser memory/object URL)
  const addLocalFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newLocalTracks: LocalUserTrack[] = [];
    const newAudioItems: AudioItem[] = [];

    fileArray.forEach((file, index) => {
      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const trackId = `local_${Date.now()}_${index}`;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const localTrack: LocalUserTrack = {
        id: trackId,
        title: cleanName,
        artist: 'My Device Audio',
        fileName: file.name,
        fileSize: sizeMb,
        audioUrl: objectUrl,
        duration: 180, // Default until metadata loads
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        addedAt: new Date().toISOString(),
        isLocal: true
      };

      const audioItem: AudioItem = {
        id: trackId,
        title: cleanName,
        titleAr: cleanName,
        artist: 'My Local Music',
        artistAr: 'موسيقاي المحلية',
        category: 'music',
        categoryLabelAr: 'ملف صوتي محلي',
        categoryLabelEn: 'Local Audio File',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        audioUrl: objectUrl,
        duration: 180,
        playsCount: 1,
        likesCount: 0,
        isCopyrightClean: true,
        copyrightType: 'Creator-Original'
      };

      newLocalTracks.push(localTrack);
      newAudioItems.push(audioItem);
    });

    setLocalTracks(prev => [...newLocalTracks, ...prev]);
    setQueue(prev => [...newAudioItems, ...prev]);
  };

  const removeLocalTrack = (id: string) => {
    setLocalTracks(prev => prev.filter(t => t.id !== id));
    setQueue(prev => prev.filter(t => t.id !== id));
    if (currentTrack?.id === id) {
      nextTrack();
    }
  };

  // Creator Podcast actions
  const createPodcast = (title: string, description: string, category: string, coverUrl?: string) => {
    const newPod: UserPodcast = {
      id: `podcast_${Date.now()}`,
      title,
      titleAr: title,
      description,
      descriptionAr: description,
      category,
      categoryAr: category,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
      creatorName: 'You (Creator)',
      creatorHandle: '@me_creator',
      isPublished: true,
      isVerifiedCreator: false,
      subscribersCount: 1,
      episodes: []
    };
    setUserPodcasts(prev => [newPod, ...prev]);
  };

  const addPodcastEpisode = (podcastId: string, episode: Omit<PodcastEpisodeItem, 'id'>) => {
    const newEp: PodcastEpisodeItem = {
      ...episode,
      id: `ep_${Date.now()}`
    };

    setUserPodcasts(prev => prev.map(p => {
      if (p.id === podcastId) {
        return {
          ...p,
          episodes: [newEp, ...p.episodes]
        };
      }
      return p;
    }));
  };

  const deletePodcast = (podcastId: string) => {
    setUserPodcasts(prev => prev.filter(p => p.id !== podcastId));
  };

  const deletePlaylist = (playlistId: string) => {
    setCreatedPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setCreatedPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        return {
          ...pl,
          tracks: pl.tracks.filter(t => t.id !== trackId)
        };
      }
      return pl;
    }));
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const nextTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentTrack(queue[randomIndex]);
      setIsPlaying(true);
      return;
    }

    const currentIndex = queue.findIndex(item => item.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      setCurrentTrack(queue[currentIndex + 1]);
      setIsPlaying(true);
    } else {
      // Loop back to start
      setCurrentTrack(queue[0]);
      setIsPlaying(true);
    }
  };

  const prevTrack = () => {
    if (!currentTrack || queue.length === 0) return;
    
    // If current time > 3s, rewind to 0
    if (currentTime > 3) {
      seekTo(0);
      return;
    }

    const currentIndex = queue.findIndex(item => item.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(queue[currentIndex - 1]);
      setIsPlaying(true);
    } else {
      setCurrentTrack(queue[queue.length - 1]);
      setIsPlaying(true);
    }
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const addToQueue = (track: AudioItem) => {
    if (!queue.some(item => item.id === track.id)) {
      setQueue([...queue, track]);
    }
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(queue.filter(item => item.id !== trackId));
  };

  const setSleepTimerMinutes = (mins: number | null) => {
    setSleepTimerMinutesState(mins);
  };

  const toggleLikeTrack = (trackId: string) => {
    setLikedTrackIds(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleDownloadTrack = (trackId: string) => {
    setDownloadedTrackIds(prev =>
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const toggleAmbientChannel = (channelId: string) => {
    setAmbientChannels(prev => 
      prev.map(ch => ch.id === channelId ? { ...ch, isActive: !ch.isActive } : ch)
    );
  };

  const setAmbientChannelVolume = (channelId: string, volume: number) => {
    setAmbientChannels(prev =>
      prev.map(ch => ch.id === channelId ? { ...ch, volume } : ch)
    );
  };

  const createPlaylist = (title: string, description: string, coverUrl?: string) => {
    const newPlaylist: AudioPlaylist = {
      id: `custom_pl_${Date.now()}`,
      title,
      titleAr: title,
      description,
      descriptionAr: description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      creatorName: 'You (Lodavia Member)',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isVerifiedCreator: false,
      isCollaborative: false,
      likesCount: 1,
      tracks: [],
      tags: ['Custom', 'User']
    };
    setCreatedPlaylists([newPlaylist, ...createdPlaylists]);
  };

  const addTrackToPlaylist = (playlistId: string, track: AudioItem) => {
    setCreatedPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        if (!pl.tracks.some(t => t.id === track.id)) {
          return { ...pl, tracks: [...pl.tracks, track] };
        }
      }
      return pl;
    }));
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackSpeed,
        isRepeat,
        isShuffle,
        queue,
        sleepTimerMinutes,
        sleepTimerRemaining,
        likedTrackIds,
        downloadedTrackIds,
        isFullPlayerOpen,
        audioQuality,
        ambientChannels,
        isAmbientMixerOpen,
        createdPlaylists,
        localTracks,
        userPodcasts,
        stories,
        listeningHistory,
        continueProgress,

        addLocalFiles,
        removeLocalTrack,
        createPodcast,
        addPodcastEpisode,
        deletePodcast,
        deletePlaylist,
        removeTrackFromPlaylist,
        skipSeconds,

        playTrack,
        togglePlayPause,
        pauseTrack,
        resumeTrack,
        nextTrack,
        prevTrack,
        seekTo,
        setVolume,
        toggleMute,
        setPlaybackSpeed,
        toggleRepeat,
        toggleShuffle,
        addToQueue,
        removeFromQueue,
        setSleepTimerMinutes,
        toggleLikeTrack,
        toggleDownloadTrack,
        setIsFullPlayerOpen,
        setAudioQuality,

        toggleAmbientChannel,
        setAmbientChannelVolume,
        setIsAmbientMixerOpen,

        createPlaylist,
        addTrackToPlaylist,
        stopAudio
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
