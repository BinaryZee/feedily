import React from "react";
import { Trash2, Pencil, Share2, ChevronRight } from "lucide-react";
import Link from "next/link";

const UserWidget = ({ data }) => {
  return (
    <div className="border rounded-2xl flex  flex-col justify-between p-4 shadow-md w-[70%] min-h-[18vh] relative bg-white">
      <p className="text-lg font-semibold text-gray-800 text-balance">
        {data.title?.split(" ").length > 10
          ? data.title.split(" ").slice(0, 10).join(" ") + "..."
          : data.title}...
      </p>

      <div className="flex items-center gap-2 ml-4 ">
        <button className="bg-red-100 p-2 rounded-md hover:bg-red-200 cursor-pointer">
          <Trash2 className="h-5 w-5 text-red-600 " />
        </button>

        <button className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
          <Pencil className="h-5 w-5 text-white" />
        </button>

        <button className="bg-gray-800 p-2 rounded-md hover:bg-gray-700 cursor-pointer">
          <Share2 className="h-5 w-5 text-white" />
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
