const Reaction = ({ emoji, count, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-3 rounded-lg 
        shadow-md transition-all 
        ${selected ? "bg-blue-500 text-white" : "bg-white hover:bg-blue-100"}`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-lg font-semibold">{count}</span>
    </button>
  );
};

export default Reaction