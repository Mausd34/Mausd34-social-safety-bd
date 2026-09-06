import React, { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import {
  Shield, Map, BarChart3, Building2, FileText, Siren, Menu, X, Search,
  ArrowRight, CheckCircle2, AlertTriangle, Users, Gavel, Activity, Phone,
  Send, LogIn, LayoutDashboard, Database, Settings, MapPin, ExternalLink
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cities, areas, cases, monthly, emergency } from "./data";

const totalReported = cities.reduce((s, c) => s + c.reported, 0);
const totalConvicted = cities.reduce((s, c) => s + c.convicted, 0);

function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const nav = [
    ["/", "Home", Shield],
    ["/map", "Safety Map", Map],
    ["/statistics", "Statistics", BarChart3],
    ["/cities", "Cities", Building2],
    ["/cases", "Cases", FileText],
    ["/report", "Report", Send],
    ["/emergency", "Help", Siren]
  ];
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark"><Shield size={19}/></span>
          <span>Social Safety <b>BD</b></span>
        </Link>
        <button className="mobile-menu" onClick={() => setOpen(v => !v)} aria-label="Menu">
          {open ? <X/> : <Menu/>}
        </button>
        <nav className={open ? "nav open" : "nav"}>
          {nav.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
              <Icon size={15}/>{label}
            </NavLink>
          ))}
        </nav>
        <div className="top-actions">
          <Link className="btn btn-ghost small" to="/login"><LogIn size={15}/> Login</Link>
          <Link className="btn btn-primary small" to="/register">Register</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div><span className="brand"><span className="brand-mark"><Shield size={17}/></span>Social Safety BD</span><p>Public safety awareness and verified statistics prototype.</p></div>
        <div><b>Important</b><p>Demo data only. Verify every statistic against authoritative sources before publication.</p></div>
        <div><b>Emergency</b><p>For immediate danger, contact local emergency services.</p></div>
      </footer>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "" }) {
  return <div className={"stat-card " + tone}><div className="stat-icon"><Icon size={19}/></div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-glow"/>
      <div className="hero-copy">
        <span className="eyebrow"><Shield size={14}/> SAFETY INTELLIGENCE PLATFORM</span>
        <h1>Stay aware.<br/><span>Stay safer.</span></h1>
        <p>Explore public safety statistics, verified case outcomes, local safety resources and emergency services across Bangladesh.</p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/map">Explore Safety Map <ArrowRight size={17}/></Link>
          <Link className="btn btn-light" to="/statistics">View Statistics</Link>
        </div>
        <div className="hero-note"><CheckCircle2 size={15}/> Designed for awareness — not for public accusation or doxxing.</div>
      </div>
      <div className="hero-panel">
        <div className="mini-map">
          <div className="map-water"/>
          <span className="pin p1"/><span className="pin p2"/><span className="pin p3"/><span className="pin p4"/>
          <div className="map-label"><MapPin size={14}/> Bangladesh</div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return <Layout>
    <div className="container">
      <Hero/>
      <section className="stats-grid">
        <StatCard icon={Building2} label="Major cities" value="08"/>
        <StatCard icon={FileText} label="Reported cases" value={totalReported.toLocaleString()}/>
        <StatCard icon={Gavel} label="Convictions" value={totalConvicted.toLocaleString()}/>
        <StatCard icon={Activity} label="Data status" value="Demo"/>
      </section>
      <section className="section-grid">
        <div className="panel">
          <div className="panel-head"><div><span className="eyebrow">OVERVIEW</span><h2>Safety map preview</h2></div><Link to="/map" className="text-link">Open map <ArrowRight size={15}/></Link></div>
          <div className="preview-map"><div className="map-shape"/>
            <div className="legend"><span><i className="dot red"/>Higher reports</span><span><i className="dot amber"/>Moderate</span><span><i className="dot green"/>Lower</span></div>
          </div>
        </div>
        <div className="panel emergency-panel">
          <div className="panel-head"><div><span className="eyebrow">QUICK ACCESS</span><h2>Emergency help</h2></div><Siren className="danger-icon"/></div>
          {emergency.map(e => <div className="emergency-row" key={e.number}><span className="emergency-icon"><Phone size={16}/></span><div><b>{e.title}</b><span>{e.detail}</span></div><strong>{e.number}</strong></div>)}
          <Link className="btn btn-dark full" to="/emergency">View all support options</Link>
        </div>
      </section>
      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">CITY SNAPSHOT</span><h2>Compare major cities</h2></div><Link to="/cities" className="text-link">All cities <ArrowRight size={15}/></Link></div>
        <div className="city-grid">{cities.slice(0,4).map(c => <CityCard key={c.slug} city={c}/>)}</div>
      </section>
    </div>
  </Layout>;
}

