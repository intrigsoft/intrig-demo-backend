const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Test script for image upload/download functionality
async function testImageUpload() {
  const baseURL = 'http://localhost:3000';
  
  console.log('[DEBUG_LOG] Starting image upload test...');

  try {
    // First, get all products to find one to test with
    console.log('[DEBUG_LOG] Fetching products...');
    const productsResponse = await fetch(`${baseURL}/products`);
    const products = await productsResponse.json();
    
    if (products.length === 0) {
      console.log('[DEBUG_LOG] No products found, creating a test product first...');
      
      // Create a test product
      const createResponse = await fetch(`${baseURL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Product for Images',
          description: 'A product created for testing image upload functionality',
          price: 99.99,
          category: 'Test',
          inStock: true,
        }),
      });
      
      if (!createResponse.ok) {
        throw new Error(`Failed to create product: ${createResponse.statusText}`);
      }
      
      const newProduct = await createResponse.json();
      console.log('[DEBUG_LOG] Created test product:', newProduct.id);
      
      // Use the newly created product for testing
      products.push(newProduct);
    }
    
    const testProductId = products[0].id;
    console.log('[DEBUG_LOG] Using product ID for testing:', testProductId);

    // Create a test image file
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
      0x49, 0x48, 0x44, 0x52, // IHDR
      0x00, 0x00, 0x00, 0x01, // width: 1
      0x00, 0x00, 0x00, 0x01, // height: 1
      0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
      0x90, 0x77, 0x53, 0xDE, // CRC
      0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
      0x49, 0x44, 0x41, 0x54, // IDAT
      0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, // image data
      0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, // CRC
      0x00, 0x00, 0x00, 0x00, // IEND chunk length
      0x49, 0x45, 0x4E, 0x44, // IEND
      0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    fs.writeFileSync(testImagePath, testImageData);
    console.log('[DEBUG_LOG] Created test image file:', testImagePath);

    // Test image upload
    console.log('[DEBUG_LOG] Testing image upload...');
    const form = new FormData();
    form.append('images', fs.createReadStream(testImagePath), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });

    const uploadResponse = await fetch(`${baseURL}/products/${testProductId}/images`, {
      method: 'POST',
      body: form,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const updatedProduct = await uploadResponse.json();
    console.log('[DEBUG_LOG] Upload successful! Updated product:', JSON.stringify(updatedProduct, null, 2));
    console.log('[DEBUG_LOG] Product now has images:', updatedProduct.images);

    if (updatedProduct.images && updatedProduct.images.length > 0) {
      const imageFilename = updatedProduct.images[0];
      console.log('[DEBUG_LOG] Testing image download for filename:', imageFilename);
      
      // Test image download
      const downloadResponse = await fetch(`${baseURL}/products/images/${imageFilename}`);
      
      if (downloadResponse.ok) {
        console.log('[DEBUG_LOG] Image download successful!');
        console.log('[DEBUG_LOG] Content-Type:', downloadResponse.headers.get('content-type'));
        console.log('[DEBUG_LOG] Content-Length:', downloadResponse.headers.get('content-length'));
      } else {
        console.log('[DEBUG_LOG] Image download failed:', downloadResponse.statusText);
      }
    }

    // Cleanup
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('[DEBUG_LOG] Cleaned up test image file');
    }

    console.log('[DEBUG_LOG] Image upload test completed successfully!');

  } catch (error) {
    console.error('[DEBUG_LOG] Test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testImageUpload();
}

module.exports = { testImageUpload };