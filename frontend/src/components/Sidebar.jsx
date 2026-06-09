import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/analysis', label: 'Analysis' },
  { to: '/history', label: 'History' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>RetailSense AI</h1>
        <p>Retail conversation analytics</p>
      </div>
      <nav>
        {links.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
