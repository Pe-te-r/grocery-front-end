import { createFileRoute } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Upload, X, Loader2, Check, Image as ImageIcon } from 'lucide-react'
import { useGetCategoryHook } from '@/hooks/subCategoryHook'
import { getAllSubcategoryByCategory } from '@/api/category'
import { getUserIdHelper } from '@/lib/authHelper'
import type { ProductForm } from '@/util/types'


function AddProductPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | null>(null)

  // Fetch categories
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoryHook()

  // Fetch subcategories based on selected category
  const { data: subcategories, isLoading: isSubcategoriesLoading } = useQuery({
    queryKey: ['subcategories', selectedCategory],
    queryFn: () => getAllSubcategoryByCategory(selectedCategory),
    enabled: !!selectedCategory,
  })

  const form = useForm<ProductForm, any, any, any, any, any, any, any, any, any>({
    defaultValues: {
      createdBy: getUserIdHelper() ?? '',
      name: '',
      price: '',
      stock: '',
      description: '',
      isAvailable: true,
      category: '',
      subCategory: '',
      image: null,
    },
    onSubmit: async ({ value }) => {
      setIsUploading(true)

      try {
        // Prepare the image data
        let imageData = null
        if (value?.image instanceof File) {
          // For files, strip metadata and log the pure image data
          imageData = await getPureImageData(value.image)
          console.log('Pure image data:', imageData)
        } else if (typeof value.image === 'string') {
          // For URLs, just log the URL
          imageData = value.image
          console.log('Image URL:', value)
        }

        // Prepare the product data
        const productData = {
          ...value,
          price: parseFloat(value.price),
          stock: parseInt(value.stock),
          image: imageData
        }

        console.log('Product data to submit:', productData)


      } catch (error) {
        console.error('Error submitting product:', error)
        alert('Error submitting product')
      } finally {
        setIsUploading(false)
      }
    },
  })

  // Function to strip metadata from image and return pure image data
  const getPureImageData = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Create canvas to redraw image (strips metadata)
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not create canvas context'))
            return
          }
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/jpeg', 0.9)) // Convert to JPEG with 90% quality
        }
        img.onerror = () => reject(new Error('Image loading error'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('File reading error'))
      reader.readAsDataURL(file)
    })
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleImageSelection(files[0])
    }
  }

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageSelection(e.target.files[0])
    }
  }

  const handleImageSelection = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPEG, PNG, GIF)')
      return
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit')
      return
    }

    setUploadMethod('file')
    form.setFieldValue('image', file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url: string = e.target.value.trim()
    if (url) {
      // Basic URL validation
      try {
        new URL(url)
        setUploadMethod('url')
        form.setFieldValue('image', url)
        setImagePreview(url)
      } catch {
        alert('Please enter a valid URL')
      }
    } else {
      setUploadMethod(null)
      form.setFieldValue('image', null)
      setImagePreview(null)
    }
  }

  const removeImage = () => {
    setUploadMethod(null)
    form.setFieldValue('image', null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // const triggerFileInput = () => {
  //   fileInputRef.current?.click()
  // }

  const validateName = (value: string) => {
    if (!value) return 'Product name is required'
    if (value.length < 3) return 'Name must be at least 3 characters'
    return undefined
  }

  const validatePrice = (value: string) => {
    if (!value) return 'Price is required'
    const numValue = parseFloat(value)
    if (isNaN(numValue)) return 'Price must be a number'
    if (numValue <= 0) return 'Price must be greater than 0'
    return undefined
  }

  const validateStock = (value: string) => {
    if (!value) return 'Stock quantity is required'
    const numValue = parseInt(value)
    if (isNaN(numValue)) return 'Stock must be a number'
    if (numValue < 0) return 'Stock cannot be negative'
    return undefined
  }

  const validateCategory = (value: string) => {
    if (!value) return 'Category is required'
    return undefined
  }

  const validateSubCategory = (value: string) => {
    if (!value) return 'Subcategory is required'
    return undefined
  }

  const validateImage = (value: File | string | null) => {
    if (!value) return 'Product image is required'
    return undefined
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Add New Product</h2>
          <p className="text-gray-600">Fill in the details of your product</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          {/* Product Name */}
          <div>
            <form.Field
              name="name"
              validators={{ onChange: ({ value }) => validateName(value) }}
              children={(field) => (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${field.state.meta.errors.length > 0
                      ? 'border-red-500'
                      : 'border-gray-300'
                      }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="price"
              validators={{ onChange: ({ value }) => validatePrice(value) }}
              children={(field) => (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (KES) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">KES</span>
                    </div>
                    <input
                      id="price"
                      name="price"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`block w-full pl-12 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${field.state.meta.errors.length > 0
                        ? 'border-red-500'
                        : 'border-gray-300'
                        }`}
                      placeholder="0.00"
                    />
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="stock"
              validators={{ onChange: ({ value }) => validateStock(value) }}
              children={(field) => (
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${field.state.meta.errors.length > 0
                      ? 'border-red-500'
                      : 'border-gray-300'
                      }`}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="category"
              validators={{ onChange: ({ value }) => validateCategory(value) }}
              children={(field) => (
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value)
                        setSelectedCategory(e.target.value)
                        form.setFieldValue('subCategory', '') // Reset subcategory when category changes
                      }}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${field.state.meta.errors.length > 0
                        ? 'border-red-500'
                        : 'border-gray-300'
                        }`}
                      disabled={isCategoriesLoading}
                    >
                      <option value="">Select a category</option>
                      {Array.isArray(categories?.data) &&
                        categories.data?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                    {isCategoriesLoading && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            />

            <form.Field
              name="subCategory"
              validators={{ onChange: ({ value }) => validateSubCategory(value) }}
              children={(field) => (
                <div>
                  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${field.state.meta.errors.length > 0
                        ? 'border-red-500'
                        : 'border-gray-300'
                        }`}
                      disabled={!selectedCategory || isSubcategoriesLoading}
                    >
                      <option value="">Select a subcategory</option>
                      {Array.isArray(subcategories?.data) &&
                        subcategories.data?.map((subcategory) => (
                          <option key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </option>
                        ))}
                    </select>
                    {isSubcategoriesLoading && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="mt-1 text-sm text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Description */}
          <div>
            <form.Field
              name="description"
              children={(field) => (
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              )}
            />
          </div>

          {/* Availability */}
          <div>
            <form.Field
              name="isAvailable"
              children={(field) => (
                <div className="flex items-center">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    checked={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-700">
                    Product is available for sale
                  </label>
                </div>
              )}
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image <span className="text-red-500">*</span>
            </label>

            {/* Upload Method Toggle */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('url')
                  form.setFieldValue('image', '')
                  setImagePreview(null)
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${uploadMethod === 'url'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
              >
                Paste Image URL
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMethod('file')
                  form.setFieldValue('image', null)
                  setImagePreview(null)
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${uploadMethod === 'file'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
              >
                Upload Image File
              </button>
            </div>

            {/* Image URL Input (shown when URL method is selected) */}
            {uploadMethod === 'url' && (
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg"
                    onChange={handleImageUrlChange}
                    value={typeof form.state.values.image === 'string' ? form.state.values.image : ''}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="ml-2 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter a direct image URL (e.g., ends with .jpg, .png)
                </p>
              </div>
            )}

            {/* File Upload (shown when file method is selected) */}
            {uploadMethod === 'file' && (
              <div
                className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-1 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageInputChange}
                            ref={fileInputRef}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Image Preview (shown when image is selected) */}
            {imagePreview && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Image Preview</h3>
                <div className="border rounded-md p-2 flex items-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mr-2" />
                  <div className="truncate flex-1">
                    {uploadMethod === 'file' && form.state.values.image instanceof File ? (
                      <>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {form.state.values.image.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(form.state.values.image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {typeof form.state.values.image === 'string' ? form.state.values.image : 'Image'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Image validation error */}
            <form.Subscribe
              selector={(state) => state.values.image}
              children={(image) => {
                const error = validateImage(image)
                return error ? (
                  <p className="mt-1 text-sm text-red-500">{error}</p>
                ) : null
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export const Route = createFileRoute('/dashboard/products/add')({
  component: AddProductPage,
})