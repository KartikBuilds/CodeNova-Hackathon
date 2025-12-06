import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import ContentItem from '../models/ContentItem.js';

// Load env vars
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const sampleData = {
  webDevelopment: {
    title: 'Introduction to Web Development',
    domain: 'Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript',
    level: 'Beginner',
    modules: [
      {
        title: 'HTML Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'HTML Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
            duration: 3600,
            tags: ['html', 'basics', 'web development']
          }
        ]
      },
      {
        title: 'CSS Fundamentals',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'CSS Tutorial - Zero to Hero',
            url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            duration: 6000,
            tags: ['css', 'styling', 'web development']
          }
        ]
      },
      {
        title: 'JavaScript Basics',
        order: 3,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'JavaScript Full Course for Beginners',
            url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
            duration: 7200,
            tags: ['javascript', 'programming', 'web development']
          }
        ]
      }
    ]
  },
  dataStructures: {
    title: 'Data Structures & Algorithms',
    domain: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms for coding interviews',
    level: 'Intermediate',
    modules: [
      {
        title: 'Arrays and Strings',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Data Structures: Arrays',
            url: 'https://www.youtube.com/watch?v=pmN9ExDf3yQ',
            duration: 3000,
            tags: ['arrays', 'data structures', 'algorithms']
          }
        ]
      },
      {
        title: 'Linked Lists',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Linked Lists in 10 minutes',
            url: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I',
            duration: 600,
            tags: ['linked lists', 'data structures']
          }
        ]
      }
    ]
  },
  dataScience: {
    title: 'Python for Data Science',
    domain: 'Data Science',
    description: 'Master Python programming for data analysis and machine learning',
    level: 'Intermediate',
    modules: [
      {
        title: 'Python Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Python Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc',
            duration: 6300,
            tags: ['python', 'programming', 'basics']
          }
        ]
      },
      {
        title: 'Data Analysis with Pandas',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Pandas Tutorial - Data Analysis in Python',
            url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            duration: 3600,
            tags: ['pandas', 'data analysis', 'python']
          }
        ]
      }
    ]
  },
  machineLearning: {
    title: 'Machine Learning Fundamentals',
    domain: 'Machine Learning',
    description: 'Introduction to machine learning algorithms and techniques',
    level: 'Intermediate',
    modules: [
      {
        title: 'Introduction to ML',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Machine Learning for Everybody',
            url: 'https://www.youtube.com/watch?v=i_LwzRVP7bg',
            duration: 3900,
            tags: ['machine learning', 'ml', 'ai']
          }
        ]
      }
    ]
  },
  react: {
    title: 'React.js Complete Course',
    domain: 'Web Development',
    description: 'Build modern web applications with React.js',
    level: 'Intermediate',
    modules: [
      {
        title: 'React Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'React Course for Beginners',
            url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
            duration: 11700,
            tags: ['react', 'javascript', 'frontend']
          }
        ]
      },
      {
        title: 'React Hooks',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'React Hooks Tutorial',
            url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
            duration: 2400,
            tags: ['react', 'hooks', 'frontend']
          }
        ]
      }
    ]
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Course.deleteMany({});
    await Module.deleteMany({});
    await ContentItem.deleteMany({});
    console.log('Existing data cleared');

    // Create courses with modules and content
    for (const [key, courseData] of Object.entries(sampleData)) {
      console.log(`\nCreating course: ${courseData.title}`);

      // Create course first (without modules)
      const course = await Course.create({
        title: courseData.title,
        domain: courseData.domain,
        description: courseData.description,
        level: courseData.level,
        modules: [] // Will update later
      });
      console.log(`  - Created course: ${course.title}`);

      // Now create content items and modules with courseId
      const moduleIds = [];

      for (const moduleData of courseData.modules) {
        // Create content items
        const contentItemIds = [];
        for (const contentData of moduleData.contentItems) {
          const contentItem = await ContentItem.create(contentData);
          contentItemIds.push(contentItem._id);
          console.log(`    - Created content: ${contentData.title}`);
        }

        // Create module with courseId
        const module = await Module.create({
          title: moduleData.title,
          courseId: course._id,
          order: moduleData.order,
          contentItems: contentItemIds
        });
        moduleIds.push(module._id);
        console.log(`    - Created module: ${moduleData.title}`);
      }

      // Update course with module IDs
      course.modules = moduleIds;
      await course.save();

      console.log(`✓ Completed course: ${course.title} with ${moduleIds.length} modules`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Total courses: ${Object.keys(sampleData).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
