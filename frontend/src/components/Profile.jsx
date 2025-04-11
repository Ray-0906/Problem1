import { useState } from "react";


export function Profile() {
    const [profile, setProfile] = useState({ name: "Dr. Meera Sen", email: "meera@eco.org" });
  
    return (
      <div className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <button className="bg-green-700 text-white px-4 py-2 rounded">Update</button>
      </div>
    );
  }
  