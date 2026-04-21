"use client";

import { useState } from "react";
import { X, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { useBulkUploadSubCategory } from "@/hooks/useSubCategory";
import { toast } from "sonner";

export default function BulkSubCategoryModal({ isOpen, onClose }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const bulkMutation = useBulkUploadSubCategory();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setIsParsing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rawData: any[] = results.data;

        const formattedData = rawData
          .filter((item) => item.name && item.category)
          .map((item) => ({
            name: item.name.trim(),
            image: item.image?.trim() || "",
            category: item.category?.trim(), 
          }));

        if (formattedData.length === 0) {
          toast.error("No valid data found in CSV. Ensure 'name' and 'category' columns exist.");
          setIsParsing(false);
          return;
        }

        try {
          await bulkMutation.mutateAsync(formattedData);
          setFile(null);
          onClose();
        } catch (error) {
          console.error(error);
        } finally {
          setIsParsing(false);
        }
      },
      error: (error) => {
        toast.error("Error parsing CSV file");
        setIsParsing(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Bulk Upload Sub-Categories</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Your CSV must contain <strong>name</strong>, <strong>image</strong>, and <strong>category</strong> (ID) columns. 
              The category column must contain valid MongoDB Object IDs.
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-green-500 hover:bg-green-50 transition-all relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-12 h-12 text-green-600 mb-2" />
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">Click to upload CSV</p>
                <p className="text-xs text-gray-500">Only .csv files are supported</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2.5 border rounded-xl font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || isParsing || bulkMutation.isPending}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              {(isParsing || bulkMutation.isPending) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Start Upload"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}