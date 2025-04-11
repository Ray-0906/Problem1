import { useState } from "react";

export function UpdateDatabase() {
  const [form, setForm] = useState({ name: "", type: "Plant", notes: "" });

  return (
    <form className="space-y-4">
      <input
        className="w-full border p-2 rounded"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <select
        className="w-full border p-2 rounded"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option>Plant</option>
        <option>Disease</option>
      </select>
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Notes"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <button className="bg-green-700 text-white px-4 py-2 rounded">Add Entry</button>
    </form>
  );
}