function CityCard({ city }) {
  return <Link className="city-card" to={"/cities/" + city.slug}>
    <div className="city-photo"><span>{city.name.slice(0,2).toUpperCase()}</span></div>
    <div className="city-info"><h3>{city.name}</h3><p>{city.reported} reported cases <ArrowRight size={14}/></p><div className="meter"><i style={{width: Math.min(100, city.reported / 3.3) + "%"}}/></div></div>
  </Link>;
}

function SafetyMap() {
  const points = [
    { name: "Dhaka", pos: [23.8103,90.4125], count: 324 },
    { name: "Chattogram", pos: [22.3569,91.7832], count: 221 },
    { name: "Rajshahi", pos: [24.3745,88.6042], count: 152 },
    { name: "Khulna", pos: [22.8456,89.5403], count: 118 },
    { name: "Sylhet", pos: [24.8949,91.8687], count: 96 },
    { name: "Rangpur", pos: [25.7439,89.2752], count: 58 },
    { name: "Mymensingh", pos: [24.7471,90.4203], count: 45 }
  ];
  const [query, setQuery] = useState("");
  const match = areas.find(a => a.name.toLowerCase() === query.trim().toLowerCase());
  return <Layout><div className="container page">
    <PageTitle eyebrow="LOCATION INTELLIGENCE" title="Safety Map" text="Explore demo case statistics by city and area. Data should be sourced and verified before publication."/>
    <div className="map-toolbar"><div className="searchbox"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search an area, e.g. Uttara"/></div><div className="filter-pills"><button className="active">All</button><button>Reported</button><button>Investigation</button><button>Convicted</button></div></div>
    {match && <div className="search-result"><MapPin size={17}/><b>{match.name}</b><span>{match.reported} reported · {match.convicted} convicted in demo data</span><Link to="/cities/dhaka/uttara">View details</Link></div>}
    <div className="map-layout">
      <div className="large-map"><MapContainer center={[23.685,90.3563]} zoom={6} scrollWheelZoom={true}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        {points.map(p => <CircleMarker key={p.name} center={p.pos} radius={Math.max(8, Math.min(18, p.count/20))} pathOptions={{color:"#0f6fff", fillColor:"#0f6fff", fillOpacity:.55}}>
          <Popup><b>{p.name}</b><br/>{p.count} reported cases (demo)</Popup>
        </CircleMarker>)}
      </MapContainer></div>
      <div className="panel map-side"><div className="panel-head"><div><span className="eyebrow">SELECTED CITY</span><h2>Dhaka</h2></div></div>
        <div className="side-stat"><span>Reported cases</span><b>324</b></div><div className="side-stat"><span>Under investigation</span><b>98</b></div><div className="side-stat"><span>Under trial</span><b>156</b></div><div className="side-stat"><span>Convicted</span><b>42</b></div>
        <Link className="btn btn-primary full" to="/cities/dhaka">View Dhaka details</Link>
      </div>
    </div>
    <div className="notice"><AlertTriangle size={17}/><div><b>Responsible data policy</b><span>Do not infer that a location is “unsafe” from raw case counts alone. Use population-adjusted rates, date ranges, source quality and context.</span></div></div>
  </div></Layout>;
}

function PageTitle({ eyebrow, title, text }) {
  return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>;
}

