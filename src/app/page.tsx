"use client"

import { useCompletion } from "ai/react"

export default function Chat() {
  const { completion, handleSubmit } = useCompletion({
    api: "/api/completion",
    body: {
      game: {
        color: "red",
        ourWords: ["apple", "banana"],
        opponentWords: ["carrot", "doughnut"],
        neutralWords: ["elephant", "frog"],
        assassinWord: "gorilla",
      },
    },
    initialInput: "foo",
  })

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button type="submit">submit</button>
      </form>
    </>
  )
}
