// Excel Data Converter Helper
// This file helps convert Excel data to our reading plan format

export interface ExcelRow {
  Day: number;
  Title: string;
  Chapter: string;
  Verses: string;
  Description?: string;
}

// Helper function to convert Excel data
export const convertExcelData = (excelRows: ExcelRow[], planId: string, planName: string, planDescription: string) => {
  return {
    id: planId,
    name: planName,
    description: planDescription,
    totalDays: excelRows.length,
    entries: excelRows.map(row => ({
      day: row.Day,
      title: row.Title,
      chapter: row.Chapter,
      verses: row.Verses,
      description: row.Description || ''
    }))
  };
};

// Instructions for converting your Excel files:

/*
STEP 1: Open each Excel file and copy the data

For 40_day_reading_plan(1).csv.xlsx:
1. Open the file in Excel or Google Sheets
2. Copy all the data (Ctrl+A, Ctrl+C)
3. Paste it below in the format shown

For Bible 90 Day Reading Plan chronological.xlsx:
1. Open the file in Excel or Google Sheets  
2. Copy all the data (Ctrl+A, Ctrl+C)
3. Paste it below in the format shown

For Biblein 90Days non-chronological.xlsx:
1. Open the file in Excel or Google Sheets
2. Copy all the data (Ctrl+A, Ctrl+C)  
3. Paste it below in the format shown

STEP 2: Format the data like this:

const excelData40Days = [
  { Day: 1, Title: "Your Title Here", Chapter: "Genesis 1:1-31", Verses: "1-31", Description: "Your description here" },
  { Day: 2, Title: "Your Title Here", Chapter: "Genesis 3:1-24", Verses: "1-24", Description: "Your description here" },
  // ... continue for all 40 days
];

const excelData90Chrono = [
  { Day: 1, Title: "Your Title Here", Chapter: "Genesis 1:1-31", Verses: "1-31", Description: "Your description here" },
  { Day: 2, Title: "Your Title Here", Chapter: "Genesis 3:1-24", Verses: "1-24", Description: "Your description here" },
  // ... continue for all 90 days
];

const excelData90NonChrono = [
  { Day: 1, Title: "Your Title Here", Chapter: "John 1:1-18", Verses: "1-18", Description: "Your description here" },
  { Day: 2, Title: "Your Title Here", Chapter: "Luke 2:1-20", Verses: "1-20", Description: "Your description here" },
  // ... continue for all 90 days
];

STEP 3: Use the converter function:

const plan40Days = convertExcelData(excelData40Days, '40-days', '40 Days', 'Essential spiritual journey');
const plan90Chrono = convertExcelData(excelData90Chrono, '90-days-chrono', '90 Days Chronological', 'Biblical timeline order');
const plan90NonChrono = convertExcelData(excelData90NonChrono, '90-days-non-chrono', '90 Days Non-Chronological', 'Thematic Bible reading');

STEP 4: Replace the data in readingPlans.ts with:
export const readingPlans: ReadingPlan[] = [plan40Days, plan90Chrono, plan90NonChrono];
*/

// Example of what the data should look like:
export const exampleData = {
  '40-days': [
    { Day: 1, Title: "The Beginning", Chapter: "Genesis 1:1-31", Verses: "1-31", Description: "In the beginning God created the heavens and the earth." },
    { Day: 2, Title: "The Fall", Chapter: "Genesis 3:1-24", Verses: "1-24", Description: "The story of Adam and Eve in the Garden of Eden." },
    { Day: 3, Title: "Noah and the Flood", Chapter: "Genesis 6:1-22", Verses: "1-22", Description: "God's judgment and salvation through Noah." }
  ],
  '90-days-chrono': [
    { Day: 1, Title: "Creation", Chapter: "Genesis 1:1-2:3", Verses: "1-2:3", Description: "The seven days of creation." },
    { Day: 2, Title: "The Garden of Eden", Chapter: "Genesis 2:4-25", Verses: "4-25", Description: "The creation of Adam and Eve." }
  ],
  '90-days-non-chrono': [
    { Day: 1, Title: "The Gospel of John", Chapter: "John 1:1-18", Verses: "1-18", Description: "The Word became flesh and dwelt among us." },
    { Day: 2, Title: "The Birth of Jesus", Chapter: "Luke 2:1-20", Verses: "1-20", Description: "The birth of our Savior in Bethlehem." }
  ]
};

// Quick conversion function for immediate use
export const quickConvert = (data: any[], planId: string, planName: string, planDescription: string) => {
  return {
    id: planId,
    name: planName,
    description: planDescription,
    totalDays: data.length,
    entries: data.map((row, index) => ({
      day: row.Day || index + 1,
      title: row.Title || row.title || '',
      chapter: row.Chapter || row.chapter || '',
      verses: row.Verses || row.verses || '',
      description: row.Description || row.description || ''
    }))
  };
};


