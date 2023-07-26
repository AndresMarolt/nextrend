import User from "@/models/User";
import db from "@/utils/db";
import bcryptjs from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return;
  }

  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: "Error de validación",
    });
    return;
  }

  try {
    await db.connect();

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: "El usuario ya existe!" });
      await db.disconnect();
      return;
    }

    const newUser = new User({
      username,
      email,
      password: bcryptjs.hashSync(password),
      isAdmin: false,
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });

    const user = await newUser.save();
    await db.disconnect();

    res.status(201).send({
      message: "Created user!",
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor al crear el usuario." });
  }
};

export default handler;
