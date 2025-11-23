import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Play, CheckCircle, Lock, BookOpen, 
  Trophy, Home, User, ArrowRight, 
  Server, Zap, ShoppingBag, Coins, RefreshCw,
  Save, Download, Upload, Lightbulb, Map as MapIcon,
  Sword, Shield, Ghost, Eye, Skull, Star, MousePointer,
  Layout, Radio
} from 'lucide-react';

// --- EXPANDED CURRICULUM DATA (10 CHAPTERS) ---
const CURRICULUM = [
  {
    id: 'ch1',
    title: 'Variables Valley',
    world: 'Basics',
    icon: <Terminal className="w-6 h-6" />,
    description: 'The foundation of all code.',
    color: 'from-blue-600 to-blue-400',
    reward: 50,
    lessons: [
      {
        id: 'l1-print',
        title: 'The Output',
        text: 'The Output window is your debugging tool. Use `print()` to send messages to it.',
        snippet: '-- Print "Hello World" below\n',
        goal: 'Print "Hello World"',
        solution: 'print("Hello World")',
        hint: 'Use print("Text Here")',
        hintCost: 10,
        validate: (code, output) => output.some(l => l.text === 'Hello World')
      },
      {
        id: 'l1-vars',
        title: 'Local Containers',
        text: 'Variables hold data. Always use `local` to create them.',
        snippet: 'local speed = 16\n-- Change speed to 50 below\n',
        goal: 'Set speed to 50',
        solution: 'local speed = 50',
        hint: 'Redefine it: local speed = 50',
        hintCost: 15,
        validate: (code, out, vars) => vars['speed'] == 50
      }
    ]
  },
  {
    id: 'ch2',
    title: 'Property Peaks',
    world: 'World',
    icon: <Zap className="w-6 h-6" />,
    description: 'Manipulating the 3D world.',
    color: 'from-green-600 to-green-400',
    reward: 60,
    lessons: [
      {
        id: 'l2-transparency',
        title: 'Ghost Mode',
        text: '0 is visible. 1 is invisible.',
        snippet: 'script.Parent.Transparency = 0',
        goal: 'Make the part invisible (1)',
        solution: 'script.Parent.Transparency = 1',
        hint: 'Set it to 1',
        hintCost: 10,
        validate: (code) => code.includes('= 1')
      },
      {
        id: 'l2-color',
        title: 'BrickColor',
        text: 'Change colors using `BrickColor.new("Name")`.',
        snippet: 'script.Parent.BrickColor = ',
        goal: 'Change color to "Really red"',
        solution: 'script.Parent.BrickColor = BrickColor.new("Really red")',
        hint: 'BrickColor.new("Really red")',
        hintCost: 20,
        validate: (code) => code.includes('Really red')
      }
    ]
  },
  {
    id: 'ch3',
    title: 'Loop Lagoon',
    world: 'Logic',
    icon: <RefreshCw className="w-6 h-6" />,
    description: 'Doing things over and over.',
    color: 'from-purple-600 to-purple-400',
    reward: 80,
    lessons: [
      {
        id: 'l3-for',
        title: 'Countdown',
        text: 'Loops let us count. A loop goes: start, end, step.',
        snippet: 'for i = 10, 1, -1 do\n    print(i)\nend\nprint("Blast off")',
        goal: 'Run the countdown',
        solution: 'for i = 10, 1, -1 do\n    print(i)\nend',
        hint: 'Just run the code provided!',
        hintCost: 5,
        validate: (code, out) => out.some(l => l.text == '10') && out.some(l => l.text == '1')
      }
    ]
  },
  {
    id: 'ch4',
    title: 'Function Forest',
    world: 'Logic',
    icon: <Server className="w-6 h-6" />,
    description: 'Reusable code blocks.',
    color: 'from-red-600 to-red-400',
    reward: 100,
    lessons: [
      {
        id: 'l4-basic',
        title: 'The Helper',
        text: 'Define a function, then call it.',
        snippet: 'local function giveCoins()\n    print("Coins given")\nend\n\n-- Call it below',
        goal: 'Call the function',
        solution: 'giveCoins()',
        hint: 'Type giveCoins()',
        hintCost: 15,
        validate: (code) => code.includes('giveCoins()')
      }
    ]
  },
  {
    id: 'ch5',
    title: 'Event Horizon',
    world: 'Events',
    icon: <Zap className="w-6 h-6" />,
    description: 'Reacting to touches.',
    color: 'from-yellow-600 to-yellow-400',
    reward: 120,
    lessons: [
      {
        id: 'l5-touched',
        title: 'Lava Floor',
        text: 'Connect a function to the `.Touched` event.',
        snippet: 'local function kill(hit)\n    print("Ouch")\nend\n\nscript.Parent.Touched:Connect(____)',
        goal: 'Connect the kill function',
        solution: 'script.Parent.Touched:Connect(kill)',
        hint: 'Put "kill" inside the Connect parentheses',
        hintCost: 20,
        validate: (code) => code.includes(':Connect(kill)')
      }
    ]
  },
  {
    id: 'ch6',
    title: 'Table Tundra',
    world: 'Data',
    icon: <DatabaseIcon className="w-6 h-6" />,
    description: 'Lists and Arrays.',
    color: 'from-cyan-600 to-cyan-400',
    reward: 150,
    lessons: [
      {
        id: 'l6-array',
        title: 'Backpack',
        text: 'Tables use curly braces `{}`. They hold lists of things.',
        snippet: 'local backpack = {"Sword", "Potion"}\nprint(backpack[1])',
        goal: 'Print the first item (Sword)',
        solution: 'print(backpack[1])',
        hint: 'Lua arrays start at 1, not 0.',
        hintCost: 15,
        validate: (code, out) => out.some(l => l.text === 'Sword')
      }
    ]
  },
  {
    id: 'ch7',
    title: 'Dictionary Desert',
    world: 'Data',
    icon: <BookOpen className="w-6 h-6" />,
    description: 'Key and Value pairs.',
    color: 'from-orange-600 to-orange-400',
    reward: 150,
    lessons: [
      {
        id: 'l7-dict',
        title: 'Pet Stats',
        text: 'Dictionaries use names as keys instead of numbers.',
        snippet: 'local pet = {Name = "Doggy", Level = 5}\n-- Print the pet\'s Name below',
        goal: 'Print the Name',
        solution: 'print(pet.Name)',
        hint: 'Use pet.Name',
        hintCost: 15,
        validate: (code, out) => out.some(l => l.text === 'Doggy')
      }
    ]
  },
  {
    id: 'ch8',
    title: 'Leaderstats Lair',
    world: 'Systems',
    icon: <Trophy className="w-6 h-6" />,
    description: 'Making a scoreboard.',
    color: 'from-pink-600 to-pink-400',
    reward: 200,
    lessons: [
      {
        id: 'l8-setup',
        title: 'Player Added',
        text: 'To give stats, we must listen for when a player joins.',
        snippet: 'game.Players.PlayerAdded:Connect(function(player)\n    print(player .. " joined")\nend)',
        goal: 'Run the connection code',
        solution: 'game.Players.PlayerAdded:Connect(function(player) end)',
        hint: 'Just click Run to see it mimic a player joining.',
        hintCost: 0,
        validate: (code) => code.includes('PlayerAdded')
      }
    ]
  },
  {
    id: 'ch9',
    title: 'GUI Gulch',
    world: 'UI',
    icon: <Layout className="w-6 h-6" />,
    description: 'Buttons and TextLabels.',
    color: 'from-indigo-600 to-indigo-400',
    reward: 250,
    lessons: [
      {
        id: 'l9-text',
        title: 'Changing Text',
        text: 'LocalScripts control UI. Change the Text property of a label.',
        snippet: 'script.Parent.Text = "Loading..."',
        goal: 'Change text to "Welcome"',
        solution: 'script.Parent.Text = "Welcome"',
        hint: 'Set it to "Welcome" (with quotes)',
        hintCost: 15,
        validate: (code) => code.includes('Welcome')
      }
    ]
  },
  {
    id: 'ch10',
    title: 'Remote Ridge',
    world: 'Networking',
    icon: <Radio className="w-6 h-6" />,
    description: 'Client to Server communication.',
    color: 'from-rose-600 to-rose-400',
    reward: 300,
    lessons: [
      {
        id: 'l10-fire',
        title: 'FireServer',
        text: 'Tell the server to do something securely.',
        snippet: 'game.ReplicatedStorage.Event:FireServer()',
        goal: 'Fire the event',
        solution: 'game.ReplicatedStorage.Event:FireServer()',
        hint: 'Just Run the code to simulate the network event.',
        hintCost: 0,
        validate: (code, out) => out.some(l => l.text === 'Event Fired to Server')
      }
    ]
  }
];

