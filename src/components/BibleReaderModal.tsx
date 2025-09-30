import React, { useState, useEffect } from 'react';
import { X, BookOpen, Settings, ChevronLeft, ChevronRight, Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Input } from './ui/input';

interface BibleReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingPlan?: string;
  day?: number;
}

const BIBLE_VERSIONS = [
  { value: 'NIV', label: 'New International Version' },
  { value: 'ESV', label: 'English Standard Version' },
  { value: 'KJV', label: 'King James Version' },
  { value: 'NLT', label: 'New Living Translation' },
  { value: 'MSG', label: 'The Message' },
  { value: 'AMP', label: 'Amplified Bible' }
];

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Songs', 'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

// Chapter counts for each book
const CHAPTER_COUNTS: { [key: string]: number } = {
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34, 'Joshua': 24, 'Judges': 21, 'Ruth': 4,
  '1 Samuel': 31, '2 Samuel': 24, '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10,
  'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31, 'Ecclesiastes': 12, 'Song of Songs': 8,
  'Isaiah': 66, 'Jeremiah': 52, 'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3, 'Amos': 9,
  'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3, 'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14,
  'Malachi': 4, 'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28, 'Romans': 16, '1 Corinthians': 16,
  '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6, 'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5,
  '2 Thessalonians': 3, '1 Timothy': 6, '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5,
  '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1, 'Jude': 1, 'Revelation': 22
};

