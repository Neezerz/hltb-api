import { HowLongToBeatService } from "howlongtobeat";

const hltbService = new HowLongToBeatService();

export default async function handler(req, res) {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: "Missing game name" });
  }

  try {
    const results = await hltbService.search(name);
    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }

    const game = results[0];

    return res.status(200).json({
      name: game.name,
      main: game.gameplayMain ? Math.round(game.gameplayMain / 60) + "h" : null,
      link: `https://howlongtobeat.com/game/${game.id}`,
      image: game.imageUrl
    });
  } catch (error) {
    return res.status(500).json({ error: "HLTB error", details: error.message });
  }
}
