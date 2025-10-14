import React, { useState } from 'react';
import BibleReaderModal from './BibleReaderModal';
import { getTodaysReading } from '../data/readingPlans';

interface HomePageProps {
  streaks: number;
  totalVisits: number;
  readingPlan: string;
}

const HomePage: React.FC<HomePageProps> = ({ streaks, totalVisits, readingPlan }) => {
  const [showBibleReader, setShowBibleReader] = useState(false);
  const verseOfTheDay = {
    verse: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11"
  };

  // Get today's reading from the reading plan
  const currentDay = 15; // This would normally be calculated based on when the user started
  const todayReadingData = getTodaysReading(readingPlan, currentDay);
  
  // Get total days based on reading plan
  const getTotalDays = (plan: string) => {
    switch (plan) {
      case '40-days':
        return 40;
      case '90-days-chrono':
      case '90-days-non-chrono':
        return 90;
      default:
        return 40;
    }
  };

  const totalDays = getTotalDays(readingPlan);
  
  const todayReading = todayReadingData ? {
    day: todayReadingData.day,
    chapter: todayReadingData.chapter,
    title: todayReadingData.title,
    description: todayReadingData.description
  } : {
    day: 15,
    chapter: "Matthew 5:1-16",
    title: "The Beatitudes",
    description: "Jesus' teaching on true blessedness"
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Verse of the Day */}
      <div className="bg-gradient-to-r from-red-800 to-yellow-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68d665f993df5d926ecdf2eb_1758881342382_a0f95d86.webp" 
            alt="Bible" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-semibold mb-3">Verse of the Day</h2>
          <p className="text-sm leading-relaxed mb-3 italic">"{verseOfTheDay.verse}"</p>
          <p className="text-sm font-medium">— {verseOfTheDay.reference}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium text-gray-600">Current Streak</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{streaks} days</p>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">📊</span>
            <span className="text-sm font-medium text-gray-600">Total Visits</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{totalVisits}</p>
        </div>
      </div>

      {/* Today's Reading */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Today's Reading</h3>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Day {todayReading.day}
          </span>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold text-gray-800">{todayReading.title}</h4>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-700 mb-2">Reading Plan Progress</h5>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{readingPlan.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              <span>{todayReading.day}/{totalDays} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-800 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(todayReading.day / totalDays) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowBibleReader(true)}
            className="w-full bg-red-800 text-white py-3 rounded-xl font-semibold hover:bg-red-900 transition-colors"
          >
            Start Today's Reading
          </button>
        </div>
      </div>


      {/* Bible Reading Modal */}
        <BibleReaderModal
          isOpen={showBibleReader}
          onClose={() => setShowBibleReader(false)}
          readingPlan={readingPlan}
          day={currentDay}
        />
    </div>
  );
};

export default HomePage;