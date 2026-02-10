'use client';

import React from "react"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface ImportPreview {
  assetName: string;
  type: string;
  serialNumber: string;
  status: 'valid' | 'invalid';
  message?: string;
}

export default function BulkImport() {
  const [isDragging, setIsDragging] = useState(false);
  const [importStep, setImportStep] = useState<'upload' | 'preview' | 'complete'>('upload');
  const [previewData, setPreviewData] = useState<ImportPreview[]>([]);
  const [fileName, setFileName] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    // Mock file processing
    const mockPreview: ImportPreview[] = [
      {
        assetName: 'iPhone 15 Pro',
        type: 'Phone',
        serialNumber: 'SN-IP15-001',
        status: 'valid',
      },
      {
        assetName: 'Dell XPS 15',
        type: 'Laptop',
        serialNumber: 'SN-DX15-001',
        status: 'valid',
      },
      {
        assetName: 'Samsung Galaxy S24',
        type: 'Phone',
        serialNumber: 'SN-SG24-001',
        status: 'valid',
      },
      {
        assetName: 'MacBook Pro',
        type: 'Laptop',
        serialNumber: '',
        status: 'invalid',
        message: 'Serial number is required',
      },
      {
        assetName: 'Vodafone SIM',
        type: 'SIM Card',
        serialNumber: 'SN-VF-005',
        status: 'valid',
      },
    ];
    setPreviewData(mockPreview);
    setImportStep('preview');
  };

  const handleImport = () => {
    setImportStep('complete');
  };

  const handleReset = () => {
    setImportStep('upload');
    setPreviewData([]);
    setFileName('');
  };

  const validCount = previewData.filter((item) => item.status === 'valid').length;
  const invalidCount = previewData.filter((item) => item.status === 'invalid').length;

  return (
    <div className=" space-y-4">
      {importStep === 'upload' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Bulk Import Assets</CardTitle>
            <CardDescription>
              Upload a CSV file to import multiple assets at once. Download the template below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Template Download */}
            <div className="p-4 bg-muted rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">CSV Template</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download a sample CSV template with the correct format and headers
                  </p>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download Template
                </Button>
              </div>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/50'
              }`}
            >
              <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {isDragging ? 'Drop your CSV file here' : 'Drag and drop your CSV file'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <input
                type="file"
                id="csv-upload"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => document.getElementById('csv-upload')?.click()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Select CSV File
              </Button>
            </div>

            {/* Requirements */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Required Columns</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Asset Name (required)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Asset Type: Phone, Laptop, SIM Card (required)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Serial Number (required)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Manufacturer (optional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Model (optional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Purchase Date (optional)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Cost (optional)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {importStep === 'preview' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Import Preview</CardTitle>
            <CardDescription>
              Review the data before importing. {validCount} valid records, {invalidCount} issues found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Records</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                  {previewData.length}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg dark:bg-green-950 border border-green-200 dark:border-green-800">
                <div className="text-sm text-green-600 dark:text-green-400">Valid</div>
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                  {validCount}
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg dark:bg-red-950 border border-red-200 dark:border-red-800">
                <div className="text-sm text-red-600 dark:text-red-400">Issues</div>
                <div className="text-2xl font-bold text-red-900 dark:text-red-100 mt-1">
                  {invalidCount}
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="border border-border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Asset Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Serial Number</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="border-b border-border hover:bg-muted/50">
                      <td className="px-4 py-3">{item.assetName}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">{item.type}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm">{item.serialNumber}</td>
                      <td className="px-4 py-3">
                        {item.status === 'valid' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-600 dark:text-green-400 text-sm">Valid</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <span className="text-red-600 dark:text-red-400 text-sm">{item.message}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Choose Different File
              </Button>
              <Button
                onClick={handleImport}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Import {validCount} Assets
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {importStep === 'complete' && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Import Completed</CardTitle>
            <CardDescription>
              Your assets have been successfully imported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-200">Success!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                {validCount} assets have been added to your inventory. {invalidCount > 0 && `${invalidCount} records were skipped due to errors.`}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Import Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total Imported</div>
                  <div className="text-2xl font-bold text-foreground mt-1">{validCount}</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="text-lg font-semibold text-foreground mt-1">Today</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-sm text-muted-foreground">File</div>
                  <div className="text-lg font-semibold text-foreground mt-1 truncate">{fileName}</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setImportStep('upload');
                  setPreviewData([]);
                  setFileName('');
                }}
              >
                Import Another File
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Asset Master
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