// --- BOSS BATTLES (Dynamic Tests) ---
const BOSS_BATTLES = [
  {
    id: 'boss_killbrick',
    name: 'The Lava Trap',
    req: ['ch1', 'ch2', 'ch5'],
    description: 'Create a trap that turns Red and prints "Dead" when touched.',
    snippet: '-- 1. Set damage var to 100\n-- 2. Set BrickColor to "Really red"\n-- 3. Connect .Touched to a function that prints "Dead"',
    solution: 'local damage = 100\nscript.Parent.BrickColor = BrickColor.new("Really red")\nscript.Parent.Touched:Connect(function() print("Dead") end)',
    validate: (code, out, vars) => vars['damage'] == 100 && code.includes('Really red') && code.includes('print')
  },
  {
    id: 'boss_autodoor',
    name: 'Haunted Door',
    req: ['ch2', 'ch3', 'ch4'],
    description: 'Make a function that fades a door invisible using a loop.',
    snippet: 'local function openDoor()\n    -- Loop i from 0 to 1 (step 0.1)\n    -- Set script.Parent.Transparency to i\nend\nopenDoor()',
    solution: 'local function openDoor()\n  for i=0,1,0.1 do script.Parent.Transparency = i end\nend\nopenDoor()',
    validate: (code, out) => code.includes('for') && code.includes('Transparency') && code.includes('openDoor()')
  },
  {
    id: 'boss_inventory',
    name: 'Inventory Sorter',
    req: ['ch1', 'ch3', 'ch6'],
    description: 'Loop through the backpack table and print every item.',
    snippet: 'local backpack = {"Sword", "Map", "Compass"}\n-- Use a loop to print items',
    solution: 'for i=1, 3 do print(backpack[i]) end',
    validate: (code, out) => out.some(l => l.text === 'Compass')
  },
  {
    id: 'boss_welcomer',
    name: 'Welcome System',
    req: ['ch8', 'ch9'],
    description: 'When a player joins (PlayerAdded), change the GUI Text to "Hello".',
    snippet: 'game.Players.PlayerAdded:Connect(function(plr)\n    -- Set script.Parent.Text to "Hello"\nend)',
    solution: 'game.Players.PlayerAdded:Connect(function(plr) script.Parent.Text = "Hello" end)',
    validate: (code) => code.includes('PlayerAdded') && code.includes('Hello')
  }
];

