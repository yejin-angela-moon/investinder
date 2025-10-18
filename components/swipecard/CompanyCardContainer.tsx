import React, { useEffect, useRef, useState } from "react";
import { CompanyCard } from "./CompanyCard";
import SwipeableCard from "./SwipeableCard";

// dummy function for now since we DO NOT have a server
export function useLikes(companyID: string) {
  const [likes, setLikes] = useState(45);
  const onLike = () => setLikes((n) => n + 1);
  return { likes, onLike };
}

export function CompanyCardContainer({ companyID }: { companyID: string }) {
  const { likes, onLike } = useLikes(companyID);
  const THRESHOLD = 50;

  const prevLikesRef = useRef(likes);
  const firedRef = useRef(false);

  useEffect(() => {
    const prev = prevLikesRef.current;
    if (!firedRef.current && prev < THRESHOLD && likes >= THRESHOLD) {
      firedRef.current = true;
      console.log("GROUP CHAT CREATED FOR: ", companyID);
    }

    prevLikesRef.current = likes;
  }, [likes, companyID]);

  return (
    <SwipeableCard
      style={{ alignSelf: "center" }}
      onSwipeRight={() => {
        onLike();
        console.log("Liked via swipe →", companyID);
      }}
      onSwipeLeft={() => {
        console.log("Skipped via swipe ←", companyID);
      }}
      onCancel={() => {}}
    >
      <CompanyCard>
        <CompanyCard.Header
          logoURI="https://plus.unsplash.com/premium_photo-1664303314018-d59cbbb5b13d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1285"
          companyName="Investinder"
          intro="AI-first matching penguins with startups and invest and what not like you know what I mean frfr"
        />
        <CompanyCard.Body />
        <CompanyCard.Footer
          message="Looking for £400k..."
          likes={likes}
          onLike={onLike}
        />
      </CompanyCard>
    </SwipeableCard>
  );
}
