import { useMemo, useState } from "react";
import ualbanyLogo from "./AI_Plus___UAlbany_RGB.png";
import LoginPage from "./LoginPage";
import {
  hardwareResources,
  softwareResources,
  learningResources,
  templates,
  users,
  workshops,
  stats,
} from "./data/resources";
import {
  Cpu,
  LayoutDashboard,
  Users,
  Wrench,
  BookOpen,
  FolderKanban,
  CalendarDays,
  ShieldCheck,
  Sparkles,
  Monitor,
  Server,
  Search,
  Bell,
  ChevronRight,
  GraduationCap,
  Boxes,
  Laptop,
} from "lucide-react";

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const RECOMMEND_ENDPOINT = import.meta.env.VITE_RECOMMEND_ENDPOINT || "/recommend";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "assistant", label: "Project Assistant", icon: Sparkles },
  { id: "hardware", label: "Hardware", icon: Cpu },
  { id: "software", label: "Software & Tools", icon: Laptop },
  { id: "users", label: "User Management", icon: Users },
  { id: "templates", label: "Templates", icon: FolderKanban },
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "policies", label: "Policies", icon: ShieldCheck },
];

const initialForm = {
  name: "",
  title: "",
  description: "",
  skillLevel: "Beginner",
  domain: "Generative AI",
  goal: "Prototype",
  hardware: "Auto-select best match",
  software: "Auto-select best match",
};

