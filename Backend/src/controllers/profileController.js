const {
  findUserById,
  updateUser
} = require("../repositories/memoryRepository");

const { publicUser } = require("../services/authService");

async function getProfile(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  res.json({ success: true, user: publicUser(user) });
}

async function updateProfile(req, res) {
  const allowed = ["name", "phone", "farmInformation"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await updateUser(req.userId, updates);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  res.json({
    success: true,
    message: "Profile updated successfully.",
    user: publicUser(user)
  });
}

module.exports = { getProfile, updateProfile };