// --- SHOP ITEMS ---
const SHOP_ITEMS = [
  { id: 'theme_matrix', name: 'Matrix Theme', cost: 100, type: 'theme', value: 'bg-black text-green-400 border-green-800' },
  { id: 'theme_dracula', name: 'Vampire', cost: 200, type: 'theme', value: 'bg-[#282a36] text-[#ff79c6] border-[#bd93f9]' },
  { id: 'theme_ocean', name: 'Oceanic', cost: 150, type: 'theme', value: 'bg-[#0f172a] text-cyan-300 border-cyan-800' },
  { id: 'avatar_gold', name: 'Gold Member', cost: 500, type: 'avatar', icon: '👑' },
  { id: 'avatar_robot', name: 'Bot', cost: 150, type: 'avatar', icon: '🤖' },
  { id: 'avatar_skull', name: 'Necromancer', cost: 300, type: 'avatar', icon: '💀' },
  { id: 'avatar_alien', name: 'Alien', cost: 250, type: 'avatar', icon: '👽' },
];

const DatabaseIcon = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

// --- MOCK INTERPRETER ---
const runLuauInterpreter = (code) => {
  const output = [];
  const variables = {};
  const log = (t) => output.push({ type: 'log', text: String(t) });
  
  const lines = code.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('--'));

  lines.forEach(line => {
    try {
      // Assignments
      const assign = line.match(/(?:local\s+)?(\w+)\s*=\s*(.+)/);
      if (assign && !line.startsWith('for') && !line.startsWith('while') && !line.includes('script.Parent')) {
        const key = assign[1];
        let val = assign[2];
        if (!isNaN(val)) val = Number(val);
        else if (val.startsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith('{')) {
          // Simple Array Mock
          const content = val.slice(1, -1).replace(/"/g, '').split(',').map(s=>s.trim());
          val = content; 
          variables['#'+key] = content.length;
        }
        else if (val === 'true') val = true;
        else if (val === 'false') val = false;
        variables[key] = val;
      }
      
      // Property Assignments (Mock)
      if (line.includes('Transparency =')) output.push({type:'sys', text:'Property Set: Transparency'});
      if (line.includes('BrickColor =')) output.push({type:'sys', text:'Property Set: Color'});
      if (line.includes('.Text =')) output.push({type:'sys', text:'UI Text Updated'});

      // Events
      if (line.includes(':FireServer()')) output.push({type:'sys', text:'Event Fired to Server'});

      // Printing
      if (line.startsWith('print(')) {
        const content = line.match(/print\((.*)\)/)[1];
        
        // Handle table indexing: print(backpack[1])
        const tableMatch = content.match(/(\w+)\[(\d+)\]/);
        
        if (content.startsWith('"')) log(content.replace(/"/g, ''));
        else if (tableMatch) {
            const arrName = tableMatch[1];
            const idx = parseInt(tableMatch[2]) - 1; 
            if(variables[arrName]) log(variables[arrName][idx]);
        }
        else if (content.includes('.')) {
            // Dict lookup: print(pet.Name)
            if(content.includes('Name')) log('Doggy'); 
            else log('Undefined');
        }
        else log(variables[content] !== undefined ? variables[content] : content);
      }
    } catch (e) { }
  });

  return { output, variables };
};

export default function RoLearnUltimate() {
  const [view, setView] = useState('home');
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeBoss, setActiveBoss] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [output, setOutput] = useState([]);
  const [showReward, setShowReward] = useState(false);
  const [selectedTestChapters, setSelectedTestChapters] = useState([]);
  const [stats, setStats] = useState({
    xp: 0, coins: 0, lessons: [], inventory: [], 
    theme: 'bg-[#1e1e1e] text-gray-300 border-gray-700'
  });
  const [hintUsed, setHintUsed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const local = localStorage.getItem('rolearn_v4');
    if (local) setStats(JSON.parse(local));
  }, []);

  useEffect(() => {
    localStorage.setItem('rolearn_v4', JSON.stringify(stats));
  }, [stats]);

  const startLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveBoss(null);
    setUserCode(lesson.snippet);
    setOutput([]);
    setShowReward(false);
    setHintUsed(false);
    setRevealed(false);
    setView('lesson');
  };

  const startBoss = (boss) => {
    setActiveBoss(boss);
    setActiveLesson(null);
    setUserCode(boss.snippet);
    setOutput([]);
    setShowReward(false);
    setHintUsed(false);
    setRevealed(false);
    setView('lesson');
  };

  const buyHint = () => {
    if (stats.coins >= activeLesson.hintCost) {
      setStats(p => ({ ...p, coins: p.coins - activeLesson.hintCost }));
      setHintUsed(true);
    } else alert("Not enough coins!");
  };

  const revealAnswer = () => {
    const cost = 50;
    if (stats.coins >= cost) {
        if(window.confirm(`Reveal Answer for ${cost} Coins? You will get 0 XP.`)) {
            setStats(p => ({ ...p, coins: p.coins - cost }));
            setUserCode(activeLesson?.solution || activeBoss?.solution);
            setRevealed(true);
        }
    } else alert("Need 50 coins to reveal answer.");
  };

  const runCode = () => {
    const { output: simOut, variables } = runLuauInterpreter(userCode);
    let passed = false;
    const currentTask = activeLesson || activeBoss;
    try { passed = currentTask.validate(userCode, simOut, variables); } catch (e) {}

    if (passed) {
      simOut.push({ type: 'sys', text: '>> SUCCESS' });
      if (!revealed) {
          if (!activeBoss && !stats.lessons.includes(currentTask.id)) {
            let coinReward = hintUsed ? 5 : 20;
            setTimeout(() => {
              setStats(p => ({ ...p, xp: p.xp + 50, coins: p.coins + coinReward, lessons: [...p.lessons, currentTask.id] }));
              setShowReward({ coins: coinReward, xp: 50 });
            }, 500);
          } else if (activeBoss) {
            setTimeout(() => {
                setStats(p => ({ ...p, xp: p.xp + 100, coins: p.coins + 30 }));
                setShowReward({ coins: 30, xp: 100, msg: "Boss Defeated!" });
            }, 500);
          } else {
             setShowReward({ coins: 0, xp: 0, msg: "Practice Complete" });
          }
      } else {
          setTimeout(() => {
              if(!activeBoss && !stats.lessons.includes(currentTask.id)) {
                  setStats(p => ({ ...p, lessons: [...p.lessons, currentTask.id] }));
              }
              setShowReward({ coins: 0, xp: 0, msg: "Answer Revealed (No Rewards)" });
          }, 500);
      }
    } else {
      simOut.push({ type: 'err', text: '>> Goal not met.' });
    }
    setOutput(simOut);
  };

  const getAvailableBosses = () => {
      if(selectedTestChapters.length === 0) return [];
      return BOSS_BATTLES.filter(boss => boss.req.every(r => selectedTestChapters.includes(r)));
  };

  const toggleChapterSelect = (id) => {
      setSelectedTestChapters(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const NavBtn = ({icon, label, active, onClick}) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-bold ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-900/30' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
        {React.cloneElement(icon, {size: 20})} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#090909] text-gray-200 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-[#111] border-r border-gray-800 flex flex-col z-20 shadow-2xl">
        <div className="p-6">
          <h1 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
            RoLearn
          </h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Master Luau</p>
        </div>
        <div className="px-4 space-y-2">
          <NavBtn icon={<MapIcon />} label="Adventure" active={view === 'home'} onClick={() => setView('home')} />
          <NavBtn icon={<Sword />} label="Boss Battles" active={view === 'test'} onClick={() => setView('test')} />
          <NavBtn icon={<ShoppingBag />} label="Item Shop" active={view === 'shop'} onClick={() => setView('shop')} />
        </div>
        <div className="mt-auto p-4 bg-gray-900/50 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-xl shadow-lg">
                {stats.inventory.find(i=>i.startsWith('avatar')) ? SHOP_ITEMS.find(i => i.id === stats.inventory.find(inv=>inv.startsWith('avatar'))).icon : '🙂'}
             </div>
             <div>
                <div className="font-bold text-white leading-none">Player</div>
                <div className="text-xs text-blue-400 font-mono mt-1">{stats.xp} XP</div>
             </div>
          </div>
          <div className="bg-black/40 rounded-xl p-3 flex justify-between items-center border border-white/5">
             <span className="text-xs font-bold text-gray-400 uppercase">Wallet</span>
             <div className="flex items-center gap-2 text-yellow-400 font-bold">{stats.coins} <Coins size={16} /></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111] opacity-90 pointer-events-none"></div>
        
        <div className="relative h-full overflow-y-auto p-6 md:p-10 custom-scrollbar">
          
          {/* ADVENTURE MAP */}
          {view === 'home' && (
            <div className="max-w-2xl mx-auto pb-20">
              <header className="text-center mb-12">
                <h2 className="text-4xl font-black text-white mb-2 drop-shadow-lg">The Archipelago</h2>
                <p className="text-gray-400">Select an island to begin your journey.</p>
              </header>
              <div className="relative space-y-12">
                <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-gray-700 -ml-0.5 z-0 hidden md:block"></div>
                {CURRICULUM.map((chapter, idx) => {
                   const unlocked = idx === 0 || stats.lessons.includes(CURRICULUM[idx-1].lessons[0].id);
                   const completed = chapter.lessons.every(l => stats.lessons.includes(l.id));
                   return (
                    <div key={chapter.id} className={`relative z-10 transition-all duration-500 ${unlocked ? 'opacity-100' : 'opacity-50 grayscale blur-[1px]'}`}>
                      <div className={`bg-[#18181b] border border-gray-700 rounded-3xl p-1 shadow-2xl hover:scale-105 transition-transform duration-300 group ${completed ? 'border-green-500/50' : ''}`}>
                         <div className={`bg-gradient-to-br ${chapter.color} h-32 rounded-t-[1.3rem] flex items-center justify-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-full text-white shadow-xl ring-4 ring-white/10">
                               {completed ? <CheckCircle size={32} /> : chapter.icon}
                            </div>
                            {!unlocked && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Lock className="text-gray-400"/></div>}
                         </div>
                         <div className="p-6 bg-[#18181b] rounded-b-[1.3rem]">
                            <h3 className="text-xl font-bold text-white mb-1 flex items-center justify-between">
                                {chapter.title}
                                {completed && <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded-full border border-green-700">Completed</span>}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">{chapter.description}</p>
                            <div className="space-y-2">
                               {chapter.lessons.map(lesson => {
                                 const isDone = stats.lessons.includes(lesson.id);
                                 return (
                                   <button 
                                     key={lesson.id}
                                     disabled={!unlocked}
                                     onClick={() => startLesson(lesson)}
                                     className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold border transition-all ${isDone ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[#27272a] border-gray-700 text-gray-300 hover:bg-[#3f3f46]'}`}
                                   >
                                     <span className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${isDone ? 'bg-green-500' : 'bg-gray-500'}`}></div> {lesson.title}
                                     </span>
                                     {isDone ? <Star size={14} className="fill-green-400 text-green-400"/> : <Play size={14} />}
                                   </button>
                                 )
                               })}
                            </div>
                         </div>
                      </div>
                    </div>
                   )
                })}
              </div>
            </div>
          )}

          {/* BOSS BATTLE */}
          {view === 'test' && (
             <div className="max-w-4xl mx-auto animate-fade-in">
                <header className="mb-8 p-8 bg-gradient-to-r from-red-900/40 to-black rounded-3xl border border-red-900/50 relative overflow-hidden">
                   <div className="relative z-10">
                       <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3"><Sword className="text-red-500 fill-red-900" size={40} /> Boss Arena</h2>
                       <p className="text-gray-300">Construct a test by selecting mastered chapters.</p>
                   </div>
                </header>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-[#18181b] border border-gray-800 p-6 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><MapIcon size={18}/> Select Knowledge</h3>
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {CURRICULUM.map(chap => (
                                <button key={chap.id} onClick={() => toggleChapterSelect(chap.id)} className={`p-3 rounded-xl text-xs font-bold text-left transition-all border ${selectedTestChapters.includes(chap.id) ? 'bg-blue-600 border-blue-400 text-white' : 'bg-[#27272a] border-gray-700 text-gray-400'}`}>
                                    {chap.title}
                                </button>
                            ))}
                        </div>
                        <div className="bg-black/30 p-4 rounded-xl text-center border border-dashed border-gray-700">
                            <span className="text-gray-500 text-xs uppercase font-bold">Matches Found</span>
                            <div className="text-3xl font-black text-white">{getAvailableBosses().length}</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {getAvailableBosses().length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-3xl p-8">
                                <Ghost size={48} className="mb-4 opacity-50"/>
                                <p>No Bosses found for this combination.</p>
                            </div>
                        ) : (
                            getAvailableBosses().map(boss => (
                                <button key={boss.id} onClick={() => startBoss(boss)} className="w-full bg-[#18181b] border border-red-900/30 p-6 rounded-3xl text-left hover:border-red-500 transition-all group relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">{boss.name}</h4>
                                            <span className="bg-red-900 text-red-200 text-xs font-bold px-2 py-1 rounded">BOSS</span>
                                        </div>
                                        <p className="text-sm text-gray-400">{boss.description}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
             </div>
          )}

          {/* SHOP */}
          {view === 'shop' && (
              <div className="max-w-4xl mx-auto">
                 <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3"><ShoppingBag className="text-yellow-400" /> Marketplace</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SHOP_ITEMS.map(item => (
                        <div key={item.id} className="bg-[#18181b] border border-gray-800 p-6 rounded-3xl flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                           <div className={`w-24 h-24 mb-4 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${item.type === 'theme' ? item.value : 'bg-gray-800'}`}>{item.icon || '🎨'}</div>
                           <h3 className="font-bold text-lg text-white">{item.name}</h3>
                           <p className="text-yellow-500 font-bold mb-4">{item.cost} Coins</p>
                           <button onClick={() => {if(stats.coins >= item.cost && !stats.inventory.includes(item.id)) {setStats(p => ({...p, coins: p.coins - item.cost, inventory: [...p.inventory, item.id]}));} else if (stats.inventory.includes(item.id)) {if(item.type === 'theme') setStats(p => ({...p, theme: item.value}));}}} className={`w-full py-2 rounded-xl font-bold text-sm ${stats.inventory.includes(item.id) ? 'bg-gray-700 text-white' : 'bg-yellow-500 text-black hover:bg-yellow-400'}`}>{stats.inventory.includes(item.id) ? 'Owned' : 'Buy'}</button>
                        </div>
                    ))}
                 </div>
              </div>
          )}

          {/* EDITOR */}
          {view === 'lesson' && (activeLesson || activeBoss) && (
             <div className="h-[85vh] flex flex-col lg:flex-row gap-6">
                 <div className="lg:w-1/3 flex flex-col gap-4">
                    <button onClick={() => setView(activeBoss ? 'test' : 'home')} className="text-gray-400 hover:text-white flex items-center gap-2 font-bold uppercase text-xs"><ArrowRight className="rotate-180" size={16}/> Retreat</button>
                    <div className="bg-[#18181b] border border-gray-800 p-6 rounded-3xl flex-1 overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4"><span className={`text-xs font-black uppercase px-2 py-1 rounded ${activeBoss ? 'bg-red-900 text-red-200' : 'bg-blue-900 text-blue-200'}`}>{activeBoss ? 'BOSS BATTLE' : 'LESSON'}</span></div>
                        <h2 className="text-2xl font-black text-white mb-4 leading-tight">{activeBoss ? activeBoss.name : activeLesson.title}</h2>
                        <div className="prose prose-invert prose-sm mb-6 text-gray-400">{activeBoss ? activeBoss.description : activeLesson.text}</div>
                        <div className="bg-black/30 border border-white/10 p-4 rounded-xl mb-6"><h4 className="text-white text-xs font-bold uppercase mb-2 flex items-center gap-2"><Star size={14} className="text-yellow-400 fill-yellow-400"/> Goal</h4><p className="text-sm font-medium text-gray-200">{activeBoss ? activeBoss.description : activeLesson.goal}</p></div>
                        <div className="space-y-3 mt-auto">
                            {!hintUsed && !activeBoss && <button onClick={buyHint} className="w-full py-3 rounded-xl border border-gray-700 hover:bg-gray-800 flex items-center justify-center gap-2 text-sm font-bold text-gray-300"><Lightbulb size={16} className="text-yellow-500"/> Hint (-{activeLesson.hintCost})</button>}
                            {hintUsed && <div className="p-3 bg-yellow-900/20 border border-yellow-900/50 rounded-xl text-yellow-200 text-sm">{activeLesson.hint}</div>}
                            {!revealed && <button onClick={revealAnswer} className="w-full py-3 rounded-xl bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 flex items-center justify-center gap-2 text-sm font-bold text-red-400"><Eye size={16}/> Reveal Answer (-50 Coins)</button>}
                        </div>
                    </div>
                 </div>
                 <div className="lg:w-2/3 flex flex-col gap-4">
                     <div className={`flex-1 rounded-3xl border overflow-hidden flex flex-col shadow-2xl ${stats.theme}`}>
                         <div className="bg-black/40 backdrop-blur p-3 flex justify-between items-center border-b border-white/10">
                            <span className="text-xs font-mono font-bold opacity-50 px-2">Script.lua</span>
                            <button onClick={runCode} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-green-900/20"><Play size={14} fill="currentColor" /> RUN SCRIPT</button>
                         </div>
                         <textarea value={userCode} onChange={e => setUserCode(e.target.value)} className="flex-1 w-full bg-transparent p-6 outline-none font-mono text-sm resize-none leading-relaxed" spellCheck="false" />
                     </div>
                     <div className="h-32 bg-[#050505] border border-gray-800 rounded-3xl p-4 font-mono text-xs overflow-y-auto custom-scrollbar">
                         <div className="text-gray-600 font-bold mb-2 uppercase tracking-widest text-[10px]">Output Console</div>
                         {output.map((l, i) => <div key={i} className={`mb-1 ${l.type === 'err' ? 'text-red-400 bg-red-900/10 inline-block px-1 rounded' : l.type === 'sys' ? 'text-green-400 font-bold' : 'text-gray-400'}`}>{l.text}</div>)}
                     </div>
                 </div>
             </div>
          )}
        </div>
      </div>

      {/* REWARD MODAL */}
      {showReward && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-[#1e1e1e] border border-gray-700 p-8 rounded-[2rem] text-center max-w-sm w-full animate-bounce shadow-2xl shadow-yellow-500/20">
             <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 text-black shadow-lg"><Trophy size={40} /></div>
             <h2 className="text-3xl font-black text-white mb-2 uppercase italic">Success!</h2>
             {showReward.msg ? <p className="text-gray-400 mb-6 font-medium">{showReward.msg}</p> : <div className="flex justify-center gap-4 text-2xl font-black mb-8"><span className="text-yellow-400 flex items-center gap-1">+{showReward.coins}<Coins className="w-5 h-5"/></span><span className="text-blue-400 flex items-center gap-1">+{showReward.xp}<span className="text-sm">XP</span></span></div>}
             <button onClick={() => { setShowReward(false); if(activeBoss) setView('test'); else setView('home'); }} className="w-full bg-white text-black font-black py-4 rounded-xl hover:scale-105 transition-transform">CONTINUE JOURNEY</button>
          </div>
        </div>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}
