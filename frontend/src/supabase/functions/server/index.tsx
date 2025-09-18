import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create bucket for complaint photos on startup
const initializeStorage = async () => {
  const bucketName = 'make-8e7bdd01-complaint-photos';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
  }
};

// Initialize storage on startup
initializeStorage().catch(console.error);

// Utility function to authenticate users
const authenticateUser = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return null;
  }
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return null;
  }
  return user;
};

// Health check endpoint
app.get("/make-server-8e7bdd01/health", (c) => {
  return c.json({ status: "ok" });
});

// User Registration
app.post("/make-server-8e7bdd01/signup", async (c) => {
  try {
    const { email, password, name, location, role = 'user' } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, location, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      email,
      location,
      role,
      profilePhoto: null,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user, message: "User created successfully" });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Get user profile
app.get("/make-server-8e7bdd01/user/:id", async (c) => {
  try {
    const userId = c.req.param('id');
    const user = await authenticateUser(c.req);
    
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user: userProfile });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// Submit a complaint
app.post("/make-server-8e7bdd01/complaints", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { title, description, locationCoords, address, photo } = await c.req.json();
    
    const complaintId = crypto.randomUUID();
    const complaint = {
      id: complaintId,
      userId: user.id,
      title,
      description,
      photo,
      locationCoords,
      address,
      assignedTo: null,
      status: 'received',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0,
      comments: []
    };

    await kv.set(`complaint:${complaintId}`, complaint);
    
    // Add to user's complaints list
    const userComplaints = await kv.get(`user:${user.id}:complaints`) || [];
    userComplaints.push(complaintId);
    await kv.set(`user:${user.id}:complaints`, userComplaints);

    return c.json({ complaint, message: "Complaint submitted successfully" });
  } catch (error) {
    console.log(`Submit complaint error: ${error}`);
    return c.json({ error: "Failed to submit complaint" }, 500);
  }
});

// Get all complaints
app.get("/make-server-8e7bdd01/complaints", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const complaints = await kv.getByPrefix('complaint:');
    return c.json({ complaints: complaints || [] });
  } catch (error) {
    console.log(`Get complaints error: ${error}`);
    return c.json({ error: "Failed to get complaints" }, 500);
  }
});

// Get single complaint
app.get("/make-server-8e7bdd01/complaints/:id", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const complaintId = c.req.param('id');
    const complaint = await kv.get(`complaint:${complaintId}`);
    
    if (!complaint) {
      return c.json({ error: "Complaint not found" }, 404);
    }

    return c.json({ complaint });
  } catch (error) {
    console.log(`Get complaint error: ${error}`);
    return c.json({ error: "Failed to get complaint" }, 500);
  }
});

// Update complaint status (admin/volunteer only)
app.put("/make-server-8e7bdd01/complaints/:id/status", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'volunteer')) {
      return c.json({ error: "Insufficient permissions" }, 403);
    }

    const complaintId = c.req.param('id');
    const { status, assignedTo } = await c.req.json();
    
    const complaint = await kv.get(`complaint:${complaintId}`);
    if (!complaint) {
      return c.json({ error: "Complaint not found" }, 404);
    }

    complaint.status = status;
    complaint.assignedTo = assignedTo;
    complaint.updatedAt = new Date().toISOString();
    
    await kv.set(`complaint:${complaintId}`, complaint);

    // Log admin action
    const logId = crypto.randomUUID();
    await kv.set(`adminlog:${logId}`, {
      id: logId,
      action: `Updated complaint ${complaintId} status to ${status}`,
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    return c.json({ complaint, message: "Complaint status updated" });
  } catch (error) {
    console.log(`Update complaint status error: ${error}`);
    return c.json({ error: "Failed to update complaint status" }, 500);
  }
});