function Statistics() {
  const pie = [
    {name:"Reported", value:61}, {name:"Investigation", value:17}, {name:"Under Trial", value:11}, {name:"Convicted", value:7}, {name:"Acquitted", value:4}
  ];
  return <Layout><div className="container page">
    <PageTitle eyebrow="DATA EXPLORER" title="Statistics" text="Compare trends and case status across the eight demo cities."/>
    <div className="stats-grid"><StatCard icon={FileText} label="Total reported" value={totalReported.toLocaleString()}/><StatCard icon={Gavel} label="Convicted" value={totalConvicted}/><StatCard icon={Building2} label="Cities" value="08"/><StatCard icon={Database} label="Source status" value="Demo"/></div>
    <div className="chart-grid">
      <ChartPanel title="Monthly trend"><ResponsiveContainer width="100%" height={300}><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="month"/><YAxis/><Tooltip/><Line type="monotone" dataKey="reported" stroke="#0f6fff" strokeWidth={3}/><Line type="monotone" dataKey="convicted" stroke="#10a66a" strokeWidth={3}/></LineChart></ResponsiveContainer></ChartPanel>
      <ChartPanel title="Case status"><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={75} outerRadius={105} paddingAngle={3}>{pie.map((_,i)=><Cell key={i} fill={["#0f6fff","#7c5cff","#f59e0b","#10a66a","#ef4444"][i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="chart-legend">{pie.map((p,i)=><span key={p.name}><i style={{background:["#0f6fff","#7c5cff","#f59e0b","#10a66a","#ef4444"][i]}}/>{p.name} {p.value}%</span>)}</div></ChartPanel>
    </div>
    <ChartPanel title="Reported cases by city"><ResponsiveContainer width="100%" height={330}><BarChart data={cities} layout="vertical" margin={{left:20,right:20}}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number"/><YAxis dataKey="name" type="category" width={90}/><Tooltip/><Bar dataKey="reported" fill="#0f6fff" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></ChartPanel>
  </div></Layout>;
}

function ChartPanel({title, children}) { return <div className="panel chart-panel"><div className="panel-head"><div><span className="eyebrow">ANALYTICS</span><h2>{title}</h2></div></div>{children}</div>; }

function Cities() {
  return <Layout><div className="container page"><PageTitle eyebrow="CITY DIRECTORY" title="Cities" text="Select a city to view its public safety statistics and area-level demo data."/><div className="city-grid wide">{cities.map(c => <CityCard key={c.slug} city={c}/>)}</div></div></Layout>;
}

function CityPage() {
  const { slug } = useParams();
  const city = cities.find(c => c.slug === slug) || cities[0];
  const cityAreas = city.slug === "dhaka" ? areas : [];
  return <Layout><div className="container page">
    <div className="city-hero"><div><span className="eyebrow">CITY SAFETY PROFILE</span><h1>{city.name}</h1><p>Public safety statistics and service information. Demo values are shown for UI testing only.</p></div><Link className="btn btn-light" to="/map"><Map size={16}/> Open map</Link></div>
    <div className="stats-grid"><StatCard icon={FileText} label="Reported" value={city.reported}/><StatCard icon={Activity} label="Investigation" value={city.investigation}/><StatCard icon={Gavel} label="Under trial" value={city.trial}/><StatCard icon={CheckCircle2} label="Convicted" value={city.convicted}/></div>
    <div className="section-grid">
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">AREAS</span><h2>Areas in {city.name}</h2></div></div>
      {cityAreas.length ? <div className="table-wrap"><table><thead><tr><th>Area</th><th>Reported</th><th>Level</th><th></th></tr></thead><tbody>{cityAreas.map(a=><tr key={a.name}><td><b>{a.name}</b></td><td>{a.reported}</td><td><StatusBadge status={a.level}/></td><td><Link className="text-link" to="/cities/dhaka/uttara">View</Link></td></tr>)}</tbody></table></div> : <div className="empty"><MapPin size={24}/><p>Area-level demo data will appear here after verified datasets are added.</p></div>}</div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">DATA NOTE</span><h2>How to read this</h2></div></div><p className="muted">Raw case counts do not measure individual danger. Compare consistent time periods, population-adjusted rates, source quality and court status.</p><div className="notice compact"><AlertTriangle size={16}/><span>Never publish victim identities or unverified accusations.</span></div></div>
    </div>
  </div></Layout>;
}

function Uttara() {
  const a = areas[0];
  return <Layout><div className="container page">
    <div className="area-hero"><div><span className="eyebrow">DHAKA NORTH CITY CORPORATION</span><h1>Uttara Area</h1><p>Local safety profile, public services and demo case statistics.</p></div><span className="level-badge high">Higher reports</span></div>
    <div className="stats-grid"><StatCard icon={FileText} label="Reported" value={a.reported}/><StatCard icon={Activity} label="Investigation" value={a.investigation}/><StatCard icon={Gavel} label="Under trial" value={a.trial}/><StatCard icon={CheckCircle2} label="Convicted" value={a.convicted}/></div>
    <div className="section-grid">
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">LOCAL MAP</span><h2>Uttara location</h2></div></div><div className="preview-map uttara"><div className="map-shape"/><span className="map-pin-label"><MapPin size={15}/> Uttara</span></div></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">NEARBY SERVICES</span><h2>Safety resources</h2></div></div><div className="service-list"><Service icon={Siren} title="Police station" text="Add verified local station data"/><Service icon={Activity} title="Hospital" text="Add verified hospital data"/><Service icon={Phone} title="Helpline" text="109 — Women & Child support"/></div><Link className="btn btn-primary full" to="/emergency">View emergency services</Link></div>
    </div>
  </div></Layout>;
}

function Service({icon:Icon,title,text}) { return <div className="service"><span><Icon size={17}/></span><div><b>{title}</b><small>{text}</small></div></div>; }

function Cases() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(()=>cases.filter(c=>Object.values(c).join(" ").toLowerCase().includes(search.toLowerCase())),[search]);
  return <Layout><div className="container page"><PageTitle eyebrow="VERIFIED RECORDS" title="Case Records" text="A privacy-aware table for verified public records. Names, victim identities and sensitive personal details are intentionally excluded."/>
    <div className="panel"><div className="table-tools"><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search case ID, location or area"/></div><button className="btn btn-primary">Search</button></div>
    <div className="table-wrap"><table><thead><tr><th>Case ID</th><th>Location</th><th>Area</th><th>Status</th><th>Court status</th><th>Date</th><th>Source</th></tr></thead><tbody>{filtered.map(c=><tr key={c.id}><td><b>{c.id}</b></td><td>{c.city}</td><td>{c.area}</td><td><StatusBadge status={c.status}/></td><td>{c.court}</td><td>{c.date}</td><td><span className="source">{c.source}</span></td></tr>)}</tbody></table></div></div>
  </div></Layout>;
}

function StatusBadge({status}) { const cls = status.toLowerCase().replaceAll(" ","-"); return <span className={"status " + cls}>{status}</span>; }

function Report() {
  const [sent, setSent] = useState(false);
  return <Layout><div className="container narrow page"><PageTitle eyebrow="COMMUNITY REPORTING" title="Report an Incident" text="Submit information for review. A user report is not automatically treated as a verified fact."/>
    <div className="form-layout"><form className="panel form" onSubmit={e=>{e.preventDefault();setSent(true)}}><label>Location<select required><option value="">Select location</option><option>Uttara, Dhaka</option><option>Mirpur, Dhaka</option><option>Other</option></select></label><label>Date<input type="date" required/></label><label>Category<select required><option value="">Select category</option><option>Safety concern</option><option>Incident information</option><option>Public service issue</option></select></label><label>Description<textarea rows="6" placeholder="Describe what you want the review team to know..." required/></label><label>Evidence (optional)<input type="file" accept="image/*,.pdf"/></label><button className="btn btn-primary full"><Send size={16}/> Submit for review</button>{sent&&<div className="success"><CheckCircle2 size={17}/> Report submitted to the demo review queue.</div>}</form>
      <div className="panel"><span className="eyebrow">REVIEW PROCESS</span><h2>What happens next?</h2><div className="timeline"><b>1. Submitted</b><span>Your report enters a review queue.</span><b>2. Pending review</b><span>A moderator checks completeness and source quality.</span><b>3. Verified</b><span>Only supported information can be published.</span><b>4. Published</b><span>Public information is shown without unnecessary personal data.</span></div></div></div>
  </div></Layout>;
}

function Emergency() {
  return <Layout><div className="container page"><PageTitle eyebrow="GET HELP" title="Emergency Help" text="If you are in immediate danger, contact emergency services. This website does not replace police, medical or legal assistance."/>
    <div className="emergency-hero"><Phone size={30}/><div><span>EMERGENCY NUMBER</span><strong>999</strong><p>For immediate police, fire or ambulance assistance.</p></div><a className="btn btn-light" href="tel:999">Call 999</a></div>
    <div className="emergency-grid">{emergency.slice(1).map(e=><div className="panel emergency-card" key={e.number}><span className="emergency-icon"><Phone size={18}/></span><h2>{e.title}</h2><strong>{e.number}</strong><p>{e.detail}</p></div>)}<div className="panel emergency-card"><span className="emergency-icon"><MapPin size={18}/></span><h2>Nearby services</h2><p>Connect verified police stations, hospitals and support organizations to the map.</p><Link className="text-link" to="/map">Open map <ArrowRight size={15}/></Link></div></div>
    <div className="notice"><AlertTriangle size={18}/><div><b>Safety reminder</b><span>Do not share a survivor's identity, private address, phone number or medical details publicly.</span></div></div>
  </div></Layout>;
}

function Auth({register=false}) {
  return <Layout><div className="auth-page"><div className="auth-card"><div className="brand centered"><span className="brand-mark"><Shield size={19}/></span>Social Safety BD</div><h1>{register ? "Create account" : "Welcome back"}</h1><p>{register ? "Create a community account." : "Sign in to continue."}</p><form className="form">{register&&<label>Full name<input placeholder="Your name"/></label>}<label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="btn btn-primary full">{register ? "Create account" : "Login"}</button></form><p className="auth-switch">{register ? "Already have an account?" : "New here?"} <Link to={register?"/login":"/register"}>{register?"Login":"Register"}</Link></p></div></div></Layout>;
}

function Admin() {
  return <Layout><div className="container page"><PageTitle eyebrow="ADMINISTRATION" title="Admin Dashboard" text="Moderation and data management interface for the prototype."/>
    <div className="stats-grid"><StatCard icon={Users} label="Users" value="1,250"/><StatCard icon={FileText} label="Cases" value="1,248"/><StatCard icon={AlertTriangle} label="Pending reports" value="34"/><StatCard icon={CheckCircle2} label="Verified reports" value="892"/></div>
    <div className="section-grid"><div className="panel"><div className="panel-head"><div><span className="eyebrow">MODERATION</span><h2>Recent reports</h2></div></div><div className="table-wrap"><table><thead><tr><th>Location</th><th>Category</th><th>Status</th><th>Date</th></tr></thead><tbody><tr><td>Uttara</td><td>Safety concern</td><td><StatusBadge status="Pending"/></td><td>2026-08-18</td></tr><tr><td>Mirpur</td><td>Harassment</td><td><StatusBadge status="Verified"/></td><td>2026-08-16</td></tr><tr><td>Dhaka</td><td>Assault</td><td><StatusBadge status="Verified"/></td><td>2026-08-15</td></tr></tbody></table></div></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">QUICK ACTIONS</span><h2>Manage system</h2></div><LayoutDashboard/></div><div className="admin-actions"><button>Add Case</button><button>Manage Reports</button><button>Manage Users</button><button>Update Locations</button><button>Manage Sources</button><button>Settings</button></div></div></div>
  </div></Layout>;
}

function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/map" element={<SafetyMap/>}/>
    <Route path="/statistics" element={<Statistics/>}/>
    <Route path="/cities" element={<Cities/>}/>
    <Route path="/cities/:slug" element={<CityPage/>}/>
    <Route path="/cities/dhaka/uttara" element={<Uttara/>}/>
    <Route path="/cases" element={<Cases/>}/>
    <Route path="/report" element={<Report/>}/>
    <Route path="/emergency" element={<Emergency/>}/>
    <Route path="/login" element={<Auth/>}/>
    <Route path="/register" element={<Auth register/>}/>
    <Route path="/admin" element={<Admin/>}/>
  </Routes>;
}

export default App;
