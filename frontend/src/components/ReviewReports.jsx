export function ReviewReports() {
    const reports = [
      { id: 1, plant: "Unknown Vine", location: "22.81, 86.2", date: "2025-04-10" },
      { id: 2, plant: "Leaf Spot Disease", location: "22.82, 86.3", date: "2025-04-09" },
    ];
  
    return (
      <div className="space-y-4">
        {reports.map((r) => (
          <div key={r.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <p><strong>{r.plant}</strong> - {r.location}</p>
              <p className="text-sm text-gray-500">Reported on {r.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded">Mark Identified</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Discard</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  