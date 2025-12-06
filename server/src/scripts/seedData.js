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

// Enhanced sample data with 50 courses
const sampleData = {
  // MERN Stack Series
  mernFullStack: {
    title: 'Complete MERN Stack Development',
    domain: 'Web Development',
    description: 'Master MongoDB, Express.js, React.js, and Node.js to build full-stack applications',
    level: 'Advanced',
    modules: [
      {
        title: 'MongoDB & Database Design',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'MongoDB Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=ExcRbA7fy_A',
            duration: 7200,
            tags: ['mongodb', 'database', 'nosql']
          }
        ]
      },
      {
        title: 'Express.js Backend',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Express.js Full Course',
            url: 'https://www.youtube.com/watch?v=L72fhGm1tfE',
            duration: 8400,
            tags: ['express', 'nodejs', 'backend']
          }
        ]
      },
      {
        title: 'React.js Frontend',
        order: 3,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'React Full Course 2024',
            url: 'https://www.youtube.com/watch?v=CgkZ7MvWUAA',
            duration: 10800,
            tags: ['react', 'frontend', 'javascript']
          }
        ]
      },
      {
        title: 'Node.js Server Development',
        order: 4,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Node.js Complete Guide',
            url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
            duration: 9600,
            tags: ['nodejs', 'server', 'javascript']
          }
        ]
      }
    ]
  },
  
  // Web Development Fundamentals
  htmlCssFundamentals: {
    title: 'HTML & CSS Fundamentals',
    domain: 'Web Development',
    description: 'Learn the building blocks of web development with HTML and CSS',
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
        title: 'CSS Styling',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'CSS Complete Course',
            url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            duration: 6000,
            tags: ['css', 'styling', 'design']
          }
        ]
      }
    ]
  },

  javascriptMastery: {
    title: 'JavaScript Mastery',
    domain: 'Web Development',
    description: 'Master modern JavaScript from basics to advanced concepts',
    level: 'Intermediate',
    modules: [
      {
        title: 'JavaScript Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'JavaScript Full Course',
            url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
            duration: 7200,
            tags: ['javascript', 'programming', 'fundamentals']
          }
        ]
      },
      {
        title: 'ES6+ Features',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Modern JavaScript ES6+',
            url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
            duration: 5400,
            tags: ['es6', 'modern javascript', 'features']
          }
        ]
      }
    ]
  },

  reactAdvanced: {
    title: 'Advanced React Development',
    domain: 'Web Development',
    description: 'Advanced React patterns, hooks, and performance optimization',
    level: 'Advanced',
    modules: [
      {
        title: 'React Hooks Deep Dive',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'React Hooks Tutorial',
            url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q',
            duration: 2400,
            tags: ['react', 'hooks', 'advanced']
          }
        ]
      },
      {
        title: 'State Management with Redux',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Redux Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=CVpUuw9XSjY',
            duration: 4800,
            tags: ['redux', 'state management', 'react']
          }
        ]
      }
    ]
  },

  nodeJsBackend: {
    title: 'Node.js Backend Development',
    domain: 'Web Development',
    description: 'Build scalable backend applications with Node.js',
    level: 'Intermediate',
    modules: [
      {
        title: 'Node.js Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Node.js Complete Course',
            url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
            duration: 9600,
            tags: ['nodejs', 'backend', 'server']
          }
        ]
      }
    ]
  },

  // Data Science & Analytics
  pythonDataScience: {
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
        title: 'Pandas & NumPy',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Pandas Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            duration: 3600,
            tags: ['pandas', 'numpy', 'data analysis']
          }
        ]
      }
    ]
  },

  dataVisualization: {
    title: 'Data Visualization with Python',
    domain: 'Data Science',
    description: 'Create stunning visualizations using Matplotlib, Seaborn, and Plotly',
    level: 'Intermediate',
    modules: [
      {
        title: 'Matplotlib Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Matplotlib Tutorial',
            url: 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
            duration: 4200,
            tags: ['matplotlib', 'visualization', 'python']
          }
        ]
      }
    ]
  },

  sqlDatabase: {
    title: 'SQL Database Management',
    domain: 'Database Management',
    description: 'Master SQL queries and database design principles',
    level: 'Beginner',
    modules: [
      {
        title: 'SQL Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'SQL Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
            duration: 14400,
            tags: ['sql', 'database', 'queries']
          }
        ]
      }
    ]
  },

  // Machine Learning & AI
  machineLearningBasics: {
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

  deepLearning: {
    title: 'Deep Learning with TensorFlow',
    domain: 'Machine Learning',
    description: 'Build neural networks and deep learning models',
    level: 'Advanced',
    modules: [
      {
        title: 'Neural Networks',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Deep Learning Fundamentals',
            url: 'https://www.youtube.com/watch?v=aircAruvnKk',
            duration: 5400,
            tags: ['deep learning', 'neural networks', 'tensorflow']
          }
        ]
      }
    ]
  },

  naturalLanguageProcessing: {
    title: 'Natural Language Processing',
    domain: 'AI/ML',
    description: 'Process and analyze text data using NLP techniques',
    level: 'Advanced',
    modules: [
      {
        title: 'NLP Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'NLP Complete Course',
            url: 'https://www.youtube.com/watch?v=X2vAabgKiuM',
            duration: 7200,
            tags: ['nlp', 'text processing', 'ai']
          }
        ]
      }
    ]
  },

  computerVision: {
    title: 'Computer Vision with OpenCV',
    domain: 'AI/ML',
    description: 'Image processing and computer vision applications',
    level: 'Advanced',
    modules: [
      {
        title: 'OpenCV Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'OpenCV Python Tutorial',
            url: 'https://www.youtube.com/watch?v=oXlwWbU8l2o',
            duration: 6000,
            tags: ['opencv', 'computer vision', 'image processing']
          }
        ]
      }
    ]
  },

  // DevOps & Cloud
  devOpsFundamentals: {
    title: 'DevOps Fundamentals',
    domain: 'DevOps',
    description: 'Learn DevOps practices, CI/CD, and infrastructure automation',
    level: 'Intermediate',
    modules: [
      {
        title: 'Introduction to DevOps',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'DevOps Tutorial for Beginners',
            url: 'https://www.youtube.com/watch?v=Xrgk023l4lI',
            duration: 3600,
            tags: ['devops', 'ci/cd', 'automation']
          }
        ]
      }
    ]
  },

  dockerKubernetes: {
    title: 'Docker & Kubernetes',
    domain: 'DevOps',
    description: 'Containerization and orchestration with Docker and Kubernetes',
    level: 'Advanced',
    modules: [
      {
        title: 'Docker Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Docker Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
            duration: 7200,
            tags: ['docker', 'containers', 'devops']
          }
        ]
      },
      {
        title: 'Kubernetes Orchestration',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Kubernetes Complete Course',
            url: 'https://www.youtube.com/watch?v=X48VuDVv0do',
            duration: 14400,
            tags: ['kubernetes', 'orchestration', 'containers']
          }
        ]
      }
    ]
  },

  awsCloudPractitioner: {
    title: 'AWS Cloud Practitioner',
    domain: 'Cloud Computing',
    description: 'Master AWS cloud services and architecture',
    level: 'Beginner',
    modules: [
      {
        title: 'AWS Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'AWS Cloud Practitioner Course',
            url: 'https://www.youtube.com/watch?v=3hLmDS179YE',
            duration: 14400,
            tags: ['aws', 'cloud', 'certification']
          }
        ]
      }
    ]
  },

  azureFundamentals: {
    title: 'Microsoft Azure Fundamentals',
    domain: 'Cloud Computing',
    description: 'Learn Azure cloud services and deployment models',
    level: 'Beginner',
    modules: [
      {
        title: 'Azure Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Azure Fundamentals Course',
            url: 'https://www.youtube.com/watch?v=NKEFWyqJ5XA',
            duration: 12600,
            tags: ['azure', 'cloud', 'microsoft']
          }
        ]
      }
    ]
  },

  // Data Structures & Algorithms
  dataStructuresAlgorithms: {
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
        title: 'Linked Lists & Trees',
        order: 2,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Linked Lists Complete Guide',
            url: 'https://www.youtube.com/watch?v=Hj_rA0dhr2I',
            duration: 4200,
            tags: ['linked lists', 'trees', 'data structures']
          }
        ]
      }
    ]
  },

  algorithmDesign: {
    title: 'Algorithm Design & Analysis',
    domain: 'Data Structures & Algorithms',
    description: 'Advanced algorithm design techniques and complexity analysis',
    level: 'Advanced',
    modules: [
      {
        title: 'Algorithm Complexity',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Big O Notation Explained',
            url: 'https://www.youtube.com/watch?v=D6xkbGLQesk',
            duration: 2400,
            tags: ['big o', 'complexity', 'algorithms']
          }
        ]
      }
    ]
  },

  codingInterviewPrep: {
    title: 'Coding Interview Preparation',
    domain: 'Data Structures & Algorithms',
    description: 'Prepare for technical interviews at top tech companies',
    level: 'Advanced',
    modules: [
      {
        title: 'Common Interview Problems',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Top 50 Coding Interview Questions',
            url: 'https://www.youtube.com/watch?v=qli-JCrSwuk',
            duration: 7200,
            tags: ['coding interview', 'leetcode', 'problem solving']
          }
        ]
      }
    ]
  },

  // Mobile Development
  reactNative: {
    title: 'React Native Mobile Development',
    domain: 'Mobile Development',
    description: 'Build cross-platform mobile apps with React Native',
    level: 'Intermediate',
    modules: [
      {
        title: 'React Native Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'React Native Complete Course',
            url: 'https://www.youtube.com/watch?v=ur6I5m2nTvk',
            duration: 10800,
            tags: ['react native', 'mobile', 'cross-platform']
          }
        ]
      }
    ]
  },

  flutterDevelopment: {
    title: 'Flutter App Development',
    domain: 'Mobile Development',
    description: 'Create beautiful mobile apps with Flutter and Dart',
    level: 'Intermediate',
    modules: [
      {
        title: 'Flutter Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Flutter Complete Course',
            url: 'https://www.youtube.com/watch?v=x0uinJvhNxI',
            duration: 13500,
            tags: ['flutter', 'dart', 'mobile development']
          }
        ]
      }
    ]
  },

  androidDevelopment: {
    title: 'Android Development with Kotlin',
    domain: 'Mobile Development',
    description: 'Native Android app development using Kotlin',
    level: 'Intermediate',
    modules: [
      {
        title: 'Kotlin Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Android Development Course',
            url: 'https://www.youtube.com/watch?v=F9UC9DY-vIU',
            duration: 16200,
            tags: ['android', 'kotlin', 'mobile']
          }
        ]
      }
    ]
  },

  iosDevelopment: {
    title: 'iOS Development with Swift',
    domain: 'Mobile Development',
    description: 'Native iOS app development using Swift',
    level: 'Intermediate',
    modules: [
      {
        title: 'Swift Programming',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'iOS Development Tutorial',
            url: 'https://www.youtube.com/watch?v=09TeUXjzpKs',
            duration: 14400,
            tags: ['ios', 'swift', 'xcode']
          }
        ]
      }
    ]
  },

  // Cybersecurity
  cybersecurityFundamentals: {
    title: 'Cybersecurity Fundamentals',
    domain: 'Cybersecurity',
    description: 'Learn the basics of cybersecurity and threat protection',
    level: 'Beginner',
    modules: [
      {
        title: 'Security Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Cybersecurity Complete Course',
            url: 'https://www.youtube.com/watch?v=U_P23SqJaDc',
            duration: 8100,
            tags: ['cybersecurity', 'security', 'threats']
          }
        ]
      }
    ]
  },

  ethicalHacking: {
    title: 'Ethical Hacking & Penetration Testing',
    domain: 'Cybersecurity',
    description: 'Learn ethical hacking techniques and penetration testing',
    level: 'Advanced',
    modules: [
      {
        title: 'Penetration Testing Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Ethical Hacking Course',
            url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
            duration: 15300,
            tags: ['ethical hacking', 'pentesting', 'security']
          }
        ]
      }
    ]
  },

  networkSecurity: {
    title: 'Network Security & Monitoring',
    domain: 'Cybersecurity',
    description: 'Secure network infrastructure and monitor threats',
    level: 'Intermediate',
    modules: [
      {
        title: 'Network Security Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Network Security Tutorial',
            url: 'https://www.youtube.com/watch?v=qiQR5rTSshw',
            duration: 7200,
            tags: ['network security', 'monitoring', 'firewall']
          }
        ]
      }
    ]
  },

  // Additional Web Technologies
  vuejsDevelopment: {
    title: 'Vue.js Complete Guide',
    domain: 'Web Development',
    description: 'Build modern web applications with Vue.js framework',
    level: 'Intermediate',
    modules: [
      {
        title: 'Vue.js Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Vue.js Complete Course',
            url: 'https://www.youtube.com/watch?v=YrxBCBibVo0',
            duration: 9000,
            tags: ['vuejs', 'frontend', 'javascript']
          }
        ]
      }
    ]
  },

  angularDevelopment: {
    title: 'Angular Framework Mastery',
    domain: 'Web Development',
    description: 'Build enterprise applications with Angular',
    level: 'Advanced',
    modules: [
      {
        title: 'Angular Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Angular Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=k5E2AVpwsko',
            duration: 14400,
            tags: ['angular', 'typescript', 'frontend']
          }
        ]
      }
    ]
  },

  nextjsFullstack: {
    title: 'Next.js Full-Stack Development',
    domain: 'Web Development',
    description: 'Build full-stack applications with Next.js and React',
    level: 'Advanced',
    modules: [
      {
        title: 'Next.js Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Next.js Complete Guide',
            url: 'https://www.youtube.com/watch?v=9P8mASSREYM',
            duration: 11700,
            tags: ['nextjs', 'fullstack', 'react']
          }
        ]
      }
    ]
  },

  typescriptMastery: {
    title: 'TypeScript for JavaScript Developers',
    domain: 'Web Development',
    description: 'Add type safety to JavaScript with TypeScript',
    level: 'Intermediate',
    modules: [
      {
        title: 'TypeScript Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'TypeScript Complete Course',
            url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
            duration: 8100,
            tags: ['typescript', 'javascript', 'types']
          }
        ]
      }
    ]
  },

  graphqlApis: {
    title: 'GraphQL API Development',
    domain: 'Web Development',
    description: 'Build efficient APIs with GraphQL',
    level: 'Advanced',
    modules: [
      {
        title: 'GraphQL Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'GraphQL Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=ed8SzALpx1Q',
            duration: 5400,
            tags: ['graphql', 'api', 'backend']
          }
        ]
      }
    ]
  },

  // Additional Programming Languages
  pythonAdvanced: {
    title: 'Advanced Python Programming',
    domain: 'Data Science',
    description: 'Master advanced Python concepts and libraries',
    level: 'Advanced',
    modules: [
      {
        title: 'Python OOP & Design Patterns',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Advanced Python Programming',
            url: 'https://www.youtube.com/watch?v=HGOBQPFzWKo',
            duration: 7200,
            tags: ['python', 'oop', 'design patterns']
          }
        ]
      }
    ]
  },

  javaProgramming: {
    title: 'Java Programming Complete Course',
    domain: 'Web Development',
    description: 'Master Java programming from basics to advanced',
    level: 'Intermediate',
    modules: [
      {
        title: 'Java Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Java Programming Tutorial',
            url: 'https://www.youtube.com/watch?v=grEKMHGYyns',
            duration: 16200,
            tags: ['java', 'programming', 'oop']
          }
        ]
      }
    ]
  },

  cppProgramming: {
    title: 'C++ Programming Masterclass',
    domain: 'Data Structures & Algorithms',
    description: 'Master C++ programming for competitive programming',
    level: 'Advanced',
    modules: [
      {
        title: 'C++ Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'C++ Complete Course',
            url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
            duration: 14400,
            tags: ['cpp', 'programming', 'algorithms']
          }
        ]
      }
    ]
  },

  goLangDevelopment: {
    title: 'Go Programming Language',
    domain: 'Web Development',
    description: 'Build efficient backend services with Go',
    level: 'Intermediate',
    modules: [
      {
        title: 'Go Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Go Programming Tutorial',
            url: 'https://www.youtube.com/watch?v=YS4e4q9oBaU',
            duration: 10800,
            tags: ['golang', 'backend', 'concurrency']
          }
        ]
      }
    ]
  },

  rustProgramming: {
    title: 'Rust Systems Programming',
    domain: 'Web Development',
    description: 'Learn memory-safe systems programming with Rust',
    level: 'Advanced',
    modules: [
      {
        title: 'Rust Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Rust Programming Course',
            url: 'https://www.youtube.com/watch?v=zF34dRivLOw',
            duration: 12600,
            tags: ['rust', 'systems programming', 'memory safety']
          }
        ]
      }
    ]
  },

  // Blockchain & Web3
  blockchainDevelopment: {
    title: 'Blockchain Development',
    domain: 'Web Development',
    description: 'Build decentralized applications on blockchain',
    level: 'Advanced',
    modules: [
      {
        title: 'Blockchain Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Blockchain Development Course',
            url: 'https://www.youtube.com/watch?v=M576WGiDBdQ',
            duration: 14400,
            tags: ['blockchain', 'web3', 'smart contracts']
          }
        ]
      }
    ]
  },

  soliditySmartContracts: {
    title: 'Solidity Smart Contract Development',
    domain: 'Web Development',
    description: 'Develop smart contracts using Solidity',
    level: 'Advanced',
    modules: [
      {
        title: 'Solidity Programming',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Solidity Complete Course',
            url: 'https://www.youtube.com/watch?v=ipwxYa-F1uY',
            duration: 16200,
            tags: ['solidity', 'ethereum', 'smart contracts']
          }
        ]
      }
    ]
  },

  // Game Development
  unityGameDevelopment: {
    title: 'Unity Game Development',
    domain: 'Mobile Development',
    description: 'Create 2D and 3D games with Unity engine',
    level: 'Intermediate',
    modules: [
      {
        title: 'Unity Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Unity Game Development Course',
            url: 'https://www.youtube.com/watch?v=gB1F9G0JXOo',
            duration: 12600,
            tags: ['unity', 'game development', 'c#']
          }
        ]
      }
    ]
  },

  unrealEngineGameDev: {
    title: 'Unreal Engine Game Development',
    domain: 'Mobile Development',
    description: 'Build AAA-quality games with Unreal Engine',
    level: 'Advanced',
    modules: [
      {
        title: 'Unreal Engine Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Unreal Engine Complete Course',
            url: 'https://www.youtube.com/watch?v=k-zMkzmduqI',
            duration: 18000,
            tags: ['unreal engine', 'game development', 'blueprints']
          }
        ]
      }
    ]
  },

  // UI/UX Design
  uiuxDesignFundamentals: {
    title: 'UI/UX Design Fundamentals',
    domain: 'Web Development',
    description: 'Master user interface and user experience design principles',
    level: 'Beginner',
    modules: [
      {
        title: 'Design Principles',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'UI/UX Design Complete Course',
            url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
            duration: 7200,
            tags: ['ui design', 'ux design', 'figma']
          }
        ]
      }
    ]
  },

  figmaDesignTool: {
    title: 'Figma Design Mastery',
    domain: 'Web Development',
    description: 'Create stunning designs and prototypes with Figma',
    level: 'Beginner',
    modules: [
      {
        title: 'Figma Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Figma Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=FTlczfEyHnk',
            duration: 5400,
            tags: ['figma', 'design tools', 'prototyping']
          }
        ]
      }
    ]
  },

  // Testing & Quality Assurance
  softwareTesting: {
    title: 'Software Testing & QA',
    domain: 'DevOps',
    description: 'Master software testing methodologies and automation',
    level: 'Intermediate',
    modules: [
      {
        title: 'Testing Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Software Testing Complete Course',
            url: 'https://www.youtube.com/watch?v=sB_5fqiyJ_g',
            duration: 9000,
            tags: ['testing', 'qa', 'automation']
          }
        ]
      }
    ]
  },

  seleniumAutomation: {
    title: 'Selenium Test Automation',
    domain: 'DevOps',
    description: 'Automate web application testing with Selenium',
    level: 'Intermediate',
    modules: [
      {
        title: 'Selenium WebDriver',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Selenium Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=numB-z4Pa4c',
            duration: 10800,
            tags: ['selenium', 'automation testing', 'webdriver']
          }
        ]
      }
    ]
  },

  // Additional courses to reach 50
  phpWebDevelopment: {
    title: 'PHP Web Development',
    domain: 'Web Development',
    description: 'Build dynamic websites with PHP and MySQL',
    level: 'Intermediate',
    modules: [
      {
        title: 'PHP Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'PHP Complete Course',
            url: 'https://www.youtube.com/watch?v=OK_JCtrrv-c',
            duration: 14400,
            tags: ['php', 'web development', 'mysql']
          }
        ]
      }
    ]
  },

  laravelFramework: {
    title: 'Laravel Framework Development',
    domain: 'Web Development',
    description: 'Build robust web applications with Laravel PHP framework',
    level: 'Advanced',
    modules: [
      {
        title: 'Laravel Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Laravel Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=ImtZ5yENzgE',
            duration: 16200,
            tags: ['laravel', 'php', 'framework']
          }
        ]
      }
    ]
  },

  postgresqlDatabase: {
    title: 'PostgreSQL Database Administration',
    domain: 'Database Management',
    description: 'Master PostgreSQL database management and optimization',
    level: 'Intermediate',
    modules: [
      {
        title: 'PostgreSQL Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'PostgreSQL Complete Course',
            url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
            duration: 14400,
            tags: ['postgresql', 'database', 'sql']
          }
        ]
      }
    ]
  },

  redisInMemoryDatabase: {
    title: 'Redis In-Memory Database',
    domain: 'Database Management',
    description: 'Learn Redis for caching and real-time applications',
    level: 'Intermediate',
    modules: [
      {
        title: 'Redis Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Redis Complete Tutorial',
            url: 'https://www.youtube.com/watch?v=jgpVdJB2sKQ',
            duration: 5400,
            tags: ['redis', 'cache', 'in-memory database']
          }
        ]
      }
    ]
  },

  googleCloudPlatform: {
    title: 'Google Cloud Platform (GCP)',
    domain: 'Cloud Computing',
    description: 'Master Google Cloud services and architecture',
    level: 'Intermediate',
    modules: [
      {
        title: 'GCP Fundamentals',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'Google Cloud Platform Course',
            url: 'https://www.youtube.com/watch?v=4D3X6Xl5c_Y',
            duration: 18000,
            tags: ['gcp', 'google cloud', 'cloud computing']
          }
        ]
      }
    ]
  },

  tensorflowMachineLearning: {
    title: 'TensorFlow Machine Learning',
    domain: 'Machine Learning',
    description: 'Build ML models with TensorFlow and Keras',
    level: 'Advanced',
    modules: [
      {
        title: 'TensorFlow Basics',
        order: 1,
        contentItems: [
          {
            type: 'video',
            provider: 'youtube',
            title: 'TensorFlow Complete Course',
            url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk',
            duration: 25200,
            tags: ['tensorflow', 'machine learning', 'keras']
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
