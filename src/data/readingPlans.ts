// Reading Plan Types
export interface ReadingPlanEntry {
  day: number;
  title: string;
  book: string;
  chapter: string;
  description: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  totalDays: number;
  entries: ReadingPlanEntry[];
}

// Reading Plans Data
export const readingPlans: ReadingPlan[] = [
  {
    id: '40-days',
    name: '40 Days',
    description: 'Essential spiritual journey through the Gospels',
    totalDays: 40,
    entries: [
      { day: 1, title: "Matthew 1 to 6", book: "Matthew", chapter: "1 to 6", description: "Day 1 reading: Matthew 1 to 6" },
      { day: 2, title: "Matthew 7 to 11", book: "Matthew", chapter: "7 to 11", description: "Day 2 reading: Matthew 7 to 11" },
      { day: 3, title: "Matthew 12 to 15", book: "Matthew", chapter: "12 to 15", description: "Day 3 reading: Matthew 12 to 15" },
      { day: 4, title: "Matthew 16 to 20", book: "Matthew", chapter: "16 to 20", description: "Day 4 reading: Matthew 16 to 20" },
      { day: 5, title: "Matthew 21 to 24", book: "Matthew", chapter: "21 to 24", description: "Day 5 reading: Matthew 21 to 24" },
      { day: 6, title: "Matthew 25 to 28", book: "Matthew", chapter: "25 to 28", description: "Day 6 reading: Matthew 25 to 28" },
      { day: 7, title: "Mark 1 to 6", book: "Mark", chapter: "1 to 6", description: "Day 7 reading: Mark 1 to 6" },
      { day: 8, title: "Mark 7 to 11", book: "Mark", chapter: "7 to 11", description: "Day 8 reading: Mark 7 to 11" },
      { day: 9, title: "Mark 12 to 16", book: "Mark", chapter: "12 to 16", description: "Day 9 reading: Mark 12 to 16" },
      { day: 10, title: "Luke 1 to 4", book: "Luke", chapter: "1 to 4", description: "Day 10 reading: Luke 1 to 4" },
      { day: 11, title: "Luke 5 to 8", book: "Luke", chapter: "5 to 8", description: "Day 11 reading: Luke 5 to 8" },
      { day: 12, title: "Luke 9 to 11", book: "Luke", chapter: "9 to 11", description: "Day 12 reading: Luke 9 to 11" },
      { day: 13, title: "Luke 12 to 16", book: "Luke", chapter: "12 to 16", description: "Day 13 reading: Luke 12 to 16" },
      { day: 14, title: "Luke 17 to 20", book: "Luke", chapter: "17 to 20", description: "Day 14 reading: Luke 17 to 20" },
      { day: 15, title: "Luke 21 to 24", book: "Luke", chapter: "21 to 24", description: "Day 15 reading: Luke 21 to 24" },
      { day: 16, title: "John 1 to 5", book: "John", chapter: "1 to 5", description: "Day 16 reading: John 1 to 5" },
      { day: 17, title: "John 6 to 9", book: "John", chapter: "6 to 9", description: "Day 17 reading: John 6 to 9" },
      { day: 18, title: "John 10 to 15", book: "John", chapter: "10 to 15", description: "Day 18 reading: John 10 to 15" },
      { day: 19, title: "John 16 to 21", book: "John", chapter: "16 to 21", description: "Day 19 reading: John 16 to 21" },
      { day: 20, title: "Acts 1 to 6", book: "Acts", chapter: "1 to 6", description: "Day 20 reading: Acts 1 to 6" },
      { day: 21, title: "Acts 7 to 10", book: "Acts", chapter: "7 to 10", description: "Day 21 reading: Acts 7 to 10" },
      { day: 22, title: "Acts 11 to 16", book: "Acts", chapter: "11 to 16", description: "Day 22 reading: Acts 11 to 16" },
      { day: 23, title: "Acts 17 to 22", book: "Acts", chapter: "17 to 22", description: "Day 23 reading: Acts 17 to 22" },
      { day: 24, title: "Acts 23 to 28", book: "Acts", chapter: "23 to 28", description: "Day 24 reading: Acts 23 to 28" },
      { day: 25, title: "Romans 1 to 8", book: "Romans", chapter: "1 to 8", description: "Day 25 reading: Romans 1 to 8" },
      { day: 26, title: "Romans 9 to 16", book: "Romans", chapter: "9 to 16", description: "Day 26 reading: Romans 9 to 16" },
      { day: 27, title: "1 Corinthians 1 to 9", book: "1 Corinthians", chapter: "1 to 9", description: "Day 27 reading: 1 Corinthians 1 to 9" },
      { day: 28, title: "1 Corinthians 10 to 16", book: "1 Corinthians", chapter: "10 to 16", description: "Day 28 reading: 1 Corinthians 10 to 16" },
      { day: 29, title: "2 Corinthians 1 to 10", book: "2 Corinthians", chapter: "1 to 10", description: "Day 29 reading: 2 Corinthians 1 to 10" },
      { day: 30, title: "2 Corinthians 11 to 13; Galatians 1 to 6", book: "2 Corinthians; Galatians", chapter: "11 to 13; 1 to 6", description: "Day 30 reading: 2 Corinthians 11 to 13; Galatians 1 to 6" },
      { day: 31, title: "Ephesians 1 to 6; Philippians 1 to 4", book: "Ephesians; Philippians", chapter: "1 to 6; 1 to 4", description: "Day 31 reading: Ephesians 1 to 6; Philippians 1 to 4" },
      { day: 32, title: "Colossians 1 to 4; 1 Thessalonians 1 to 5; 2 Thessalonians 1 to 3", book: "Colossians; 1 Thessalonians; 2 Thessalonians", chapter: "1 to 4; 1 to 5; 1 to 3", description: "Day 32 reading: Colossians 1 to 4; 1 Thessalonians 1 to 5; 2 Thessalonians 1 to 3" },
      { day: 33, title: "1 Timothy 1 to 6; 2 Timothy 1 to 4", book: "1 Timothy; 2 Timothy", chapter: "1 to 6; 1 to 4", description: "Day 33 reading: 1 Timothy 1 to 6; 2 Timothy 1 to 4" },
      { day: 34, title: "Titus 1 to 3; Philemon 1; Hebrews 1 to 7", book: "Titus; Philemon; Hebrews", chapter: "1 to 3; 1; 1 to 7", description: "Day 34 reading: Titus 1 to 3; Philemon 1; Hebrews 1 to 7" },
      { day: 35, title: "Hebrews 8 to 13", book: "Hebrews", chapter: "8 to 13", description: "Day 35 reading: Hebrews 8 to 13" },
      { day: 36, title: "James 1 to 5; 1 Peter 1 to 5", book: "James; 1 Peter", chapter: "1 to 5; 1 to 5", description: "Day 36 reading: James 1 to 5; 1 Peter 1 to 5" },
      { day: 37, title: "2 Peter 1 to 3; 1 John 1 to 5", book: "2 Peter; 1 John", chapter: "1 to 3; 1 to 5", description: "Day 37 reading: 2 Peter 1 to 3; 1 John 1 to 5" },
      { day: 38, title: "2 John 1; 3 John 1; Jude 1; Revelation 1 to 6", book: "2 John; 3 John; Jude; Revelation", chapter: "1; 1; 1; 1 to 6", description: "Day 38 reading: 2 John 1; 3 John 1; Jude 1; Revelation 1 to 6" },
      { day: 39, title: "Revelation 7 to 15", book: "Revelation", chapter: "7 to 15", description: "Day 39 reading: Revelation 7 to 15" },
      { day: 40, title: "Revelation 16 to 22", book: "Revelation", chapter: "16 to 22", description: "Day 40 reading: Revelation 16 to 22" }
    ]
  },
  {
    id: '90-days-chrono',
    name: '90 Days Chronological',
    description: 'Read the Bible chronologically in 90 days',
    totalDays: 90,
    entries: [
      { day: 1, title: "Genesis 1 to 15", book: "Genesis", chapter: "1 to 15", description: "Day 1 reading: Genesis 1 to 15" },
      { day: 2, title: "Genesis 16 to 26", book: "Genesis", chapter: "16 to 26", description: "Day 2 reading: Genesis 16 to 26" },
      { day: 3, title: "Genesis 27 to 36", book: "Genesis", chapter: "27 to 36", description: "Day 3 reading: Genesis 27 to 36" },
      { day: 4, title: "Genesis 37 to 47", book: "Genesis", chapter: "37 to 47", description: "Day 4 reading: Genesis 37 to 47" },
      { day: 5, title: "Genesis 48 to 60; Exodus 1 to 9", book: "Genesis; Exodus", chapter: "48 to 60; 1 to 9", description: "Day 5 reading: Genesis 48 to 60; Exodus 1 to 9" },
      { day: 6, title: "Exodus 10 to 21", book: "Exodus", chapter: "10 to 21", description: "Day 6 reading: Exodus 10 to 21" },
      { day: 7, title: "Exodus 22 to 31", book: "Exodus", chapter: "22 to 31", description: "Day 7 reading: Exodus 22 to 31" },
      { day: 8, title: "Exodus 32 to 40; Leviticus 1 to 3", book: "Exodus; Leviticus", chapter: "32 to 40; 1 to 3", description: "Day 8 reading: Exodus 32 to 40; Leviticus 1 to 3" },
      { day: 9, title: "Leviticus 4 to 13", book: "Leviticus", chapter: "4 to 13", description: "Day 9 reading: Leviticus 4 to 13" },
      { day: 10, title: "Leviticus 14 to 23", book: "Leviticus", chapter: "14 to 23", description: "Day 10 reading: Leviticus 14 to 23" },
      { day: 11, title: "Leviticus 24 to 27; Numbers 1 to 4", book: "Leviticus; Numbers", chapter: "24 to 27; 1 to 4", description: "Day 11 reading: Leviticus 24 to 27; Numbers 1 to 4" },
      { day: 12, title: "Numbers 5 to 13", book: "Numbers", chapter: "5 to 13", description: "Day 12 reading: Numbers 5 to 13" },
      { day: 13, title: "Numbers 14 to 23", book: "Numbers", chapter: "14 to 23", description: "Day 13 reading: Numbers 14 to 23" },
      { day: 14, title: "Numbers 24 to 33", book: "Numbers", chapter: "24 to 33", description: "Day 14 reading: Numbers 24 to 33" },
      { day: 15, title: "Numbers 34 to 36; Deuteronomy 1 to 7", book: "Numbers; Deuteronomy", chapter: "34 to 36; 1 to 7", description: "Day 15 reading: Numbers 34 to 36; Deuteronomy 1 to 7" }
      // ... more entries would be added from your CSV data
    ]
  },
  {
    id: '90-days-non-chrono',
    name: '90 Days Non-Chronological',
    description: 'Read the Bible non-chronologically in 90 days',
    totalDays: 90,
    entries: [
      { day: 1, title: "Genesis 1 to 10; Matthew 1 to 3", book: "Genesis; Matthew", chapter: "1 to 10; 1 to 3", description: "Day 1 reading: Genesis 1 to 10; Matthew 1 to 3" },
      { day: 2, title: "Genesis 11 to 20; Matthew 4 to 6", book: "Genesis; Matthew", chapter: "11 to 20; 4 to 6", description: "Day 2 reading: Genesis 11 to 20; Matthew 4 to 6" },
      { day: 3, title: "Genesis 21 to 30; Matthew 7 to 9", book: "Genesis; Matthew", chapter: "21 to 30; 7 to 9", description: "Day 3 reading: Genesis 21 to 30; Matthew 7 to 9" },
      { day: 4, title: "Genesis 31 to 40; Matthew 10 to 12", book: "Genesis; Matthew", chapter: "31 to 40; 10 to 12", description: "Day 4 reading: Genesis 31 to 40; Matthew 10 to 12" },
      { day: 5, title: "Genesis 41 to 50; Matthew 13 to 15", book: "Genesis; Matthew", chapter: "41 to 50; 13 to 15", description: "Day 5 reading: Genesis 41 to 50; Matthew 13 to 15" },
      { day: 6, title: "Exodus 1 to 11; Matthew 16 to 18", book: "Exodus; Matthew", chapter: "1 to 11; 16 to 18", description: "Day 6 reading: Exodus 1 to 11; Matthew 16 to 18" },
      { day: 7, title: "Exodus 12 to 22; Matthew 19 to 21", book: "Exodus; Matthew", chapter: "12 to 22; 19 to 21", description: "Day 7 reading: Exodus 12 to 22; Matthew 19 to 21" },
      { day: 8, title: "Exodus 23 to 33; Matthew 22 to 24", book: "Exodus; Matthew", chapter: "23 to 33; 22 to 24", description: "Day 8 reading: Exodus 23 to 33; Matthew 22 to 24" },
      { day: 9, title: "Exodus 34 to 40; Leviticus 1 to 4; Matthew 25 to 26", book: "Exodus; Leviticus; Matthew", chapter: "34 to 40; 1 to 4; 25 to 26", description: "Day 9 reading: Exodus 34 to 40; Leviticus 1 to 4; Matthew 25 to 26" },
      { day: 10, title: "Leviticus 5 to 15; Matthew 27 to 28", book: "Leviticus; Matthew", chapter: "5 to 15; 27 to 28", description: "Day 10 reading: Leviticus 5 to 15; Matthew 27 to 28" },
      { day: 11, title: "Leviticus 16 to 25; Mark 1 to 3", book: "Leviticus; Mark", chapter: "16 to 25; 1 to 3", description: "Day 11 reading: Leviticus 16 to 25; Mark 1 to 3" },
      { day: 12, title: "Leviticus 26 to 27; Numbers 1 to 8; Mark 4 to 5", book: "Leviticus; Numbers; Mark", chapter: "26 to 27; 1 to 8; 4 to 5", description: "Day 12 reading: Leviticus 26 to 27; Numbers 1 to 8; Mark 4 to 5" },
      { day: 13, title: "Numbers 9 to 18; Mark 6 to 8", book: "Numbers; Mark", chapter: "9 to 18; 6 to 8", description: "Day 13 reading: Numbers 9 to 18; Mark 6 to 8" },
      { day: 14, title: "Numbers 19 to 28; Mark 9 to 11", book: "Numbers; Mark", chapter: "19 to 28; 9 to 11", description: "Day 14 reading: Numbers 19 to 28; Mark 9 to 11" },
      { day: 15, title: "Numbers 29 to 36; Deuteronomy 1 to 3; Mark 12 to 14", book: "Numbers; Deuteronomy; Mark", chapter: "29 to 36; 1 to 3; 12 to 14", description: "Day 15 reading: Numbers 29 to 36; Deuteronomy 1 to 3; Mark 12 to 14" }
      // ... more entries would be added from your CSV data
    ]
  }
];

// Helper Functions
export const getReadingPlan = (id: string): ReadingPlan | undefined => {
  return readingPlans.find(plan => plan.id === id);
};

export const getTodaysReading = (planId: string, day: number): ReadingPlanEntry | undefined => {
  const plan = getReadingPlan(planId);
  if (!plan) return undefined;
  
  return plan.entries.find(entry => entry.day === day);
};

export const getAllReadingPlans = (): ReadingPlan[] => {
  return readingPlans;
};

