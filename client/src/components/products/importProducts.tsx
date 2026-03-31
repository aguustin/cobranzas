import { useState, useRef } from "react";
import {
  Upload, FileSpreadsheet, X, ArrowRight,
  Table2, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";

interface SelectedFile { name: string; size: number; raw: File; }

const ExcelUploader = () => {
  const [file, setFile] = useState<SelectedFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (b: number) => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;

  const handleFile = (f: File) => {
    setFile({ name: f.name, size: f.size, raw: f });
    setToast(null);
    setProgress(0);
  };

  const clearFile = () => { setFile(null); setToast(null); setProgress(0); };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setToast(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file.raw);
    console.log(file.raw)
    try {
      // Simulated progress — replace XHR with your real endpoint
      await new Promise<void>((resolve) => {
        let p = 0;
        const iv = setInterval(() => {
          p += Math.random() * 20;
          if (p >= 90) { p = 90; clearInterval(iv); resolve(); }
          setProgress(Math.min(Math.round(p), 90));
        }, 180);
      });

      setProgress(100);
      setToast({ type: "success", msg: "Productos importados correctamente al catálogo." });
    } catch {
      setToast({ type: "error", msg: "Error al subir el archivo. Verificá el formato e intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  };

  const exampleRows = [
    { id: 1, producto: "Vestido Lino Midi",     precio: 89990,  ventas: 142, stock: 38 },
    { id: 2, producto: "Blazer Oversize Camel", precio: 124990, ventas: 97,  stock: 15 },
    { id: 3, producto: "Jeans Tiro Alto",        precio: 69990,  ventas: 310, stock: 72 },
    { id: 4, producto: "Top Canalé Blanco",      precio: 34990,  ventas: 255, stock: 90 },
  ];

  return (
    <div className="min-h-[90vh] bg-[#030712] text-[rgba(248,248,248,0.87)] font-sans flex items-center justify-center p-6">
      <div className="w-full ">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-1">Inventario</p>
          <h1 className="text-2xl font-semibold tracking-tight">Importar Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Carga masiva de productos desde un archivo Excel</p>
        </div>

        {/* Card */}
        <div className="w-full bg-[#0d1117] border border-[#1f2937] rounded-2xl overflow-hidden">
          <div className="p-6 space-y-5">

            {/* Drop Zone */}
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 group border-gray-600
                ${dragging ? "border-indigo-500/60 bg-indigo-500/5" : "border-[#1f2937] hover:border-indigo-500/40 hover:bg-indigo-500/5"}`}
            >
              <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#161b22] border border-[#1f2937] flex items-center justify-center group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all">
                  <Upload size={22} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Arrastra tu archivo aquí</p>
                  <p className="text-xs text-gray-500 mt-1">o haz clic para buscar</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {[".xlsx", ".xls", ".csv"].map((ext) => (
                    <span key={ext} className="text-xs bg-[#161b22] border border-[#1f2937] text-gray-400 px-2 py-0.5 rounded-md font-mono">{ext}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* File selected */}
            {file && (
              <div className="flex items-center gap-3 bg-[#161b22] border border-[#1f2937] rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <FileSpreadsheet size={17} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatBytes(file.size)}</p>
                </div>
                <button onClick={clearFile} className="p-1.5 rounded-lg hover:bg-[#1f2937] text-gray-500 hover:text-red-400 transition-colors">
                  <X size={15} />
                </button>
              </div>
            )}

            {/* Progress */}
            {loading && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Subiendo archivo…</span>
                  <span className="text-xs text-indigo-400 font-medium">{progress}%</span>
                </div>
                <div className="h-1 bg-[#1f2937] rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* Toast */}
            {toast && (
              <div className={`flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium border
                ${toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                {toast.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {toast.msg}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-600" />
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Formato del Excel</span>
              <div className="flex-1 h-px bg-gray-600" />
            </div>

            {/* Table */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Table2 size={13} className="text-indigo-400" />
                <span className="text-xs font-semibold tracking-wide uppercase text-indigo-400">Ejemplo de estructura</span>
              </div>

              <div className="border border-[#1f2937] rounded-xl overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <thead className="bg-[#161b22]">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-medium text-gray-600 w-8">#</th>
                      {["Producto","Precio","Ventas","Stock"].map((h, i) => (
                        <th key={h} className={`px-4 py-2.5 font-semibold text-indigo-400 tracking-wide uppercase text-[10px] ${i > 0 ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]">
                    {exampleRows.map((row) => (
                      <tr key={row.id} className="hover:bg-[#161b22] transition-colors">
                        <td className="px-4 py-2.5 text-gray-600">{row.id}</td>
                        <td className="px-4 py-2.5">{row.producto}</td>
                        <td className="px-4 py-2.5 text-right font-medium tabular-nums">{row.precio.toLocaleString("es-CL")}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-400">{row.ventas}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-400">{row.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {loading ? "Procesando archivo…" : "Subir productos al catálogo"}
            </button>

          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          La primera fila del archivo debe contener los encabezados exactos de las columnas
        </p>
      </div>
    </div>
  );
}

export default ExcelUploader