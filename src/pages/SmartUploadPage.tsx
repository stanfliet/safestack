import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function SmartUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<{ file: string; status: string; message: string }[]>([]);
  const [category, setCategory] = useState('inspection');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...dropped]);
  }, []);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadAll = async () => {
    setUploading(true);
    setResults([]);
    const output: { file: string; status: string; message: string }[] = [];

    for (const file of files) {
      try {
        const ext = file.name.split('.').pop();
        const path = `${category}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage.from('uploads').upload(path, file);
        if (error) throw error;

        // AI classification stub — could call edge function here
        output.push({ file: file.name, status: 'uploaded', message: `Saved to ${path}` });
      } catch (err: any) {
        output.push({ file: file.name, status: 'error', message: err.message });
      }
    }

    setResults(output);
    setFiles([]);
    setUploading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Smart Upload</h1>
      <p className="text-gray-600 mb-6">
        Drag and drop files, or click to browse. Supported: PDF, JPG, PNG, DOCX.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border rounded p-2 w-full max-w-xs"
        >
          <option value="inspection">Inspection</option>
          <option value="incident">Incident Report</option>
          <option value="certificate">Certificate</option>
          <option value="contractor">Contractor</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => document.getElementById('file-input')?.click()}
      >
        {files.length === 0 ? (
          <p className="text-gray-500">Drop files here, or click to browse</p>
        ) : (
          <p className="text-blue-600">{files.length} file(s) selected</p>
        )}
      </div>
      <input
        id="file-input"
        type="file"
        multiple
        onChange={handleSelect}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx,.csv"
      />

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Selected Files</h3>
          {files.map((f, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-100 px-3 py-2 rounded">
              <span className="text-sm truncate">{f.name} ({(f.size / 1024).toFixed(1)} KB)</span>
              <button onClick={() => removeFile(i)} className="text-red-500 text-sm hover:underline">Remove</button>
            </div>
          ))}
          <button
            onClick={uploadAll}
            disabled={uploading}
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
          </button>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Results</h3>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">File</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={r.status === 'error' ? 'bg-red-50' : 'bg-green-50'}>
                  <td className="border p-2">{r.file}</td>
                  <td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
