import { connectDB } from "@/utils/mongodb";
import Role from "@/models/Role";
import User from "@/models/User";

async function seed() {
  await connectDB();

  // 1. Seed roles
  const roles = [
    { name: "student", permissions: [] },
    { name: "src", permissions: ["review_submissions"] },
    { name: "admin", permissions: ["manage_users", "manage_roles"] },
  ];
  for (const r of roles) {
    await Role.updateOne({ name: r.name }, r, { upsert: true });
  }
  console.log("Roles seeded");

  // 2. Seed two admin users
  //    Replace emails/passwords/studentIds with real test data
  const adminRole = await Role.findOne({ name: "admin" });
  if (!adminRole) throw new Error("Admin role not found");

  const admins = [
    {
      name: "Kananelo Joel",
      email: "kananelo.joel@gmail.com",
      studentId: "0000001",
      password: "123456",
    },
    {
      name: "Poloko Nkolanyane",
      email: "pm@example.com",
      studentId: "0000002",
      password: "123456",
    },
  ];

  for (const a of admins) {
    const exists = await User.findOne({ email: a.email });
    if (exists) {
      console.log(`Admin user ${a.email} already exists`);
      continue;
    }
    const user = new User({
      ...a,
      studentCardUrl: "/uploads/placeholder.png", // you’ll want to replace or upload a real file
      role: adminRole._id,
    });
    // password will be hashed by your pre-save hook
    await user.save();
    console.log(`Admin user ${a.email} created`);
  }

  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
