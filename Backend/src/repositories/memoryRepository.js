const { getPool } = require("../config/db");
const bcrypt = require("bcryptjs");

// In-memory data structures
const memoryUsers = [];
const memoryAnalyses = [];

function mapUser(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    passwordHash: row.password_hash || row.passwordHash,
    farmInformation: row.farm_information || row.farmInformation || "",
    settings: {
      language: row.language || (row.settings && row.settings.language) || "English",
      notifications: row.notifications !== undefined ? row.notifications : (row.settings ? row.settings.notifications : true),
      offlineMode: row.offline_mode !== undefined ? row.offline_mode : (row.settings ? row.settings.offlineMode : false),
    },
    createdAt: new Date(row.created_at || row.createdAt || Date.now()).toISOString(),
  };
}

function mapAnalysis(row) {
  if (!row) return null;

  let measurements = { ...(row.measurements || {}) };
  if (row.moisture !== undefined && row.moisture !== null) measurements.moisture = Number(row.moisture);
  if (row.protein !== undefined && row.protein !== null) measurements.protein = Number(row.protein);
  if (row.fiber !== undefined && row.fiber !== null) measurements.fiber = Number(row.fiber);
  if (row.aflatoxin !== undefined && row.aflatoxin !== null) measurements.aflatoxin = Number(row.aflatoxin);
  if (row.ph !== undefined && row.ph !== null) measurements.ph = Number(row.ph);
  if (row.temperature !== undefined && row.temperature !== null) measurements.temperature = Number(row.temperature);

  let recs = row.recommendations || [];
  if (typeof recs === "string") {
    try {
      recs = JSON.parse(recs);
    } catch {
      recs = [recs];
    }
  }

  return {
    id: String(row.id),
    userId: String(row.user_id || row.userId),
    testId: row.test_id || row.testId || `AG-${String(row.id).padStart(4, "0")}`,
    sampleType: row.sample_type || row.sampleType,
    imagePath: row.image_path || row.imagePath || null,
    annotatedImagePath: row.annotated_image_path || row.annotatedImagePath || null,
    outputImageDataUrl: row.output_image_data_url || row.outputImageDataUrl || null,
    aiAnalysis: row.ai_analysis || row.aiAnalysis || null,
    measurements,
    aiResult: row.ai_result || row.aiResult,
    confidence: Number(row.confidence || 0),
    quality: row.quality || "GOOD",
    recommendations: Array.isArray(recs) ? recs : [],
    createdAt: new Date(row.created_at || row.createdAt || Date.now()).toISOString(),
  };
}

let dbInitPromise = null;

