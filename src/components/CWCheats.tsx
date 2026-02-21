import { useEffect, useState } from "react";

export default function CWCheats() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/ULUS10391.ini")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ULUS10391.ini";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28]">
      <h1 className="text-2xl font-bold mb-4">CW Cheats</h1>
      <div className="mb-4">
        <button
          onClick={handleCopy}
          className="mr-2 px-4 py-2 bg-[#6B3E1B] text-[#F7E7D0] rounded hover:bg-[#5A3F28]"
        >
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-[#6B3E1B] text-[#F7E7D0] rounded hover:bg-[#5A3F28]"
        >
          Download
        </button>
      </div>
      <pre className="bg-white p-4 rounded shadow overflow-auto max-h-[70vh]">
        {content}
      </pre>
    </div>
  );
}
