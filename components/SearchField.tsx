"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    // This method and action attributes are written because, if we disable javascript in our browser then the "query" will directly attached to "http://localhost:3000/q=AdarshVemasani".
    // So, If we use them and set the link in action attribute, then the query will be like "http://localhost:3000/search?q=AdarshVemasani".
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
