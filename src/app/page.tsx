"use client"

import { useCompletion } from "ai/react"

export default function Page() {
  const { handleSubmit } = useCompletion({
    api: "/api/ai/codenames",
    body: {
      game: {
        turn: "red",
        board: [
          { label: "red", selected: false, word: "foo" },
          { label: "blue", selected: false, word: "bar" },
          { label: "bystander", selected: false, word: "baz" },
          { label: "assassin", selected: false, word: "qux" },
        ],
      },
    },
    initialInput: "foo",
  })

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">submit</button>
    </form>
  )
}
