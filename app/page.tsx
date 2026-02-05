"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkle, Stars, Music, Coffee, Moon, Flower2, Calculator } from "lucide-react";
import confetti from "canvas-confetti";
import { DigitalGreenhouseScene } from "../components/DigitalGreenhouseScene";
import { useFleeingButton } from "../hooks/useFleeingButton";

type FlowerData = {
  id: number;
  position: [number, number, number];
  hue: number;
  type?: "rose" | "tulip" | "daisy";
  scale?: number;
};

const captions = [
  "A quiet bloom, louder than a thousand fireworks.",
  "We grow in every soft light we share.",
  "Your laugh is the warmest winter I know.",
  "Petals remember what words cannot hold.",
  "In every heartbeat, I find your echo.",
  "You are my favorite notification.",
];

const questions = [
  {
    question: "What's your love language?",
    options: ["Words of Affirmation 💬", "Quality Time ⏰", "Physical Touch 🤗", "Acts of Service 💝"],
    icon: Heart,
  },
  {
    question: "Our perfect date night?",
    options: ["Stargazing 🌟", "Movie Marathon 🎬", "Cooking Together 👨‍🍳", "Dancing in Rain 🌧️"],
    icon: Moon,
  },
  {
    question: "What song plays in your heart?",
    options: ["Romantic Ballad 🎵", "Upbeat Pop 🎤", "Classical Piano 🎹", "Our Song 💕"],
    icon: Music,
  },
  {
    question: "Morning ritual together?",
    options: ["Sunrise Coffee ☕", "Breakfast in Bed 🥐", "Morning Cuddles 🛏️", "Yoga Together 🧘"],
    icon: Coffee,
  },
  {
    question: "MATH_PUZZLE",
    options: [],
    icon: Calculator,
    isMathPuzzle: true,
  },
];

