import db from "@/utils/db";
import User from "@/models/User";

const handler = async (req, res) => {
  await db.connect();

  if (req.method === "GET") {
    const user = await User.findById(req.query._id);
    res.send(user);
  } else if (req.method === "PUT") {
    const { _id } = req.query;
    const newData = req.body;

    try {
      const updatedUser = await User.findByIdAndUpdate(_id, newData, {
        new: true,
      });
      res.send(updatedUser);
    } catch (error) {
      res.status(500).send({ message: "Error updating the user." });
    }
  } else {
    res.status(405).end();
  }

  await db.disconnect();
};

export default handler;
