import db from "@/utils/db";
import Order from "@/models/Order";

export default async function handler(req, res) {
  const orderIds = req.query["orderIds[]"];
  try {
    await db.connect();

    const orders = await Order.find({ _id: { $in: orderIds } });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    db.disconnect();
  }
}
