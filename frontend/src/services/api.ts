// Hardcoded for debugging to ensure Env Var isn't overriding with localhost
export const API_URL = "https://fortex-hackathon.vercel.app";
console.log("Using API URL:", API_URL);

export async function login(
  email: string,
  password: string,
  role: "student" | "admin"
) {
  const res = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  return res.json();
}

export async function signup(
  email: string,
  password: string,
  role: "student" | "admin",
  name: string
) {
  const res = await fetch(
    `${API_URL}/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role, name }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Signup failed");
  }

  return res.json();
}

export async function getMyComplaints() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/complaints/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Not authorized");
  }

  return res.json();
}

export async function testBackend() {
  const res = await fetch(`${API_URL}/`);
  if (!res.ok) throw new Error("Backend reachable but returned error " + res.status);
  return res.json();
}
