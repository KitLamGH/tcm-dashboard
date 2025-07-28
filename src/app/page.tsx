"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Item = {
  id: number;
  name: string;
};

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/names/")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>ID: {item.id}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
