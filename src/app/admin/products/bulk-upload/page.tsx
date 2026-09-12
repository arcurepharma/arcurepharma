"use client";

import { useState } from "react";
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface ParsedProduct {
  title: string;
  price: string;
  category: string;
  description: string;
  sku: string;
  imageUrl: string;
  stock: string;
  status: "pending" | "success" | "error";
  error?: string;
}

export default function BulkUploadPage() {
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const parsed: ParsedProduct[] = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index] || "";
      });

      return {
        title: product.title || product.name || "",
        price: product.price || "",
        category: product.category || "General",
        description: product.description || "",
        sku: product.sku || "",
        imageUrl: product.imageurl || product.image || "",
        stock: product.stock || "0",
        status: "pending" as const,
      };
    });

    setProducts(parsed);
  };

  const validateProduct = (product: ParsedProduct): { valid: boolean; error?: string } => {
    if (!product.title) return { valid: false, error: "Title is required" };
    if (!product.price || isNaN(parseFloat(product.price))) {
      return { valid: false, error: "Invalid price" };
    }
    if (!product.imageUrl) return { valid: false, error: "Image URL is required" };
    return { valid: true };
  };

  const handleBulkUpload = async () => {
    setUploading(true);

    // Validate and process each product
    const updatedProducts = products.map((product) => {
      const validation = validateProduct(product);
      if (!validation.valid) {
        return { ...product, status: "error" as const, error: validation.error };
      }

      // Simulate API call
      return { ...product, status: "success" as const };
    });

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setProducts(updatedProducts);
    setUploading(false);
  };

  const downloadTemplate = () => {
    const template = `title,price,category,description,sku,imageUrl,stock
ARCUDERM CS Serum,2999,Skincare,Restorative skincare serum,ACS-001,/jenpharm/hero-desktop.jpg,50
ARCU-CAL K2,1999,Supplements,Bone and joint support,ACK-002,/jenpharm/quiz-banner.jpg,30`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-upload-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const successCount = products.filter((p) => p.status === "success").length;
  const errorCount = products.filter((p) => p.status === "error").length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bulk Product Upload
        </h1>
        <p className="text-gray-500">
          Upload multiple products at once using CSV file
        </p>
      </div>

      {/* Instructions Card */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 border-2 border-blue-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          How to Upload Products
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 mb-4">
          <li>Download the CSV template below</li>
          <li>Fill in your product details in the template</li>
          <li>Upload the completed CSV file</li>
          <li>Review the parsed products and click "Upload All"</li>
        </ol>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-sm"
        >
          <Download className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-300 p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Upload CSV File
          </h3>
          <p className="text-gray-500 mb-6">
            Drag and drop or click to select a CSV file
          </p>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl cursor-pointer transition-all">
            <FileText className="w-5 h-5" />
            Choose File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preview Table */}
      {products.length > 0 && (
        <>
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Products Preview
                </h3>
                <p className="text-sm text-gray-500">
                  {products.length} products found in CSV
                </p>
              </div>
              {successCount === 0 && errorCount === 0 && (
                <button
                  onClick={handleBulkUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload All Products
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Stats */}
            {(successCount > 0 || errorCount > 0) && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-green-700 mb-1">Success</p>
                  <p className="text-2xl font-bold text-green-700">{successCount}</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-sm text-red-700 mb-1">Failed</p>
                  <p className="text-2xl font-bold text-red-700">{errorCount}</p>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {product.status === "pending" && (
                          <span className="text-gray-400">
                            <AlertCircle className="w-5 h-5" />
                          </span>
                        )}
                        {product.status === "success" && (
                          <span className="text-green-600">
                            <CheckCircle className="w-5 h-5" />
                          </span>
                        )}
                        {product.status === "error" && (
                          <span className="text-red-600" title={product.error}>
                            <XCircle className="w-5 h-5" />
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {product.title || <span className="text-red-500">Missing</span>}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {product.sku}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {product.price ? `Rs. ${product.price}` : <span className="text-red-500">Missing</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {product.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
