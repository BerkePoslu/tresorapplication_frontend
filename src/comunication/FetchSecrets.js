/**
 * Fetch methodes for secret api calls
 * @author Peter Rutschmann
 */

//Post secret to server (SECURE ENDPOINT)
export const postSecret = async ({ content, authHeadersWithContentType }) => {
  const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
  const host = process.env.REACT_APP_API_HOST; // "localhost"
  const port = process.env.REACT_APP_API_PORT; // "8080"
  const path = process.env.REACT_APP_API_PATH; // "/api"
  const portPart = port ? `:${port}` : ""; // port is optional
  const API_URL = `${protocol}://${host}${portPart}${path}`;

  try {
    // Use the secure PUT /api/secrets/me endpoint that extracts user email from JWT automatically
    const response = await fetch(`${API_URL}/secrets/me`, {
      method: "PUT",
      headers: authHeadersWithContentType,
      body: JSON.stringify({
        content: content,
        encryptPassword: "default", // Provide default encryption password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Server response failed.");
    }

    const data = await response.json();
    console.log("Secret successfully posted:", data);
    return data;
  } catch (error) {
    console.error("Error posting secret:", error.message);
    throw new Error("Failed to save secret. " || error.message);
  }
};

//get all secrets for a user authenticated by JWT token (SECURE ENDPOINT)
export const getSecretsforUser = async (authHeaders) => {
  const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
  const host = process.env.REACT_APP_API_HOST; // "localhost"
  const port = process.env.REACT_APP_API_PORT; // "8080"
  const path = process.env.REACT_APP_API_PATH; // "/api"
  const portPart = port ? `:${port}` : ""; // port is optional
  const API_URL = `${protocol}://${host}${portPart}${path}`;

  try {
    console.log(
      "getSecretsforUser: Making GET request with headers:",
      authHeaders
    );
    console.log(
      "getSecretsforUser: URL:",
      `${API_URL}/secrets/me?encryptPassword=default`
    );

    // Use the secure /api/secrets/me endpoint that extracts user email from JWT automatically
    const response = await fetch(
      `${API_URL}/secrets/me?encryptPassword=default`,
      {
        method: "GET",
        headers: authHeaders,
      }
    );

    console.log("getSecretsforUser: Response status:", response.status);
    console.log("getSecretsforUser: Response headers:", response.headers);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Server response failed.");
    }
    const data = await response.json();
    console.log("Secret successfully got:", data);
    return data;
  } catch (error) {
    console.error("Failed to get secrets:", error.message);
    throw new Error("Failed to get secrets. " || error.message);
  }
};
