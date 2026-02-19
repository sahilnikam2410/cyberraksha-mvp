import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";
import { getUser } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function MyCases() {
  const nav = useNavigate();
  const user = getUser();
  const [items, setItems] = useState([]);

  async function load() {
    const res = await api.get("/api/cases/my");
    setItems(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black">My Cases</h2>
        <p className="text-gray-600 mt-2">
          Logged in as <b>{user?.name}</b>
        </p>

        <div className="mt-6 space-y-4">
          {items.map((c) => (
            <button
              key={c._id}
              className="w-full text-left bg-white rounded-3xl shadow p-5 hover:bg-gray-50"
              onClick={() => nav(`/my/${c._id}`)}
            >
              <div className="flex justify-between items-center">
                <div className="font-black text-lg">{c.ticketId}</div>
                <div className="text-xs font-bold">
                  {c.status} • {c.severity}
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {c.category} • {new Date(c.createdAt).toLocaleString()}
              </div>

              <div className="text-sm text-gray-800 mt-2 line-clamp-2">
                {c.message}
              </div>
            </button>
          ))}

          {items.length === 0 && (
            <div className="text-gray-600">
              No cases found. Submit one from Scam Check.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