const fallbackRecommendation = (form) => ({
  summary: `Recommended path for ${form.title || "your project"} (${form.domain})`,
  difficulty: form.skillLevel === "Beginner" ? "Moderate" : "Advanced",
  recommendedHardware:
    form.domain === "Computer Vision"
      ? ["RTX 4500 Workstation", "Dell 27” 4K Monitor"]
      : ["RTX 4000 Workstation", "Dell 27” 4K Monitor"],
  recommendedSoftware:
    form.domain === "Generative AI"
      ? ["Python", "Hugging Face", "FastAPI", "Docker", "VS Code"]
      : ["Python", "PyTorch", "Jupyter", "GitHub", "VS Code"],
  nextSteps: [
    "Define project scope and expected output.",
    "Select dataset, tools, and target hardware.",
    "Build an MVP and validate core functionality.",
    "Test deployment readiness and troubleshooting paths.",
  ],
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [form, setForm] = useState(initialForm);
  const [resourceFilter, setResourceFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [assistantResult, setAssistantResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [recentProjects, setRecentProjects] = useState([]);

  // Load recent projects for templates section
  useState(() => {
    fetch("/api/projects?limit=6")
      .then(r => r.json())
      .then(data => setRecentProjects(data.projects || []))
      .catch(() => {});
  });

  const filteredHardware = useMemo(() => {
    if (resourceFilter === "All") return hardwareResources;
    return hardwareResources.filter((item) => item.category === resourceFilter);
  }, [resourceFilter]);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const searchIndex = [
    ...hardwareResources.map(i => ({ label: i.name, sub: i.category, section: "hardware" })),
    ...softwareResources.map(i => ({ label: i.name, sub: i.category, section: "software" })),
    ...learningResources.map(i => ({ label: i.title, sub: i.type, section: "learning" })),
    ...templates.map(i => ({ label: i.name, sub: i.level, section: "templates" })),
    ...workshops.map(i => ({ label: i.title, sub: i.date, section: "events" })),
    ...users.map(i => ({ label: i.name, sub: i.role, section: "users" })),
  ];

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const lower = q.toLowerCase();
    setSearchResults(searchIndex.filter(item =>
      item.label.toLowerCase().includes(lower) || item.sub.toLowerCase().includes(lower)
    ).slice(0, 6));
  };

  const handleSearchSelect = (result) => {
    setSearchQuery("");
    setSearchResults([]);
    scrollToSection(result.section);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setAssistantMessage("");
    setAssistantResult(null);

    const payload = {
      name: form.name,
      project_title: form.title,
      project_description: form.description,
      skill_level: form.skillLevel,
      project_domain: form.domain,
      project_goal: form.goal,
      preferred_hardware: form.hardware,
      preferred_software: form.software,
    };

    const endpoint = BACKEND_BASE_URL
      ? `${BACKEND_BASE_URL.replace(/\/$/, "")}${RECOMMEND_ENDPOINT}`
      : RECOMMEND_ENDPOINT;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setProjectId(data.project_id || null);
      setChatMessages([{
        role: "assistant",
        content: `Hi! I know your project — "${form.title || form.description}". Ask me anything if you get stuck on a step.`
      }]);
      // Refresh recent projects
      fetch("/api/projects?limit=6").then(r => r.json()).then(d => setRecentProjects(d.projects || [])).catch(() => {});
      setAssistantResult({
        summary: data.summary || data.recommendation || data.project_plan || "Recommendation received from backend.",
        difficulty: data.difficulty || data.estimated_difficulty || "Not specified",
        recommendedHardware: data.recommendedHardware || data.recommended_hardware || data.hardware || [],
        recommendedSoftware: data.recommendedSoftware || data.recommended_software || data.software || [],
        nextSteps: data.nextSteps || data.next_steps || data.steps || [],
      });
      setAssistantMessage("Live recommendation loaded from backend.");
    } catch (error) {
      setProjectId(null);
      setChatMessages([]);
      setAssistantResult(fallbackRecommendation(form));
      setAssistantMessage(
        "Backend response was unavailable, so a demo recommendation is shown. Update VITE_API_BASE_URL or VITE_RECOMMEND_ENDPOINT if your API path is different."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <LoginPage onLogin={setCurrentUser} />;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img src={ualbanyLogo} alt="UAlbany AI Makerspace" style={{width:"120px", marginBottom:"8px", filter:"brightness(0) invert(1)"}} />
          <div>
            <h1>UAlbany AI Makerspace Portal</h1>
            <p>Project guidance + resource management</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
                onClick={() => scrollToSection(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <h3>Makerspace Snapshot</h3>
          <p>2 GPU towers, 1 4K monitor, project templates, learning paths, and workshop support in one portal.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-box" style={{ position: "relative" }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search hardware, software, templates, learning..."
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map((r, i) => (
                  <button key={i} className="search-result-item" onClick={() => handleSearchSelect(r)}>
                    <span className="search-result-label">{r.label}</span>
                    <span className="search-result-sub">{r.sub}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="notifications">
              <Bell size={18} />
            </button>
            <div className="user-chip">
              <span className="status-dot" />
              <div>
                <strong>{currentUser.role === "Admin" ? "Admin View" : "Student View"}</strong>
                <p>{currentUser.name}</p>
              </div>
              <button
                onClick={() => setCurrentUser(null)}
                style={{ marginLeft: "10px", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", color: "#888" }}
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <section id="dashboard" className="section hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h2>AI-Guided Project Development System for the AI Makerspace</h2>
            <p>
              A professional front end for project assistance, user management, hardware discovery,
              software support, learning resources, and workshop visibility.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollToSection("assistant")}>
                Open Project Assistant
              </button>
              <button className="secondary-button" onClick={() => scrollToSection("hardware")}>
                Explore Resources
              </button>
            </div>
          </div>
        </section>

        <section className="section stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <p>{stat.description}</p>
            </article>
          ))}
        </section>

        <section id="assistant" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Core Working Module</span>
              <h3>Project Assistant Workspace</h3>
              <p>Keep this connected to your backend while presenting a more professional portal UI.</p>
            </div>
          </div>

          <div className="assistant-layout">
            <form className="assistant-form" onSubmit={handleAssistantSubmit}>
              <div className="form-grid">
                <label>
                  <span>Your Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder=""
                  />
                </label>

                <label>
                  <span>Project Title</span>
                  <input
                    value={form.title}
                    onChange={(e) => updateForm("title", e.target.value)}
                    placeholder=""
                  />
                </label>

                <label className="full-width">
                  <span>Project Description</span>
                  <textarea
                    rows="6"
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder=""
                  />
                </label>

                <label>
                  <span>Skill Level</span>
                  <select value={form.skillLevel} onChange={(e) => updateForm("skillLevel", e.target.value)}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </label>

                <label>
                  <span>Project Domain</span>
                  <select value={form.domain} onChange={(e) => updateForm("domain", e.target.value)}>
                    <option>Generative AI</option>
                    <option>Computer Vision</option>
                    <option>Data Science</option>
                    <option>NLP</option>
                    <option>Recommendation Systems</option>
                    <option>Robotics</option>
                    <option>IoT</option>
                  </select>
                </label>

                <label>
                  <span>Project Goal</span>
                  <select value={form.goal} onChange={(e) => updateForm("goal", e.target.value)}>
                    <option>Prototype</option>
                    <option>Class Project</option>
                    <option>Research</option>
                    <option>Hackathon</option>
                    <option>Deployment</option>
                    <option>Portfolio Project</option>
                  </select>
                </label>

                <label>
                  <span>Preferred Hardware</span>
                  <select value={form.hardware} onChange={(e) => updateForm("hardware", e.target.value)}>
                    <option>Auto-select best match</option>
                    <option>RTX 4500 Workstation</option>
                    <option>RTX 4000 Workstation</option>
                    <option>Dell 27” 4K Monitor</option>
                  </select>
                </label>

                <label>
                  <span>Preferred Software</span>
                  <select value={form.software} onChange={(e) => updateForm("software", e.target.value)}>
                    <option>Auto-select best match</option>
                    <option>Python + FastAPI</option>
                    <option>PyTorch + Jupyter</option>
                    <option>Hugging Face + Docker</option>
                    <option>TensorFlow + VS Code</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-button" disabled={isLoading}>
                  {isLoading ? "Generating..." : "Generate Project Plan"}
                </button>
                <p className="helper-text">
                  Tip: this page already supports real backend integration through a POST request.
                </p>
              </div>
            </form>

            <div className="assistant-result">
              <div className="result-header">
                <Sparkles size={18} />
                <h4>Recommendation Output</h4>
              </div>

              {assistantMessage ? <p className="info-banner">{assistantMessage}</p> : null}

              {assistantResult ? (
                <div className="result-body">
                  <div className="result-block">
                    <span>Summary</span>
                    <p>{assistantResult.summary}</p>
                  </div>

                  <div className="result-columns">
                    <div className="result-block">
                      <span>Difficulty</span>
                      <p>{assistantResult.difficulty}</p>
                    </div>

                    <div className="result-block">
                      <span>Recommended Hardware</span>
                      <ul>
                        {(assistantResult.recommendedHardware || []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="result-block">
                      <span>Recommended Software</span>
                      <ul>
                        {(assistantResult.recommendedSoftware || []).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="result-block">
                    <span>Next Steps</span>
                    <ol>
                      {(assistantResult.nextSteps || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Your AI-generated project guidance will appear here.</p>
                  <ul>
                    <li>Architecture suggestions</li>
                    <li>Hardware and software recommendations</li>
                    <li>Build steps and deployment direction</li>
                    <li>Troubleshooting-oriented next actions</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {assistantResult && (
            <div className="chat-box" style={{marginTop:"2rem",background:"#fff",borderRadius:"12px",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",overflow:"hidden"}}>
              <div style={{padding:"14px 20px",borderBottom:"1px solid #eee",fontWeight:600,display:"flex",gap:"8px",alignItems:"center"}}>
                <Sparkles size={16}/> Project Assistant Chat
                <span style={{fontSize:"0.78rem",fontWeight:400,color:"#888",marginLeft:"8px"}}>Ask follow-up questions about your project</span>
              </div>
              <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:"10px",maxHeight:"320px",overflowY:"auto"}}>
                {chatMessages.length === 0 && (
                  <div style={{color:"#888",fontSize:"0.9rem",fontStyle:"italic"}}>
                    {projectId ? `Project loaded. Ask me anything about your project steps.` : "Connect to backend to enable interactive chat."}
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{alignSelf:msg.role==="user"?"flex-end":"flex-start",background:msg.role==="user"?"#6c47ff":"#f4f4f4",color:msg.role==="user"?"#fff":"#333",padding:"10px 14px",borderRadius:"12px",maxWidth:"80%",fontSize:"0.9rem",whiteSpace:"pre-wrap"}}>
                    <strong style={{display:"block",fontSize:"0.72rem",opacity:0.7,marginBottom:"4px"}}>{msg.role==="user"?"You":"Assistant"}</strong>
                    {msg.content}
                  </div>
                ))}
                {chatLoading && <div style={{alignSelf:"flex-start",background:"#f4f4f4",padding:"10px 14px",borderRadius:"12px",fontSize:"0.9rem",fontStyle:"italic",opacity:0.6}}>Thinking...</div>}
              </div>
              <div style={{display:"flex",gap:"10px",padding:"14px 20px",borderTop:"1px solid #eee"}}>
                <textarea
                  rows={2}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!chatInput.trim() || chatLoading || !projectId) return;
                      const msg = chatInput.trim();
                      setChatInput("");
                      setChatMessages(prev => [...prev, {role:"user", content:msg}]);
                      setChatLoading(true);
                      try {
                        const res = await fetch("/api/chat", {
                          method:"POST",
                          headers:{"Content-Type":"application/json"},
                          body: JSON.stringify({project_id: projectId, message: msg})
                        });
                        const data = await res.json();
                        setChatMessages(prev => [...prev, {role:"assistant", content: data.reply}]);
                      } catch {
                        setChatMessages(prev => [...prev, {role:"assistant", content:"Sorry, something went wrong."}]);
                      } finally {
                        setChatLoading(false);
                      }
                    }
                  }}
                  placeholder={projectId ? "Ask something like: I'm stuck on step 2... (Press Enter to send)" : "Backend required for chat"}
                  disabled={chatLoading || !projectId}
                  style={{flex:1,border:"1px solid #ddd",borderRadius:"8px",padding:"10px 12px",fontSize:"0.9rem",resize:"none",fontFamily:"inherit",outline:"none"}}
                />
              </div>
            </div>
          )}
        </section>

        <section id="hardware" className="section panel">
          <div className="section-heading split">
            <div>
              <span className="section-tag">UAlbany Resource Catalog</span>
              <h3>Hardware Resources</h3>
              <p>Built from the equipment your professor shared for the AI Makerspace.</p>
            </div>

            <select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)} className="filter-select">
              <option>All</option>
              <option>GPU Workstation</option>
              <option>Display</option>
            </select>
          </div>

          <div className="card-grid">
            {filteredHardware.map((item) => (
              <article key={item.name} className="resource-card">
                <div className="card-top">
                  <div>
                    <span className="resource-type">{item.category}</span>
                    <h4>{item.name}</h4>
                  </div>
                  <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, "-")}`}>
                    {item.status}
                  </span>
                </div>

                <ul className="spec-list">
                  {item.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>

                <p>{item.description}</p>

                <div className="card-footer">
                  <button className="ghost-button">Request Access</button>
                  <span>{item.bestFor}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="software" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Development Support</span>
              <h3>Software & Tools</h3>
              <p>Suggested tools to expose in the portal for project development support.</p>
            </div>
          </div>

          <div className="mini-card-grid">
            {softwareResources.map((tool) => (
              <article key={tool.name} className="mini-card">
                <h4>{tool.name}</h4>
                <span>{tool.category}</span>
                <p>{tool.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="users" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Live Student Submissions</span>
              <h3>User Management</h3>
              <p>Students who have submitted projects through the Project Assistant.</p>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Skill Level</th>
                  <th>Project Description</th>
                  <th>Submitted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.length > 0 ? recentProjects.map((project, i) => (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.student_name || "Anonymous"}</td>
                    <td>{project.skill_level}</td>
                    <td>{project.description.slice(0, 60)}{project.description.length > 60 ? "..." : ""}</td>
                    <td>{new Date(project.created_at).toLocaleDateString()}</td>
                    <td><span className="status-badge active">Submitted</span></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{textAlign:"center", color:"#888", padding:"20px"}}>
                      No submissions yet. Students who use the Project Assistant will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section id="templates" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Recent Projects</span>
              <h3>Project Templates</h3>
              <p>Recent student projects — click "Use Template" to pre-fill the assistant form.</p>
            </div>
          </div>

          <div className="mini-card-grid">
            {recentProjects.length > 0 ? recentProjects.map((project) => (
              <article key={project.id} className="mini-card template-card">
                <h4>{project.description.slice(0, 60)}{project.description.length > 60 ? "..." : ""}</h4>
                <span>{project.skill_level}</span>
                <p>Submitted project — click to reuse this setup.</p>
                <button
                  className="inline-link"
                  onClick={() => {
                    updateForm("description", project.description);
                    updateForm("skillLevel", project.skill_level || "Beginner");
                    scrollToSection("assistant");
                  }}
                >
                  Use Template <ChevronRight size={14} />
                </button>
              </article>
            )) : (
              <p style={{color:"#888", fontSize:"0.9rem"}}>No projects submitted yet. Submit a project to see it here.</p>
            )}
          </div>
        </section>

        <section id="learning" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Learning Support</span>
              <h3>Learning Resources</h3>
              <p>Add curated guides, documentation, troubleshooting help, and workshop materials.</p>
            </div>
          </div>

          <div className="mini-card-grid">
            {learningResources.map((resource) => (
              <article key={resource.title} className="mini-card">
                <h4>{resource.title}</h4>
                <span>{resource.type}</span>
                <p>{resource.description}</p>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-link"
                    style={{display:"inline-flex", alignItems:"center", gap:"4px", marginTop:"8px", fontSize:"0.85rem"}}
                  >
                    Open Resource <ChevronRight size={14} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="events" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Community + Training</span>
              <h3>Workshops & Events</h3>
              <p>Show the makerspace as an active ecosystem, not only a form-based tool.</p>
            </div>
          </div>

          <div className="timeline">
            {workshops.map((item) => (
              <article key={item.title} className="timeline-item">
                <div className="timeline-date">{item.date}</div>
                <div className="timeline-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="policies" className="section panel">
          <div className="section-heading">
            <div>
              <span className="section-tag">Governance Layer</span>
              <h3>Policies & Responsible AI</h3>
              <p>Include this section to reflect the makerspace's operational and ethical support model.</p>
            </div>
          </div>

          <div className="policy-grid">
            <article className="policy-card">
              <ShieldCheck size={20} />
              <h4>AI Usage Guidelines</h4>
              <p>Define allowed tool categories, project use cases, and safe experimentation practices.</p>
            </article>

            <article className="policy-card">
              <Server size={20} />
              <h4>Hardware Access Policy</h4>
              <p>Set workstation request flow, expected usage duration, and maintenance awareness.</p>
            </article>

            <article className="policy-card">
              <Monitor size={20} />
              <h4>Data Handling Rules</h4>
              <p>Support project intake with sensitivity checks and recommended resource constraints.</p>
            </article>

            <article className="policy-card">
              <GraduationCap size={20} />
              <h4>Learning & Support Path</h4>
              <p>Guide new users from beginner-friendly templates to more advanced AI project development.</p>
            </article>
          </div>
        </section>

        <footer className="footer">
          <div>
            <strong>UAlbany AI Makerspace Portal</strong>
            <p>Professional frontend redesign for your AI-Guided Project Development System.</p>
          </div>
          <div className="footer-links">
            <span>Dashboard</span>
            <span>Assistant</span>
            <span>Resources</span>
            <span>Users</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
