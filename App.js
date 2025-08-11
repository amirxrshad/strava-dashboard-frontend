import React, { useEffect, useState } from "react";

export default function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${backendUrl}/api/activities`);
        if (res.status === 401) {
          setConnected(false);
        } else {
          const data = await res.json();
          setActivities(data);
          setConnected(true);
        }
      } catch (err) {
        setError("Cannot reach backend");
      }
      setLoading(false);
    }
    loadData();
  }, [backendUrl]);

  async function connectStrava() {
    const res = await fetch(`${backendUrl}/auth/strava/url`);
    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>My Strava Dashboard</h1>
      {!connected && (
        <button
          onClick={connectStrava}
          style={{ padding: "10px 20px", background: "#fc4c02", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Connect Strava
        </button>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {activities.map((act) => (
        <div key={act.id} style={{ marginTop: "15px", padding: "10px", border: "1px solid #ccc" }}>
          <h3>{act.name}</h3>
          <p>Distance: {(act.distance_m / 1000).toFixed(2)} km</p>
          <p>Time: {Math.round(act.moving_time_s / 60)} min</p>
          <small>{new Date(act.start_date_local).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
