import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * Layout
 * @author Peter Rutschmann
 */
const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleOAuthLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <>
      <nav>
        <h1>The Secret Tresor Application</h1>
        <div className="user-info">
          {isAuthenticated ? (
            <div className="authenticated-user">
              <p>Welcome, {user?.firstName || user?.email}!</p>
              <p>Role: {user?.role || "USER"}</p>
              {user?.twoFactorEnabled && (
                <span className="2fa-badge">🔐 2FA</span>
              )}
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <p>No user logged in</p>
          )}
        </div>
        <ul>
          <li>
            <a href="/">Secrets</a>
            <ul>
              {isAuthenticated && (
                <>
                  <li>
                    <Link to="/secret/secrets">my secrets</Link>
                  </li>
                  <li>
                    <Link to="/secret/newcredential">new credential</Link>
                  </li>
                  <li>
                    <Link to="/secret/newcreditcard">new credit-card</Link>
                  </li>
                  <li>
                    <Link to="/secret/newnote">new note</Link>
                  </li>
                </>
              )}
            </ul>
          </li>
          <li>
            <a href="/">User</a>
            <ul>
              {!isAuthenticated ? (
                <>
                  <li>
                    <Link to="/user/login">login</Link>
                  </li>
                  <li>
                    <Link to="/user/register">register</Link>
                  </li>
                  <li>
                    <Link to="/user/forgot-password">forgot password</Link>
                  </li>
                  <li>
                    <button onClick={handleOAuthLogin} className="oauth-btn">
                      Login with Google
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/user/2fa">Two-Factor Authentication</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </li>
          {isAuthenticated && user?.role === "ADMIN" && (
            <li>
              <a href="/">Admin</a>
              <ul>
                <li>
                  <Link to="/user/users">All users</Link>
                </li>
                <li>Add user</li>
                <li>
                  <Link to="/user/users/:id">Edit user</Link>
                </li>
                <li>All secrets</li>
              </ul>
            </li>
          )}
          <li>
            <Link to="/">About</Link>
          </li>
        </ul>
      </nav>
      <hr />
      <Outlet />
    </>
  );
};

export default Layout;
