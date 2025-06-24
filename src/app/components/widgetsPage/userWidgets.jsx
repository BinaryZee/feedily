"use client"
import React, { useState } from "react";
import { Trash2, Archive, Share2, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase";

const UserWidget = ({ data, removeWidget }) => {
  const supabase = createClient()
  const [isToggled, setIsToggled] = useState(data.text_feedback);
  const [isArchived, setIsArchived] = useState(data.archieved || false); 

  const handleToggleChange = async(newValue) => {
    setIsToggled(newValue);
    await fetch("/api/setFeedback",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({link: data.link, set: newValue})
    });
  };

  const handleArchive = async () => {
    try {
      const newArchiveStatus = !isArchived;
      setIsArchived(newArchiveStatus);
      

      const { error } = await supabase
        .from('widgets')
        .update({ archieved: newArchiveStatus })
        .eq('link', data.link);
      
      if (error) throw error;
    } catch (err) {
      console.error("Error updating archive status:", err);
      setIsArchived(!newArchiveStatus); 
    }
  };

  const clipBoardCopy = (link) => {
    const copyLink = window.location.href + "/" + link;
    navigator.clipboard.writeText(copyLink).then(() => {
      alert("Copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
  }

  return (
    <div className="border rounded-2xl flex flex-col justify-between p-4 shadow-md w-[70%] min-h-[18vh] relative bg-white">
      <p className="text-lg font-semibold text-gray-800 text-balance">
        {data.title?.split(" ").length > 10
          ? data.title.split(" ").slice(0, 10).join(" ") + "..."
          : data.title}
        ...
      </p>

      <div className="flex items-center gap-2 ml-4">
        <button title="delete" className="bg-red-100 p-2 rounded-md hover:bg-red-200 cursor-pointer">
          <Trash2 
            className="h-5 w-5 text-red-600"
            onClick={async () => {
              await fetch("/api/deleteWidget", {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({link: data.link}),
              });
              removeWidget();
            }}
          />
        </button>

        <button 
          title={isArchived ? "Unarchive this widget" : "Archive this widget"}
          className={`p-2 rounded-md hover:bg-gray-700 cursor-pointer ${
            isArchived ? 'bg-green-100' : 'bg-gray-800'
          }`}
          onClick={handleArchive}
        >
          <Archive className={`h-5 w-5 ${
            isArchived ? 'text-green-600' : 'text-white'
          }`} />
        </button>

        <button onClick={() => {clipBoardCopy(data.link)}} title="share with friends" className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
          <Share2 className="h-5 w-5 text-white" />
        </button>

        <button 
          title="toggle feature"
          className="p-2 rounded-md bg-black cursor-pointer"
          onClick={() => handleToggleChange(!isToggled)}
        >
          {isToggled ? (
            <ToggleRight className="h-5 w-5 text-green-500" />
          ) : (
            <ToggleLeft className="h-5 w-5 text-white" />
          )}
        </button>

        <Link href={`/widgets/${data.link}`}>
          <button>
            <ChevronRight className="h-6 w-6 text-black absolute top-1/2 left-[90%] -translate-y-1/2 -translate-x-1/2 cursor-pointer" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserWidget;