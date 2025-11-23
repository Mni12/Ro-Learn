import React, { useState, useEffect } from 'react'; import { Trophy, Flame, Star, Lock, CheckCircle, Circle, Award, Target, Zap, Book, Code, Sparkles, TrendingUp, Users, Medal, Crown, Heart, MessageCircle, Share2, Volume2, VolumeX, Home, Settings, User, BookOpen, BarChart3, Gift, ChevronRight, Play, X, Check, ArrowRight, Calendar, Timer, Brain, Lightbulb, Rocket } from 'lucide-react'; const RobloxLuaAcademy = () => { const [currentView, setCurrentView] = useState('home'); const [selectedChapter, setSelectedChapter] = useState(null); const [selectedLesson, setSelectedLesson] = useState(null); const [currentQuestion, setCurrentQuestion] = useState(0); const [selectedAnswer, setSelectedAnswer] = useState(null); const [showFeedback, setShowFeedback] = useState(false); const [isCorrect, setIsCorrect] = useState(false); const [userProgress, setUserProgress] = useState({ xp: 0, level: 1, streak: 0, hearts: 5, gems: 0, completedLessons: [], completedTests: [], achievements: [], dailyGoalProgress: 0, totalLessonsCompleted: 0, correctAnswers: 0, lastLoginDate: new Date().toDateString() }); const [soundOn, setSoundOn] = useState(true); const [showReward, setShowReward] = useState(false); const [rewardType, setRewardType] = useState(null); const [showAchievement, setShowAchievement] = useState(false); const [newAchievement, setNewAchievement] = useState(null); const [questionHistory, setQuestionHistory] = useState([]); const [timer, setTimer] = useState(null); const [showHint, setShowHint] = useState(false); const [friendsLeaderboard, setFriendsLeaderboard] = useState([ { name: 'CodeMaster99', xp: 15420, avatar: '🦊', streak: 47 }, { name: 'LuaLegend', xp: 14890, avatar: '🐉', streak: 32 }, { name: 'You', xp: userProgress.xp, avatar: '🚀', streak: userProgress.streak }, { name: 'ScriptKid', xp: 12340, avatar: '🎮', streak: 28 }, { name: 'DevPro2024', xp: 11200, avatar: '🎯', streak: 19 } ]); const [showShop, setShowShop] = useState(false); const [showProfile, setShowProfile] = useState(false); // Comprehensive chapter and lesson structure const chapters = [ { id: 1, title: 'Lua Basics', icon: '📝', color: 'from-blue-400 to-blue-600', lessons: [ { id: 1, title: 'What is Lua?', difficulty: 'easy', xp: 10, type: 'lesson' }, { id: 2, title: 'Print Statements', difficulty: 'easy', xp: 10, type: 'lesson' }, { id: 3, title: 'Variables & Data Types', difficulty: 'easy', xp: 15, type: 'lesson' }, { id: 4, title: 'Numbers & Math', difficulty: 'easy', xp: 15, type: 'lesson' }, { id: 5, title: 'Strings & Concatenation', difficulty: 'easy', xp: 15, type: 'lesson' }, { id: 6, title: 'Chapter 1 Test', difficulty: 'test', xp: 50, type: 'test' } ] }, { id: 2, title: 'Control Flow', icon: '🔀', color: 'from-green-400 to-green-600', lessons: [ { id: 7, title: 'If Statements', difficulty: 'easy', xp: 20, type: 'lesson' }, { id: 8, title: 'Else & ElseIf', difficulty: 'easy', xp: 20, type: 'lesson' }, { id: 9, title: 'Comparison Operators', difficulty: 'medium', xp: 25, type: 'lesson' }, { id: 10, title: 'Logical Operators', difficulty: 'medium', xp: 25, type: 'lesson' }, { id: 11, title: 'Nested Conditions', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 12, title: 'Chapter 2 Test', difficulty: 'test', xp: 60, type: 'test' } ] }, { id: 3, title: 'Loops', icon: '🔄', color: 'from-purple-400 to-purple-600', lessons: [ { id: 13, title: 'While Loops', difficulty: 'medium', xp: 25, type: 'lesson' }, { id: 14, title: 'For Loops', difficulty: 'medium', xp: 25, type: 'lesson' }, { id: 15, title: 'Repeat Until', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 16, title: 'Break & Continue', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 17, title: 'Nested Loops', difficulty: 'hard', xp: 35, type: 'lesson' }, { id: 18, title: 'Chapter 3 Test', difficulty: 'test', xp: 70, type: 'test' } ] }, { id: 4, title: 'Functions', icon: '⚡', color: 'from-yellow-400 to-orange-600', lessons: [ { id: 19, title: 'Creating Functions', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 20, title: 'Function Parameters', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 21, title: 'Return Values', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 22, title: 'Multiple Returns', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 23, title: 'Local vs Global Functions', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 24, title: 'Chapter 4 Test', difficulty: 'test', xp: 80, type: 'test' } ] }, { id: 5, title: 'Tables', icon: '📊', color: 'from-pink-400 to-red-600', lessons: [ { id: 25, title: 'Creating Tables', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 26, title: 'Accessing Table Values', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 27, title: 'Table Methods', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 28, title: 'Arrays in Lua', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 29, title: 'Nested Tables', difficulty: 'hard', xp: 45, type: 'lesson' }, { id: 30, title: 'Chapter 5 Test', difficulty: 'test', xp: 90, type: 'test' } ] }, { id: 6, title: 'Roblox Basics', icon: '🎮', color: 'from-cyan-400 to-blue-600', lessons: [ { id: 31, title: 'Roblox Studio Overview', difficulty: 'easy', xp: 20, type: 'lesson' }, { id: 32, title: 'Scripts vs LocalScripts', difficulty: 'easy', xp: 25, type: 'lesson' }, { id: 33, title: 'The Workspace', difficulty: 'easy', xp: 25, type: 'lesson' }, { id: 34, title: 'Finding Parts', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 35, title: 'Part Properties', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 36, title: 'Chapter 6 Test', difficulty: 'test', xp: 70, type: 'test' } ] }, { id: 7, title: 'Events & Listeners', icon: '🎯', color: 'from-indigo-400 to-purple-600', lessons: [ { id: 37, title: 'What are Events?', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 38, title: 'Touched Event', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 39, title: 'ClickDetector', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 40, title: 'Changed Event', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 41, title: 'Custom Events', difficulty: 'hard', xp: 45, type: 'lesson' }, { id: 42, title: 'Chapter 7 Test', difficulty: 'test', xp: 90, type: 'test' } ] }, { id: 8, title: 'Player Interaction', icon: '👤', color: 'from-teal-400 to-green-600', lessons: [ { id: 43, title: 'Getting Players', difficulty: 'medium', xp: 30, type: 'lesson' }, { id: 44, title: 'Player Properties', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 45, title: 'Character Model', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 46, title: 'Humanoid', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 47, title: 'Player Tools', difficulty: 'hard', xp: 45, type: 'lesson' }, { id: 48, title: 'Chapter 8 Test', difficulty: 'test', xp: 90, type: 'test' } ] }, { id: 9, title: 'UI & GUIs', icon: '🖼️', color: 'from-rose-400 to-pink-600', lessons: [ { id: 49, title: 'ScreenGui Basics', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 50, title: 'TextLabels & Buttons', difficulty: 'medium', xp: 35, type: 'lesson' }, { id: 51, title: 'Frames & Layouts', difficulty: 'hard', xp: 40, type: 'lesson' }, { id: 52, title: 'Button Events', difficulty: 'hard', xp: 45, type: 'lesson' }, { id: 53, title: 'Tweening UI', difficulty: 'hard', xp: 50, type: 'lesson' }, { id: 54, title: 'Chapter 9 Test', difficulty: 'test', xp: 100, type: 'test' } ] }, { id: 10, title: 'Advanced Scripting', icon: '🚀', color: 'from-orange-400 to-red-600', lessons: [ { id: 55, title: 'Module Scripts', difficulty: 'hard', xp: 50, type: 'lesson' }, { id: 56, title: 'RemoteEvents', difficulty: 'hard', xp: 55, type: 'lesson' }, { id: 57, title: 'RemoteFunctions', difficulty: 'hard', xp: 55, type: 'lesson' }, { id: 58, title: 'DataStores', difficulty: 'expert', xp: 60, type: 'lesson' }, { id: 59, title: 'Metatables', difficulty: 'expert', xp: 70, type: 'lesson' }, { id: 60, title: 'Chapter 10 Test', difficulty: 'test', xp: 150, type: 'test' } ] } ]; // Sample questions for lessons const getLessonQuestions = (lessonId) => { const questionBank = { 1: [ { question: 'What programming language does Roblox use?', options: ['JavaScript', 'Lua', 'Python', 'C++'], correct: 1, hint: 'It\'s a lightweight scripting language!', explanation: 'Roblox uses Lua, a powerful and lightweight scripting language perfect for game development.' }, { question: 'Lua is known for being...', options: ['Complex', 'Lightweight', 'Outdated', 'Slow'], correct: 1, hint: 'Think about performance!', explanation: 'Lua is lightweight and fast, making it ideal for games.' } ], 2: [ { question: 'Which command outputs text in Lua?', options: ['console.log()', 'print()', 'echo()', 'write()'], correct: 1, hint: 'It\'s the same word you\'d use in real life!', explanation: 'print() is used to output text to the console in Lua.' }, { question: 'What is the correct syntax to print "Hello World"?', options: ['print "Hello World"', 'print("Hello World")', 'PRINT("Hello World")', 'Both A and B'], correct: 3, hint: 'Lua is flexible with parentheses for single strings!', explanation: 'Both print("Hello World") and print "Hello World" work in Lua!' } ], 3: [ { question: 'How do you create a variable in Lua?', options: ['var x = 5', 'local x = 5', 'let x = 5', 'int x = 5'], correct: 1, hint: 'Think about scope!', explanation: 'In Lua, we use "local" to create variables with local scope.' }, { question: 'Which is a valid Lua data type?', options: ['integer', 'number', 'float', 'double'], correct: 1, hint: 'Lua uses a general term for numeric values!', explanation: 'Lua uses "number" as its numeric data type, which can be integer or float.' } ] }; return questionBank[lessonId] || [ { question: 'This is a sample question for this lesson.', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0, hint: 'This is a sample hint!', explanation: 'This is a sample explanation.' } ]; }; // Achievements system const achievements = [ { id: 1, title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', requirement: 1 }, { id: 2, title: 'Getting Started', description: 'Complete 5 lessons', icon: '⭐', requirement: 5 }, { id: 3, title: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '📚', requirement: 10 }, { id: 4, title: 'Lua Novice', description: 'Complete 20 lessons', icon: '🎓', requirement: 20 }, { id: 5, title: 'Perfect Score', description: 'Get 100% on any test', icon: '💯', requirement: 'perfect_test' }, { id: 6, title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', requirement: 7 }, { id: 7, title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '👑', requirement: 30 }, { id: 8, title: 'Speed Demon', description: 'Complete a lesson in under 2 minutes', icon: '⚡', requirement: 'speed' }, { id: 9, title: 'Gem Collector', description: 'Collect 100 gems', icon: '💎', requirement: 100 }, { id: 10, title: 'Level 10', description: 'Reach level 10', icon: '🏆', requirement: 'level_10' } ]; // Calculate level from XP const calculateLevel = (xp) => { return Math.floor(Math.sqrt(xp / 100)) + 1; }; // XP needed for next level const xpForNextLevel = (level) => { return Math.pow(level, 2) * 100; }; // Check and award achievements const checkAchievements = (newProgress) => { const newAchievements = []; if (newProgress.totalLessonsCompleted >= 1 && !newProgress.achievements.includes(1)) { newAchievements.push(achievements[0]); } if (newProgress.totalLessonsCompleted >= 5 && !newProgress.achievements.includes(2)) { newAchievements.push(achievements[1]); } if (newProgress.totalLessonsCompleted >= 10 && !newProgress.achievements.includes(3)) { newAchievements.push(achievements[2]); } if (newProgress.streak >= 7 && !newProgress.achievements.includes(6)) { newAchievements.push(achievements[5]); } if (newAchievements.length > 0) { const achievement = newAchievements[0]; setNewAchievement(achievement); setShowAchievement(true); setUserProgress(prev => ({ ...prev, achievements: [...prev.achievements, achievement.id], gems: prev.gems + 10 })); setTimeout(() => setShowAchievement(false), 3000); } }; // Handle lesson completion const completeLesson = () => { const lesson = selectedLesson; const newProgress = { ...userProgress, xp: userProgress.xp + lesson.xp, gems: userProgress.gems + Math.floor(lesson.xp / 5), completedLessons: [...userProgress.completedLessons, lesson.id], totalLessonsCompleted: userProgress.totalLessonsCompleted + 1, dailyGoalProgress: userProgress.dailyGoalProgress + 1 }; const newLevel = calculateLevel(newProgress.xp); if (newLevel > userProgress.level) { setRewardType('levelUp'); setShowReward(true); } else { setRewardType('complete'); setShowReward(true); } newProgress.level = newLevel; setUserProgress(newProgress); checkAchievements(newProgress); setTimeout(() => { setShowReward(false); setCurrentView('chapter'); setSelectedLesson(null); setCurrentQuestion(0); setQuestionHistory([]); }, 2000); }; // Handle answer selection const handleAnswerSelect = (index) => { if (showFeedback) return; setSelectedAnswer(index); }; // Check answer const checkAnswer = () => { const questions = getLessonQuestions(selectedLesson.id); const correct = questions[currentQuestion].correct === selectedAnswer; setIsCorrect(correct); setShowFeedback(true); if (!correct && userProgress.hearts > 0) { setUserProgress(prev => ({ ...prev, hearts: prev.hearts - 1 })); } if (correct) { setUserProgress(prev => ({ ...prev, correctAnswers: prev.correctAnswers + 1 })); } setQuestionHistory([...questionHistory, { question: currentQuestion, correct }]); }; // Next question or complete const nextQuestion = () => { const questions = getLessonQuestions(selectedLesson.id); if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null); setShowFeedback(false); setShowHint(false); } else { completeLesson(); } }; // Check if lesson is unlocked const isLessonUnlocked = (lesson, chapter) => { const chapterLessons = chapter.lessons; const lessonIndex = chapterLessons.findIndex(l => l.id === lesson.id); if (lessonIndex === 0) return true; const previousLesson = chapterLessons[lessonIndex - 1]; return userProgress.completedLessons.includes(previousLesson.id); }; // Start lesson const startLesson = (lesson) => { if (userProgress.hearts === 0) { alert('Out of hearts! Come back later or buy more in the shop.'); return; } setSelectedLesson(lesson); setCurrentQuestion(0); setSelectedAnswer(null); setShowFeedback(false); setQuestionHistory([]); setCurrentView('lesson'); }; // Render difficulty badge const DifficultyBadge = ({ difficulty }) => { const colors = { easy: 'bg-green-500', medium: 'bg-yellow-500', hard: 'bg-orange-500', expert: 'bg-red-500', test: 'bg-purple-500' }; return ( {difficulty.toUpperCase()} ); }; // Home View const HomeView = () => (
{/* Daily Goal */}
Daily Goal
{userProgress.dailyGoalProgress}/5
Complete 5 lessons today!

{/* Quick Stats */}
{userProgress.streak}
Day Streak
{userProgress.level}
Level
{/* Continue Learning */}
Continue Learning
{chapters.slice(0, 3).map(chapter => { const completedLessons = chapter.lessons.filter(l => userProgress.completedLessons.includes(l.id) ).length; const progress = (completedLessons / chapter.lessons.length) * 100; return (
{ setSelectedChapter(chapter); setCurrentView('chapter'); }} className="bg-gradient-to-r ${chapter.color} p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform" >
{chapter.icon}
{chapter.title}
{completedLessons}/{chapter.lessons.length} lessons
); })}
{/* Leaderboard Preview */}
Leaderboard
{friendsLeaderboard.slice(0, 3).map((friend, index) => (
{friend.avatar}
{friend.name}
{friend.xp} XP
{friend.streak}
))}
); // Chapters View const ChaptersView = () => (
Choose Your Path
{chapters.map(chapter => { const completedLessons = chapter.lessons.filter(l => userProgress.completedLessons.includes(l.id) ).length; const progress = (completedLessons / chapter.lessons.length) * 100; return (
{ setSelectedChapter(chapter); setCurrentView('chapter'); }} className={`bg-gradient-to-r ${chapter.color} p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform shadow-lg`} >
{chapter.icon}
{chapter.title}
{chapter.lessons.length} lessons

{completedLessons}/{chapter.lessons.length}
completed
); })}
); // Chapter Detail View const ChapterView = () => (
setCurrentView('chapters')} className="mb-4 text-gray-600 hover:text-gray-900 flex items-center gap-2" > ← Back to Chapters
{selectedChapter.icon}
{selectedChapter.title}

