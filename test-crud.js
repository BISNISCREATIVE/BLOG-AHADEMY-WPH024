#!/usr/bin/env node

// Simple test script to verify CRUD operations work
const BASE_URL = "http://localhost:8080/api";

async function testCRUDOperations() {
  console.log("🧪 Testing CRUD Operations...\n");

  try {
    // Test 1: Login to get authentication token
    console.log("1. Testing authentication...");
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "john@example.com",
        password: "password123",
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const { token, user } = await loginResponse.json();
    console.log("✅ Authentication successful");
    console.log(`   User: ${user.name} (${user.email})`);

    const authHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // Test 2: Create a new post
    console.log("\n2. Testing post creation...");
    const createResponse = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Test Post from CRUD Script",
        content:
          "This is a test post created by the CRUD test script to verify functionality.",
        tags: "Testing, CRUD, Automation",
        published: false, // Create as draft first
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Post creation failed: ${createResponse.status}`);
    }

    const newPost = await createResponse.json();
    console.log("✅ Post created successfully");
    console.log(`   Post ID: ${newPost.id}`);
    console.log(`   Title: ${newPost.title}`);
    console.log(`   Published: ${newPost.published}`);

    // Test 3: Update the post
    console.log("\n3. Testing post update...");
    const updateResponse = await fetch(`${BASE_URL}/posts/${newPost.id}`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        title: "Updated Test Post from CRUD Script",
        content:
          "This post has been updated to test the CRUD update functionality.",
        tags: "Testing, CRUD, Updated",
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Post update failed: ${updateResponse.status}`);
    }

    const updatedPost = await updateResponse.json();
    console.log("✅ Post updated successfully");
    console.log(`   New Title: ${updatedPost.title}`);

    // Test 4: Publish the post
    console.log("\n4. Testing post publishing...");
    const publishResponse = await fetch(
      `${BASE_URL}/posts/${newPost.id}/publish`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ published: true }),
      },
    );

    if (!publishResponse.ok) {
      throw new Error(`Post publishing failed: ${publishResponse.status}`);
    }

    const publishedPost = await publishResponse.json();
    console.log("✅ Post published successfully");
    console.log(`   Published: ${publishedPost.published}`);
    console.log(`   Published At: ${publishedPost.publishedAt}`);

    // Test 5: Get the post
    console.log("\n5. Testing post retrieval...");
    const getResponse = await fetch(`${BASE_URL}/posts/${newPost.id}`);

    if (!getResponse.ok) {
      throw new Error(`Post retrieval failed: ${getResponse.status}`);
    }

    const retrievedPost = await getResponse.json();
    console.log("✅ Post retrieved successfully");
    console.log(`   Title: ${retrievedPost.title}`);
    console.log(
      `   Content length: ${retrievedPost.content.length} characters`,
    );

    // Test 6: Test profile update
    console.log("\n6. Testing profile update...");
    const profileUpdateResponse = await fetch(`${BASE_URL}/users/profile`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        name: "John Doe (Updated)",
        headline: "Senior Frontend Developer (Updated via CRUD test)",
      }),
    });

    if (!profileUpdateResponse.ok) {
      throw new Error(`Profile update failed: ${profileUpdateResponse.status}`);
    }

    const updatedProfile = await profileUpdateResponse.json();
    console.log("✅ Profile updated successfully");
    console.log(`   Name: ${updatedProfile.name}`);
    console.log(`   Headline: ${updatedProfile.headline}`);

    // Test 7: Get user posts
    console.log("\n7. Testing user posts retrieval...");
    const myPostsResponse = await fetch(
      `${BASE_URL}/posts/my-posts?includeUnpublished=true`,
      {
        headers: authHeaders,
      },
    );

    if (!myPostsResponse.ok) {
      throw new Error(`My posts retrieval failed: ${myPostsResponse.status}`);
    }

    const myPosts = await myPostsResponse.json();
    console.log("✅ User posts retrieved successfully");
    console.log(`   Total posts: ${myPosts.total}`);
    console.log(`   Posts on this page: ${myPosts.data.length}`);

    // Test 8: Delete the test post
    console.log("\n8. Testing post deletion...");
    const deleteResponse = await fetch(`${BASE_URL}/posts/${newPost.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    if (!deleteResponse.ok) {
      throw new Error(`Post deletion failed: ${deleteResponse.status}`);
    }

    const deleteResult = await deleteResponse.json();
    console.log("✅ Post deleted successfully");
    console.log(`   Success: ${deleteResult.success}`);

    console.log("\n🎉 All CRUD operations completed successfully!");
    console.log("\n📊 Test Summary:");
    console.log("   ✅ Authentication");
    console.log("   ✅ Post Creation (Draft)");
    console.log("   ✅ Post Update");
    console.log("   ✅ Post Publishing");
    console.log("   ✅ Post Retrieval");
    console.log("   ✅ Profile Update");
    console.log("   ✅ User Posts Retrieval");
    console.log("   ✅ Post Deletion");
    console.log("\n🔥 All CRUD functionality is working correctly!");
  } catch (error) {
    console.error("\n❌ CRUD Test Failed:");
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCRUDOperations();
}