async function ensureSeedData() {
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = (async () => {
    // Populate In-Memory default user if empty
    if (memoryUsers.length === 0) {
      const demoPasswordHash = await bcrypt.hash("password123", 10);
      const demoUser = {
        id: "usr_1",
        name: "Farmer",
        email: "farmer@example.com",
        phone: "+91 98765 43210",
        passwordHash: demoPasswordHash,
        farmInformation: "Green Valley Dairy Farm, Maharashtra, India. Herd of 45 Holstein Friesian cows.",
        settings: {
          language: "English",
          notifications: true,
          offlineMode: false,
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      memoryUsers.push(demoUser);

      const sampleFeed = {
        id: "an_1",
        userId: "usr_1",
        testId: "FD-001",
        sampleType: "feed",
        imagePath: null,
        measurements: { moisture: 12.5, protein: 18.2, fiber: 14.8, aflatoxin: 4.5, ph: 6.8 },
        aiResult: "Good Quality Feed",
        confidence: 94,
        quality: "GOOD",
        recommendations: [
          "Store feed in a clean, dry, well-ventilated storage facility.",
          "Aflatoxin level is well within safe thresholds (< 20 ppb).",
          "Perform regular batch inspections before feeding."
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const sampleSilage = {
        id: "an_2",
        userId: "usr_1",
        testId: "SL-002",
        sampleType: "silage",
        imagePath: null,
        measurements: { moisture: 64.0, protein: 12.0, fiber: 22.5, aflatoxin: 2.1, ph: 4.2, temperature: 24.5 },
        aiResult: "Good Quality Silage",
        confidence: 88,
        quality: "GOOD",
        recommendations: [
          "pH is optimal (4.2), indicating excellent lactic fermentation.",
          "Keep the silage face tightly sealed after daily extraction.",
          "Regularly monitor pit moisture and temperature."
        ],
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      };

      memoryAnalyses.push(sampleFeed, sampleSilage);
    }

    const pool = getPool();
    if (pool) {
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(50),
            password_hash TEXT NOT NULL,
            farm_information TEXT,
            language VARCHAR(50) DEFAULT 'English',
            notifications BOOLEAN DEFAULT true,
            offline_mode BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE TABLE IF NOT EXISTS analyses (
            id SERIAL PRIMARY KEY,
            user_id INT NOT NULL,
            test_id VARCHAR(50) NOT NULL,
            sample_type VARCHAR(50) NOT NULL,
            image_path TEXT,
            annotated_image_path TEXT,
            output_image_data_url TEXT,
            ai_analysis JSONB,
            moisture NUMERIC,
            protein NUMERIC,
            fiber NUMERIC,
            aflatoxin NUMERIC,
            ph NUMERIC,
            temperature NUMERIC,
            ai_result TEXT,
            confidence NUMERIC,
            quality VARCHAR(50),
            recommendations JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);

        try {
          await pool.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL;`);
          await pool.query(`ALTER TABLE analyses ADD COLUMN IF NOT EXISTS annotated_image_path TEXT;`);
          await pool.query(`ALTER TABLE analyses ADD COLUMN IF NOT EXISTS output_image_data_url TEXT;`);
          await pool.query(`ALTER TABLE analyses ADD COLUMN IF NOT EXISTS ai_analysis JSONB;`);
          await pool.query(`ALTER TABLE analyses ADD COLUMN IF NOT EXISTS aflatoxin NUMERIC;`);
        } catch (alterErr) {
          // Ignored
        }
      } catch (err) {
        console.warn("Could not ensure PG tables:", err.message);
      }
    }
  })();

  return dbInitPromise;
}

async function findUserByEmail(email) {
  if (!email) return null;
  await ensureSeedData();
  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, password_hash, farm_information,
                language, notifications, offline_mode, created_at
         FROM users
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1`,
        [email.trim()]
      );
      return mapUser(result.rows[0]);
    } catch (err) {
      console.warn("PG findUserByEmail fallback:", err.message);
    }
  }

  const user = memoryUsers.find((u) => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
  return user ? mapUser(user) : null;
}

async function findUserByPhone(phone) {
  if (!phone) return null;
  await ensureSeedData();
  const cleanPhone = phone.trim();
  const stripped = cleanPhone.replace(/[\s\-+]/g, "");
  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, password_hash, farm_information,
                language, notifications, offline_mode, created_at
         FROM users
         WHERE phone = $1 OR regexp_replace(phone, '[\\s\\-+]', '', 'g') = $2
         LIMIT 1`,
        [cleanPhone, stripped]
      );
      return mapUser(result.rows[0]);
    } catch (err) {
      console.warn("PG findUserByPhone fallback:", err.message);
    }
  }

  const user = memoryUsers.find((u) => {
    if (!u.phone) return false;
    const p = u.phone.trim();
    const pStripped = p.replace(/[\s\-+]/g, "");
    return p === cleanPhone || (stripped && pStripped === stripped);
  });
  return user ? mapUser(user) : null;
}

async function findUserByIdentifier(identifier) {
  if (!identifier) return null;
  await ensureSeedData();
  const clean = identifier.trim();
  const lower = clean.toLowerCase();
  const stripped = clean.replace(/[\s\-+]/g, "");

  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, password_hash, farm_information,
                language, notifications, offline_mode, created_at
         FROM users
         WHERE (email IS NOT NULL AND LOWER(email) = $1)
            OR (phone IS NOT NULL AND (phone = $2 OR regexp_replace(phone, '[\\s\\-+]', '', 'g') = $3))
         LIMIT 1`,
        [lower, clean, stripped]
      );
      return mapUser(result.rows[0]);
    } catch (err) {
      console.warn("PG findUserByIdentifier fallback:", err.message);
    }
  }

  const user = memoryUsers.find((u) => {
    const emailMatch = u.email && u.email.toLowerCase() === lower;
    const phoneMatch = u.phone && (
      u.phone.trim() === clean ||
      (stripped && u.phone.replace(/[\s\-+]/g, "") === stripped)
    );
    return emailMatch || phoneMatch;
  });
  return user ? mapUser(user) : null;
}

async function findUserById(userId) {
  await ensureSeedData();
  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT id, name, email, phone, password_hash, farm_information,
                language, notifications, offline_mode, created_at
         FROM users
         WHERE id::text = $1
         LIMIT 1`,
        [String(userId)]
      );
      return mapUser(result.rows[0]);
    } catch (err) {
      console.warn("PG findUserById fallback:", err.message);
    }
  }

  const user = memoryUsers.find((u) => String(u.id) === String(userId));
  return user ? mapUser(user) : null;
}

async function createUser(data) {
  await ensureSeedData();
  const emailVal = data.email ? data.email.trim().toLowerCase() : null;
  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `INSERT INTO users (name, email, phone, password_hash)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, phone, password_hash, farm_information,
                   language, notifications, offline_mode, created_at`,
        [data.name, emailVal, data.phone || "", data.passwordHash]
      );
      return mapUser(result.rows[0]);
    } catch (err) {
      console.warn("PG createUser fallback to memory:", err.message);
    }
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name: data.name,
    email: emailVal,
    phone: data.phone || "",
    passwordHash: data.passwordHash,
    farmInformation: "",
    settings: {
      language: "English",
      notifications: true,
      offlineMode: false,
    },
    createdAt: new Date().toISOString(),
  };
  memoryUsers.push(newUser);
  return mapUser(newUser);
}

async function updateUser(userId, updates) {
  const pool = getPool();
  if (pool) {
    const fields = [];
    const values = [];
    let index = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(updates.name);
    }
    if (updates.phone !== undefined) {
      fields.push(`phone = $${index++}`);
      values.push(updates.phone);
    }
    if (updates.farmInformation !== undefined) {
      fields.push(`farm_information = $${index++}`);
      values.push(updates.farmInformation);
    }
    if (updates.settings) {
      if (updates.settings.language !== undefined) {
        fields.push(`language = $${index++}`);
        values.push(updates.settings.language);
      }
      if (updates.settings.notifications !== undefined) {
        fields.push(`notifications = $${index++}`);
        values.push(updates.settings.notifications);
      }
      if (updates.settings.offlineMode !== undefined) {
        fields.push(`offline_mode = $${index++}`);
        values.push(updates.settings.offlineMode);
      }
    }

    if (fields.length === 0) return findUserById(userId);

    values.push(userId);
    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE id = $${index}
       RETURNING id, name, email, phone, password_hash, farm_information,
                 language, notifications, offline_mode, created_at`,
      values
    );
    return mapUser(result.rows[0]);
  }

  const user = memoryUsers.find((u) => String(u.id) === String(userId));
  if (!user) return null;

  if (updates.name !== undefined) user.name = updates.name;
  if (updates.phone !== undefined) user.phone = updates.phone;
  if (updates.farmInformation !== undefined) user.farmInformation = updates.farmInformation;
  if (updates.settings) {
    user.settings = { ...user.settings, ...updates.settings };
  }
  return mapUser(user);
}

async function createAnalysis(data) {
  const m = data.measurements || {};
  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `INSERT INTO analyses
         (user_id, test_id, sample_type, image_path, annotated_image_path,
          output_image_data_url, ai_analysis, moisture, protein, fiber,
          aflatoxin, ph, temperature, ai_result, confidence, quality, recommendations)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::jsonb)
       RETURNING *`,
      [
        data.userId,
        `AG-${Date.now().toString().slice(-6)}`,
        data.sampleType,
        data.imagePath || null,
        data.annotatedImagePath || null,
        data.outputImageDataUrl || null,
        JSON.stringify(data.aiAnalysis || null),
        m.moisture ?? null,
        m.protein ?? null,
        m.fiber ?? null,
        m.aflatoxin ?? null,
        m.ph ?? null,
        m.temperature ?? null,
        data.aiResult,
        data.confidence,
        data.quality,
        JSON.stringify(data.recommendations || []),
      ]
    );
    return mapAnalysis(result.rows[0]);
  }

  const prefix = data.sampleType === "feed" ? "FD" : "SL";
  const newAnalysis = {
    id: `an_${Date.now()}`,
    userId: String(data.userId),
    testId: `${prefix}-${Math.floor(100 + Math.random() * 900)}`,
    sampleType: data.sampleType,
    imagePath: data.imagePath || null,
    annotatedImagePath: data.annotatedImagePath || null,
    outputImageDataUrl: data.outputImageDataUrl || null,
    aiAnalysis: data.aiAnalysis || null,
    measurements: {
      moisture: m.moisture ?? null,
      protein: m.protein ?? null,
      fiber: m.fiber ?? null,
      aflatoxin: m.aflatoxin ?? null,
      ph: m.ph ?? null,
      temperature: m.temperature ?? null,
    },
    aiResult: data.aiResult,
    confidence: data.confidence,
    quality: data.quality,
    recommendations: data.recommendations || [],
    createdAt: new Date().toISOString(),
  };
  memoryAnalyses.unshift(newAnalysis);
  return mapAnalysis(newAnalysis);
}

