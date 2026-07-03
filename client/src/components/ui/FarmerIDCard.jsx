import React from "react";
import { User, QrCode, Printer, MapPin, BadgeCheck, Leaf } from "lucide-react";

const FarmerIDCard = ({ farmerInfo }) => {
  if (!farmerInfo) return null;

  const handlePrint = () => {
    window.print();
  };

  const name = farmerInfo.personalDetails
    ? `${farmerInfo.personalDetails.firstName} ${farmerInfo.personalDetails.lastName}`
    : "Sani Abubakar";

  const email = farmerInfo.personalDetails?.email || "sani@agripass.coop";
  const idNumber = farmerInfo.farmerIdNumber || "AP-KTS-849201";
  const state = farmerInfo.location?.state || "Katsina State";
  const lga = farmerInfo.location?.lga || "Batagarawa";
  const ward = farmerInfo.location?.ward || "Batagarawa A";

  return (
    <div className="space-y-4">
      {/* Printable ID Container Wrapper */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-850 to-teal-950 text-white rounded-3xl p-6 border border-emerald-800 shadow-2xl max-w-sm mx-auto select-none print:shadow-none print:border-slate-300 print:text-black print:bg-white print:max-w-full">
        
        {/* Card Background Overlay Patterns */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full -ml-8 -mb-8 pointer-events-none" />
        
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4 print:border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-300">
              <Leaf size={16} />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider uppercase">AgriPass</span>
              <span className="block text-[8px] uppercase tracking-widest text-emerald-300">Digital Passport</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 print:border-slate-300">
            <BadgeCheck size={10} /> Verified
          </span>
        </div>

        {/* Content Info Grid */}
        <div className="flex gap-4">
          {/* Avatar Picture Spot */}
          <div className="shrink-0">
            <div className="w-24 h-28 bg-slate-800/80 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden print:border-slate-200">
              <User size={45} className="text-slate-400" />
            </div>
          </div>

          {/* Core Text Details */}
          <div className="space-y-2.5 flex-1 min-w-0">
            <div>
              <span className="block text-[9px] uppercase tracking-wider text-emerald-300 font-bold">Farmer Name</span>
              <h4 className="font-extrabold text-base truncate leading-tight">{name}</h4>
            </div>

            <div>
              <span className="block text-[9px] uppercase tracking-wider text-emerald-300 font-bold">AgriPass ID</span>
              <h5 className="font-mono font-bold text-sm tracking-wider">{idNumber}</h5>
            </div>

            <div className="flex gap-4">
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-emerald-300 font-bold">LGA</span>
                <span className="text-xs font-semibold">{lga}</span>
              </div>
              <div>
                <span className="block text-[8px] uppercase tracking-wider text-emerald-300 font-bold">Ward</span>
                <span className="text-xs font-semibold">{ward}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area with QR representation */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center print:border-slate-200">
          <div className="flex items-center gap-1 text-[10px] text-slate-300">
            <MapPin size={12} className="text-emerald-400" />
            <span>{state}, Nigeria</span>
          </div>
          <div className="p-1 bg-white rounded-lg">
            <QrCode size={30} className="text-slate-900" />
          </div>
        </div>

      </div>

      {/* Trigger Control Panel */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
        >
          <Printer size={13} />
          Print ID Card
        </button>
      </div>
    </div>
  );
};

export default FarmerIDCard;
