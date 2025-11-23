import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Play,
  CheckCircle,
  Lock,
  BookOpen,
  Trophy,
  Home,
  User,
  AlertTriangle,
  ArrowRight,
  Server,
  Zap,
  ShoppingBag,
  Coins,
  RefreshCw,
  Save,
  Download,
  Upload,
  Lightbulb,
} from "lucide-react";

// --- CURRICULUM DATA (EXPANDED) ---
const CURRICULUM = [
  {
    id: "ch1-basics",
    title: "1. The Basics",
    icon: <Terminal className="w-6 h-6" />,
    description: "Output, Variables, and Strings",
    color: "bg-blue-500",
    reward: 50,
    lessons: [
      {
        id: "l1-print",
        title: "Your First Script",
        text: "The Output window is your debugging tool. Use `print()` to send messages to it.",
        snippet: '-- Print "Hello Roblox" below\nprint()',
        goal: 'Print the exact phrase "Hello Roblox"',
        hint: 'Put the text inside quotes inside the parentheses: print("Hello Roblox")',
        hintCost: 10,
        validate: (code, output) =>
          output.some((l) => l.text === "Hello Roblox"),
      },
      {
        id: "l1-vars",
        title: "Variables",
        text: "Variables are containers. Use `local` to create them.",
        snippet:
          "local myScore = 10\n-- Change the value above to 100, then print it below\n",
        goal: "Set myScore to 100 and print it.",
        hint: "Write: print(myScore) on the last line. Ensure the variable equals 100.",
        hintCost: 15,
        validate: (code, output, vars) =>
          vars["myScore"] == 100 && output.some((l) => l.text == "100"),
      },
    ],
  },
  {
    id: "ch2-props",
    title: "2. Properties",
    icon: <Zap className="w-6 h-6" />,
    description: "Changing how things look",
    color: "bg-green-500",
    reward: 60,
    lessons: [
      {
        id: "l2-transparency",
        title: "Invisibility",
        text: "Properties control object appearance. `Transparency` is a number from 0 (visible) to 1 (invisible).",
        snippet:
          "local part = script.Parent\n-- Make the part 50% visible (0.5)\npart.Transparency = ",
        goal: "Set Transparency to 0.5",
        hint: "Just add 0.5 after the equals sign.",
        hintCost: 10,
        validate: (code) => code.includes("= 0.5"),
      },
      {
        id: "l2-anchored",
        title: "Anchoring",
        text: "If `Anchored` is false, physics applies (it falls). If true, it stays stuck in air.",
        snippet: "local part = script.Parent\n-- Stop the part from falling\n",
        goal: "Set Anchored to true",
        hint: "Type: part.Anchored = true",
        hintCost: 15,
        validate: (code) => code.includes(".Anchored = true"),
      },
    ],
  },
  {
    id: "ch3-loops",
    title: "3. Loops",
    icon: <RefreshCw className="w-6 h-6" />,
    description: "Repeating actions automatically",
    color: "bg-purple-500",
    reward: 80,
    lessons: [
      {
        id: "l3-for",
        title: "For Loops",
        text: "A `for` loop counts from a start number to an end number.",
        snippet:
          '-- Create a loop that runs 5 times\nfor i = 1, __ do\n    print("Count: " .. i)\nend',
        goal: "Run the loop 5 times (fill in the blank)",
        hint: "Change the __ to 5.",
        hintCost: 10,
        validate: (code) =>
          code.includes("for i = 1, 5") || code.includes("for i=1,5"),
      },
      {
        id: "l3-while",
        title: "While Loops",
        text: "A `while` loop runs forever as long as the condition is true. Be careful of infinite crashes!",
        snippet:
          'local running = true\nwhile running do\n    print("Looping")\n    -- Set running to false below to stop it\n    \nend',
        goal: "Set running to false inside the loop",
        hint: "Inside the loop, type: running = false",
        hintCost: 20,
        validate: (code) => code.includes("running = false"),
      },
    ],
  },
  {
    id: "ch4-functions",
    title: "4. Functions",
    icon: <Server className="w-6 h-6" />,
    description: "Reusable code blocks",
    color: "bg-red-500",
    reward: 100,
    lessons: [
      {
        id: "l4-basic",
        title: "Creating Functions",
        text: 'Functions let you run the same code multiple times by "calling" it.',
        snippet:
          'local function killPlayer()\n    print("Player Died")\nend\n\n-- Call the function below\n',
        goal: "Call the killPlayer function",
        hint: "Type killPlayer() at the bottom.",
        hintCost: 15,
        validate: (code) =>
          code.match(/killPlayer\(\s*\)$/m) || code.includes("killPlayer()"),
      },
    ],
  },
  {
    id: "ch5-events",
    title: "5. Events",
    icon: <Zap className="w-6 h-6" />,
    description: "Reacting to touches and clicks",
    color: "bg-yellow-500",
    reward: 120,
    lessons: [
      {
        id: "l5-touched",
        title: "Touched Event",
        text: "The `.Touched` event fires when a part hits something.",
        snippet:
          'local part = script.Parent\n\nlocal function onTouch(hit)\n    print("Hit something!")\nend\n\n-- Connect the function to the event\npart.Touched:Connect(______)',
        goal: "Connect the onTouch function",
        hint: "Replace ______ with onTouch (no parentheses).",
        hintCost: 20,
        validate: (code) => code.includes(":Connect(onTouch)"),
      },
    ],
  },
  // ... Imagine 15 more chapters here for the full version
];

