import express from "express";
import cors from "cors";
import { HowLongToBeatService } from "howlongtobeat";

const app = express();
app.use(cors());

const hltb = new HowLongToBeatService();

app.get("/", (req, res) => {
  res.send("✅ HLTB API OK - Add /game?name=YOUR_GAME");
});

app.get("/game", async (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({ error: "Missing game name" });

  try {
    const result = await hltb.search(name);
    if (!result || result.length === 0) {
      return res.json({ name, main: null });
    }

    const game = result[0];
    res.json({
      name: game.name,
      main: game.gameplayMain ? Math.round(game.gameplayMain / 60) + "h" : null,
      image: game.imageUrl,
      link: `https://howlongtobeat.com/game/${game.id}`
    });
  } catch (error) {
    res.status(500).json({ error: "HLTB error", details: error.message });
  }
});

app.listen(3000, () => console.log("✅ API HLTB ready on port 3000"));
