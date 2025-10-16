import { HowLongToBeatService } from "howlongtobeat";

const hltb = new HowLongToBeatService();

export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing game name" });
  }

  try {
    const result = await hltb.search(name);
    if (!result || result.length === 0) {
      return res.json({ name, main: null });
    }

    const game = result[0];
    return res.json({
      name: game.name,
      main: game.gameplayMain ? Math.round(game.gameplayMain / 60) + "h" : null,
      image: game.imageUrl,
      link: `https://howlongtobeat.com/game/${game.id}`
    });
  } catch (err) {
    return res.status(500).json({ error: "HLTB error", details: err.message });
  }
}
