"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import prompts from "@/data/prompts.json";

interface Prompt {
  title: string;
  tags: string[];
  language: string;
  prompt: string;
}

export default function PromptLibrary() {
  const [search, setSearch] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("");

  const filteredPrompts = prompts.filter(
    (p: Prompt) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterTag ? p.tags.includes(filterTag) : true)
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copiado al portapapeles!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Biblioteca de Prompts</h1>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Input
          placeholder="Filtrar por etiqueta..."
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredPrompts.map((prompt, index) => (
          <Card key={index} className="p-4">
            <CardContent>
              <h2 className="text-xl font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-500">{prompt.language}</p>
              <p className="mt-2">{prompt.prompt}</p>
              <div className="mt-2 flex gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="mt-2"
                onClick={() => copyToClipboard(prompt.prompt)}
              >
                Copiar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
