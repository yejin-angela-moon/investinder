import { useState, createContext, useContext, ReactNode } from "react";

interface WatchlistContextType {
  watchlist: string[];
  addToWatchlist: (companyID: string) => void;
  removeFromWatchlist: (companyID: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  
  const addToWatchlist = (companyID: string) => {
    console.log("useWatchlist: addToWatchlist called with:", companyID);
    setWatchlist(prev => {
      console.log("useWatchlist: Current watchlist before update:", prev);
      if (!prev.includes(companyID)) {
        console.log("useWatchlist: Adding to watchlist:", companyID);
        const newWatchlist = [...prev, companyID];
        console.log("useWatchlist: New watchlist:", newWatchlist);
        return newWatchlist;
      }
      console.log("useWatchlist: Company already in watchlist:", companyID);
      return prev;
    });
  };
  
  const removeFromWatchlist = (companyID: string) => {
    setWatchlist(prev => {
      console.log("Removed from watchlist:", companyID);
      return prev.filter(id => id !== companyID);
    });
  };
  
  return (
    <WatchlistContext.Provider 
      value={{ 
        watchlist, 
        addToWatchlist, 
        removeFromWatchlist 
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
