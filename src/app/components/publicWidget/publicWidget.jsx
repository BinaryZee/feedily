"use client";
import React, { useEffect, useState } from "react";
import Reaction from "./reaction";

const PublicWidget = ({ link }) => {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [feedbackCounts, setFeedbackCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [isDone, setIsDone] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const reactions = [
    { id: 1, emoji: "❤️" },
    { id: 2, emoji: "🙂" },
    { id: 3, emoji: "😐" },
    { id: 4, emoji: "🙁" },
    { id: 5, emoji: "😠" },
  ];

  useEffect(() => {
    const getAllData = async () => {
      await fetchIP();
      await fetchWidget();
      setLoading(false);
    };

    const fetchIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIp(data.ip);
        console.log("User IP:", data.ip);
      } catch (err) {
        console.error("Failed to fetch IP:", err);
      }
    };

    const fetchWidget = async () => {
      try {
        const res = await fetch(`/api/getWidget?link=${link}`);
        const data = await res.json();
        setData(data);

        const feedbacks = data.feedbacks || {};

        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        Object.values(feedbacks).forEach((value) => {
          const num = parseInt(value);
          if (num >= 1 && num <= 5) {
            counts[num]++;
          }
        });
        setFeedbackCounts(counts);

        if (feedbacks.hasOwnProperty(ip)) {
          const previousRating = parseInt(feedbacks[ip]);
          if (previousRating >= 1 && previousRating <= 5) {
            setSelectedRating(previousRating); 
            setIsDone(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch widget data:", err);
      }
    };  

    getAllData();
  }, [ip, link]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {!loading ? (
        <div className="flex flex-col gap-4 w-[50%] h-[70vh] border-2 rounded-2xl p-8 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-balance">
            {data.title}
          </h2>

          {reactions.map((reaction) => (
            <Reaction
              key={reaction.id}
              emoji={reaction.emoji}
              count={feedbackCounts[reaction.id] || 0}
              selected={selectedRating === reaction.id}
              onClick={async () => {
                if (selectedRating === reaction.id) return;

                setFeedbackCounts((prev) => {
                  const updated = { ...prev };
                  if (selectedRating) {
                    updated[selectedRating] = Math.max(
                      (updated[selectedRating] || 1) - 1,
                      0
                    );
                  }
                  updated[reaction.id] = (updated[reaction.id] || 0) + 1;
                  return updated;
                });

                setSelectedRating(reaction.id);

                try {
                  await fetch("/api/postFeedback", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ip,
                      rating: reaction.id,
                      link,
                    }),
                  });
                } catch (err) {
                  console.error("Failed to send feedback", err);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default PublicWidget;
