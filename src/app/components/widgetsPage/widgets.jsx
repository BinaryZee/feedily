"use client";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import UserWidget from "./userWidgets";

const Widgets = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [title]);

  useEffect(() => {
    const fetchUserWidgets = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getUserWidgets");
        const data = await response.json();
        setWidgets(data || []);
      } catch (error) {
        console.error("Error fetching user widgets:", error);
        setWidgets([]);
      } finally {
        setLoading(false);
      }
    };
    if (!showForm) fetchUserWidgets();
  }, [showForm]);

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
    setTitle("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await postWidget(title);
    setShowForm(false);
    setTitle("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Shift") {
      setIsShiftPressed(true);
    }

    if (e.key === "Enter" && !isShiftPressed) {
      handleFormSubmit(e);
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Shift") {
      setIsShiftPressed(false);
    }
  };

  const postWidget = async (title) => {
    const resp = await fetch("/api/postWidget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });
  };

  const removeWidget = (ind)=>{
    setWidgets(prevItems => {
      const newItems = [...prevItems]; 
      newItems.splice(ind, 1);       
      return newItems;                 
    });
  }


  return (
    <div className="w-[60%] h-[70%]">
      {!showForm ? (
        <>
          <div className="w-full h-[20%] flex justify-end items-center">
            <button
              onClick={handleCreateClick}
              className="bg-black w-32 h-16 rounded-xl text-white text-xl cursor-pointer"
            >
              Create
            </button>
          </div>
          <SimpleBar style={{ height: "80%" }} autoHide={false}>
            <div className="w-full h-full flex flex-col gap-4 items-center justify-start py-8">
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : widgets.length === 0 ? (
                <p className="text-gray-500">
                  You have not created a widget yet!!
                </p>
              ) : (
                widgets.map((widget , ind) => (
                  <UserWidget key={widget.widget_id} data={widget} removeWidget = {()=>{removeWidget(ind)}}/>
                ))
              )}
            </div>
          </SimpleBar>
          
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <form
            onSubmit={handleFormSubmit}
            className="w-1/2 h-[60%] flex flex-col items-center justify-center gap-8 border-2 rounded-xl p-8 relative"
          >
            <button
              type="button"
              onClick={handleBackClick}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Back"
            >
              <X className="w-6 h-6" />
            </button>
            <textarea
              ref={textareaRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              placeholder="Enter title"
              className="w-full min-h-[48px] max-h-[200px] px-4 py-2 border-2 rounded-lg text-lg overflow-y-auto resize-none"
              rows={1}
              required
            />  
            <button
              type="submit"
              className="bg-black w-32 h-16 rounded-xl text-white text-xl cursor-pointer"
            >
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Widgets;