{/* Lesson List */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
  {selectedChapter.lessons.map(lesson => {
    const unlocked = isLessonUnlocked(lesson, selectedChapter);
    const completed = userProgress.completedLessons.includes(lesson.id);
    return (
      <div
        key={lesson.id}
        onClick={() => unlocked && startLesson(lesson)}
        className={`p-4 rounded-xl cursor-pointer transition-transform shadow-md ${
          unlocked
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-gray-700 cursor-not-allowed opacity-50"
        }`}
      >
        <div className="flex justify-between items-center">
          <span>{lesson.title}</span>
          <DifficultyBadge difficulty={lesson.difficulty} />
        </div>
        {completed && <Check className="text-green-400 mt-2" />}
      </div>
    );
  })}
</div>
</div>
);

// Lesson View
const LessonView = () => {
  const questions = getLessonQuestions(selectedLesson.id);
  const current = questions[currentQuestion];

  return (
    <div className="p-6">
      <button onClick={() => setCurrentView('chapter')} className="text-gray-500 hover:text-gray-300 mb-4 flex items-center gap-2">
        ← Back to Chapter
      </button>
      <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>

      <div className="mb-4">
        <p className="mb-2">{current.question}</p>
        {showHint && <p className="text-yellow-400 mb-2">Hint: {current.hint}</p>}
        <div className="grid grid-cols-1 gap-2">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`p-2 rounded-lg text-left w-full ${
                selectedAnswer === index ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded mt-4 ${isCorrect ? "bg-green-600" : "bg-red-600"}`}>
          {isCorrect ? "Correct!" : "Incorrect!"} <br />
          {current.explanation}
        </div>
      )}

      <div className="flex justify-between mt-4">
        {!showFeedback && (
          <button onClick={() => setShowHint(true)} className="bg-yellow-500 p-2 rounded">
            Show Hint
          </button>
        )}
        {showFeedback && (
          <button onClick={nextQuestion} className="bg-blue-500 p-2 rounded">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

// Reward / Achievement Overlay
const RewardOverlay = () => {
  if (!showReward && !showAchievement) return null;

  const rewardText = rewardType === "levelUp" ? "Level Up!" : "Lesson Complete!";
  const achievementText = newAchievement ? newAchievement.title : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white z-50 p-6">
      {showReward && <h2 className="text-3xl font-bold mb-2">{rewardText}</h2>}
      {showAchievement && <h3 className="text-2xl font-semibold mb-2">Achievement Unlocked: {achievementText}</h3>}
    </div>
  );
};

// Main Renderer
return (
  <div className="min-h-screen bg-gray-900 text-gray-100 p-4 relative">
    {currentView === "home" && <HomeView />}
    {currentView === "chapters" && <ChaptersView />}
    {currentView === "chapter" && <ChapterView />}
    {currentView === "lesson" && <LessonView />}
    <RewardOverlay />
  </div>
);
};

export default RobloxLuaAcademy;
