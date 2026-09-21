const {
  findUserById,
  updateUser
} = require("../repositories/memoryRepository");

async function getSettings(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  res.json({
    success: true,
    settings: user.settings
  });
}

async function updateSettings(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  const current = user.settings || {};

  const settings = {
    language:
      req.body.language !== undefined ? req.body.language : current.language,
    notifications:
      req.body.notifications !== undefined
        ? Boolean(req.body.notifications)
        : current.notifications,
    offlineMode:
      req.body.offlineMode !== undefined
        ? Boolean(req.body.offlineMode)
        : current.offlineMode
  };

  await updateUser(req.userId, { settings });

  res.json({
    success: true,
    message: "Settings updated successfully.",
    settings
  });
}

module.exports = { getSettings, updateSettings };
