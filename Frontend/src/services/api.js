const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function getToken() {
  try {
    return localStorage.getItem("agrisense_token") || null;
  } catch (e) {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem("agrisense_token", token);
    } else {
      localStorage.removeItem("agrisense_token");
    }
  } catch (e) {
    console.warn("Could not save token to localStorage:", e);
  }
}

export function getStoredUser() {
  try {
    const user = localStorage.getItem("agrisense_user");
    if (!user || user === "undefined" || user === "null") return null;
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    if (user) {
      localStorage.setItem("agrisense_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("agrisense_user");
    }
  } catch (e) {
    console.warn("Could not save user to localStorage:", e);
  }
}

export async function analyzeImageWithGemini(imageFile, accessToken) {
  if (!imageFile) {
    throw new Error("Please select an image.");
  }

  const token = accessToken || getToken();

  if (!token) {
    throw new Error("Your session is missing. Please log in again.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(`${API_BASE_URL}/api/ai/analyze-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let responseBody;

  try {
    responseBody = await response.json();
  } catch {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok || responseBody.success === false) {
    if (response.status === 401) {
      throw new Error("Your login session expired. Please log in again.");
    }

    if (response.status === 429) {
      throw new Error("Too many analysis requests. Please wait and try again.");
    }

    throw new Error(
      responseBody.error ||
        responseBody.message ||
        responseBody.details ||
        "The image could not be analyzed."
    );
  }

  return responseBody.analysis;
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is NOT FormData, set Content-Type JSON
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setToken(null);
    setStoredUser(null);
  }

  const contentType = response.headers.get("content-type");
  let data;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (typeof data === "object" && (data.error || data.message)) || data || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  async login(credentials) {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async register(userData) {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
    if (data.token) {
      setToken(data.token);
      setStoredUser(data.user);
    }
    return data;
  },

  async getMe() {
    return request("/api/auth/me");
  },

  logout() {
    setToken(null);
    setStoredUser(null);
  },

  // Gemini AI Analysis
  analyzeImageWithGemini,

  // Dashboard
  async getDashboard() {
    return request("/api/dashboard");
  },

  // Analyses
  async analyzeFeed(formData) {
    return request("/api/analysis/feed", {
      method: "POST",
      body: formData,
    });
  },

  async analyzeSilage(formData) {
    return request("/api/analysis/silage", {
      method: "POST",
      body: formData,
    });
  },

  async getHistory() {
    return request("/api/analysis/history");
  },

  async getAnalysis(id) {
    return request(`/api/analysis/${id}`);
  },

  // Profile
  async getProfile() {
    return request("/api/profile");
  },

  async updateProfile(updates) {
    return request("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Settings
  async getSettings() {
    return request("/api/settings");
  },

  async updateSettings(settings) {
    return request("/api/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  },

  // Reports
  async getReports() {
    return request("/api/reports");
  },

  getDownloadUrl(id) {
    return `${API_BASE_URL}/api/reports/${id}/download`;
  },
};
