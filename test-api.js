const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  const baseOptions = {
    hostname: 'localhost',
    port: 5001,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  console.log('Testing Products CRUD API...\n');

  try {
    // Test 1: Get all products
    console.log('1. Testing GET /products');
    const getAllResponse = await makeRequest({
      ...baseOptions,
      path: '/products',
      method: 'GET',
    });
    console.log(`Status: ${getAllResponse.status}`);
    console.log(`Products count: ${getAllResponse.data?.length || 0}\n`);

    // Test 2: Search products by category
    console.log('2. Testing GET /products?category=Electronics');
    const searchResponse = await makeRequest({
      ...baseOptions,
      path: '/products?category=Electronics',
      method: 'GET',
    });
    console.log(`Status: ${searchResponse.status}`);
    console.log(`Electronics products: ${searchResponse.data?.length || 0}\n`);

    // Test 3: Search products by text
    console.log('3. Testing GET /products?search=headphones');
    const textSearchResponse = await makeRequest({
      ...baseOptions,
      path: '/products?search=headphones',
      method: 'GET',
    });
    console.log(`Status: ${textSearchResponse.status}`);
    console.log(`Search results: ${textSearchResponse.data?.length || 0}\n`);

    // Test 4: Get product by ID
    console.log('4. Testing GET /products/1');
    const getOneResponse = await makeRequest({
      ...baseOptions,
      path: '/products/1',
      method: 'GET',
    });
    console.log(`Status: ${getOneResponse.status}`);
    console.log(`Product name: ${getOneResponse.data?.name || 'N/A'}\n`);

    // Test 5: Create new product
    console.log('5. Testing POST /products');
    const newProduct = {
      name: 'Test Product',
      description: 'A test product created by API test',
      price: 99.99,
      category: 'Test Category',
      inStock: true,
    };
    const createResponse = await makeRequest({
      ...baseOptions,
      path: '/products',
      method: 'POST',
    }, newProduct);
    console.log(`Status: ${createResponse.status}`);
    console.log(`Created product ID: ${createResponse.data?.id || 'N/A'}\n`);

    const createdId = createResponse.data?.id;

    if (createdId) {
      // Test 6: Update product
      console.log('6. Testing PUT /products/' + createdId);
      const updateData = { price: 89.99, name: 'Updated Test Product' };
      const updateResponse = await makeRequest({
        ...baseOptions,
        path: `/products/${createdId}`,
        method: 'PUT',
      }, updateData);
      console.log(`Status: ${updateResponse.status}`);
      console.log(`Updated price: ${updateResponse.data?.price || 'N/A'}\n`);

      // Test 7: Delete product
      console.log('7. Testing DELETE /products/' + createdId);
      const deleteResponse = await makeRequest({
        ...baseOptions,
        path: `/products/${createdId}`,
        method: 'DELETE',
      });
      console.log(`Status: ${deleteResponse.status}\n`);
    }

    console.log('API tests completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\nMake sure the server is running with: npm run start:dev');
    }
  }
}

testAPI();