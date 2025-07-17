import { Post, User, Author, PostsResponse, Comment } from "@shared/types";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    headline: "Frontend Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    headline: "Full Stack Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1d5?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    headline: "UI/UX Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    headline: "Backend Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Jessica Jane",
    email: "jessica@example.com",
    headline: "Product Designer",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b1d5?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Alexandra",
    email: "alexandra@example.com",
    headline: "Frontend Developer",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
];

// Create sequential posts for carousel display
const createSequentialPosts = (): Post[] => {
  const posts: Post[] = [];
  const baseContent =
    "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and intuitive. As we move into 2025, the demand for skilled frontend developers continues to rise.";
  const carouselImage =
    "https://cdn.builder.io/api/v1/image/assets%2Ff0814687c37c496a970fdefb6a24c7bf%2F65ece06449fd457695abcb19dacc53c5?format=webp&width=800";

  const contentVariations = [
    "Frontend development is more than just building beautiful user interfaces — it's about crafting user experiences that are fast, accessible, and intuitive. As we move into 2025, the demand for skilled frontend developers continues to rise.",
    "Modern web development requires a deep understanding of user experience principles, performance optimization, and accessibility standards. Developers today must think beyond just code.",
    "The landscape of frontend technologies is constantly evolving. From React to Vue, from vanilla JavaScript to TypeScript, developers have more tools than ever to create amazing experiences.",
    "Building responsive, mobile-first applications has become the standard in modern web development. Understanding CSS Grid, Flexbox, and media queries is essential.",
    "Performance optimization techniques like lazy loading, code splitting, and efficient state management can make or break user experience in modern applications.",
    "Accessibility in web development isn't just a nice-to-have anymore — it's a requirement. Creating inclusive experiences benefits everyone.",
    "The rise of component-based architecture has revolutionized how we think about building scalable frontend applications and maintaining clean codebases.",
    "API integration and state management are crucial skills for frontend developers working with complex, data-driven applications in today's development landscape.",
  ];

  const tagVariations = [
    ["Programming", "Frontend", "Coding"],
    ["JavaScript", "React", "Development"],
    ["CSS", "Design", "UI/UX"],
    ["TypeScript", "Modern", "Web"],
    ["Performance", "Optimization", "Speed"],
    ["Accessibility", "Inclusive", "Design"],
    ["Architecture", "Components", "Scalable"],
    ["API", "State", "Management"],
  ];

  // Create 50 posts for "Recommend For You" carousel
  for (let i = 1; i <= 50; i++) {
    const contentIndex = (i - 1) % contentVariations.length;
    const tagIndex = (i - 1) % tagVariations.length;

    posts.push({
      id: i,
      title: `5 Reasons to Learn Frontend Development in 2025 Post${i}`,
      content: contentVariations[contentIndex],
      tags: tagVariations[tagIndex],
      imageUrl: carouselImage,
      author: mockUsers[(i - 1) % mockUsers.length] as Author,
      createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(), // Each post 1 hour apart
      likes: Math.floor(Math.random() * 50) + 10, // Random likes between 10-60
      comments: Math.floor(Math.random() * 30) + 5, // Random comments between 5-35
    });
  }

  // Add additional posts for "Most Liked" (without images)
  for (let i = 51; i <= 70; i++) {
    const contentIndex = (i - 1) % contentVariations.length;
    const tagIndex = (i - 1) % tagVariations.length;

    posts.push({
      id: i,
      title: `5 Reasons to Learn Frontend Development in 2025`,
      content: contentVariations[contentIndex],
      tags: tagVariations[tagIndex],
      imageUrl: undefined, // No images for Most Liked posts
      author: mockUsers[(i - 1) % mockUsers.length] as Author,
      createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 80) + 40, // Higher likes for "Most Liked" (40-120)
      comments: Math.floor(Math.random() * 25) + 10, // Comments between 10-35
    });
  }

  return posts;
};

export const mockPosts: Post[] = createSequentialPosts();

