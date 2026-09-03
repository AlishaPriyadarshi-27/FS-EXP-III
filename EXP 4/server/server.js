const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = 5000;

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   CALENDAR EVENTS DATA
========================= */

let events = [
  {
    id: 1,
    title: "Design review",
    day: "Mon",
    time: "10:00",
    type: "meeting",
  },
  {
    id: 2,
    title: "Ship v2.3",
    day: "Mon",
    time: "16:00",
    type: "deadline",
  },
  {
    id: 3,
    title: "1:1 with Sam",
    day: "Tue",
    time: "09:30",
    type: "meeting",
  },
  {
    id: 4,
    title: "Write proposal",
    day: "Wed",
    time: "13:00",
    type: "focus",
  },
  {
    id: 5,
    title: "Client demo",
    day: "Thu",
    time: "15:00",
    type: "meeting",
  },
  {
    id: 6,
    title: "Portfolio review",
    day: "Thu",
    time: "18:00",
    type: "focus",
  },
  {
    id: 7,
    title: "Grocery run",
    day: "Sat",
    time: "10:00",
    type: "personal",
  },
  {
    id: 8,
    title: "Sprint planning",
    day: "Sun",
    time: "11:00",
    type: "meeting",
  },
];

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Interactive Calendar Backend is Running!",
  });
});

/* =========================
   GET ALL EVENTS
========================= */

app.get("/api/events", (req, res) => {
  res.status(200).json(events);
});

/* =========================
   ADD NEW EVENT
========================= */

app.post("/api/events", (req, res) => {
  const { title, day, time, type } = req.body;

  if (!title || !day || !time || !type) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const newEvent = {
    id: Date.now(),
    title,
    day,
    time,
    type,
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
});

/* =========================
   UPDATE EVENT
========================= */

app.put("/api/events/:id", (req, res) => {
  const eventId = Number(req.params.id);

  const eventIndex = events.findIndex(
    (event) => event.id === eventId
  );

  if (eventIndex === -1) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events[eventIndex] = {
    ...events[eventIndex],
    ...req.body,
    id: eventId,
  };

  res.status(200).json(events[eventIndex]);
});

/* =========================
   DELETE EVENT
========================= */

app.delete("/api/events/:id", (req, res) => {
  const eventId = Number(req.params.id);

  const eventExists = events.some(
    (event) => event.id === eventId
  );

  if (!eventExists) {
    return res.status(404).json({
      message: "Event not found",
    });
  }

  events = events.filter(
    (event) => event.id !== eventId
  );

  res.status(200).json({
    message: "Event deleted successfully",
  });
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});