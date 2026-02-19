import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { api, API_BASE } from "../../utils/api";
import { useParams } from "react-router-dom";

export default function MyCaseDetails() {
  const { id } = useParams();
  const [c, setC] = useState(null);

  async function load() {
    const res = await api.get(`/api/cases/my/${id}`);
    setC(res.data);
  }

  useEffect(() => {
    load();
  }, [id]);

  if (!c) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="text-2xl font-black">{c.ticketId}</div>
          <div className="text-sm text-gray-600 mt-1">
            {c.category} • {new Date(c.createdAt).toLocaleString()}
          </div>

          <div className="mt-4 border rounded-2xl p-4">
            <div className="font-bold">Your Report</div>
            <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
              {c.message}
            </div>

            {c.link && (
              <div className="mt-2 text-sm">
                <b>Link:</b>{" "}
                <a
                  href={c.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  {c.link}
                </a>
              </div>
            )}

            {c.screenshotUrl && (
              <div className="mt-4">
                <div className="font-semibold text-sm">Screenshot:</div>
                <img
                  alt="screenshot"
                  className="mt-2 rounded-2xl border max-h-[350px]"
                  src={`${API_BASE}${c.screenshotUrl}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Reply section */}
        <div className="bg-white rounded-3xl shadow p-6">
          <div className="font-black text-xl">CyberRaksha Reply</div>

          <div className="mt-4">
            {!c.analystReply ? (
              <div className="text-gray-600">
                ⏳ Your case is under review. Please check again later.
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {c.analystReply}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Status: <b>{c.status}</b> • Severity: <b>{c.severity}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
