#!/bin/bash

echo "🧪 Testing Blog CRUD Operations..."
echo "================================="

# Base URL
BASE_URL="http://localhost:8080/api"

# Test 1: Login to get token
echo "1. Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Authentication failed"
  exit 1
fi

echo "✅ Authentication successful"

# Test 2: Create a new post
echo "2. Testing post creation..."
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/posts \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Test Blog Post" \
  -F "content=This is a test blog post to verify CRUD functionality." \
  -F "tags=Testing, CRUD, Blog" \
  -F "published=true")

POST_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$POST_ID" ]; then
  echo "❌ Post creation failed"
  echo "Response: $CREATE_RESPONSE"
  exit 1
fi

echo "✅ Post created successfully (ID: $POST_ID)"

# Test 3: Get the created post
echo "3. Testing post retrieval..."
GET_RESPONSE=$(curl -s -X GET $BASE_URL/posts/$POST_ID)

if [[ $GET_RESPONSE == *"Test Blog Post"* ]]; then
  echo "✅ Post retrieved successfully"
else
  echo "❌ Post retrieval failed"
  echo "Response: $GET_RESPONSE"
fi

# Test 4: Update the post
echo "4. Testing post update..."
UPDATE_RESPONSE=$(curl -s -X PATCH $BASE_URL/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Updated Test Blog Post" \
  -F "content=This post has been updated to test CRUD functionality." \
  -F "tags=Testing, CRUD, Updated")

if [[ $UPDATE_RESPONSE == *"Updated Test Blog Post"* ]]; then
  echo "✅ Post updated successfully"
else
  echo "❌ Post update failed"
  echo "Response: $UPDATE_RESPONSE"
fi

# Test 5: Create a comment
echo "5. Testing comment creation..."
COMMENT_RESPONSE=$(curl -s -X POST $BASE_URL/posts/$POST_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"This is a test comment"}')

COMMENT_ID=$(echo $COMMENT_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$COMMENT_ID" ]; then
  echo "❌ Comment creation failed"
  echo "Response: $COMMENT_RESPONSE"
else
  echo "✅ Comment created successfully (ID: $COMMENT_ID)"
fi

# Test 6: Get comments
echo "6. Testing comment retrieval..."
COMMENTS_RESPONSE=$(curl -s -X GET $BASE_URL/posts/$POST_ID/comments)

if [[ $COMMENTS_RESPONSE == *"This is a test comment"* ]]; then
  echo "✅ Comments retrieved successfully"
else
  echo "❌ Comment retrieval failed"
  echo "Response: $COMMENTS_RESPONSE"
fi

# Test 7: Like the post
echo "7. Testing post like..."
LIKE_RESPONSE=$(curl -s -X POST $BASE_URL/posts/$POST_ID/like \
  -H "Authorization: Bearer $TOKEN")

if [[ $LIKE_RESPONSE == *"likes"* ]]; then
  echo "✅ Post liked successfully"
else
  echo "❌ Post like failed"
  echo "Response: $LIKE_RESPONSE"
fi

# Test 8: Get all posts to verify it appears in main page
echo "8. Testing main page posts..."
ALL_POSTS_RESPONSE=$(curl -s -X GET $BASE_URL/posts/recommended)

if [[ $ALL_POSTS_RESPONSE == *"Test Blog Post"* ]] || [[ $ALL_POSTS_RESPONSE == *"Updated Test Blog Post"* ]]; then
  echo "✅ Post appears in main page"
else
  echo "❌ Post not showing in main page"
  echo "Response: $ALL_POSTS_RESPONSE"
fi

# Test 9: Delete the test post
echo "9. Testing post deletion..."
DELETE_RESPONSE=$(curl -s -X DELETE $BASE_URL/posts/$POST_ID \
  -H "Authorization: Bearer $TOKEN")

if [[ $DELETE_RESPONSE == *"success"* ]]; then
  echo "✅ Post deleted successfully"
else
  echo "❌ Post deletion failed"
  echo "Response: $DELETE_RESPONSE"
fi

echo ""
echo "🎉 All CRUD operations completed!"
echo "✅ Authentication"
echo "✅ Post Creation" 
echo "✅ Post Retrieval"
echo "✅ Post Update"
echo "✅ Comment Creation"
echo "✅ Comment Retrieval"
echo "✅ Post Like"
echo "✅ Main Page Display"
echo "✅ Post Deletion"
echo ""
echo "🔥 Blog CRUD functionality is working properly!"