async function getAnalysisById(userId, analysisId) {
  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `SELECT * FROM analyses
       WHERE (id::text = $1 OR test_id = $1) AND user_id::text = $2
       LIMIT 1`,
      [String(analysisId), String(userId)]
    );
    return mapAnalysis(result.rows[0]);
  }

  const item = memoryAnalyses.find(
    (a) => (String(a.id) === String(analysisId) || a.testId === String(analysisId)) && String(a.userId) === String(userId)
  );
  return item ? mapAnalysis(item) : null;
}

async function getAnalysesByUser(userId) {
  const pool = getPool();
  if (pool) {
    const result = await pool.query(
      `SELECT * FROM analyses
       WHERE user_id::text = $1
       ORDER BY created_at DESC`,
      [String(userId)]
    );
    return result.rows.map(mapAnalysis);
  }

  return memoryAnalyses
    .filter((a) => String(a.userId) === String(userId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(mapAnalysis);
}

async function getDashboardStats(userId) {
  await ensureSeedData();
  const pool = getPool();
  if (pool) {
    try {
      const result = await pool.query(
        `SELECT
           COUNT(*)::int AS total_tests,
           COUNT(*) FILTER (WHERE UPPER(quality) = 'GOOD')::int AS good_quality,
           COUNT(*) FILTER (WHERE UPPER(quality) = 'AVERAGE')::int AS average_quality,
           COUNT(*) FILTER (WHERE UPPER(quality) = 'POOR')::int AS poor_quality
         FROM analyses
         WHERE user_id::text = $1`,
        [String(userId)]
      );

      const row = result.rows[0] || {};
      return {
        totalTests: Number(row.total_tests || 0),
        goodQuality: Number(row.good_quality || 0),
        averageQuality: Number(row.average_quality || 0),
        poorQuality: Number(row.poor_quality || 0),
      };
    } catch (err) {
      console.warn("PG getDashboardStats fallback:", err.message);
    }
  }

  const userAnalyses = memoryAnalyses.filter((a) => String(a.userId) === String(userId));
  return {
    totalTests: userAnalyses.length,
    goodQuality: userAnalyses.filter((a) => (a.quality || "").toUpperCase() === "GOOD").length,
    averageQuality: userAnalyses.filter((a) => (a.quality || "").toUpperCase() === "AVERAGE").length,
    poorQuality: userAnalyses.filter((a) => (a.quality || "").toUpperCase() === "POOR").length,
  };
}

async function deleteAnalysis(analysisId) {
  const pool = getPool();
  if (pool) {
    await pool.query("DELETE FROM analyses WHERE id::text = $1", [String(analysisId)]);
    return;
  }

  const index = memoryAnalyses.findIndex((a) => String(a.id) === String(analysisId));
  if (index !== -1) {
    memoryAnalyses.splice(index, 1);
  }
}

module.exports = {
  ensureSeedData,
  findUserByEmail,
  findUserByPhone,
  findUserByIdentifier,
  findUserById,
  createUser,
  updateUser,
  createAnalysis,
  getAnalysisById,
  getAnalysesByUser,
  getDashboardStats,
  deleteAnalysis,
};
