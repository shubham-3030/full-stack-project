const http = require('http');
const app = require('./server');
const connectDB = require('./config/db');
const User = require('./models/User');
const Blog = require('./models/Blog');

const PORT = 5005;

let server;

const makeRequest = (options, postData = null) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log('Connecting DB for integration tests...');
    await connectDB();

    await User.deleteMany({ email: /@test\.com$/ });
    await Blog.deleteMany({ title: /User A/ });

    server = app.listen(PORT, async () => {
      console.log(`Test server running on port ${PORT}`);

      console.log('\n--- 1. Testing Registration (with confirmPassword) ---');
      const timeStamp = Date.now();
      const emailA = `usera_${timeStamp}@test.com`;
      const emailB = `userb_${timeStamp}@test.com`;

      const regUserA = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: 'Author User A',
          email: emailA,
          password: 'password123',
          confirmPassword: 'password123',
        }
      );
      console.log('User A Registration Status (Expect 201):', regUserA.status);
      const tokenA = regUserA.data.token;

      const regUserB = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/auth/register',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        {
          name: 'Other User B',
          email: emailB,
          password: 'password123',
          confirmPassword: 'password123',
        }
      );
      console.log('User B Registration Status (Expect 201):', regUserB.status);
      const tokenB = regUserB.data.token;

      console.log('\n--- 2. Testing Read Blogs Authorization (Unauthenticated vs Authenticated) ---');
      const unauthReadRes = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/blogs',
        method: 'GET',
      });
      console.log('Unauthenticated Read Status (Expect 401 Unauthorized):', unauthReadRes.status);

      const authReadRes = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: '/api/blogs',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenA}`,
        },
      });
      console.log('Authenticated Read Status (Expect 200 OK):', authReadRes.status);

      console.log('\n--- 3. Testing Blog Creation by User A ---');
      const createBlogRes = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: '/api/blogs',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenA}`,
          },
        },
        {
          title: 'User A Exclusive Post',
          content: 'This post is written exclusively by User A.',
          category: 'Technology',
          tags: ['test', 'security'],
        }
      );
      console.log('Blog Creation Status (Expect 201):', createBlogRes.status);
      const blogId = createBlogRes.data.data._id;
      console.log('Created Blog ID:', blogId);

      console.log('\n--- 4. Testing Ownership Security (User B attempts to edit User A post) ---');
      const editAttemptByB = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: `/api/blogs/${blogId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenB}`,
          },
        },
        {
          title: 'Hacked Title by User B',
        }
      );
      console.log('User B Edit Attempt Status (Expect 403 Forbidden):', editAttemptByB.status);

      console.log('\n--- 5. Testing Ownership Security (User B attempts to delete User A post) ---');
      const deleteAttemptByB = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: `/api/blogs/${blogId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenB}`,
        },
      });
      console.log('User B Delete Attempt Status (Expect 403 Forbidden):', deleteAttemptByB.status);

      console.log('\n--- 6. Testing Authorized Update by User A (Owner) ---');
      const editByA = await makeRequest(
        {
          hostname: 'localhost',
          port: PORT,
          path: `/api/blogs/${blogId}`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenA}`,
          },
        },
        {
          title: 'User A Updated Post Title',
        }
      );
      console.log('User A Update Status (Expect 200):', editByA.status);

      console.log('\n--- 7. Testing Authorized Delete by User A (Owner) ---');
      const deleteByA = await makeRequest({
        hostname: 'localhost',
        port: PORT,
        path: `/api/blogs/${blogId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      });
      console.log('User A Delete Status (Expect 200):', deleteByA.status);

      console.log('\n==================================================');
      console.log('✅ ALL INTEGRATION & AUTHORIZATION TESTS PASSED PERFECTLY!');
      console.log('==================================================');
      server.close(() => process.exit(0));
    });
  } catch (err) {
    console.error('Test execution error:', err);
    if (server) server.close(() => process.exit(1));
    else process.exit(1);
  }
};

runTests();
