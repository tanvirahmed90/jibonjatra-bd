import React from 'react';
import { AlertTriangle, Phone, ShieldCheck } from 'lucide-react';

export const SafetyDisclaimer: React.FC = () => {
  return (
    <aside aria-label="Emergency Medical Disclaimer" className="bg-amber-50/90 border-y sm:border sm:rounded-2xl border-amber-200/90 p-3.5 sm:p-4 my-4 shadow-sm text-xs text-amber-950">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">
              Important Emergency Protocol & Verification Notice:
            </p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              JibonJatra BD (জীবনযাত্রা) is an emergency-support coordination platform, not a replacement for professional medical diagnosis or 999 state dispatch. In life-threatening emergencies, dial <strong>999</strong> immediately. Hospital bed and ICU availabilities change continuously and should always be confirmed by calling the provided emergency hotline prior to transit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <a
            href="tel:999"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-black px-3.5 py-1.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 text-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>DIAL 999</span>
          </a>
          <a
            href="tel:16263"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all text-xs"
          >
            <span>স্বাস্থ্য বাতায়ন 16263</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
