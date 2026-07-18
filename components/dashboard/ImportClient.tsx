"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { importFromCSV } from "@/app/actions/testimonials";

const SAMPLE = `author_name,author_email,author_company,author_role,content,rating
Jane Doe,jane@example.com,Acme Inc,CEO,"Great product, highly recommend!",5
John Smith,john@example.com,Globex,CTO,"Helped us close more deals.",4`;

export default function ImportClient({
  workspaceId, workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const text = await file.text();
    setCsv(text);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!csv.trim()) { toast.error("Provide CSV content or upload a file"); return; }
    setLoading(true);
    setResult(null);
    const res = await importFromCSV(workspaceId, csv);
    setLoading(false);
    if (res.success) {
      setResult({ success: true, message: `Imported ${res.imported} testimonial${res.imported === 1 ? "" : "s"}.` });
      toast.success("Import complete");
      setCsv(""); setFileName("");
      router.refresh();
    } else {
      setResult({ success: false, message: res.error || "Import failed" });
      toast.error(res.error || "Import failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-md text-ink">Import testimonials</h1>
        <p className="font-body mt-1 text-muted">
          Bulk import testimonials for{" "}
          <span className="text-ink">{workspaceName}</span> from a CSV file. Imported testimonials start as <em>pending</em>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card-hairline p-6">
        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-hairline px-6 py-8">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-muted" />
            <label className="mt-3 block cursor-pointer font-body-sm text-accent hover:underline">
              {fileName ? fileName : "Click to upload a .csv file"}
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
            </label>
            <p className="font-caption mt-1 text-muted">or paste CSV below</p>
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="csv" className="font-body-sm block text-ink">CSV content</label>
          <textarea id="csv" value={csv} onChange={(e) => setCsv(e.target.value)} rows={8} placeholder={SAMPLE}
            className="input-field mt-1 font-mono text-xs" />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-1 px-3 py-2 font-caption text-muted">
          <FileText className="h-4 w-4" />
          Required columns: <code>author_name</code>, <code>content</code>. Optional: <code>author_email</code>, <code>author_company</code>, <code>author_role</code>, <code>rating</code>.
        </div>

        {result && (
          <div className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 font-body-sm ${result.success ? "bg-surface-2 text-success" : "bg-surface-1 text-muted"}`}>
            {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {result.message}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full justify-center">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {loading ? "Importing..." : "Import testimonials"}
        </button>
      </form>
    </div>
  );
}
