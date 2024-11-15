"use client";
import React from "react";
import { Carousel, Card } from "@/components/ui/cards-carousel";

export function HomePageCards() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    (<div className="w-full h-full py-20">
      <h2
        className=" pl-4 sm:mx-7 text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Popular Categories
      </h2>
      <Carousel items={cards} />
    </div>)
  );
}


const data = [
  {
    category: "Music",
    title: "Rock Concerts",
    src: "https://images.unsplash.com/photo-1565035010268-a3816f98589a?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Sports",
    title: "Football Matches",
    src: "https://images.unsplash.com/photo-1598121876884-f4573ed0b9f0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Sports",
    title: "Formula 1 Races",
    src: "https://images.unsplash.com/photo-1522519972666-d8677d9d3e67?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Music",
    title: "Pop Concerts",
    src: "https://images.unsplash.com/photo-1615799564339-fc60b0f28cd4?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Theater",
    title: "Comedy Shows",
    src: "https://images.unsplash.com/photo-1675712262701-3d08442ff5fa?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  
  {
    category: "Sports",
    title: "Cricket Matches",
    src: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1929&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    category: "Movies",
    title: "Movie Premieres",
    src: "https://images.unsplash.com/photo-1580478341213-659047bb025c?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    category: "Sports",
    title: "Tennis Tournaments",
    src: "https://images.unsplash.com/photo-1530915365347-e35b749a0381?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Theater",
    title: "Mime",
    src: "https://images.unsplash.com/photo-1506780789966-15774276e069?q=80&w=2101&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Sports",
    title: "Basketball Games",
    src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    category: "Music",
    title: "Electronic Music Festivals",
    src: "https://images.unsplash.com/photo-1520242739010-44e95bde329e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

];
