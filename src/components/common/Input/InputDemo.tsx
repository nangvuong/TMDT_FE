import React, { useState } from 'react';
import Input from './Input';
import { Mail, Lock, Search, MapPin, Phone } from 'lucide-react';

/**
 * Input Demo Component - Showcases all input variants, sizes, and states
 */
const InputDemo: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Input Component</h1>

      {/* Basic Inputs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Inputs</h2>
        <div className="space-y-6 max-w-md">
          <Input
            label="Full Name"
            placeholder="Enter your name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            helperText="We'll never share your email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            helperText="At least 8 characters"
          />
        </div>
      </section>

      {/* Input Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sizes</h2>
        <div className="space-y-6 max-w-md">
          <Input
            inputSize="sm"
            label="Small Input"
            placeholder="Small size"
          />
          <Input
            inputSize="md"
            label="Medium Input"
            placeholder="Medium size (default)"
          />
          <Input
            inputSize="lg"
            label="Large Input"
            placeholder="Large size"
          />
        </div>
      </section>

      {/* Input Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Variants</h2>
        <div className="space-y-6 max-w-md">
          <Input
            variant="default"
            label="Default Variant"
            placeholder="Default style"
          />
          <Input
            variant="outline"
            label="Outline Variant"
            placeholder="Outline style"
          />
          <Input
            variant="filled"
            label="Filled Variant"
            placeholder="Filled style"
          />
        </div>
      </section>

      {/* Inputs with Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">With Icons</h2>
        <div className="space-y-6 max-w-md">
          <Input
            label="Email with Icon"
            placeholder="your@email.com"
            startIcon={<Mail size={18} />}
          />
          <Input
            label="Password with Icon"
            type="password"
            placeholder="Enter password"
            startIcon={<Lock size={18} />}
          />
          <Input
            label="Search"
            placeholder="Search products..."
            startIcon={<Search size={18} />}
          />
          <Input
            label="Location"
            placeholder="Enter location"
            startIcon={<MapPin size={18} />}
            endIcon={<Phone size={18} />}
          />
        </div>
      </section>

      {/* Error States */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Error States</h2>
        <div className="space-y-6 max-w-md">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value="invalid-email"
            error="Invalid email address"
            onChange={() => {}}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            value="short"
            error="Password must be at least 8 characters"
            onChange={() => {}}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowError(!showError)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              {showError ? 'Clear Error' : 'Show Error'}
            </button>
          </div>
          {showError && (
            <Input
              label="Phone Number"
              type="tel"
              placeholder="(123) 456-7890"
              startIcon={<Phone size={18} />}
              error="This phone number is already registered"
            />
          )}
        </div>
      </section>

      {/* Disabled State */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disabled State</h2>
        <div className="space-y-6 max-w-md">
          <Input
            label="Disabled Input"
            placeholder="This input is disabled"
            disabled
          />
          <Input
            label="Disabled with Value"
            placeholder="Disabled"
            value="Cannot edit this"
            disabled
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Full Width */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Full Width</h2>
        <div className="space-y-6">
          <Input
            label="Full Width Input"
            placeholder="This input spans the full width"
            fullWidth
          />
          <Input
            label="Full Width with Helper"
            placeholder="Enter something..."
            fullWidth
            helperText="This input is full width with helper text"
          />
        </div>
      </section>

      {/* Form Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Example</h2>
        <div className="max-w-md bg-gray-50 p-6 rounded-lg">
          <form className="space-y-6">
            <Input
              label="Full Name"
              placeholder="John Doe"
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              startIcon={<Phone size={18} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              helperText="At least 8 characters with uppercase and numbers"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-medium transition-colors"
            >
              Sign Up
            </button>
          </form>
        </div>
      </section>

      {/* Props Reference */}
      <section className="mb-8">
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
                <td className="py-3 text-gray-700">Label text above input</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">error</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Error message to display</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">size</td>
                <td className="py-3 text-gray-700">'sm' | 'md' | 'lg'</td>
                <td className="py-3 text-gray-700">Input size (default: 'md')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">variant</td>
                <td className="py-3 text-gray-700">'default' | 'outline' | 'filled'</td>
                <td className="py-3 text-gray-700">Input style variant (default: 'default')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">helperText</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Helper text below input</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">startIcon</td>
                <td className="py-3 text-gray-700">ReactNode</td>
                <td className="py-3 text-gray-700">Icon at start of input</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">endIcon</td>
                <td className="py-3 text-gray-700">ReactNode</td>
                <td className="py-3 text-gray-700">Icon at end of input</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">fullWidth</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Make input full width</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">disabled</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Disable input</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default InputDemo;
