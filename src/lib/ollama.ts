export async function fetchOllamaResponse(context: string) {
  const res = await fetch("http://localhost:8000/api/ai/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ context }),
  });

  const data = await res.json();
  return data.response;
}
