import { useState } from "react";

/* ─────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────── */

const CATEGORIES = [
  "Contractor",
  "Technician",
  "Delivery Personnel",
  "Staff",
  "Customer / Visitor",
];

// Simple SVG Line Chart component
function LineChartSVG({ labels, values, height = 80 }: { labels: string[]; values: number[]; height?: number; }) {
  const max = Math.max(...values, 1);
  const w = 320;
  const h = height;
  const gap = w / Math.max(labels.length - 1, 1);
  const points = values.map((v, i) => `${i * gap},${h - (v / max) * (h - 10)}`);
  const poly = points.join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="rounded">
      <defs>
        <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={poly} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`${poly} ${w},${h} 0,${h}`} fill="url(#lg)" stroke="none" />
      {points.map((p, idx) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={idx} cx={x} cy={y} r={2.5} fill="#1e40af" />;
      })}
    </svg>
  );
}

// Simple SVG Bar Chart component
function BarChartSVG({ labels, values, height = 100 }: { labels: string[]; values: number[]; height?: number }) {
  const max = Math.max(...values, 1);
  const w = 320;
  const colW = w / labels.length;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      {values.map((v, i) => {
        const barH = (v / max) * (height - 20);
        const x = i * colW + colW * 0.15;
        const bw = colW * 0.7;
        const y = height - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} rx={4} fill="#7c3aed" />
            <text x={x + bw / 2} y={height - 4} fontSize={10} textAnchor="middle" fill="#475569">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Simple SVG Pie Chart component
function PieChartSVG({ values, colors = [], size = 120 }: { values: number[]; colors?: string[]; size?: number }) {
  const total = values.reduce((s, v) => s + v, 0) || 1;
  let acc = 0;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {values.map((v, i) => {
        const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
        acc += v;
        const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const large = end - start > Math.PI ? 1 : 0;
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
        const fill = colors[i] || [`#60a5fa`, `#34d399`, `#f59e0b`, `#a78bfa`, `#ef4444`][i % 5];
        return <path key={i} d={path} fill={fill} stroke="#fff" strokeWidth={1} />;
      })}
    </svg>
  );
}
const MOCK_VISITORS = [
  { id:1, fullName:"Marcus Obi", category:"Staff", status:"active", timeIn:new Date().setHours(7,12), tools:[] },
  { id:2, fullName:"Lena Hoffman", category:"Contractor", status:"active", timeIn:new Date().setHours(7,45), tools:["Drill"] },
  { id:3, fullName:"James Patel", category:"Technician", status:"checked-out", timeIn:new Date().setHours(8,3), tools:["Laptop"] },
  { id:4, fullName:"Aisha Koroma", category:"Delivery Personnel", status:"checked-out", timeIn:new Date().setHours(8,30), tools:[] },
  { id:5, fullName:"David Chukwu", category:"Customer / Visitor", status:"active", timeIn:new Date().setHours(9,10), tools:[] },
  { id:6, fullName:"Sofia Brandt", category:"Staff", status:"active", timeIn:new Date().setHours(9,22), tools:[] },
];

const HOURLY_DATA = [
  { hour:"06:00", ins:2, outs:0 },
  { hour:"07:00", ins:8, outs:1 },
  { hour:"08:00", ins:15, outs:4 },
  { hour:"09:00", ins:22, outs:7 },
  { hour:"10:00", ins:18, outs:11 },
  { hour:"11:00", ins:12, outs:9 },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

const initials = (name: string): string =>
  name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();



/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */

export default function Dashboard() {
  const visitors = MOCK_VISITORS;
  const activeVisitors = visitors.filter(v=>v.status==="active");

  const today = new Date().toDateString();
  const todayAll = visitors.filter(v=>new Date(v.timeIn).toDateString()===today);
  const todayOut = todayAll.filter(v=>v.status==="checked-out");
  const totalTools = activeVisitors.reduce((s,v)=>s+v.tools.length,0);

  const [tab,setTab] = useState("area");

  

  

  return (
    <>
      <style>{`
        body { margin:0; font-family:Inter, sans-serif; }
        .root {
          min-height:100vh;
          padding:24px;
          background:linear-gradient(to bottom right,#f1f5f9,#e2e8f0);
        }
        .header {
          display:flex;
          justify-content:space-between;
          flex-wrap:wrap;
          gap:16px;
          margin-bottom:24px;
        }
        .stats {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:16px;
          margin-bottom:24px;
        }
        .charts {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:16px;
          margin-bottom:24px;
        }
        .bottom {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:16px;
        }
        .card {
          background:#fff;
          border-radius:16px;
          padding:20px;
          box-shadow:0 6px 20px rgba(0,0,0,0.05);
        }
        .stat-value {
          font-size:28px;
          font-weight:800;
          margin-top:6px;
        }
        .visitor-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:10px 0;
          border-bottom:1px solid #f1f5f9;
        }
        .visitor-row:last-child { border-bottom:none; }
        button.tab {
          padding:6px 12px;
          border-radius:8px;
          border:none;
          cursor:pointer;
          font-size:12px;
          font-weight:600;
        }
      `}</style>

      <div className="root">

        {/* HEADER */}
        <div className="header">
          <div>
            <h1 style={{margin:0,fontSize:26,fontWeight:800}}>Control Centre</h1>
            <p style={{marginTop:4,color:"#64748b"}}>
              {new Date().toDateString()}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="card">
            Visitors Today
            <div className="stat-value">{todayAll.length}</div>
          </div>
          <div className="card">
            Currently Inside
            <div className="stat-value">{activeVisitors.length}</div>
          </div>
          <div className="card">
            Checked Out
            <div className="stat-value">{todayOut.length}</div>
          </div>
          <div className="card">
            Tools On Site
            <div className="stat-value">{totalTools}</div>
          </div>
        </div>

        {/* CHARTS: lightweight SVG visualizations */}
        <div className="charts">
          <div className="card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
              <h3 style={{margin:0}}>Visitor Traffic (hourly)</h3>
              <div>
                <button className="tab" onClick={()=>setTab("line")} style={{background:tab==="line"?"#e2e8f0":"transparent"}}>Line</button>
                <button className="tab" onClick={()=>setTab("bar")} style={{background:tab==="bar"?"#e2e8f0":"transparent"}}>Bar</button>
              </div>
            </div>
            <div style={{marginTop:12}}>
              {tab === "bar" ? (
                <BarChartSVG labels={HOURLY_DATA.map(d=>d.hour)} values={HOURLY_DATA.map(d=>d.ins)} height={140} />
              ) : (
                <LineChartSVG labels={HOURLY_DATA.map(d=>d.hour)} values={HOURLY_DATA.map(d=>d.ins)} height={140} />
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{margin:0}}>Status Split</h3>
            <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
              <PieChartSVG values={[activeVisitors.length, todayOut.length]} colors={["#10b981","#94a3b8"]} size={120} />
              <div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}><span style={{width:10,height:10,background:"#10b981",borderRadius:2}}/> Active: <strong style={{marginLeft:6}}>{activeVisitors.length}</strong></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{width:10,height:10,background:"#94a3b8",borderRadius:2}}/> Checked Out: <strong style={{marginLeft:6}}>{todayOut.length}</strong></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{margin:0}}>Visitors by Category</h3>
            <div style={{marginTop:12}}>
              <BarChartSVG labels={CATEGORIES.map(c=>c.split(" ")[0])} values={CATEGORIES.map(c=>visitors.filter(v=>v.category===c).length)} height={140} />
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="bottom">

          <div className="card">
            <h3>Visitors by Category</h3>
            <div style={{marginTop:12}}>
              <BarChartSVG
                labels={CATEGORIES.map(c => c.split(" ")[0])}
                values={CATEGORIES.map(c => visitors.filter(v => v.category === c).length)}
                height={160}
              />
            </div>
          </div>

          <div className="card">
            <h3>Recent Visitors</h3>
            {todayAll.map(v=>(
              <div key={v.id} className="visitor-row">
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{
                    width:36,height:36,
                    borderRadius:8,
                    background:"#e2e8f0",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center",
                    fontWeight:700
                  }}>
                    {initials(v.fullName)}
                  </div>
                  <div>
                    <div style={{fontWeight:600}}>{v.fullName}</div>
                    <div style={{fontSize:12,color:"#64748b"}}>{v.category}</div>
                  </div>
                </div>
                <div style={{
                  width:8,height:8,
                  borderRadius:"50%",
                  background:v.status==="active"?"#10b981":"#cbd5e1"
                }}/>
              </div>
            ))}
          </div>

        </div>

      </div>
    </>
  );
}
