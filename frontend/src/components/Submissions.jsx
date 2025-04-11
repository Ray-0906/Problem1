 export function Submissions() {
    const submissions = [
      { id: 101, species: "Cassia Fistula", submittedBy: "Ranger A" },
      { id: 102, species: "Powdery Mildew", submittedBy: "Citizen X" },
    ];

    return (
      <div className="space-y-4">
        {submissions.map((s) => (
          <div key={s.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p><strong>{s.species}</strong></p>
              <p className="text-sm text-gray-500">Submitted by {s.submittedBy}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded">Approve</button>
              <button className="bg-gray-500 text-white px-3 py-1 rounded">Reject</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  