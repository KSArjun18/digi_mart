import { Mic, X } from "lucide-react";
import { motion } from "framer-motion";

export default function VoiceSearchPopup({ onClose, onStartListening, listening }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center w-80 relative"
      >
        {/* Close Button */}
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Animated Waves */}
        <div className="relative flex items-center justify-center">
          {listening && (
            <>
              <motion.div
                className="absolute w-20 h-20 bg-red-500/30 rounded-full"
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute w-28 h-28 bg-red-500/20 rounded-full"
                animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </>
          )}

          {/* Mic Button */}
          <motion.div
            animate={listening ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`relative w-16 h-16 flex items-center justify-center rounded-full ${
              listening ? "bg-red-500/20" : "bg-gray-300"
            }`}
            onClick={onStartListening}
          >
            <Mic className={`w-8 h-8 ${listening ? "text-red-500" : "text-gray-500"}`} />
          </motion.div>
        </div>

        {/* Status Text */}
        <p className="text-lg font-semibold mt-4">
          {listening ? "Listening..." : "Tap mic to start"}
        </p>

        {/* Cancel Button */}
        <button className="mt-4 px-5 py-2 bg-gray-200 rounded-full text-sm" onClick={onClose}>
          Cancel
        </button>
      </motion.div>
    </div>
  );
}
