import React from "react";

interface CoinCardProps {
  coins: number;
  title: string;
  description: string[];
  active?: boolean;
}

const CoinCard: React.FC<CoinCardProps> = ({ coins, title, description, active }) => {
  return (
    <div
      className={`group cursor-pointer transform transition-all duration-500 
        ${active ? "scale-105 -rotate-1" : "hover:scale-105 hover:-rotate-1"}`}
      style={{ margin: "20px" }}
    >
      <div
        className={`text-gray-900 rounded-3xl border shadow-2xl duration-700 z-10 relative overflow-hidden
          ${active 
            ? "border-green-500/40 shadow-green-500/10 bg-emerald-50" 
            : "border-green-500/20 bg-white hover:border-green-500/40 hover:shadow-green-500/10 hover:shadow-3xl"
          }`}
        style={{ width: "350px", padding: "32px" }}
      >
        {/* Layer hiệu ứng */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-tr from-green-500/5 to-green-400/10 transition-opacity duration-500 
              ${active ? "opacity-40" : "opacity-20 group-hover:opacity-40"}`}
          ></div>
        </div>

        {/* Nội dung */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-green-500/10 animate-pulse delay-500"></div>
              <div
                className={`rounded-full backdrop-blur-lg border bg-gradient-to-br from-white to-gray-100 shadow-2xl transform transition-all duration-500
                  ${active 
                    ? "rotate-12 scale-110 border-green-500/40 shadow-green-500/20" 
                    : "group-hover:rotate-12 group-hover:scale-110 border-green-500/20 hover:shadow-green-500/20"
                  }`}
                style={{ padding: "24px" }}
              >
                <svg
                  className={`w-8 h-8 fill-current transition-colors duration-300 
                    ${active ? "text-green-400" : "text-green-500 group-hover:text-green-400"}`}
                  viewBox="0 0 496 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 30.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z"></path>
                </svg>
              </div>
            </div>

            {/* Title */}
            <p className="text-3xl font-bold text-green-600 mb-4">{coins} Coin</p>

            {/* Nội dung mô tả */}
            <div className="max-w-xs">
              <p className="font-semibold text-base">{title}</p>
              {description.map((desc, idx) => (
                <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                  {desc}
                </p>
              ))}
            </div>

            {/* Line */}
            <div
              className={`bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full transition-all duration-500 animate-pulse mt-6
                ${active ? "w-1/2 h-1" : "w-1/3 h-[2px] group-hover:w-1/2 group-hover:h-1"}`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinCard;
