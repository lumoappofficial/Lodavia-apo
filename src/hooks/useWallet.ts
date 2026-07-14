import { useApp } from '../contexts/AppContext';
import { postService } from '../services/post.service';

export function useWallet() {
  const {
    currentUser,
    setCurrentUser,
    showStoreModal,
    setShowStoreModal,
    showAdPlayer,
    setShowAdPlayer,
    adCountdown,
    setAdCountdown,
    adRewardClaimable,
    setAdRewardClaimable,
    currentAdCompany,
    setCurrentAdCompany,
    storeMessage,
    setStoreMessage,
    startWatchingAd,
    claimAdReward,
    handlePurchaseItem
  } = useApp();

  return {
    points: currentUser.points,
    purchasedItems: currentUser.purchasedItems,
    showStoreModal,
    setShowStoreModal,
    showAdPlayer,
    setShowAdPlayer,
    adCountdown,
    setAdCountdown,
    adRewardClaimable,
    setAdRewardClaimable,
    currentAdCompany,
    setCurrentAdCompany,
    storeMessage,
    setStoreMessage,
    startWatchingAd,
    claimAdReward,
    handlePurchaseItem,
    addPoints: async (amount: number): Promise<void> => {
      setCurrentUser(prev => ({ ...prev, points: prev.points + amount }));
    }
  };
}
