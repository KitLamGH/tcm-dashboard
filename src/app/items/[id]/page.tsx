"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { fetchOllamaResponse } from "@/lib/ollama"; // helper

type Item = {
  id: number;
  name: string;
  origin: string;
  aliases: string[];
  explanation: string[];
  general_notes: string[];
  processing: string[];
  section: string;
  volume: string;
  category: string;
  properties: string[];
  properties_notes: string[];
  indications: string[];
  discoveries: string[];
};

type Prescription = {
  id: number;
  name: string;
  method: string;
};

const hoverLoading = "Loading AI translation/explanation...";
export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [hoveredText, setHoveredText] = useState("");
  const [hoverResponse, setHoverResponse] = useState("");

  const handleHover = async (method: string) => {
    setHoveredText(method);
    setHoverResponse(hoverLoading);
    const response = await fetchOllamaResponse(method);
    setHoverResponse(response);
  };

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:8000/api/items/${id}/`)
      .then((res) => res.json())
      .then((data) => setItem(data))
      .catch((err) => console.error("Item fetch error:", err));

    fetch(`http://127.0.0.1:8000/api/prescriptions/medica/?item_id=${id}`)
      .then((res) => res.json())
      .then((data) => setPrescriptions(data))
      .catch((err) => console.error("Prescriptions fetch error:", err));
  }, [id]);

  if (!item) return <div className="p-6">Loading...</div>;

  const renderListSection = (title: string, items: string[]) => (
    <section>
      <h2 className="text-xl font-semibold mt-6">{title}</h2>
      {items.length > 0 ? (
        <ul className="list-disc ml-6 space-y-1 mt-2">
          {items.map((val, idx) => (
            <li key={idx}>{val}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic mt-1">No data available.</p>
      )}
    </section>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{item.name}</h1>
        <p className="text-gray-600">Origin: {item.origin || "N/A"}</p>
        <p className="text-gray-600">Category: {item.category || "N/A"}</p>
        <p className="text-gray-600">
          Section: {item.section || "N/A"} / Volume: {item.volume || "N/A"}
        </p>
      </div>

      {renderListSection("Aliases", item.aliases)}
      {renderListSection("Explanation", item.explanation)}
      {renderListSection("General Notes", item.general_notes)}
      {renderListSection("Processing", item.processing)}
      {renderListSection("Properties", item.properties)}
      {renderListSection("Property Notes", item.properties_notes)}
      {renderListSection("Indications", item.indications)}
      {renderListSection("Discoveries", item.discoveries)}

      <div className="mb-4">
        <h2 className="font-semibold">Prescriptions</h2>
        {prescriptions.map((prescription) => (
          <Popover key={prescription.id}>
            <PopoverTrigger asChild>
              <button
                onClick={() => handleHover(prescription.method)}
                className="text-blue-600 underline mb-2 block text-left"
              >
                💊 {prescription.name}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 whitespace-pre-wrap text-sm">
              <p className="mb-1">
                <strong>Method:</strong> {hoveredText}
              </p>
              <hr className="my-2" />
              {hoverResponse || hoverLoading}
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
