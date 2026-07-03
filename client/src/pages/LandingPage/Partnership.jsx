import React from "react";
import woocommerce from "../../assets/woocommerce.png";
import slack from "../../assets/slack.png";
import meundies from "../../assets/meundies.png";
import amazon from "../../assets/amazon.png";

const Partnership = () => {
  const logos = [slack, amazon, woocommerce, meundies];
  return (
    <div className="w-full bg-slate-950 border-t border-slate-900 py-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="shrink-0 pl-4 border-l-4 border-emerald-500 py-1.5 z-10 text-base font-bold text-white uppercase tracking-wider">
          Trusted by over <br />{" "}
          <span className="text-emerald-400">10,000+ Farmers</span>
        </div>
        
        <div className="flex-1 flex flex-wrap justify-center md:justify-start items-center gap-10 md:gap-16 opacity-40">
          {logos.map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`partner-${index + 1}`}
              className="h-7 w-28 object-contain grayscale brightness-200 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partnership;
