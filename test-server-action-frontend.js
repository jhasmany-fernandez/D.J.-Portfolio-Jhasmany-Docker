// Test server action from within the frontend container environment
const { subscribeNewsletterAction } = require('./Portfolio-Jhasmany-Frontend/src/actions/newsletter.ts');

async function testServerAction() {
  console.log('🧪 Testing server action...');

  // Create a mock FormData
  const formData = new FormData();
  formData.append('email', 'jhasmany.fernandez.dev@gmail.com');
  formData.append('firstName', 'Test');
  formData.append('lastName', 'User');
  formData.append('company', 'Test Company');
  formData.append('source', 'test-script');

  try {
    const result = await subscribeNewsletterAction(null, formData);
    console.log('✅ Server action result:', result);
  } catch (error) {
    console.error('❌ Server action error:', error);
  }
}

testServerAction();