export const mockComments: Comment[] = [
  {
    id: 1,
    content: "This is super insightful — thanks for sharing!",
    author: {
      id: 2,
      name: "Clarissa",
      email: "clarissa@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1d5?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2025-03-27T10:00:00Z",
    postId: 1,
  },
  {
    id: 2,
    content:
      "Exactly what I needed to read today. Frontend is evolving so fast!",
    author: {
      id: 3,
      name: "Marco",
      email: "marco@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2025-03-27T11:00:00Z",
    postId: 1,
  },
  {
    id: 3,
    content: "Great breakdown! You made complex ideas sound simple.",
    author: {
      id: 4,
      name: "Michael Sailor",
      email: "michael@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2025-03-27T12:00:00Z",
    postId: 1,
  },
  {
    id: 4,
    content:
      "As a beginner in frontend, this motivates me a lot. Appreciate it!",
    author: {
      id: 5,
      name: "Jessica Jane",
      email: "jessica@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2025-03-27T13:00:00Z",
    postId: 1,
  },
  {
    id: 5,
    content:
      "Well-written and straight to the point. Keep posting content like this!",
    author: {
      id: 6,
      name: "Alexandra",
      email: "alexandra@example.com",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1d5?w=150&h=150&fit=crop&crop=face",
    },
    createdAt: "2025-03-27T14:00:00Z",
    postId: 1,
  },
];

// Helper functions for data manipulation
export class MockDataService {
  private static posts = [...mockPosts];
  private static users = [...mockUsers];
  private static comments = [...mockComments];
  private static nextPostId = Math.max(...mockPosts.map((p) => p.id)) + 1;
  private static nextUserId = Math.max(...mockUsers.map((u) => u.id)) + 1;
  private static nextCommentId = Math.max(...mockComments.map((c) => c.id)) + 1;

  // Posts methods
  static getAllPosts(
    page = 1,
    limit = 10,
    sortBy: "latest" | "likes" = "latest",
  ): PostsResponse {
    let sortedPosts = [...this.posts];

    if (sortBy === "likes") {
      sortedPosts.sort((a, b) => b.likes - a.likes);
    } else {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: sortedPosts.length,
      page,
      lastPage: Math.ceil(sortedPosts.length / limit),
    };
  }

  static getRecommendedPosts(page = 1, limit = 10): PostsResponse {
    // Get first 50 posts (with images) for carousel
    const postsWithImages = this.posts
      .filter((post) => post.imageUrl)
      .slice(0, 50);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = postsWithImages.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: postsWithImages.length,
      page,
      lastPage: Math.ceil(postsWithImages.length / limit),
    };
  }

  static getMostLikedPosts(page = 1, limit = 10): PostsResponse {
    // Get posts without images, sorted by likes
    const postsWithoutImages = this.posts.filter((post) => !post.imageUrl);
    const sortedPosts = postsWithoutImages.sort((a, b) => b.likes - a.likes);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: sortedPosts.length,
      page,
      lastPage: Math.ceil(sortedPosts.length / limit),
    };
  }

  static getPostById(id: number): Post | null {
    return this.posts.find((post) => post.id === id) || null;
  }

  static getPostsByAuthor(
    authorId: number,
    page = 1,
    limit = 10,
  ): PostsResponse {
    const authorPosts = this.posts.filter(
      (post) => post.author.id === authorId,
    );
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = authorPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: authorPosts.length,
      page,
      lastPage: Math.ceil(authorPosts.length / limit),
    };
  }

  static searchPosts(query: string, page = 1, limit = 10): PostsResponse {
    const searchTerm = query.toLowerCase();
    const filteredPosts = this.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      data: paginatedPosts,
      total: filteredPosts.length,
      page,
      lastPage: Math.ceil(filteredPosts.length / limit),
    };
  }

  static createPost(postData: {
    title: string;
    content: string;
    tags: string[];
    imageUrl?: string;
    authorId: number;
  }): Post {
    const author = this.users.find((u) => u.id === postData.authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const newPost: Post = {
      id: this.nextPostId++,
      title: postData.title,
      content: postData.content,
      tags: postData.tags,
      imageUrl: postData.imageUrl,
      author: author as Author,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  static updatePost(
    id: number,
    updates: {
      title?: string;
      content?: string;
      tags?: string[];
      imageUrl?: string;
    },
  ): Post | null {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      return null;
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updates,
    };

    return this.posts[postIndex];
  }

  static deletePost(id: number): boolean {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex === -1) {
      return false;
    }

    this.posts.splice(postIndex, 1);
    return true;
  }

  static likePost(id: number): Post | null {
    const post = this.posts.find((post) => post.id === id);
    if (!post) {
      return null;
    }

    post.likes += 1;
    return post;
  }

  // Users methods
  static getAllUsers(): User[] {
    return [...this.users];
  }

  static getUserById(id: number): User | null {
    return this.users.find((user) => user.id === id) || null;
  }

  static getUserByEmail(email: string): User | null {
    return this.users.find((user) => user.email === email) || null;
  }

  static createUser(userData: {
    name: string;
    email: string;
    headline?: string;
    avatarUrl?: string;
  }): User {
    const newUser: User = {
      id: this.nextUserId++,
      name: userData.name,
      email: userData.email,
      headline: userData.headline,
      avatarUrl: userData.avatarUrl,
    };

    this.users.push(newUser);
    return newUser;
  }

  static updateUser(
    id: number,
    updates: {
      name?: string;
      email?: string;
      headline?: string;
      avatarUrl?: string;
    },
  ): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
    };

    return this.users[userIndex];
  }

  // Comments methods
  static getCommentsByPostId(postId: number): Comment[] {
    return this.comments
      .filter((comment) => comment.postId === postId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
  }

  static createComment(commentData: {
    content: string;
    authorId: number;
    postId: number;
  }): Comment {
    const author = this.users.find((u) => u.id === commentData.authorId);
    if (!author) {
      throw new Error("Author not found");
    }

    const newComment: Comment = {
      id: this.nextCommentId++,
      content: commentData.content,
      author: author as Author,
      createdAt: new Date().toISOString(),
      postId: commentData.postId,
    };

    this.comments.push(newComment);

    // Update comment count on the post
    const post = this.posts.find((p) => p.id === commentData.postId);
    if (post) {
      post.comments += 1;
    }

    return newComment;
  }

  static deleteComment(id: number): boolean {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.id === id,
    );
    if (commentIndex === -1) {
      return false;
    }

    const comment = this.comments[commentIndex];
    this.comments.splice(commentIndex, 1);

    // Update comment count on the post
    const post = this.posts.find((p) => p.id === comment.postId);
    if (post && post.comments > 0) {
      post.comments -= 1;
    }

    return true;
  }
}
