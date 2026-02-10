'use client';

import React from "react"

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AssetCreationProps {
  assetManager: any;
}

export default function AssetCreation({ assetManager }: AssetCreationProps) {
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseDate: '',
    cost: '',
    supplier: '',
    warrantyPeriod: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.assetName || !formData.assetType || !formData.serialNumber) {
      setStatus('error');
      setMessage('Please fill in all required fields');
      return;
    }

    // Create asset using the hook
    try {
      assetManager.createAsset({
        name: formData.assetName,
        type: formData.assetType,
        serialNumber: formData.serialNumber,
        manufacturer: formData.manufacturer,
        model: formData.model,
        purchaseDate: formData.purchaseDate,
        cost: formData.cost,
        supplier: formData.supplier,
        warrantyPeriod: formData.warrantyPeriod,
        notes: formData.notes,
        status: 'active',
      });

      setStatus('success');
      setMessage(`Asset "${formData.assetName}" created successfully!`);
      
      // Reset form
      setTimeout(() => {
        setFormData({
          assetName: '',
          assetType: '',
          serialNumber: '',
          manufacturer: '',
          model: '',
          purchaseDate: '',
          cost: '',
          supplier: '',
          warrantyPeriod: '',
          notes: '',
        });
        setStatus('idle');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage('Error creating asset. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Create New Asset</CardTitle>
          <CardDescription>
            Add a new asset to the inventory. All required fields must be completed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status Messages */}
            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-green-800 dark:text-green-200">{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-800 dark:text-red-200">{message}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetName" className="text-foreground">
                    Asset Name *
                  </Label>
                  <Input
                    id="assetName"
                    name="assetName"
                    placeholder="e.g., iPhone 15 Pro"
                    value={formData.assetName}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetType" className="text-foreground">
                    Asset Type *
                  </Label>
                  <Select value={formData.assetType} onValueChange={(value) => handleSelectChange('assetType', value)}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="sim-card">SIM Card</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber" className="text-foreground">
                    Serial Number *
                  </Label>
                  <Input
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="e.g., SN-ABC123"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer" className="text-foreground">
                    Manufacturer
                  </Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    placeholder="e.g., Apple"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="text-foreground">
                    Model
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    placeholder="e.g., iPhone 15 Pro Max"
                    value={formData.model}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate" className="text-foreground">
                    Purchase Date
                  </Label>
                  <Input
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Financial Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost" className="text-foreground">
                    Cost
                  </Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    placeholder="0.00"
                    value={formData.cost}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-foreground">
                    Supplier
                  </Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    placeholder="Supplier name"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod" className="text-foreground">
                    Warranty Period (months)
                  </Label>
                  <Input
                    id="warrantyPeriod"
                    name="warrantyPeriod"
                    type="number"
                    placeholder="12"
                    value={formData.warrantyPeriod}
                    onChange={handleChange}
                    className="bg-input"
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Additional Information</h3>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-foreground">
                  Notes
                </Label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any additional notes about this asset..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    assetName: '',
                    assetType: '',
                    serialNumber: '',
                    manufacturer: '',
                    model: '',
                    purchaseDate: '',
                    cost: '',
                    supplier: '',
                    warrantyPeriod: '',
                    notes: '',
                  });
                  setStatus('idle');
                }}
              >
                Clear
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Asset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