export default function BibleReaderModal({ isOpen, onClose, readingPlan, day = 1 }: BibleReaderModalProps) {
  const [selectedVersion, setSelectedVersion] = useState('NIV');
  const [fontSize, setFontSize] = useState(16);
  const [bibleText, setBibleText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedBook, setSelectedBook] = useState('Matthew');
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [todaysReading, setTodaysReading] = useState<any>(null);

  // Format Bible text to show verses in separate paragraphs
  const formatBibleText = (text: string): string => {
    if (!text) return '';
    
    console.log('Raw API text:', text);
    
    // The API returns text with verse numbers, we need to format them properly
    let formattedText = text;
    
    // Handle different verse patterns from the API
    // Pattern 1: "1 In the beginning..." (newline separated)
    formattedText = formattedText.replace(/^(\d+)\s+(.+)$/gm, '<p><strong>$1</strong> $2</p>');
    
    // Pattern 2: Already in paragraphs but need bold verse numbers
    formattedText = formattedText.replace(/<p>(\d+)\s+(.+?)<\/p>/g, '<p><strong>$1</strong> $2</p>');
    
    // Pattern 3: Handle text that comes as one block
    if (!formattedText.includes('<p>')) {
      // Split by verse numbers and wrap in paragraphs
      const verses = formattedText.split(/(\d+\s+)/).filter(v => v.trim());
      let result = '';
      for (let i = 0; i < verses.length; i += 2) {
        if (verses[i] && verses[i + 1]) {
          const verseNum = verses[i].trim();
          const verseText = verses[i + 1].trim();
          result += `<p><strong>${verseNum}</strong> ${verseText}</p>`;
        }
      }
      if (result) formattedText = result;
    }
    
    console.log('Formatted text:', formattedText);
    return formattedText;
  };

  useEffect(() => {
    if (isOpen) {
      loadTodaysReading();
      // Test API first
      import('../services/bibleApi').then(({ testBibleApi }) => {
        testBibleApi();
      });
      // Also load initial Bible text
      if (selectedBook && selectedChapter) {
        console.log('Loading initial Bible text on modal open');
        fetchBibleText(selectedBook, selectedChapter);
      }
    }
  }, [isOpen, readingPlan, day]);

  // Auto-load Bible text when selections change
  useEffect(() => {
    console.log('useEffect triggered:', { isOpen, selectedBook, selectedChapter, selectedVersion });
    if (isOpen && selectedBook && selectedChapter) {
      console.log('Auto-loading Bible text...');
      handleBookChapterChange();
    }
  }, [selectedBook, selectedChapter, selectedVersion]);

  const loadTodaysReading = async () => {
    if (!readingPlan) return;
    
    try {
      const { getTodaysReading } = await import('../data/readingPlans');
      
      // Map the reading plan ID to the correct format
      let planId = readingPlan || '40-days';
      if (planId === '40-day') planId = '40-days';
      if (planId === '90-day-chronological') planId = '90-days-chrono';
      if (planId === '90-day-non-chronological') planId = '90-days-non-chrono';
      
      const readingData = getTodaysReading(planId, day);
      setTodaysReading(readingData);
      
      // Set default book and chapter from today's reading
      if (readingData) {
        const firstBook = readingData.book.split(';')[0].trim();
        setSelectedBook(firstBook);
        const firstChapter = readingData.chapter.split(';')[0].trim().split(' ')[0];
        setSelectedChapter(firstChapter);
      }
    } catch (err) {
      console.error('Error loading reading plan:', err);
    }
  };

  const fetchBibleText = async (book: string, chapter: string) => {
    console.log('fetchBibleText called with:', book, chapter, selectedVersion);
    setIsLoading(true);
    setError('');
    setBibleText(''); // Clear previous text
    
    try {
      const { fetchBibleTextCached } = await import('../services/bibleApi');
      const reference = `${book} ${chapter}`;
      console.log('Fetching with reference:', reference);
      const bibleResponse = await fetchBibleTextCached(reference, selectedVersion);
      console.log('Bible response received:', bibleResponse);
      setBibleText(bibleResponse.text);
    } catch (err) {
      console.error('Error fetching Bible text:', err);
      setError('Failed to load Bible text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookChapterChange = () => {
    if (selectedBook && selectedChapter) {
      fetchBibleText(selectedBook, selectedChapter);
    }
  };

  const handleVersionChange = (version: string) => {
    setSelectedVersion(version);
    if (selectedBook && selectedChapter) {
      fetchBibleText(selectedBook, selectedChapter);
    }
  };

  const goToPreviousChapter = () => {
    const currentBookIndex = BIBLE_BOOKS.indexOf(selectedBook);
    const currentChapter = parseInt(selectedChapter);
    
    if (currentChapter > 1) {
      setSelectedChapter((currentChapter - 1).toString());
      fetchBibleText(selectedBook, (currentChapter - 1).toString());
    } else if (currentBookIndex > 0) {
      const prevBook = BIBLE_BOOKS[currentBookIndex - 1];
      const prevBookChapters = CHAPTER_COUNTS[prevBook];
      setSelectedBook(prevBook);
      setSelectedChapter(prevBookChapters.toString());
      fetchBibleText(prevBook, prevBookChapters.toString());
    }
  };

  const goToNextChapter = () => {
    const currentBookIndex = BIBLE_BOOKS.indexOf(selectedBook);
    const currentChapter = parseInt(selectedChapter);
    const maxChapters = CHAPTER_COUNTS[selectedBook];
    
    if (currentChapter < maxChapters) {
      setSelectedChapter((currentChapter + 1).toString());
      fetchBibleText(selectedBook, (currentChapter + 1).toString());
    } else if (currentBookIndex < BIBLE_BOOKS.length - 1) {
      const nextBook = BIBLE_BOOKS[currentBookIndex + 1];
      setSelectedBook(nextBook);
      setSelectedChapter('1');
      fetchBibleText(nextBook, '1');
    }
  };

  const getChapterOptions = () => {
    const maxChapters = CHAPTER_COUNTS[selectedBook] || 1;
    return Array.from({ length: maxChapters }, (_, i) => i + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl w-full max-w-5xl h-[98vh] sm:h-[95vh] flex flex-col shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-500 safe-area-inset">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-red-800/90 to-yellow-600/90 backdrop-blur-sm text-white rounded-t-2xl">
          <div className="flex-1">
            {todaysReading && (
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Day {day}
                </h2>
                <p className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-white/30">
                  {todaysReading.title}
                </p>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/20 backdrop-blur-sm rounded-full p-2 border border-white/30 hover:border-white/50 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-red-50/80 to-yellow-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4">
            {/* Book Selection */}
            <Select value={selectedBook} onValueChange={(value) => {
              setSelectedBook(value);
              setSelectedChapter('1');
            }}>
              <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-red-200 focus:border-red-500 hover:bg-white/90 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border border-red-200 shadow-xl">
                {BIBLE_BOOKS.map((book) => (
                  <SelectItem key={book} value={book} className="hover:bg-red-50 focus:bg-red-50">{book}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Chapter Selection */}
            <Select value={selectedChapter} onValueChange={(value) => setSelectedChapter(value)}>
              <SelectTrigger className="w-20 bg-white/80 backdrop-blur-sm border-red-200 focus:border-red-500 hover:bg-white/90 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border border-red-200 shadow-xl">
                {getChapterOptions().map((chapter) => (
                  <SelectItem key={chapter} value={chapter.toString()} className="hover:bg-red-50 focus:bg-red-50">{chapter}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Version Selection */}
            <Select value={selectedVersion} onValueChange={handleVersionChange}>
              <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm border-red-200 focus:border-red-500 hover:bg-white/90 transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border border-red-200 shadow-xl max-h-60">
                {BIBLE_VERSIONS.map((version) => (
                  <SelectItem key={version.value} value={version.value} className="hover:bg-red-50 focus:bg-red-50">
                    {version.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bible Text */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-gradient-to-b from-white/90 to-red-50/90 backdrop-blur-sm">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="bg-red-100 p-4 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
              <p className="text-red-800 font-medium">Loading Bible text...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="text-red-600 mb-4">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Text</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <Button 
                  onClick={handleBookChapterChange} 
                  className="bg-red-800 hover:bg-red-900 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : bibleText ? (
            <div className="max-w-4xl mx-auto">
              <div 
                className="prose prose-lg max-w-none leading-relaxed text-gray-800"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              >
                <div 
                  className="bible-text"
                  dangerouslySetInnerHTML={{ 
                    __html: formatBibleText(bibleText) 
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-red-50 to-yellow-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold text-red-800 mb-2">Ready to Read</h3>
                <p className="text-red-700">Select a book and chapter to start reading</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-r from-red-50/80 to-yellow-50/80 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousChapter}
              className="border-red-300 text-red-800 hover:bg-red-50 px-6 py-2 transition-all duration-200 hover:border-red-400 hover:shadow-md"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous Chapter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextChapter}
              className="border-red-300 text-red-800 hover:bg-red-50 px-6 py-2 transition-all duration-200 hover:border-red-400 hover:shadow-md"
            >
              Next Chapter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
