import cron from "node-cron";
import User from "../models/User.js";
import fetch from "node-fetch";
import { sendWeatherEmail } from "./email.js";

cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Running daily weather job...");

  const users = await User.find({ city: { $exists: true } });

  for (const user of users) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&units=metric&appid=${process.env.API_KEY}`
      );

      const weather = await res.json();

      await sendWeatherEmail(user.email, user.city, weather);

      console.log(`📧 Email sent to ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed for ${user.email}`, err.message);
    }
  }
});