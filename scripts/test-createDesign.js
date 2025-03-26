// Test script for createDesign function
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth, signInWithEmailAndPassword, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "test-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "t2design-test",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "test-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app, 'asia-northeast1');

// Connect to emulators
connectAuthEmulator(auth, 'http://127.0.0.1:9299');
connectFunctionsEmulator(functions, '127.0.0.1', 5002);

// Test user credentials
const testEmail = 'test@example.com';
const testPassword = 'password123';

// Banner types to test
const bannerTypes = [
  'banner',
  'poster',
  'magazineCover',
  'flyer',
  'youtubeThumbnail',
  'businessCard'  // Adding a 6th type
];

async function testCreateDesign() {
  try {
    // Sign in with test user
    console.log('Signing in test user...');
    await signInWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('Successfully signed in test user');
    
    // Get the createDesign function
    const createDesignFunction = httpsCallable(functions, 'createDesign');
    
    // Test each banner type
    for (const bannerType of bannerTypes) {
      console.log(`Testing creation of ${bannerType}...`);
      
      const result = await createDesignFunction({
        prompt: `A beautiful ${bannerType} for a tech company`,
        type: bannerType,
        size: bannerType === 'banner' ? '16:9' : 
              bannerType === 'poster' ? '9:16' :
              bannerType === 'magazineCover' ? '4:3' :
              bannerType === 'flyer' ? '1:1' :
              bannerType === 'youtubeThumbnail' ? '16:9' : '1:1',
        style: bannerType === 'banner' ? 'modern' : 
               bannerType === 'poster' ? 'minimal' :
               bannerType === 'magazineCover' ? 'elegant' :
               bannerType === 'flyer' ? 'colorful' :
               bannerType === 'youtubeThumbnail' ? 'bold' : 'professional'
      });
      
      console.log(`Successfully created ${bannerType}:`, result.data);
    }
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Error during testing:', error);
  }
}

// Run the tests
testCreateDesign();
