"use client";

import { useState } from "react";
import { X, Upload, FileText, Loader2, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { useBulkUploadAdminProducts } from "@/hooks/useProduct";
import { toast } from "sonner";

export default function BulkProductModal({ isOpen, onClose }: any) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const bulkMutation = useBulkUploadAdminProducts();

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

        try {
          const formattedProducts = rawData.map((item) => {
            // 1. Handle the stringified JSON array in the image column
            let parsedImages = [];
            try {
              if (item.image) {
                // Remove extra spaces/newlines and parse
                const cleanImageString = item.image.trim();
                parsedImages = JSON.parse(cleanImageString);
              }
            } catch (e) {
              console.error("Image parsing failed for:", item.name, e);
              parsedImages = []; // Fallback to empty array
            }

            return {
              name: item.name?.trim(),
              image: Array.isArray(parsedImages) ? parsedImages : [],
              category: item.category?.trim(),
              subCategory: item.subCategory?.trim(),
              unit: item.unit?.trim(),
              stock: Number(item.stock) || 0,
              price: Number(item.price) || 0,
              discount: Number(item.discount) || 0,
              description: item.description?.trim() || "",
              publish: item.publish?.toUpperCase() === "TRUE",
              more_details: {}, // Backend expects this
            };
          });

          // 2. Validate essential fields
          const validProducts = formattedProducts.filter(
            (p) => p.name && p.price > 0 && p.category
          );

          if (validProducts.length === 0) {
            toast.error("No valid products found. Check column headers.");
            return;
          }

          // 3. Send to API
          await bulkMutation.mutateAsync(validProducts);
          setFile(null);
          onClose();
        } catch (error) {
          console.error("Bulk Upload Logic Error:", error);
          toast.error("Failed to process data. Check console.");
        } finally {
          setIsParsing(false);
        }
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Bulk Upload Products</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs text-amber-700 space-y-1">
              <p><strong>Required Columns:</strong> name, image, category, subCategory, unit, price, stock, description, publish</p>
              <p>The <strong>image</strong> column must be a JSON array of URLs.</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-green-500 hover:bg-green-50 transition-all relative">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-12 h-12 text-green-600 mb-2" />
                <p className="text-sm font-medium">{file.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">Upload Products CSV</p>
                <p className="text-xs text-gray-500 mt-1">Drag and drop your file here</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 border rounded-xl font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              disabled={!file || isParsing || bulkMutation.isPending}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium flex justify-center items-center gap-2 hover:bg-green-700 disabled:opacity-50"
            >
              {(isParsing || bulkMutation.isPending) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Upload Inventory"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}