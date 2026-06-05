/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "bouquet"       → Canvas-based flower bouquet with ribbon
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Aurel",
  photo: "./img/aurel.jpg",       // Place your photo in the img/ folder
  music: "./music/hbd.mpeg",      // Place your music in the music/ folder

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#f472b6",           // Main accent color (rose pink)
    accent: "#60a5fa",            // Secondary accent color (sky blue)
    dark: {
      background: "#0f172a",      // Slate 900
      text: "#f1f5f9",            // Slate 100
    },
    light: {
      background: "#fafaf9",      // Stone 50
      text: "#1e293b",            // Slate 800
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "light",

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "greeting",
      title: "Hi",
      subtitle: "nama lu kek martabak yang telornya 3, <br><strong>spesial</strong>",
    },
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
      goText: "<img src='./img/celebrate.gif' style='width: 400px; height: auto;'>",                 // Text shown after countdown ends
    },
    {
      type: "announcement",
      text: "It's your bday!",
    },
    {
      type: "chatbox",
      message:
        "Happy bday rell, semoga di umur yang bertambah ini menjadi orang yang lebih baik dari sebelumnya dan taat kepada orang tua. Semoga juga di tahun ini lu selalu diberikan kesehatan 😁. terus juga selalu dimudahkan dalam segala hal. semoga diperkuliahan juga punya temen yang banyak dan baik tidak anomali. semangat dan happy teruss yeah",
      buttonText: "Send",
    },
    {
      type: "ideas",
      lines: [
        "Tadi gw mau ngechat ginian.",
        "Cuman gajadi.",
        "terus gw mau buat yang <strong>special</strong>.azza ",
        "karena,",
        "lu spesial, hahay <span>:P</span>",
      ],
      bigLetters: "SO",
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday RELLL !!",
      wishText: "semoga apa yang kamu impikan tercapai, dan sehat selalu my mbg gweh",
    },
    {
      type: "bouquet",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "closing",
      text: "dah abis, suka ga? suka aja yee",
      replayText: "teken lgi aja klo mau replay ya cinta",
    },
  ],
};
