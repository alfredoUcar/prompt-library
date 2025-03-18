"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import prompts from "@/data/prompts.json";
import languages from "@/data/languages.json";

interface Prompt {
  title: string;
  tags: string[];
  languageInput: string;
  languageOutput: string;
  prompt: string;
}

type LanguageCode = keyof typeof languages;

export default function PromptLibrary() {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");

  useEffect(() => {
    // Extract all available tags for autocomplete
    const allTags = Array.from(new Set(prompts.flatMap((p) => p.tags)));
    setAvailableTags(allTags);

    // Read search parameters from URL
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") || "");
    setFilterTags(params.get("tags")?.split(",") || []);
  }, []);

  useEffect(() => {
    // Update search state when navigating history
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearch(params.get("search") || "");
      setFilterTags(params.get("tags")?.split(",") || []);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filterTags.length) params.set("tags", filterTags.join(","));
    router.push(`?${params.toString()}`);
  }, [search, filterTags]);

  // Add a new tag to the filter list
  const handleAddTag = (tag: string) => {
    if (!filterTags.includes(tag.toLowerCase())) {
      setFilterTags([...filterTags, tag.toLowerCase()]);
      setTagInput("");
    }
  };

  // Remove a tag from the filter list
  const handleRemoveTag = (tag: string) => {
    setFilterTags(filterTags.filter((t) => t !== tag));
  };

  // Copy prompt text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Prompt copied to clipboard!");
  };

  // Filter prompts based on title and tags
  const filteredPrompts = prompts.filter(
    (p: Prompt) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterTags.length === 0 ||
        filterTags.every((tag) =>
          p.tags.map((t) => t.toLowerCase()).includes(tag)
        ))
  );

  // Filter tags for autocomplete (only when user starts typing)
  const filteredTags = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
      !filterTags.includes(tag.toLowerCase())
  );

  const languageDisplay = (source: string, output: string) => {
    if (source === output) {
      return languages[source as LanguageCode] || source;
    } else {
      return `from ${languages[source as LanguageCode] || source} to ${
        languages[output as LanguageCode] || output
      }`;
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Prompt Library</h1>

      {/* Search by title and add tags */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="relative w-64">
          <Input
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
          />
          {tagInput && filteredTags.length > 0 && (
            <div className="absolute bg-white border mt-1 w-full max-h-40 overflow-y-auto z-10">
              {filteredTags.map((tag) => (
                <div
                  key={tag}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Display selected filter tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {filterTags.map((tag) => (
          <span
            key={tag}
            className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button onClick={() => handleRemoveTag(tag)}>✕</button>
          </span>
        ))}
      </div>

      {/* Display filtered prompts */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPrompts.map((prompt, index) => (
          <Card key={index} className="p-4">
            <CardContent>
              <h2 className="text-xl font-semibold">{prompt.title}</h2>
              <p className="text-sm text-gray-500">
                Language:{" "}
                {languageDisplay(prompt.languageInput, prompt.languageOutput)}
              </p>
              <p className="mt-2">{prompt.prompt}</p>
              <div className="mt-2 flex gap-2">
                {prompt.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-600 px-2 py-1 rounded cursor-pointer"
                    onClick={() => handleAddTag(tag.toLowerCase())}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="mt-2"
                onClick={() => copyToClipboard(prompt.prompt)}
              >
                Copy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
