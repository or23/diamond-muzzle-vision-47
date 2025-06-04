import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DiamondInputField } from './form/DiamondInputField';
import { DiamondSelectField } from './form/DiamondSelectField';
import { DiamondFormActions } from './form/DiamondFormActions';
import { ImageUploadField } from './form/ImageUploadField';
import { CertificateUploadField } from './form/CertificateUploadField';
import { DiamondFormData } from './form/types';
import { shapes, colors, clarities, cuts, statuses, polishes, symmetries } from './form/diamondFormConstants';
import { Diamond } from './InventoryTable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface DiamondFormProps {
  diamond?: Diamond;
  onSubmit: (data: DiamondFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DiamondForm({ diamond, onSubmit, onCancel, isLoading = false }: DiamondFormProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<DiamondFormData>({
    defaultValues: diamond ? {
      stockNumber: diamond.stockNumber || '',
      shape: diamond.shape || 'Round',
      carat: diamond.carat || 1,
      color: diamond.color || 'G',
      clarity: diamond.clarity || 'VS1',
      cut: diamond.cut || 'Excellent',
      polish: diamond.polish || 'Excellent',
      symmetry: diamond.symmetry || 'Excellent',
      price: diamond.price || 0,
      status: diamond.status || 'Available',
      imageUrl: diamond.imageUrl || '',
      certificateUrl: diamond.certificateUrl || '',
    } : {
      stockNumber: '',
      carat: 1,
      price: 0,
      status: 'Available',
      imageUrl: '',
      certificateUrl: '',
      shape: 'Round',
      color: 'G',
      clarity: 'VS1',
      cut: 'Excellent',
      polish: 'Excellent',
      symmetry: 'Excellent'
    }
  });

  const currentShape = watch('shape');
  const isRoundShape = currentShape === 'Round';

  useEffect(() => {
    if (diamond && diamond.id) {
      console.log('Resetting form with diamond data:', diamond);
      reset({
        stockNumber: diamond.stockNumber || '',
        shape: diamond.shape || 'Round',
        carat: diamond.carat || 1,
        color: diamond.color || 'G',
        clarity: diamond.clarity || 'VS1',
        cut: diamond.cut || 'Excellent',
        polish: diamond.polish || 'Excellent',
        symmetry: diamond.symmetry || 'Excellent',
        price: diamond.price || 0,
        status: diamond.status || 'Available',
        imageUrl: diamond.imageUrl || '',
        certificateUrl: diamond.certificateUrl || '',
      });
    }
  }, [diamond?.id, reset]);

  const handleFormSubmit = (data: DiamondFormData) => {
    console.log('Form submitted with data:', data);
    
    // Validate required fields
    if (!data.stockNumber || data.stockNumber.trim() === '') {
      console.error('Stock number is required');
      return;
    }
    
    if (!data.carat || data.carat <= 0) {
      console.error('Valid carat weight is required');
      return;
    }
    
    if (!data.price || data.price <= 0) {
      console.error('Valid price is required');
      return;
    }
    
    const formattedData = {
      ...data,
      stockNumber: data.stockNumber.trim(),
      carat: Number(data.carat),
      price: Number(data.price),
      shape: data.shape || 'Round',
      color: data.color || 'G',
      clarity: data.clarity || 'VS1',
      cut: isRoundShape ? (data.cut || 'Excellent') : '',
      polish: data.polish || 'Excellent',
      symmetry: data.symmetry || 'Excellent',
      status: data.status || 'Available',
      imageUrl: data.imageUrl?.trim() || '',
      certificateUrl: data.certificateUrl?.trim() || '',
    };
    
    console.log('Formatted form data:', formattedData);
    onSubmit(formattedData);
  };

  const handleImageChange = (url: string) => {
    setValue('imageUrl', url);
  };

  const handleCertificateChange = (url: string) => {
    setValue('certificateUrl', url);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <ImageUploadField
            id="imageUrl"
            label="Diamond Image"
            value={watch('imageUrl')}
            onChange={handleImageChange}
          />
        </div>

        <div className="md:col-span-2">
          <CertificateUploadField
            id="certificateUrl"
            label="Certificate Upload"
            value={watch('certificateUrl')}
            onChange={handleCertificateChange}
          />
        </div>

        <DiamondInputField
          id="stockNumber"
          label="Stock Number"
          placeholder="Enter stock number"
          register={register}
          validation={{ required: 'Stock number is required' }}
          errors={errors}
        />

        <DiamondSelectField
          id="shape"
          label="Shape"
          value={watch('shape') || 'Round'}
          onValueChange={(value) => setValue('shape', value)}
          options={shapes}
        />

        <DiamondInputField
          id="carat"
          label="Carat"
          type="number"
          step="0.01"
          placeholder="Enter carat weight"
          register={register}
          validation={{ 
            required: 'Carat is required',
            min: { value: 0.01, message: 'Carat must be greater than 0' }
          }}
          errors={errors}
        />

        <DiamondSelectField
          id="color"
          label="Color"
          value={watch('color') || 'G'}
          onValueChange={(value) => setValue('color', value)}
          options={colors}
        />

        <DiamondSelectField
          id="clarity"
          label="Clarity"
          value={watch('clarity') || 'VS1'}
          onValueChange={(value) => setValue('clarity', value)}
          options={clarities}
        />

        {isRoundShape && (
          <DiamondSelectField
            id="cut"
            label="Cut"
            value={watch('cut') || 'Excellent'}
            onValueChange={(value) => setValue('cut', value)}
            options={cuts}
          />
        )}

        <DiamondSelectField
          id="polish"
          label="Polish"
          value={watch('polish') || 'Excellent'}
          onValueChange={(value) => setValue('polish', value)}
          options={polishes}
        />

        <DiamondSelectField
          id="symmetry"
          label="Symmetry"
          value={watch('symmetry') || 'Excellent'}
          onValueChange={(value) => setValue('symmetry', value)}
          options={symmetries}
        />

        <DiamondInputField
          id="price"
          label="Price ($)"
          type="number"
          placeholder="Enter price"
          register={register}
          validation={{ 
            required: 'Price is required',
            min: { value: 1, message: 'Price must be greater than 0' }
          }}
          errors={errors}
        />

        <DiamondSelectField
          id="status"
          label="Status"
          value={watch('status') || 'Available'}
          onValueChange={(value) => setValue('status', value)}
          options={statuses}
        />
      </div>

      {!isRoundShape && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
          <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription>
            Cut grade is only applicable for Round diamonds. For {currentShape} diamonds, please use Polish and Symmetry grades.
          </AlertDescription>
        </Alert>
      )}

      <DiamondFormActions
        diamond={diamond}
        isLoading={isLoading}
        onCancel={onCancel}
      />
    </form>
  );
}