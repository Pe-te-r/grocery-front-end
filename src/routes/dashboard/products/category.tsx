import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { getAllSubcategoryByCategory } from '@/api/category'
import { useState } from 'react'
import { Pen, Trash2, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateHookSubcategory, useGetCategoryHook } from '@/hooks/subCategoryHook'
import { CategoryTable } from '@/components/category/CategoryTable'
import { EditCategoryModal } from '@/components/category/EditCategory'
import { CreateCategoryModal } from '@/components/category/CreateCategory'

export const Route = createFileRoute('/dashboard/products/category')({
  component: CategoryManagement,
})

type Category = {
  id: string
  name: string
}

type Subcategory = {
  id: string
  name: string
}

function CategoryManagement() {
  const { data: categories, isLoading, error, refetch } = useGetCategoryHook()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentEditCategory, setCurrentEditCategory] = useState<Category | null>(null)

  if (isLoading) return <div className="p-4">Loading categories...</div>
  if (error) return <div className="p-4 text-red-500">Error loading categories</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <CategoryTable
        categories={categories?.data || []}
        onSelectCategory={(category) => {
          setSelectedCategory(category)
          setIsModalOpen(true)
        }}
        refetch={() => refetch()}
        onEditCategory={(category) => {
          setCurrentEditCategory(category)
          setIsEditModalOpen(true)
        }}
      />

      {/* Subcategory Modal */}
      <AnimatePresence>
        {isModalOpen && selectedCategory && (
          <SubcategoryModal
            category={selectedCategory}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Create Category Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateCategoryModal onClose={() => setIsCreateModalOpen(false)} refetch={() => refetch()} />
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentEditCategory && (
          <EditCategoryModal
            category={currentEditCategory}
            onClose={() => setIsEditModalOpen(false)}
            refetch={() => refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function SubcategoryModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const { data: subcategories, isLoading,refetch } = useQuery({
    queryKey: ['categories', category.id],
    queryFn: () => getAllSubcategoryByCategory(category.id),
  });
  const mutate = useCreateHookSubcategory()
  // State for managing new subcategories input
  const [newSubcategories, setNewSubcategories] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubcategories = () => {
    setIsAdding(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Split the input by commas or new lines and trim whitespace
    const subcategoriesArray = newSubcategories
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    console.log({
      categoryId: category.id,
      subcategories: subcategoriesArray
    });
    mutate.mutate({ categoryId: category.id, names: subcategoriesArray },
      {
        onSuccess: (data) => {
          console.log('data on success', data)
          setNewSubcategories('');
          refetch()
          setIsAdding(false);
          
        }
      }
    )

    // Here you would typically call an API to save the subcategories
    // For now, we'll just log them and reset the form
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            Subcategories for {category.name}
          </h2>
          <button onClick={onClose} className="text-white hover:text-green-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading subcategories...</div>
          ) : subcategories?.data?.length ? (
            <ul className="space-y-3">
              {subcategories.data.map((sub: Subcategory) => (
                <li
                  key={sub.id}
                  className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <span className="font-medium text-green-800">{sub.name}</span>
                  <div className="flex gap-2">
                    <button className="p-1 text-green-600 hover:text-green-800">
                      <Pen size={16} />
                    </button>
                    <button className="p-1 text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No subcategories found for this category
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            {!isAdding ? (
              <button
                onClick={handleAddSubcategories}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                Add Subcategory
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subcategories" className="block text-sm font-medium text-gray-700 mb-1">
                    Add Subcategories
                  </label>
                  <textarea
                    id="subcategories"
                    value={newSubcategories}
                    onChange={(e) => setNewSubcategories(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Enter subcategories, separated by commas or new lines"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Separate multiple subcategories with commas or new lines.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Save Subcategories
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewSubcategories('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}