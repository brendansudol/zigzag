import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

type Card = {
  label: string
  selected: boolean
  word: string
}

type Game = {
  turn: "red" | "blue"
  board: Card[]
}

export async function POST(req: Request) {
  const { game }: { game: Game } = await req.json()
  const prompt = getPrompt(game)

  const { text: result } = await generateText({
    model: openai("gpt-4-turbo"),
    system: SYSTEM_PROMPT,
    prompt,
  })

  return Response.json({ game, prompt, result })
}

const SYSTEM_PROMPT = formatString(`
You are an AI assistant specialized in the game Codenames, acting as a helpful co-spymaster.
Your task is to generate clever, valid clues based on the given word sets. 
`)

function getPrompt(game: Game): string {
  const { turn, board } = game

  const nextTurn = turn === "red" ? "blue" : "red"
  const toWordList = (cards: Card[]) => cards.map((card) => card.word).join(", ")

  const remainingCards = board.filter((card) => !card.selected)
  const ourWords = remainingCards.filter((card) => card.label === turn)
  const opponentWords = remainingCards.filter((card) => card.label === nextTurn)
  const neutralWords = remainingCards.filter((card) => card.label === "bystander")
  const assassinWord = remainingCards.find((card) => card.label === "assassin")?.word ?? "N/A"

  return formatString(`
    I'm playing Codenames with my friends. I'm the spymaster and I need your help to come up with a clue.
    As a refresher, Codenames is a word-guessing game where, as spymaster, you give one-word clues to
    help your team identify specific words from a grid. Your challenge is to connect multiple target
    words with each clue, while avoiding words belonging to the opponent, neutral words, and the
    game-ending assassin word.

    We are the ${turn.toUpperCase()} team.

    Our words: ${toWordList(ourWords)}

    Opponent's words: ${toWordList(opponentWords)}

    Neutral words: ${toWordList(neutralWords)}

    Assassin word: ${assassinWord}

    Please suggest a good one-word clue to give my team, followed by the number of words it relates to.
    Then list the specific words from our team's list that your clue relates to.
    Finally, briefly explain your reasoning for choosing this clue.

    Your response should be in this format:

    Clue: [CLUE_WORD] [NUMBER]
    
    Related words: [WORD1], [WORD2], etc.
    
    Reasoning: [Brief explanation]
`)
}

function formatString(str: string): string {
  return str
    .split("\n")
    .map((line) => line.trim())
    .reduce((result, line, index, array) => {
      if (line !== "") {
        if (result.length > 0 && array[index - 1] !== "") {
          result += " " // Add space if previous line wasn't empty
        }
        result += line
      } else if (index > 0 && array[index - 1] !== "") {
        result += "\n" // Add newline for empty lines, but not at the start
      }
      return result
    }, "")
}
