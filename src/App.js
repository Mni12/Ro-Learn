import React, { useState } from "react";
import {
  Check,
} from "lucide-react";

const RobloxLuaAcademy = () => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    hearts: 5,
    gems: 0,
    completedLessons: [],
    achievements: [],
    dailyGoalProgress: 0,
    totalLessonsCompleted: 0,
    correctAnswers: 0,
    lastLoginDate: new Date().toDateString(),
  });
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState(null);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [showHint, setShowHint] = useState(false);

  // Simplified chapters array (add all as needed)
  const chapters = [
    {
      id: 1,
      title: "Lua Basics",
      icon: "📝",
      color: "from-blue-400 to-blue-600",
      lessons: [
        { id: 1, title: "What is Lua?", difficulty: "easy", xp: 10, type: "lesson" },
        { id: 6, title: "Chapter 1 Test", difficulty: "test", xp: 50, type: "test" },
      ],
    },
    {
      id: 2,
      title: "Control Flow",
      icon: "🔀",
      color: "from-green-400 to-green-600",
      lessons: [
        { id: 7, title: "If Statements", difficulty: "easy", xp: 20, type: "lesson" },
        { id: 12, title: "Chapter 2 Test", difficulty: "test", xp: 60, type: "test" },
      ],
    },
  ];

  // Sample questions
  const getLessonQuestions = (lessonId) => {
    const questionBank = {
      1: [
        {
          question: "What programming language does Roblox use?",
          options: ["JavaScript", "Lua", "Python", "C++"],
          correct: 1,
          hint: "It's a lightweight scripting language!",
          explanation: "Roblox uses Lua, a powerful and lightweight scripting language perfect for game development.",
        },
      ],
    };
    return questionBank[lessonId] || [];
  };

  // Difficulty badge
  const DifficultyBadge = ({ difficulty }) => {
    const colors = {
      easy: "bg-green-500",
      medium: "bg-yellow-500",
      hard: "bg-orange-500",
      expert: "bg-red-500",
      test: "bg-purple-500",
    };
    return (
      <span className={`px-2 py-1 rounded ${colors[difficulty] || "bg-gray-500"} text-xs`}>
        {difficulty.toUpperCase()}
      </span>
    );
  };

  // Navigation helpers
  const isLessonUnlocked = (lesson, chapter) => {
    const index = chapter.lessons.findIndex((l) => l.id === lesson.id);
    if (index === 0) return true;
    const prev = chapter.lessons[index - 1];
    return userProgress.completedLessons.includes(prev.id);
  };

  const startLesson = (lesson) => {
    if (userProgress.hearts === 0) {
      alert("Out of hearts! Come back later or buy more in the shop.");
      return;
    }
    setSelectedLesson(lesson);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuestionHistory([]);
    setCurrentView("lesson");
  };

  const handleAnswerSelect = (index) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    const questions = getLessonQuestions(selectedLesson.id);
    const correct = questions[currentQuestion].correct === selectedAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (!correct && userProgress.hearts > 0) {
      setUserProgress((prev) => ({ ...prev, hearts: prev.hearts - 1 }));
    }
  };

  const nextQuestion = () => {
    const questions = getLessonQuestions(selectedLesson.id);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    } else {
      // Complete lesson
      setUserProgress((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, selectedLesson.id],
        totalLessonsCompleted: prev.totalLessonsCompleted + 1,
        xp: prev.xp + selectedLesson.xp,
      }));
      setCurrentView("chapter");
      setSelectedLesson(null);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
    }
  };

  // Views
  const HomeView = () => (
    <div>
      <h1 className="text-3xl font-bold mb-4">Daily Goal</h1>
      <p>{userProgress.dailyGoalProgress}/5 Complete 5 lessons today!</p>

      <h2 className="text-2xl font-bold mt-6">Continue Learning</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {chapters.map((chapter) => {
          const completedLessons = chapter.lessons.filter((l) =>
            userProgress.completedLessons.includes(l.id)
          ).length;
          return (
            <div
              key={chapter.id}
              onClick={() => setCurrentView("chapter") || setSelectedChapter(chapter)}
              className={`bg-gradient-to-r ${chapter.color} p-4 rounded-xl cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="flex justify-between items-center">
                <span>{chapter.icon}</span>
                <span>{chapter.title}</span>
              </div>
              <p>
                {completedLessons}/{chapter.lessons.length} lessons completed
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ChapterView = () => (
    <div>
      <button
        onClick={() => setCurrentView("home")}
        className="mb-4 text-gray-500 hover:text-gray-300 flex items-center gap-2"
      >
        ← Back to Chapters
      </button>
      <h2 className="text-2xl font-bold mb-4">{selectedChapter?.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedChapter?.lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson, selectedChapter);
          const completed = userProgress.completedLessons.includes(lesson.id);
          return (
            <div
              key={lesson.id}
              onClick={() => unlocked && startLesson(lesson)}
              className={`p-4 rounded-xl cursor-pointer shadow-md ${
                unlocked ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-700 cursor-not-allowed opacity-50"
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

  const LessonView = () => {
    const questions = getLessonQuestions(selectedLesson.id);
    const current = questions[currentQuestion];

    return (
      <div className="p-6">
        <button
          onClick={() => setCurrentView("chapter")}
          className="text-gray-500 hover:text-gray-300 mb-4 flex items-center gap-2"
        >
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      {currentView === "home" && <HomeView />}
      {currentView === "chapter" && <ChapterView />}
      {currentView === "lesson" && <LessonView />}
    </div>
  );
};

export default RobloxLuaAcademy;
