// Debug script to test community data transformation
// This will help us understand what's happening with the day field

// Simulate the data transformation that happens in AppLayout.tsx
function testCommunityDataTransformation() {
  // Mock data that might come from the database
  const mockCommunityData = [
    {
      id: '1',
      username: 'Test User',
      day: null, // This could cause "Invalid day"
      post_type: 'insight',
      content: 'Test content',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      username: 'Test User 2',
      day: 0, // This could also cause issues
      post_type: 'prayer',
      content: 'Test prayer',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      username: 'Test User 3',
      day: 5, // Valid day
      post_type: 'testimony',
      content: 'Test testimony',
      created_at: '2024-01-01T00:00:00Z'
    }
  ];

  console.log('Original data:', mockCommunityData);

  // Apply the transformation from AppLayout.tsx
  const mappedCommunity = mockCommunityData.map((row) => ({
    ...row,
    type: row.post_type,
    day: row.day && row.day > 0 ? row.day : 1, // Our fix
    is_facilitator: false,
    comments: [],
    likedBy: [],
    likes: 0,
  }));

  console.log('Transformed data:', mappedCommunity);

  // Test the display logic
  mappedCommunity.forEach(entry => {
    console.log(`Entry ${entry.id}: Day ${entry.day || 1}`);
  });
}

testCommunityDataTransformation();
