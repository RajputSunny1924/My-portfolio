import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(target);
      return;
    }

    let frame;
    let startTime = null;
    const duration = 1200;
    const startValue = displayValue;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 4);

      setDisplayValue(Math.round(startValue + (target - startValue) * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{displayValue.toLocaleString("en-IN")}</>;
}

function VisitorCounter() {
  const [stats, setStats] = useState({
    total_visits: 0,
    returning_visitors: 0,
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/analytics/public-stats`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load visitor statistics");
        }

        const data = await response.json();

        if (active) {
          setStats({
            total_visits: Number(data.total_visits) || 0,
            returning_visitors: Number(data.returning_visitors) || 0,
          });

          setLoaded(true);
        }
      } catch (error) {
        console.error("Visitor counter error:", error);
      }
    };

    fetchStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="visitor-counter-section">
      <div className="visitor-counter-inner">
        <span className="visitor-counter-label">PORTFOLIO REACH</span>

        <div className="visitor-counter-number">
          {loaded ? <AnimatedNumber value={stats.total_visits} /> : "—"}
        </div>

        <p className="visitor-counter-description">
          Visits from people exploring my work
        </p>

        <div className="visitor-counter-secondary">
          <span>
            {loaded ? <AnimatedNumber value={stats.returning_visitors} /> : "—"}
          </span>
          <p>Returning visitors</p>
        </div>
      </div>
    </section>
  );
}

export default VisitorCounter;
