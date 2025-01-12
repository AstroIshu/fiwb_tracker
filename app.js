const positiveMessages = [
  "You're crushing it! 🚀",
  "The comeback is real! 💪",
  "Unstoppable today! ⭐",
  "Peak performance! 📈",
  "Nothing can stop you! 🔥",
  "Living the dream! 🌟",
  "You're on fire! 🔥",
  "Legendary moves! 🏆",
  "Absolutely killing it! 💥",
  "Pure greatness! ✨",
  "You're a rockstar! 🎸",
  "Winning at life! 🏅"
];

const negativeMessages = [
  "Tomorrow is a new day 🌅",
  "This too shall pass 🌧️",
  "Keep your head up 🌟",
  "Time to reset 🔄",
  "Take a deep breath 🍃",
  "Chin up, champ! 🥊",
  "It's just a bad day, not a bad life 🌈",
  "You've got this! 💪",
  "Every setback is a setup for a comeback 🚀",
  "Take a break, you deserve it ☕",
  "You're stronger than you think 💥",
  "Keep going, you're doing great! 🌟"
];

const HabitTracker = () => {
  const [history, setHistory] = React.useState({});
  const [message, setMessage] = React.useState("");
  const [streak, setStreak] = React.useState(0);

  // Load history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('habitHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      const cleanedHistory = cleanOldData(parsedHistory); // Clean data older than 28 days
      setHistory(cleanedHistory);
      calculateStreak(cleanedHistory); // Calculate streak
    }
  }, []);

  // Clean data older than 28 days
  const cleanOldData = (data) => {
    const today = new Date();
    const twentyEightDaysAgo = new Date(today);
    twentyEightDaysAgo.setDate(today.getDate() - 28);

    const cleanedData = {};
    for (const [date, value] of Object.entries(data)) {
      const dateObj = new Date(date);
      if (dateObj >= twentyEightDaysAgo) {
        cleanedData[date] = value;
      }
    }
    return cleanedData;
  };

  // Calculate streak
  const calculateStreak = (data) => {
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      if (data[dateString] === 'back') {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);

    // Trigger confetti if streak hits 7 days
    if (currentStreak === 7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setMessage("Congratulations on a 7-day streak! 🎉");
    }
  };

  // Handle button click
  const handleClick = (type) => {
    const today = new Date().toISOString().split('T')[0];
    const newHistory = { ...history, [today]: type };

    const messages = type === 'back' ? positiveMessages : negativeMessages;
    setMessage(messages[Math.floor(Math.random() * messages.length)]);

    const cleanedHistory = cleanOldData(newHistory); // Clean data before saving
    setHistory(cleanedHistory);
    calculateStreak(cleanedHistory); // Update streak
    localStorage.setItem('habitHistory', JSON.stringify(cleanedHistory));

    // Check if the grid is full
    if (Object.keys(cleanedHistory).length === 28) {
      const shouldClear = window.confirm("You've completed the grid! Do you want to clear the data and start over?");
      if (shouldClear) {
        clearData();
      }
    }
  };

  // Clear all data
  const clearData = () => {
    localStorage.removeItem('habitHistory'); // Clear localStorage
    setHistory({}); // Reset history state
    setStreak(0); // Reset streak
    setMessage("Data cleared successfully! 🧹"); // Show confirmation message
  };

  // Generate a 7x4 grid of the last 28 days (Monday to Sunday)
  const generateGrid = () => {
    const grid = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Calculate the start of the week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)); // Adjust to Monday

    for (let row = 0; row < 4; row++) {
      const week = [];
      for (let col = 0; col < 7; col++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + (row * 7 + col)); // Move from Monday to Sunday
        const dateString = date.toISOString().split('T')[0];
        week.push(dateString);
      }
      grid.push(week);
    }
    return grid;
  };

  return (
    <div className="card">
      <div className="heading">Fuck It, We Ball Tracker</div>
      <div className="buttons">
        <button
          onClick={() => handleClick('back')}
          className="button back"
        >
          We're so back
        </button>
        <button
          onClick={() => handleClick('over')}
          className="button over"
        >
          It's over
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {/* Day Labels */}
      <div className="day-labels">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="day-label">{day}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid">
        {generateGrid().map((week, row) => (
          <div key={row} className="week">
            {week.map((date) => (
              <div
                key={date}
                className={`day ${history[date] === 'back' ? 'back' : history[date] === 'over' ? 'over' : ''}`}
                title={`${date}: ${history[date] || 'No data'}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="streak">Streak: {streak} days 🔥</div>

      {/* Clear Data Button */}
      <button
        onClick={clearData}
        className="button clear"
      >
        Clear Data
      </button>

      <div className="footer">
        <img src="deku.jpg" alt="Profile" />
        <span>AstroIshu</span>
        <a href="https://twitter.com/Astro_iSHU" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </div>
    </div>
  );
};

ReactDOM.render(<HabitTracker />, document.getElementById('root'));