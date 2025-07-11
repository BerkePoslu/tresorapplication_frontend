import "../../App.css";
import React, { useEffect, useState } from "react";
import { getUsers } from "../../comunication/FetchUser";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Users
 * @author Peter Rutschmann
 */
const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { getAuthHeaders, isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Check if user is authenticated and is admin
        if (!isAuthenticated) {
          setErrorMessage("You must be logged in to view users");
          return;
        }

        if (user?.role !== "ADMIN") {
          setErrorMessage("Admin access required to view users");
          return;
        }

        const authHeaders = getAuthHeaders();
        const users = await getUsers(authHeaders);
        console.log(users);
        setUsers(users);
      } catch (error) {
        console.error("Failed to fetch to server:", error.message);
        setErrorMessage(error.message);
      }
    };
    fetchUsers();
  }, [isAuthenticated, user, getAuthHeaders]);

  return (
    <>
      <h1>Client list</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.id} {user.firstName} {user.lastName} - {user.email} -{" "}
            {user.password}
          </li>
        ))}
      </ul>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </>
  );
};

export default Users;
