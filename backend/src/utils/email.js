import nodemailer from "nodemailer";

export const sendWeatherEmail = async (to, city, weather) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const temp = weather.main?.temp;
  const desc = weather.weather?.[0]?.description;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `Daily Weather for ${city}`,
    html: `
      <h2>Weather Update for ${city}</h2>
      <p>Temperature: ${temp}°C</p>
      <p>Condition: ${desc}</p>
    `,
  });
};