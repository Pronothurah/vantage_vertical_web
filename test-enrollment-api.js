// Test script for enrollment API
const testEnrollmentAPI = async () => {
  const testData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254712345678",
    program: "basic-pilot",
    session: "2024-02-15-2024-02-17",
    experience: "complete-beginner",
    motivation: "I want to learn drone operations for aerial photography and videography. This skill will help me expand my photography business and offer new services to my clients. I'm particularly interested in commercial applications.",
    accommodation: false,
    terms: true,
    emergencyContact: {
      name: "Jane Doe",
      phone: "+254712345679",
      relationship: "spouse"
    }
  };

  try {
    console.log('Testing enrollment API with data:', testData);
    
    const response = await fetch('http://localhost:3000/api/enrollment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Enrollment API test successful');
    } else {
      console.log('❌ Enrollment API test failed');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

// Run the test if this script is executed directly
if (typeof window === 'undefined') {
  testEnrollmentAPI();
}

module.exports = { testEnrollmentAPI };