const FloatingHeart = ({ delay = 0 }: { delay?: number }) => {
  const size = useMemo(() => 10 + Math.random() * 12, []);
  const left = useMemo(() => Math.random() * 100, []);
  const duration = useMemo(() => 25 + Math.random() * 15, []);
  
  return (
    <motion.div
      initial={{ y: "100vh", x: Math.random() * 40 - 20, opacity: 0, rotate: 0 }}
      animate={{ y: "-100vh", opacity: [0, 0.3, 0.3, 0], rotate: [0, 10, -10, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
      className="pointer-events-none absolute text-rose-300/20"
      style={{ left: `${left}%` }}
    >
      <Heart size={size} fill="currentColor" />
    </motion.div>
  );
};

// Shooting star animation
const ShootingStar = ({ delay = 0 }: { delay?: number }) => {
  const startX = useMemo(() => Math.random() * 100, []);
  const startY = useMemo(() => Math.random() * 40, []);
  
  return (
    <motion.div
      initial={{ x: `${startX}vw`, y: `${startY}vh`, opacity: 0, scale: 0 }}
      animate={{ 
        x: `${startX - 30}vw`, 
        y: `${startY + 25}vh`, 
        opacity: [0, 1, 1, 0], 
        scale: [0, 1, 1, 0] 
      }}
      transition={{ duration: 1.5, delay, repeat: Infinity, repeatDelay: 8 + Math.random() * 5 }}
      className="pointer-events-none absolute"
    >
      <div className="relative">
        <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-white to-amber-200 blur-[1px]" />
        <div className="absolute right-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_white]" />
      </div>
    </motion.div>
  );
};

// Sparkle particle effect
const SparkleParticle = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
    transition={{ duration: 2, delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 2 }}
    className="pointer-events-none absolute text-amber-300/60"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <Sparkle size={8 + Math.random() * 8} />
  </motion.div>
);

// Aurora background effect
const AuroraBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <motion.div
      animate={{ 
        background: [
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,72,0.15), transparent 50%)",
          "radial-gradient(ellipse 60% 40% at 40% 10%, rgba(251,191,36,0.1), transparent 50%)",
          "radial-gradient(ellipse 80% 50% at 60% 0%, rgba(139,92,246,0.12), transparent 50%)",
          "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,29,72,0.15), transparent 50%)",
        ]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    />
    <motion.div
      animate={{ 
        x: [0, 100, -50, 0],
        y: [0, -30, 20, 0],
        opacity: [0.1, 0.25, 0.15, 0.1],
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-1/4 left-1/4 h-[600px] w-[800px] rotate-12 rounded-full bg-gradient-to-r from-rose-500/20 via-purple-500/10 to-amber-500/15 blur-[100px]"
    />
    <motion.div
      animate={{ 
        x: [0, -80, 40, 0],
        y: [0, 40, -20, 0],
        opacity: [0.1, 0.2, 0.1, 0.1],
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -right-1/4 top-1/3 h-[500px] w-[700px] -rotate-12 rounded-full bg-gradient-to-l from-amber-500/15 via-pink-500/10 to-purple-500/10 blur-[100px]"
    />
  </div>
);

const MemoryCard = ({ onClose }: { onClose: () => void }) => {
  const caption = useMemo(
    () => captions[Math.floor(Math.random() * captions.length)],
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: 40, scale: 0.9, rotateX: 15 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="relative w-[min(92vw,380px)] rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 via-white/5 to-rose-500/10 p-6 text-white shadow-[0_0_60px_rgba(225,29,72,0.4),0_0_120px_rgba(251,191,36,0.2)] backdrop-blur-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-rose-500/50 blur-xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80 transition-all hover:bg-white/20"
      >
        Close
      </button>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-rose-200/80"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkle size={16} />
        </motion.div>
        Memory
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/20 via-rose-500/10 to-amber-500/10"
      >
        <div className="flex h-full w-full items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Heart size={64} className="text-rose-400/50" fill="currentColor" />
          </motion.div>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center text-sm italic leading-relaxed text-white/80"
      >
        &ldquo;{caption}&rdquo;
      </motion.p>
    </motion.div>
  );
};

// Cute reaction emojis that appear when selecting
const reactionEmojis = ["💕", "😍", "🥰", "💖", "✨", "💗", "🌹", "💝"];
const loveMessages = [
  "Great choice! 💕",
  "I love that! 🥰",
  "Perfect! 💖",
  "So romantic! 💗",
  "That's beautiful! ✨",
  "Aww! 😍",
  "Love it! 🌹",
  "Wonderful! 💝",
];

const QuestionCard = ({
  question,
  options,
  icon: Icon,
  onAnswer,
  questionNumber,
  totalQuestions,
}: {
  question: string;
  options: string[];
  icon: React.ElementType;
  onAnswer: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [showReaction, setShowReaction] = useState(false);
  const [reactionEmoji, setReactionEmoji] = useState("💕");
  const [loveMessage, setLoveMessage] = useState("");
  const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setReactionEmoji(reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)]);
    setLoveMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
    setShowReaction(true);
    setFloatingHearts(Array.from({ length: 12 }, (_, i) => i));
    
    setTimeout(() => {
      setShowReaction(false);
      onAnswer(option);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.85 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative w-[min(92vw,440px)] overflow-visible rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 via-rose-500/10 to-amber-500/5 p-6 text-white shadow-[0_0_80px_rgba(225,29,72,0.4)] backdrop-blur-2xl"
    >
      {/* Floating hearts animation on selection */}
      <AnimatePresence>
        {showReaction && floatingHearts.map((i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: Math.random() * 200 - 100,
              y: 0,
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.5,
              y: -150 - Math.random() * 100,
              x: Math.random() * 300 - 150,
              rotate: Math.random() * 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-50 text-2xl"
          >
            {["💕", "💖", "💗", "❤️", "🩷", "💝"][i % 6]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Reaction popup */}
      <AnimatePresence>
        {showReaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500/40 via-pink-500/30 to-amber-500/20 backdrop-blur-sm"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="text-7xl"
            >
              {reactionEmoji}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl font-light text-white"
            >
              {loveMessage}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative corner hearts */}
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -right-3 -top-3 text-3xl"
      >
        💕
      </motion.div>
      <motion.div 
        animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        className="absolute -bottom-3 -left-3 text-2xl"
      >
        ✨
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rounded-full bg-gradient-to-br from-rose-500/30 to-pink-500/20 p-3 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
        >
          <Icon size={24} className="text-rose-300" />
        </motion.div>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`h-2 w-2 rounded-full transition-all ${
                i < questionNumber ? "bg-rose-400" : i === questionNumber - 1 ? "bg-rose-500 ring-2 ring-rose-400/50" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 text-xl font-light leading-relaxed"
      >
        {question}
      </motion.h3>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
            whileHover={{ 
              scale: 1.05, 
              y: -4,
              boxShadow: "0 10px 40px rgba(225,29,72,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option)}
            disabled={selected !== null}
            className={`group relative overflow-hidden rounded-xl border px-4 py-4 text-left text-sm transition-all ${
              selected === option
                ? "border-rose-400 bg-gradient-to-br from-rose-500/40 to-pink-500/30 text-white shadow-[0_0_30px_rgba(225,29,72,0.4)]"
                : "border-white/20 bg-white/5 text-white/80 hover:border-rose-400/50 hover:bg-white/10"
            }`}
          >
            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              whileHover={{ translateX: "200%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Beautiful progress bar */}
      <motion.div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="mt-3 text-center text-xs text-white/50"
      >
        Question {questionNumber} of {totalQuestions} 💕
      </motion.p>
    </motion.div>
  );
};

// Special Math Puzzle Card - "I MISS YOU" reveal
const MathPuzzleCard = ({
  onAnswer,
  questionNumber,
  totalQuestions,
}: {
  onAnswer: () => void;
  questionNumber: number;
  totalQuestions: number;
}) => {
  const [step, setStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showReveal, setShowReveal] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const handleSubmit = () => {
    if (userAnswer === "155") {
      setStep(1);
      setTimeout(() => setShowReveal(true), 800);
      setTimeout(() => setShowFinalMessage(true), 2500);
      setTimeout(() => onAnswer(), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -60, scale: 0.85 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="relative w-[min(92vw,400px)] overflow-visible rounded-3xl border border-white/20 bg-gradient-to-br from-white/15 via-rose-500/10 to-amber-500/5 p-6 text-white shadow-[0_0_80px_rgba(225,29,72,0.4)] backdrop-blur-2xl"
    >
      {/* Decorative elements */}
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -right-3 -top-3 text-3xl"
      >
        🧮
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rounded-full bg-gradient-to-br from-rose-500/30 to-pink-500/20 p-3 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
        >
          <Calculator size={24} className="text-rose-300" />
        </motion.div>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`h-2 w-2 rounded-full transition-all ${
                i < questionNumber ? "bg-rose-400" : i === questionNumber - 1 ? "bg-rose-500 ring-2 ring-rose-400/50" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>

      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 text-center text-lg font-light"
      >
        Solve this for me? 💭
      </motion.h3>

      {!showReveal ? (
        <div className="flex flex-col items-center gap-4">
          {/* Math problem display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-white/20 bg-white/5 px-8 py-6 font-mono text-2xl"
          >
            <div className="flex flex-col items-end">
              <span className="text-white/90">100</span>
              <span className="text-rose-300">+ 55</span>
              <div className="my-2 h-0.5 w-full bg-white/30" />
              <motion.span 
                className="text-amber-300"
                animate={{ opacity: step === 0 ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 1.5, repeat: step === 0 ? Infinity : 0 }}
              >
                {step === 0 ? "?" : "155"}
              </motion.span>
            </div>
          </motion.div>

          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value.replace(/\D/g, ""))}
                placeholder="Your answer..."
                className="w-32 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-xl text-white placeholder-white/40 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30"
                maxLength={3}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={userAnswer.length === 0}
                className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] disabled:opacity-50"
              >
                Check ✨
              </motion.button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="flex flex-col items-center gap-4 py-4"
        >
          {/* The reveal: M + 155 = MISS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-3xl font-bold"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-rose-400"
            >
              M
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="font-mono text-white"
            >
              +
            </motion.span>
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              className="font-mono text-amber-300"
            >
              155
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white/60"
            >
              =
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-4xl text-transparent"
            >
              M155
            </motion.span>
          </motion.div>

          {/* Transform to MISS */}
          <AnimatePresence>
            {showFinalMessage && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  className="text-5xl font-bold tracking-wider"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 bg-clip-text text-transparent">
                    MISS
                  </span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-light text-white"
                >
                  YOU
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-6xl"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    ❤️
                  </motion.div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-sm text-white/60"
                >
                  Every moment without you... 💕
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Progress bar */}
      <motion.div
        className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.8 }}
        className="mt-3 text-center text-xs text-white/50"
      >
        Question {questionNumber} of {totalQuestions} 💕
      </motion.p>
    </motion.div>
  );
};

const CompletionCard = ({ onContinue }: { onContinue: () => void }) => {
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="relative w-[min(92vw,420px)] overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-rose-500/25 via-white/10 to-amber-500/15 p-8 text-center text-white shadow-[0_0_100px_rgba(225,29,72,0.5)] backdrop-blur-2xl"
    >
      {/* Celebration particles */}
      <AnimatePresence>
        {showCelebration && Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 1, 
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 400,
              rotate: Math.random() * 720,
            }}
            transition={{ duration: 2, delay: i * 0.05 }}
            className="pointer-events-none absolute left-1/2 top-1/2 text-2xl"
          >
            {["💕", "💖", "✨", "🌹", "💗", "🩷", "💝", "❤️"][i % 8]}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Animated rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -left-20 -top-20 h-40 w-40 rounded-full border border-rose-500/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full border border-amber-500/20"
      />

      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mx-auto mb-6 w-fit rounded-full bg-gradient-to-br from-rose-500/40 to-pink-500/30 p-5 shadow-[0_0_40px_rgba(225,29,72,0.4)]"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Heart size={56} className="text-rose-300" fill="currentColor" />
        </motion.div>
      </motion.div>

      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-3 bg-gradient-to-r from-rose-200 via-white to-amber-200 bg-clip-text text-3xl font-light text-transparent"
      >
        Perfect Match! 💕
      </motion.h3>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-6 text-sm leading-relaxed text-white/70"
      >
        Every answer brought us closer together.<br />
        Now explore our magical garden of memories...
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-6 text-4xl"
      >
        🌸🌹🌷
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        whileHover={{ scale: 1.08, boxShadow: "0 0 50px rgba(225,29,72,0.6)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className="relative overflow-hidden rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_0_40px_rgba(225,29,72,0.5)]"
      >
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        <span className="relative z-10 flex items-center gap-2">
          🌹 Enter Our Garden 🌹
        </span>
      </motion.button>
    </motion.div>
  );
};

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionsComplete, setQuestionsComplete] = useState(false);
  const [gardenReady, setGardenReady] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState<FlowerData | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [valentineYes, setValentineYes] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { style } = useFleeingButton(noButtonRef);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount((p) => p + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    const heart = confetti.shapeFromText({ text: "❤", scalar: 2 });
    const star = confetti.shapeFromText({ text: "✨", scalar: 1.5 });

    // First burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      shapes: [heart],
      colors: ["#e11d48", "#fb7185", "#fda4af"],
      scalar: 1.2,
    });

    // Second burst with stars
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        shapes: [star],
        colors: ["#fbbf24", "#fcd34d", "#fef3c7"],
        scalar: 1,
      });
    }, 200);

    // Side bursts
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        shapes: [heart],
        colors: ["#e11d48", "#fbbf24"],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        shapes: [heart],
        colors: ["#e11d48", "#fbbf24"],
      });
    }, 400);
  };

  const handleAnswer = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setQuestionsComplete(true);
    }
  };

  const handleEnterGarden = () => {
    setGardenReady(true);
    setShowQuestions(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020617] via-[#0a0a0f] to-[#0f0a1a] text-white"
    >
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Starfield background */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity, 
              delay: Math.random() * 3 
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <ShootingStar key={i} delay={i * 3} />
      ))}

      {/* Sparkle particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <SparkleParticle 
          key={i} 
          x={Math.random() * 100} 
          y={Math.random() * 100} 
          delay={i * 0.5} 
        />
      ))}

      {/* Animated gradient overlay */}
      <motion.div
        animate={{ 
          background: [
            "radial-gradient(circle at 30% 20%, rgba(225,29,72,0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 70% 60%, rgba(225,29,72,0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, rgba(225,29,72,0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 30% 20%, rgba(225,29,72,0.08) 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-rose-500/15 blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-amber-500/15 blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute bottom-1/4 left-1/3 h-60 w-60 rounded-full bg-purple-500/15 blur-[100px]"
      />

      {/* Floating Hearts */}
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingHeart key={i} delay={i * 0.6} />
      ))}

      {/* Hero Entry Screen */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-2 text-xs uppercase tracking-[0.5em] text-rose-300/60"
              >
                A Special Experience For You
              </motion.div>
              <h1 className="bg-gradient-to-r from-rose-300 via-white to-amber-200 bg-clip-text text-4xl font-light tracking-wide text-transparent md:text-5xl">
                To Express My Feeling To You              </h1>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEntered(true);
                setShowQuestions(true);
              }}
              className="group relative flex h-44 w-44 items-center justify-center rounded-full border border-white/20 bg-white/5 shadow-[0_0_80px_rgba(225,29,72,0.5)] backdrop-blur-xl"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-rose-500/20 blur-3xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-rose-400/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="relative h-24 w-24 rounded-full bg-gradient-to-br from-rose-400 via-rose-600 to-amber-300"
                animate={{
                  scale: [1, 1.15, 0.95, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(225,29,72,0.5)",
                    "0 0 40px rgba(225,29,72,0.7)",
                    "0 0 20px rgba(225,29,72,0.5)",
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <Heart size={32} className="text-white/90" fill="currentColor" />
              </motion.div>
            </motion.button>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="text-xs uppercase tracking-[0.4em] text-rose-100/50"
            >
              Tap to Begin ✨
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Questions Flow */}
      <AnimatePresence mode="wait">
        {showQuestions && !questionsComplete && (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          >
            {questions[currentQuestion].isMathPuzzle ? (
              <MathPuzzleCard
                onAnswer={handleAnswer}
                questionNumber={currentQuestion + 1}
                totalQuestions={questions.length}
              />
            ) : (
              <QuestionCard
                {...questions[currentQuestion]}
                onAnswer={handleAnswer}
                questionNumber={currentQuestion + 1}
                totalQuestions={questions.length}
              />
            )}
          </motion.div>
        )}

        {showQuestions && questionsComplete && !gardenReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 p-4"
          >
            <CompletionCard onContinue={handleEnterGarden} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Garden Scene */}
      <motion.div
        animate={{
          opacity: gardenReady ? 1 : 0.15,
          scale: gardenReady ? 1 : 0.95,
          filter: gardenReady ? "blur(0px)" : "blur(4px)",
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        <DigitalGreenhouseScene
          onFlowerSelect={(data) => {
            if (gardenReady) {
              setSelectedFlower(data);
              setShowCard(true);
            }
          }}
          selectedFlower={selectedFlower}
        />
      </motion.div>

      {/* Memory Card Modal */}
      <AnimatePresence>
        {showCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowCard(false);
              setSelectedFlower(null);
            }}
          >
            <MemoryCard onClose={() => {
              setShowCard(false);
              setSelectedFlower(null);
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: gardenReady ? 1 : 0, y: gardenReady ? 0 : -20 }}
        transition={{ delay: 0.5 }}
        className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur md:left-6 md:top-6 md:gap-3 md:px-5 md:py-3"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Flower2 size={14} className="text-rose-400 md:h-[18px] md:w-[18px]" />
        </motion.div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-rose-100/70 md:text-xs md:tracking-[0.3em]">
          Your Jerry
        </span>
      </motion.div>

      {/* Hint - positioned below header on mobile */}
      <AnimatePresence>
        {gardenReady && !showCard && !valentineYes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
            className="absolute left-3 top-14 z-10 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[9px] text-white/60 backdrop-blur md:left-auto md:right-6 md:top-6 md:px-4 md:py-2 md:text-xs"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ Tap a flower
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valentine Question Panel - Hidden when memory card is shown */}
      <AnimatePresence>
        {gardenReady && !showCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto flex w-[90vw] max-w-[360px] flex-col items-center gap-4 rounded-2xl border border-white/15 bg-black/60 px-5 py-6 text-center shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-xl md:max-w-[420px] md:gap-5 md:rounded-3xl md:px-10 md:py-8"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hidden md:block"
            >
              <Stars size={18} className="text-amber-300" />
            </motion.div>
            <p className="text-xs text-rose-100/90 md:text-base">
              Will you be my Valentine? 💕
            </p>
            <div className="flex w-full items-center justify-center gap-2 md:gap-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.08, boxShadow: "0 0 50px rgba(225,29,72,0.7)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setValentineYes(true);
                  triggerConfetti();
                }}
                className="flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] md:gap-2 md:px-8 md:py-3 md:text-sm md:tracking-[0.2em]"
              >
                <Heart size={12} className="md:h-4 md:w-4" fill="currentColor" />
                Yes!
              </motion.button>
              <motion.button
                ref={noButtonRef}
                type="button"
                style={style}
                className="flex items-center justify-center gap-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] cursor-pointer md:gap-2 md:px-8 md:py-3 md:text-sm md:tracking-[0.2em]"
              >
                <Heart size={12} className="md:h-4 md:w-4" fill="currentColor" />
                No
              </motion.button>
            </div>
            <AnimatePresence>
              {valentineYes && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="flex flex-col items-center gap-1"
                >
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm font-light text-amber-200 md:text-lg"
                  >
                    Forever starts now 💝
                  </motion.p>
                  <p className="text-[9px] text-white/50 md:text-xs">I love you ∞</p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heartbeat indicator - hidden on mobile */}
      <motion.div
        className="pointer-events-none absolute bottom-4 right-4 z-10 hidden items-center gap-2 text-xs text-rose-300/40 md:flex"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        >
          <Heart size={12} fill="currentColor" />
        </motion.div>
        <span>{72 + Math.floor(Math.sin(pulseCount * 0.5) * 5)} bpm</span>
      </motion.div>
    </div>
  );
}
