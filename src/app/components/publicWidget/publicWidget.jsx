"use client";
import React, { useEffect, useRef, useState } from "react";
import Reaction from "./reaction";
import TextFeedbacks from "./textFeedbacks";
import { Send } from "lucide-react";

const PublicWidget = ({ link }) => {
  const feedback = useRef(null);
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [allowFeedback, setFeedback] = useState(null);
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
  const [isNameGiven, setIsNameGiven] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const getAllData = async () => {
      await fetchIP();
      await fetchWidget();
    };

    const fetchIP = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.error("Failed to fetch IP:", err);
      }
    };

    const fetchWidget = async () => {
      try {
        const res = await fetch(`/api/getWidget?link=${link}`);
        const data = await res.json();
        setData(data);
        setFeedback(data.text_feedback);
        
        if (data.archieved) {
          setLoading(false);
          return;
        }

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
        const resIp = await fetch("/api/ipExist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip }),
        });

        const userIpData = await resIp.json();
        setIsNameGiven(userIpData.exists);
        if (userIpData.exists) setUsername(userIpData.userName);
      } catch (err) {
        console.error("Failed to fetch widget data:", err);
      }
      setLoading(false);
    };

    getAllData();
  }, [ip, link]);

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsNameGiven(true);
      await fetch("/api/postUserName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ip,
          userName: username,
        }),
      });
    }
  };

  const handelFeedbackSubmit = async () => {
    if (feedback.current) {
      const value = feedback.current.value;
      feedback.current.value = "";
      await fetch("/api/postTextFeedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          link,
          user_name: username,
          title: value,
        }),
      });
    }
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center"><h2>Loading...</h2></div>
  }
  if (data.archieved) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 md:p-8 rounded-lg max-w-md w-full text-center">
          <h3 className="text-lg md:text-xl font-semibold mb-4">Widget Unavailable</h3>
          <p className="text-gray-600">
            The owner has temporarily hidden this widget.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative w-full p-4">
      {!isNameGiven && (
        <div className="bg-white absolute inset-0 bg-opacity-50 flex items-center justify-center p-4 z-10">
          <div className="bg-white p-4 md:p-6 rounded-lg max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Please enter your name
            </h3>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Your name"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {isNameGiven && (
        <div className="flex flex-col lg:flex-row w-full justify-center items-center gap-4 md:gap-6">
          {/* Feedback Section */}
          <div className="flex flex-col gap-4 w-full lg:w-[50%] max-w-2xl h-auto min-h-[50vh] lg:h-[70vh] border-2 rounded-2xl p-4 md:p-6 lg:p-8 overflow-y-auto">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-balance">
              {data.title}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:flex lg:flex-col gap-3 md:gap-4">
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
                          username: isNameGiven ? username : null,
                        }),
                      });
                    } catch (err) {
                      console.error("Failed to send feedback", err);
                    }
                  }}
                />
              ))}
            </div>

            {/* Feedback Input */}
            <div
              className={`w-full flex items-center gap-2 mt-4 ${
                allowFeedback ? "" : "hidden"
              }`}
            >
              <div className="relative flex-1">
                <input
                  ref={feedback}
                  type="text"
                  placeholder="Enter your feedback"
                  className="min-h-[50px] md:min-h-[60px] border w-full rounded-lg p-2 pl-3 pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handelFeedbackSubmit();
                    }
                  }}
                />
                <button
                  onClick={handelFeedbackSubmit}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                  aria-label="Submit feedback"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Text Feedbacks Section */}
          {allowFeedback && (
            <div className="w-full lg:w-[50%] max-w-2xl">
              <TextFeedbacks link={link} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicWidget;