import React from "react";
import { CompanyCard } from "./CompanyCard";
import SwipeableCard from "./SwipeableCard";
import { getCompanyData } from "./CompanyData";

export function CompanyCardContainer({ 
  companyID, 
  onAddToWatchlist,
  onSkip
}: { 
  companyID: string;
  onAddToWatchlist?: (companyID: string) => void;
  onSkip?: () => void;
}) {
  const companyData = getCompanyData(companyID);

  const handleSwipeRight = () => {
    console.log("CompanyCardContainer: Swipe right detected for:", companyID);
    console.log("CompanyCardContainer: onAddToWatchlist function:", onAddToWatchlist);
    onAddToWatchlist?.(companyID);
    console.log("CompanyCardContainer: Added to watchlist via swipe →", companyID);
  };

  return (
    <SwipeableCard
      style={{ alignSelf: "center" }}
      swipeThreshold={80}
      onSwipeRight={handleSwipeRight}
      onSwipeLeft={() => {
        console.log("Skipped via swipe ←", companyID);
        onSkip?.();
      }}
      onCancel={() => {}}
    >
      <CompanyCard>
        <CompanyCard.Header
          logoURI={companyData.logoURI}
          companyName={companyData.name}
          intro={companyData.intro}
        />
        <CompanyCard.Body companyID={companyID} />
        <CompanyCard.Footer />
      </CompanyCard>
    </SwipeableCard>
  );
}
