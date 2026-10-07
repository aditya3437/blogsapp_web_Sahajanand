require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Post = require("./models/Post");
const User = require("./models/User");

const demoUsers = [
  {
    name: "Papertrail Admin",
    email: "admin@papertrail.test",
    password: "PapertrailAdmin123!",
    role: "admin",
  },
  {
    name: "Jamie Writer",
    email: "jamie@papertrail.test",
    password: "PapertrailUser123!",
    role: "user",
  },
];

const demoPosts = [
  {
    title: "Finding a Little More Room to Think",
    content:
      "A quiet morning can make an ordinary day feel full of possibility. Before the messages and meetings begin, take a moment to notice what is already around you.\n\nA notebook, an open window, and a warm cup of coffee are sometimes enough to make space for a better idea.",
    authorEmail: "admin@papertrail.test",
  },
  {
    title: "The Small Rituals That Make a Home",
    content:
      "A home is shaped by the things we do there every day. The Sunday market, the familiar walk after dinner, and the shelf where everyone leaves their books all become part of its story.\n\nThese rituals do not need to be impressive. Their meaning comes from returning to them.",
    authorEmail: "jamie@papertrail.test",
  },
  {
    title: "Keeping a Travel Journal",
    content:
      "Write down the details you might otherwise forget: the name of the street, the sound of the station, or what you ate when the rain started.\n\nYears later, those small observations can bring a place back more clearly than a perfect photograph.",
    authorEmail: "admin@papertrail.test",
  },
  {
    title: "A Weekend Without a Checklist",
    content:
      "Leaving a little room in the weekend can be its own kind of plan. Follow a recommendation, take the longer route, or spend an afternoon finishing a book.\n\nNot every useful day has to be measured by how many things got crossed off.",
    authorEmail: "jamie@papertrail.test",
  },
];

async function seed() {
  await connectDB();

  const usersByEmail = new Map();
  for (const demoUser of demoUsers) {
    const password = await bcrypt.hash(demoUser.password, 12);
    const user = await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        $set: {
          name: demoUser.name,
          password,
          role: demoUser.role,
        },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    usersByEmail.set(user.email, user);
  }

  for (const demoPost of demoPosts) {
    const author = usersByEmail.get(demoPost.authorEmail);
    await Post.findOneAndUpdate(
      { title: demoPost.title, author: author._id },
      { $set: { content: demoPost.content } },
      { upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }

  console.log(`Seeded ${demoUsers.length} demo users and ${demoPosts.length} posts.`);
  console.log("Admin login: admin@papertrail.test / PapertrailAdmin123!");
  console.log("User login: jamie@papertrail.test / PapertrailUser123!");
}

seed()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
