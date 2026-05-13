"use client";

import { toast } from "sonner";
import { useState } from "react";

export default function MyForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName: "general-will.pdf",
          outputFileName: "output.pdf",
          fields: { name, email, date },
          drawInstructions: [
            { key: "name", page: 0, x: 380, y: 650, size: 11 },
            { key: "email", page: 0, x: 380, y: 625, size: 11 },
            { key: "date", page: 0, x: 380, y: 600, size: 11 },
          ],
        }),
      });

      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md" dir="rtl">
      <label className="block text-sm font-medium">
        الاسم
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </label>
      <label className="block text-sm font-medium">
        البريد الإلكتروني
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="البريد الإلكتروني"
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </label>
      <label className="block text-sm font-medium">
        التاريخ
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
      >
        {loading ? "جاري الإنشاء..." : "Generate PDF"}
      </button>
    </form>
  );
}