// Vote on complaint
app.post("/make-server-8e7bdd01/complaints/:id/vote", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const complaintId = c.req.param('id');
    const { voteType } = await c.req.json(); // 'upvote' or 'downvote'
    
    const voteId = crypto.randomUUID();
    const vote = {
      id: voteId,
      userId: user.id,
      complaintId,
      voteType,
      timestamp: new Date().toISOString()
    };

    // Check if user already voted
    const existingVotes = await kv.getByPrefix(`vote:${complaintId}:${user.id}:`);
    if (existingVotes && existingVotes.length > 0) {
      return c.json({ error: "User already voted on this complaint" }, 400);
    }

    await kv.set(`vote:${complaintId}:${user.id}:${voteId}`, vote);

    // Update complaint vote count
    const complaint = await kv.get(`complaint:${complaintId}`);
    if (complaint) {
      complaint.votes = (complaint.votes || 0) + (voteType === 'upvote' ? 1 : -1);
      await kv.set(`complaint:${complaintId}`, complaint);
    }

    return c.json({ vote, message: "Vote recorded successfully" });
  } catch (error) {
    console.log(`Vote error: ${error}`);
    return c.json({ error: "Failed to record vote" }, 500);
  }
});

// Add comment to complaint
app.post("/make-server-8e7bdd01/complaints/:id/comments", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const complaintId = c.req.param('id');
    const { content } = await c.req.json();
    
    const commentId = crypto.randomUUID();
    const comment = {
      id: commentId,
      userId: user.id,
      complaintId,
      content,
      timestamp: new Date().toISOString()
    };

    await kv.set(`comment:${complaintId}:${commentId}`, comment);

    return c.json({ comment, message: "Comment added successfully" });
  } catch (error) {
    console.log(`Add comment error: ${error}`);
    return c.json({ error: "Failed to add comment" }, 500);
  }
});

// Get comments for complaint
app.get("/make-server-8e7bdd01/complaints/:id/comments", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const complaintId = c.req.param('id');
    const comments = await kv.getByPrefix(`comment:${complaintId}:`);
    
    return c.json({ comments: comments || [] });
  } catch (error) {
    console.log(`Get comments error: ${error}`);
    return c.json({ error: "Failed to get comments" }, 500);
  }
});

// Admin dashboard - get statistics
app.get("/make-server-8e7bdd01/admin/stats", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile || userProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const complaints = await kv.getByPrefix('complaint:');
    const users = await kv.getByPrefix('user:');
    const votes = await kv.getByPrefix('vote:');
    const comments = await kv.getByPrefix('comment:');

    const stats = {
      totalComplaints: complaints ? complaints.length : 0,
      totalUsers: users ? users.length : 0,
      totalVotes: votes ? votes.length : 0,
      totalComments: comments ? comments.length : 0,
      complaintsByStatus: {
        received: complaints ? complaints.filter(c => c.status === 'received').length : 0,
        in_review: complaints ? complaints.filter(c => c.status === 'in_review').length : 0,
        resolved: complaints ? complaints.filter(c => c.status === 'resolved').length : 0,
      }
    };

    return c.json({ stats });
  } catch (error) {
    console.log(`Get admin stats error: ${error}`);
    return c.json({ error: "Failed to get statistics" }, 500);
  }
});

// Get admin logs
app.get("/make-server-8e7bdd01/admin/logs", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile || userProfile.role !== 'admin') {
      return c.json({ error: "Admin access required" }, 403);
    }

    const logs = await kv.getByPrefix('adminlog:');
    return c.json({ logs: logs || [] });
  } catch (error) {
    console.log(`Get admin logs error: ${error}`);
    return c.json({ error: "Failed to get logs" }, 500);
  }
});

// Upload photo endpoint
app.post("/make-server-8e7bdd01/upload", async (c) => {
  try {
    const user = await authenticateUser(c.req);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.arrayBuffer();
    const fileName = `${crypto.randomUUID()}.jpg`;
    const bucketName = 'make-8e7bdd01-complaint-photos';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, body, {
        contentType: 'image/jpeg',
      });

    if (error) {
      console.log(`Upload error: ${error.message}`);
      return c.json({ error: "Failed to upload photo" }, 500);
    }

    // Create signed URL for the uploaded file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 30); // 30 days

    if (signedUrlError) {
      console.log(`Signed URL error: ${signedUrlError.message}`);
      return c.json({ error: "Failed to create photo URL" }, 500);
    }

    return c.json({ 
      photoUrl: signedUrlData.signedUrl,
      fileName,
      message: "Photo uploaded successfully" 
    });
  } catch (error) {
    console.log(`Upload photo error: ${error}`);
    return c.json({ error: "Failed to upload photo" }, 500);
  }
});

Deno.serve(app.fetch);