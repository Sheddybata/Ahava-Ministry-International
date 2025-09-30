// Utility functions for parsing Excel data
// This file will help convert Excel data to our reading plan format

export interface ExcelReadingPlanRow {
  Day: number;
  Title: string;
  Chapter: string;
  Verses: string;
  Description?: string;
}

// Function to convert Excel data to our format
export const convertExcelToReadingPlan = (
  excelData: ExcelReadingPlanRow[],
  planId: string,
  planName: string,
  planDescription: string
) => {
  return {
    id: planId,
    name: planName,
    description: planDescription,
    totalDays: excelData.length,
    entries: excelData.map(row => ({
      day: row.Day,
      title: row.Title,
      chapter: row.Chapter,
      verses: row.Verses,
      description: row.Description || ''
    }))
  };
};

// Sample data structure for the Excel files
// This would be populated with actual data from the Excel files
export const sampleExcelData = {
  '40-days': [
    { Day: 1, Title: 'The Beginning', Chapter: 'Genesis 1:1-31', Verses: '1-31', Description: 'In the beginning God created the heavens and the earth.' },
    { Day: 2, Title: 'The Fall', Chapter: 'Genesis 3:1-24', Verses: '1-24', Description: 'The story of Adam and Eve in the Garden of Eden.' },
    { Day: 3, Title: 'Noah and the Flood', Chapter: 'Genesis 6:1-22', Verses: '1-22', Description: 'God\'s judgment and salvation through Noah.' },
    { Day: 4, Title: 'The Tower of Babel', Chapter: 'Genesis 11:1-9', Verses: '1-9', Description: 'Human pride and God\'s response.' },
    { Day: 5, Title: 'Abraham\'s Call', Chapter: 'Genesis 12:1-9', Verses: '1-9', Description: 'God\'s promise to Abraham and his journey of faith.' }
  ],
  '90-days-chrono': [
    { Day: 1, Title: 'Creation', Chapter: 'Genesis 1:1-2:3', Verses: '1-2:3', Description: 'The seven days of creation.' },
    { Day: 2, Title: 'The Garden of Eden', Chapter: 'Genesis 2:4-25', Verses: '4-25', Description: 'The creation of Adam and Eve.' },
    { Day: 3, Title: 'The Fall of Man', Chapter: 'Genesis 3:1-24', Verses: '1-24', Description: 'The first sin and its consequences.' },
    { Day: 4, Title: 'Cain and Abel', Chapter: 'Genesis 4:1-16', Verses: '1-16', Description: 'The first murder and God\'s justice.' },
    { Day: 5, Title: 'The Generations', Chapter: 'Genesis 5:1-32', Verses: '1-32', Description: 'The genealogy from Adam to Noah.' }
  ],
  '90-days-non-chrono': [
    { Day: 1, Title: 'The Gospel of John', Chapter: 'John 1:1-18', Verses: '1-18', Description: 'The Word became flesh and dwelt among us.' },
    { Day: 2, Title: 'The Birth of Jesus', Chapter: 'Luke 2:1-20', Verses: '1-20', Description: 'The birth of our Savior in Bethlehem.' },
    { Day: 3, Title: 'The Baptism of Jesus', Chapter: 'Matthew 3:13-17', Verses: '13-17', Description: 'Jesus\' baptism and the Father\'s approval.' },
    { Day: 4, Title: 'The Temptation', Chapter: 'Matthew 4:1-11', Verses: '1-11', Description: 'Jesus\' victory over Satan\'s temptations.' },
    { Day: 5, Title: 'The Beatitudes', Chapter: 'Matthew 5:1-12', Verses: '1-12', Description: 'Jesus\' teaching on true blessedness.' }
  ]
};

// Instructions for updating with real Excel data:
/*
To integrate the actual Excel data:

1. Open each Excel file in Excel or Google Sheets
2. Export as CSV or copy the data
3. Convert the data to the format shown in sampleExcelData above
4. Replace the sample data with the real data
5. Update the readingPlans.ts file with the converted data

The Excel files should have columns like:
- Day (number)
- Title (string)
- Chapter (string like "Genesis 1:1-31")
- Verses (string like "1-31")
- Description (optional string)

Example conversion:
Excel row: Day=1, Title="Creation", Chapter="Genesis 1:1-31", Verses="1-31", Description="God creates the world"
Becomes: { Day: 1, Title: 'Creation', Chapter: 'Genesis 1:1-31', Verses: '1-31', Description: 'God creates the world' }
*/


