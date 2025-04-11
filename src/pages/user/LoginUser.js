import { useNavigate } from "react-router-dom";

function LoginUser({ loginValues, setLoginValues }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginValues),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        // Store user info in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          })
        );
        navigate("/");
      } else {
        console.error("Login failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login user</h2>
      <form onSubmit={handleSubmit}>
        <section>
          <aside>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={loginValues.email}
                onChange={(e) =>
                  setLoginValues((prevValues) => ({
                    ...prevValues,
                    email: e.target.value,
                  }))
                }
                required
                placeholder="Please enter your email *"
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={loginValues.password}
                onChange={(e) =>
                  setLoginValues((prevValues) => ({
                    ...prevValues,
                    password: e.target.value,
                  }))
                }
                required
                placeholder="Please enter your password *"
              />
            </div>
          </aside>
        </section>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginUser;
