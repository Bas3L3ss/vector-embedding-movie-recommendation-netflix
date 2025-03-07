"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Plus, Star, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type Episode = {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  progress: number;
};

type Season = {
  id: string;
  name: string;
  episodes: Episode[];
};

export default function TVShowPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>("1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  const seasons: Season[] = [
    {
      id: "1",
      name: "Season 1",
      episodes: [
        {
          id: 1,
          title: "Pilot",
          description:
            "The journey begins as our protagonists discover a mysterious artifact that will change their lives forever.",
          duration: "45 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 100,
        },
        {
          id: 2,
          title: "The Discovery",
          description:
            "The team delves deeper into the mystery, uncovering clues that lead them to an unexpected destination.",
          duration: "42 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 75,
        },
        {
          id: 3,
          title: "Revelations",
          description:
            "Shocking truths are revealed as the protagonists face their first major obstacle.",
          duration: "47 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 0,
        },
        {
          id: 4,
          title: "The Confrontation",
          description:
            "Tensions rise as the team confronts an enemy from their past, testing their newfound alliance.",
          duration: "51 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 0,
        },
      ],
    },
    {
      id: "2",
      name: "Season 2",
      episodes: [
        {
          id: 1,
          title: "New Beginnings",
          description:
            "One year later, our heroes regroup to face a new threat that endangers everything they've built.",
          duration: "48 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 0,
        },
        {
          id: 2,
          title: "Shadows of the Past",
          description:
            "A familiar face returns, bringing with them secrets that could unravel the team's mission.",
          duration: "45 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 0,
        },
        {
          id: 3,
          title: "Alliances",
          description:
            "Forced to work with former enemies, the team must navigate treacherous political waters.",
          duration: "46 min",
          thumbnail: "/placeholder.svg?height=180&width=320",
          progress: 0,
        },
      ],
    },
  ];

  const handlePlayEpisode = (episode: Episode) => {
    setCurrentEpisode(episode);
    setIsPlaying(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="pt-24 min-h-screen bg-black text-white">
      {/* Banner and Header */}
      <div className="relative w-full h-[50vh] md:h-[70vh]">
        {isPlaying && currentEpisode ? (
          <div className="absolute inset-0 bg-black">
            <div className="relative w-full h-full">
              <video
                className="w-full h-full object-contain"
                controls
                autoPlay
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              >
                Your browser does not support the video tag.
              </video>
              <Button
                variant="outline"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                onClick={() => setIsPlaying(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0">
              <Image
                src="/placeholder.svg?height=1080&width=1920"
                alt="Show banner"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                Cosmic Frontiers
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1">9.2</span>
                </div>
                <span>2023</span>
                <span className="border border-white/20 px-2 py-0.5 text-sm">
                  TV-MA
                </span>
              </div>
              <p className="text-lg max-w-2xl mb-6">
                A team of explorers ventures into the unknown reaches of space,
                discovering wonders and terrors beyond imagination while
                confronting their own demons.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => handlePlayEpisode(seasons[0].episodes[0])}
                >
                  <Play className="w-5 h-5 fill-current" /> Play
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  <Plus className="w-5 h-5" /> My List
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Season Selection and Episodes */}
      <div className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue={selectedSeason}
          onValueChange={setSelectedSeason}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Episodes</h2>
            <TabsList className="bg-gray-800">
              {seasons.map((season) => (
                <TabsTrigger
                  key={season.id}
                  value={season.id}
                  className="data-[state=active]:bg-gray-700"
                >
                  {season.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {seasons.map((season) => (
            <TabsContent
              key={season.id}
              value={season.id}
              className="space-y-6"
            >
              {season.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="flex flex-col md:flex-row gap-4 p-4 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => handlePlayEpisode(episode)}
                >
                  <div className="relative w-full md:w-64 aspect-video rounded-md overflow-hidden">
                    <Image
                      src={episode.thumbnail || "/placeholder.svg"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                    />
                    {episode.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                        <Progress value={episode.progress} className="h-full" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                      <Play className="w-12 h-12 fill-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-medium">
                        {episode.id}. {episode.title}
                      </h3>
                      <span className="text-gray-400">{episode.duration}</span>
                    </div>
                    <p className="text-gray-300 mt-2">{episode.description}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        Rate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Watch Next Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video rounded-md overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=180&width=320&text=Show+${
                      index + 1
                    }`}
                    alt={`Similar show ${index + 1}`}
                    width={320}
                    height={180}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium truncate">
                    Similar Series {index + 1}
                  </h3>
                  <div className="flex items-center text-sm text-gray-400">
                    <span className="mr-2">2023</span>
                    <span>TV-MA</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
