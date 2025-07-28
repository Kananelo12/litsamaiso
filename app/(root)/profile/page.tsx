// app/users/page.tsx or wherever your route is
import User from '@/models/User'
import { connectDB } from '@/utils/mongodb'; // assuming you have a db connect util

const Page = async () => {
  await connectDB(); // Make sure you're connected
  const users = await User.find({});

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li> // assuming user has a name
        ))}
      </ul>
    </div>
  );
};

export default Page;
