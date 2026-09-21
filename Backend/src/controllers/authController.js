const {
  findUserByEmail,
  findUserByPhone,
  findUserByIdentifier,
  createUser,
  findUserById
} = require("../repositories/memoryRepository");

const {
  publicUser,
  hashPassword,
  comparePassword,
  createToken
} = require("../services/authService");

async function register(req, res) {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: "Name, mobile number, and password are required."
    });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match."
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 6 characters."
    });
  }

  if (email && email.trim()) {
    const existingEmail = await findUserByEmail(email.trim());
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }
  }

  if (phone && phone.trim()) {
    const existingPhone = await findUserByPhone(phone.trim());
    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "An account with this mobile number already exists."
      });
    }
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    name: name.trim(),
    email: email && email.trim() ? email.trim() : null,
    phone: phone ? phone.trim() : "",
    passwordHash
  });

  const token = createToken(user.id);

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token,
    user: publicUser(user)
  });
}

async function login(req, res) {
  const { email, password, identifier } = req.body;
  const loginIdentifier = identifier || email;

  if (!loginIdentifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Email or mobile number, and password are required."
    });
  }

  const user = await findUserByIdentifier(loginIdentifier);

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    return res.status(401).json({
      success: false,
      message: "Invalid email/mobile number or password."
    });
  }

  const token = createToken(user.id);

  res.json({
    success: true,
    message: "Login successful.",
    token,
    user: publicUser(user)
  });
}

async function me(req, res) {
  const user = await findUserById(req.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found."
    });
  }

  res.json({
    success: true,
    user: publicUser(user)
  });
}

module.exports = { register, login, me };