// --- SHOP ITEMS ---
const SHOP_ITEMS = [
  {
    id: "theme_matrix",
    name: "Matrix Theme",
    cost: 100,
    type: "theme",
    value: "bg-black text-green-400 border-green-800",
  },
  {
    id: "theme_dracula",
    name: "Vampire Theme",
    cost: 200,
    type: "theme",
    value: "bg-[#282a36] text-[#ff79c6] border-[#bd93f9]",
  },
  {
    id: "avatar_gold",
    name: "Gold Member",
    cost: 500,
    type: "avatar",
    icon: "👑",
  },
  { id: "avatar_robot", name: "Bot", cost: 150, type: "avatar", icon: "🤖" },
];

// --- MOCK INTERPRETER (UPDATED) ---
const runLuauInterpreter = (code) => {
  const output = [];
  const variables = {};

  const log = (t) => output.push({ type: "log", text: String(t) });

  // Clean code lines
  const lines = code
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("--"));

  lines.forEach((line) => {
    try {
      // 1. Assignments (local x = 10)
      const assign = line.match(/(?:local\s+)?(\w+)\s*=\s*(.+)/);
      if (assign && !line.startsWith("for") && !line.startsWith("while")) {
        const key = assign[1];
        let val = assign[2];
        if (!isNaN(val)) val = Number(val);
        else if (val.startsWith('"')) val = val.slice(1, -1);
        else if (val === "true") val = true;
        else if (val === "false") val = false;
        variables[key] = val;
      }

      // 2. Prints
      if (line.startsWith("print(")) {
        const content = line.match(/print\((.*)\)/)[1];
        if (content.startsWith('"')) log(content.replace(/"/g, ""));
        else if (content.includes("..")) {
          // Basic concat simulation
          const parts = content.split("..").map((p) => p.trim());
          const res = parts
            .map((p) =>
              p.startsWith('"') ? p.replace(/"/g, "") : variables[p] || ""
            )
            .join("");
          log(res);
        } else
          log(variables[content] !== undefined ? variables[content] : content);
      }
    } catch (e) {}
  });

  return { output, variables };
};

export default function RoLearnUltimate() {
  const [view, setView] = useState("home");
  const [activeLesson, setActiveLesson] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [backendStatus, setBackendStatus] = useState("disconnected"); // disconnected, saving, saved, error

  // --- PROGRESS STATE ---
  const [stats, setStats] = useState({
    xp: 0,
    coins: 0,
    lessons: [], // IDs of completed lessons
    inventory: [],
    theme: "bg-[#1e1e1e] text-gray-300 border-gray-700",
  });

  // Track if hint was used in CURRENT active lesson
  const [hintUsedInSession, setHintUsedInSession] = useState(false);

  // --- BACKEND SYNC ---
  const API_URL = "http://localhost:3005"; // Pointing to your laptop server

  const saveToBackend = async () => {
    try {
      setBackendStatus("saving");
      const response = await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats),
      });
      if (response.ok) setBackendStatus("saved");
      else setBackendStatus("error");
    } catch (err) {
      setBackendStatus("error");
      console.log("Backend not found. Is server.js running?");
    }
  };

  const loadFromBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/load`);
      const data = await response.json();
      if (data) {
        setStats(data);
        setBackendStatus("loaded");
        alert("Progress loaded from laptop server!");
      }
    } catch (err) {
      alert("Could not connect to laptop server. Make sure it is running.");
    }
  };

  // Auto-save to localStorage (Backup)
  useEffect(() => {
    const local = localStorage.getItem("rolearn_save");
    if (local) setStats(JSON.parse(local));
  }, []);

  useEffect(() => {
    localStorage.setItem("rolearn_save", JSON.stringify(stats));
  }, [stats]);

  // --- ACTIONS ---
  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setUserCode(lesson.snippet);
    setOutput([]);
    setShowReward(false);
    setHintUsedInSession(false);
    setView("lesson");
  };

  const buyHint = () => {
    if (stats.coins >= activeLesson.hintCost) {
      setStats((prev) => ({
        ...prev,
        coins: prev.coins - activeLesson.hintCost,
      }));
      setHintUsedInSession(true);
    } else {
      alert("Not enough coins!");
    }
  };

  const buyItem = (item) => {
    if (stats.inventory.includes(item.id)) {
      // Equip
      if (item.type === "theme")
        setStats((prev) => ({ ...prev, theme: item.value }));
    } else if (stats.coins >= item.cost) {
      // Buy
      setStats((prev) => ({
        ...prev,
        coins: prev.coins - item.cost,
        inventory: [...prev.inventory, item.id],
      }));
    }
  };

  const runCode = () => {
    const { output: simOut, variables } = runLuauInterpreter(userCode);

    // Check Goal
    let passed = false;
    try {
      passed = activeLesson.validate(userCode, simOut, variables);
    } catch (e) {}

    if (passed) {
      simOut.push({ type: "sys", text: ">> MISSION COMPLETE" });

      if (!stats.lessons.includes(activeLesson.id)) {
        // Calculate Reward
        let reward = CURRICULUM.find((c) =>
          c.lessons.includes(activeLesson)
        ).reward;
        // Logic: Lesson reward is chunked, but let's just give fixed coins per lesson
        let coinReward = 20;
        if (hintUsedInSession) coinReward = 5; // Reduced reward

        setTimeout(() => {
          setStats((prev) => ({
            ...prev,
            xp: prev.xp + 50,
            coins: prev.coins + coinReward,
            lessons: [...prev.lessons, activeLesson.id],
          }));
          setShowReward({ coins: coinReward, xp: 50 });
        }, 500);
      } else {
        setShowReward({ coins: 0, xp: 0, msg: "Replayed" });
      }
    } else {
      simOut.push({ type: "err", text: ">> Goal not met. Check output." });
    }
    setOutput(simOut);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-gray-200 font-sans flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-[#111] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
            <span className="text-blue-500">Ro</span>Learn
          </h1>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono text-gray-500">
            <div
              className={`w-2 h-2 rounded-full ${
                backendStatus === "saved" ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            Local Server: {backendStatus}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={() => setView("home")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "home"
                ? "bg-blue-900/20 text-blue-400"
                : "hover:bg-gray-800"
            }`}
          >
            <Home size={18} /> Home
          </button>
          <button
            onClick={() => setView("shop")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              view === "shop"
                ? "bg-yellow-900/20 text-yellow-400"
                : "hover:bg-gray-800"
            }`}
          >
            <ShoppingBag size={18} /> Shop
          </button>
        </div>

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="bg-gray-900 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-bold text-gray-500">
                Balance
              </span>
              <Coins size={16} className="text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.coins}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={saveToBackend}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded flex justify-center items-center gap-1"
            >
              <Upload size={12} /> Save PC
            </button>
            <button
              onClick={loadFromBackend}
              className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-2 rounded flex justify-center items-center gap-1"
            >
              <Download size={12} /> Load PC
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 overflow-y-auto h-screen">
        {view === "home" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Curriculum</h2>
              <div className="text-sm text-gray-400">
                Rank: <span className="text-white">Beginner</span>
              </div>
            </div>

            {CURRICULUM.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-[#141414] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all"
              >
                <div className={`h-1 w-full ${chapter.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-2 rounded-lg ${chapter.color} bg-opacity-20 text-white`}
                    >
                      {chapter.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {chapter.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapter.lessons.map((lesson) => {
                      const done = stats.lessons.includes(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => startLesson(lesson)}
                          className={`flex items-center justify-between p-3 rounded-lg border text-sm font-medium transition-all ${
                            done
                              ? "bg-green-900/10 border-green-900/30 text-green-400"
                              : "bg-[#0a0a0a] border-gray-800 text-gray-300 hover:border-gray-500"
                          }`}
                        >
                          {lesson.title}
                          {done ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Play size={14} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === "shop" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Item Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SHOP_ITEMS.map((item) => {
                const owned = stats.inventory.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-[#141414] border border-gray-800 p-6 rounded-2xl flex flex-col items-center text-center"
                  >
                    <div
                      className={`w-full h-24 mb-4 rounded-lg flex items-center justify-center border border-gray-700 ${
                        item.type === "theme"
                          ? item.value
                          : "bg-gray-800 text-4xl"
                      }`}
                    >
                      {item.icon || "Aa"}
                    </div>
                    <h3 className="font-bold text-lg text-white">
                      {item.name}
                    </h3>
                    <p className="text-yellow-500 font-bold mb-4 flex items-center gap-1">
                      {item.cost} <Coins size={14} />
                    </p>
                    <button
                      onClick={() => buyItem(item)}
                      disabled={!owned && stats.coins < item.cost}
                      className={`w-full py-2 rounded-lg font-bold text-sm ${
                        owned
                          ? "bg-gray-700 text-white"
                          : "bg-yellow-600 text-black hover:bg-yellow-500"
                      }`}
                    >
                      {owned
                        ? item.type === "theme"
                          ? "Equip"
                          : "Owned"
                        : "Buy"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {view === "lesson" && activeLesson && (
          <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
            {/* INSTRUCTIONS */}
            <div className="lg:w-1/3 flex flex-col gap-4">
              <button
                onClick={() => setView("home")}
                className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 hover:text-white"
              >
                <ArrowRight className="rotate-180" size={14} /> Back
              </button>

              <div className="bg-[#141414] border border-gray-800 p-6 rounded-2xl flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {activeLesson.title}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {activeLesson.text}
                </p>

                <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl mb-4">
                  <h4 className="text-blue-400 text-xs font-bold uppercase mb-2">
                    Objective
                  </h4>
                  <p className="text-sm text-white font-medium">
                    {activeLesson.goal}
                  </p>
                </div>

                {!hintUsedInSession ? (
                  <button
                    onClick={buyHint}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-yellow-400 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Lightbulb size={16} /> Buy Hint (-{activeLesson.hintCost}{" "}
                    Coins)
                  </button>
                ) : (
                  <div className="bg-yellow-900/20 border border-yellow-900/50 p-4 rounded-xl text-yellow-200 text-sm">
                    <span className="font-bold uppercase text-xs block mb-1">
                      Hint:
                    </span>
                    {activeLesson.hint}
                  </div>
                )}
              </div>
            </div>

            {/* EDITOR */}
            <div className="lg:w-2/3 flex flex-col gap-4">
              <div
                className={`flex-1 rounded-xl border overflow-hidden flex flex-col shadow-2xl ${stats.theme}`}
              >
                <div className="bg-black/30 p-2 flex justify-between items-center border-b border-white/10">
                  <span className="text-xs font-mono opacity-70 px-2">
                    script.lua
                  </span>
                  <button
                    onClick={runCode}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-1 rounded text-xs font-bold flex items-center gap-1"
                  >
                    <Play size={12} fill="currentColor" /> RUN
                  </button>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 w-full bg-transparent p-4 outline-none font-mono text-sm resize-none"
                  spellCheck="false"
                />
              </div>

              <div className="h-32 bg-black border border-gray-800 rounded-xl p-3 font-mono text-xs overflow-y-auto">
                <div className="text-gray-600 mb-1">Output:</div>
                {output.map((l, i) => (
                  <div
                    key={i}
                    className={
                      l.type === "err"
                        ? "text-red-400"
                        : l.type === "sys"
                        ? "text-green-400"
                        : "text-gray-300"
                    }
                  >
                    {l.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* REWARD OVERLAY */}
      {showReward && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-gray-700 p-8 rounded-3xl text-center max-w-sm w-full animate-bounce-short">
            <Trophy size={48} className="mx-auto text-yellow-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Lesson Complete!
            </h2>
            {showReward.msg ? (
              <p className="text-gray-400 mb-6">{showReward.msg}</p>
            ) : (
              <div className="flex justify-center gap-4 text-xl font-bold mb-6 text-white">
                <div className="flex items-center gap-1 text-yellow-400">
                  +{showReward.coins} <Coins size={20} />
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  +{showReward.xp} XP
                </div>
              </div>
            )}
            <button
              onClick={() => {
                setShowReward(false);
                setView("home");
              }}
              className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
