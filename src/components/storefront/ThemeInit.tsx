"use client";

import { useServerInsertedHTML } from "next/navigation";

export default function ThemeInit() {
  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `try{var t=localStorage.getItem("arcure_theme");document.documentElement.setAttribute("data-theme",t==="navy"?"navy":"green");}catch(e){}`,
      }}
    />
  ));

  return null;
}