import React, { useState } from 'react';
import Select from './Select';

/**
 * Select Demo Component - Showcases all select variants and features
 */
const SelectDemo: React.FC = () => {
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'in', label: 'India' },
    { value: 'br', label: 'Brazil' },
    { value: 'mx', label: 'Mexico' },
  ];

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'books', label: 'Books' },
    { value: 'sports', label: 'Sports & Outdoors' },
  ];

  const sizeOptions = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
    { value: 'xxl', label: '2XL' },
  ];

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Component</h1>

      {/* Basic Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Select</h2>
        <div className="max-w-md">
          <Select
            label="Select Country"
            options={countryOptions}
            placeholder="Choose a country..."
            value={country}
            onChange={(val) => setCountry(val as string)}
          />
        </div>
      </section>

      {/* Select Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sizes</h2>
        <div className="space-y-6 max-w-md">
          <Select
            inputSize="sm"
            label="Small Select"
            options={categoryOptions}
            placeholder="Small size"
          />
          <Select
            inputSize="md"
            label="Medium Select"
            options={categoryOptions}
            placeholder="Medium size (default)"
          />
          <Select
            inputSize="lg"
            label="Large Select"
            options={categoryOptions}
            placeholder="Large size"
          />
        </div>
      </section>

      {/* Select Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Variants</h2>
        <div className="space-y-6 max-w-md">
          <Select
            variant="default"
            label="Default Variant"
            options={sizeOptions}
            placeholder="Default style"
          />
          <Select
            variant="outline"
            label="Outline Variant"
            options={sizeOptions}
            placeholder="Outline style"
          />
          <Select
            variant="filled"
            label="Filled Variant"
            options={sizeOptions}
            placeholder="Filled style"
          />
        </div>
      </section>

      {/* Searchable Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Searchable Select</h2>
        <div className="max-w-md">
          <Select
            label="Search Country"
            options={countryOptions}
            placeholder="Type to search..."
            searchable
            value={country}
            onChange={(val) => setCountry(val as string)}
            helperText="Start typing to filter countries"
          />
        </div>
      </section>

      {/* Clearable Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Clearable Select</h2>
        <div className="max-w-md">
          <Select
            label="Select Category"
            options={categoryOptions}
            placeholder="Choose category..."
            clearable
            searchable
            value={category}
            onChange={(val) => setCategory(val as string)}
          />
        </div>
      </section>

      {/* Select with Helper & Error */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">With Helper & Error</h2>
        <div className="space-y-6 max-w-md">
          <Select
            label="Select Size"
            options={sizeOptions}
            placeholder="Choose size..."
            helperText="Choose your preferred size"
          />
          <Select
            label="Invalid Select"
            options={sizeOptions}
            placeholder="Choose size..."
            error="This field is required"
          />
        </div>
      </section>

      {/* Disabled Select */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disabled State</h2>
        <div className="max-w-md">
          <Select
            label="Disabled Select"
            options={countryOptions}
            placeholder="This select is disabled"
            disabled
          />
        </div>
      </section>

      {/* Full Width */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Full Width</h2>
        <Select
          label="Full Width Select"
          options={categoryOptions}
          placeholder="This select spans full width"
          fullWidth
          searchable
        />
      </section>

      {/* Form Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Example</h2>
        <div className="max-w-md bg-gray-50 p-6 rounded-lg">
          <form className="space-y-6">
            <Select
              label="Country"
              options={countryOptions}
              placeholder="Select your country..."
              searchable
              required
            />
            <Select
              label="Category"
              options={categoryOptions}
              placeholder="Choose a category..."
              required
            />
            <Select
              label="Size"
              options={sizeOptions}
              placeholder="Select your size..."
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-medium transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* Props Reference */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Props Reference</h2>
        <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="text-left font-semibold text-gray-900 py-2">Prop</th>
                <th className="text-left font-semibold text-gray-900 py-2">Type</th>
                <th className="text-left font-semibold text-gray-900 py-2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-700">label</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Label text above select</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">options</td>
                <td className="py-3 text-gray-700">Option[]</td>
                <td className="py-3 text-gray-700">Array of select options</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">error</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Error message to display</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">inputSize</td>
                <td className="py-3 text-gray-700">'sm' | 'md' | 'lg'</td>
                <td className="py-3 text-gray-700">Select size (default: 'md')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">variant</td>
                <td className="py-3 text-gray-700">'default' | 'outline' | 'filled'</td>
                <td className="py-3 text-gray-700">Style variant (default: 'default')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">searchable</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Enable search filter</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">clearable</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Show clear button</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">fullWidth</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Full width select</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">disabled</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Disable select</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SelectDemo;
