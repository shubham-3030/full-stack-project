const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Blog = require('./models/Blog');

dotenv.config();

const seedData = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogapp';
    await mongoose.connect(connUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Blog.deleteMany();
    console.log('Cleared existing data.');

    // Create seed users
    const user1 = await User.create({
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      password: 'password123',
      bio: 'Full-stack developer & tech writer passionate about React and Node.js.',
    });

    const user2 = await User.create({
      name: 'Alex Mercer',
      email: 'alex@example.com',
      password: 'password123',
      bio: 'UI/UX designer & frontend engineer building clean modern user experiences.',
    });

    console.log('Created Seed Users: sarah@example.com, alex@example.com (password: password123)');

    // Create seed blogs
    await Blog.create([
      {
        title: 'Building Modern Full-Stack Web Applications with MERN Stack',
        content: `Building scalable full-stack applications requires a clear separation of concerns, robust API architecture, and seamless user experiences.

In this guide, we explore how React, Express, MongoDB, and Tailwind CSS come together to form an exceptionally efficient tech stack.

Key highlights include:
1. RESTful API Design with Express
2. JWT Authentication & Middleware Guards
3. Mongo Mongoose Schema Modeling & Relationships
4. Clean, dynamic UI styling with Tailwind CSS`,
        category: 'Development',
        tags: ['react', 'express', 'mongodb', 'fullstack'],
        author: user1._id,
      },
      {
        title: 'The Art of Glassmorphism and Modern Dark Mode UI Design',
        content: `Glassmorphism has emerged as one of the most aesthetically pleasing design trends in web development.

By utilizing backdrop-blur, subtle borders, and dynamic gradients, interfaces feel tactile, sleek, and high-end.

In this article, we cover how to build reusable glass components using Tailwind CSS and CSS backdrop filters.`,
        category: 'Design',
        tags: ['ui', 'css', 'tailwind', 'design'],
        author: user2._id,
      },
      {
        title: 'Mastering Async JavaScript: Promises, Async/Await & Event Loops',
        content: `Asynchronous programming is at the core of JavaScript's non-blocking I/O model.

Understanding how the microtask queue, call stack, and event loop interact is crucial for writing performant Node.js servers and responsive React interfaces.`,
        category: 'Technology',
        tags: ['javascript', 'async', 'nodejs'],
        author: user1._id,
      },
    ]);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
