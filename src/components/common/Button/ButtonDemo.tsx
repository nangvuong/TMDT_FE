import React from 'react';
import { Button, ButtonGroup, IconButton, LinkButton} from '../Button'
import { Settings, Edit, Trash2, Heart, Save, X, Delete, ChevronDown, Plus } from 'lucide-react'

/**
 * Button Component Demo
 * Shows all available button variants, sizes, and states
 */
export const ButtonDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-black">Button Components</h1>
      <p className="text-gray-600 mb-12">Black, White & Gray Color Scheme with Lucide Icons</p>

      {/* Basic Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Button Variants</h2>
        <ButtonGroup spacing="md" fullWidth className="bg-white p-6 rounded-lg shadow-sm">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </ButtonGroup>
      </section>

      {/* Button Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Button Sizes</h2>
        <ButtonGroup spacing="md" className="bg-white p-6 rounded-lg shadow-sm">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </ButtonGroup>
      </section>

      {/* Button States */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Button States</h2>
        <ButtonGroup spacing="md" fullWidth className="bg-white p-6 rounded-lg shadow-sm">
          <Button variant="primary">Normal</Button>
          <Button variant="primary" isLoading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </ButtonGroup>
      </section>

      {/* Full Width Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Full Width Button</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-3">
          <Button variant="primary" fullWidth>
            <Save size={18} />
            Full Width Primary Button
          </Button>
          <Button variant="outline" fullWidth>
            <ChevronDown size={18} />
            Full Width Outline Button
          </Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Icon Buttons</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">Using Lucide React Icons</p>
          <ButtonGroup spacing="md">
            <IconButton
              variant="primary"
              size="md"
              icon={<Settings size={20} />}
              title="Settings"
            />
            <IconButton
              variant="secondary"
              size="md"
              icon={<Edit size={20} />}
              title="Edit"
            />
            <IconButton
              variant="danger"
              size="md"
              icon={<Trash2 size={20} />}
              title="Delete"
            />
            <IconButton
              variant="ghost"
              size="md"
              icon={<Heart size={20} />}
              title="Like"
            />
          </ButtonGroup>

          {/* Different Icon Button Sizes */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Icon Button Sizes</h3>
            <ButtonGroup spacing="md">
              <IconButton
                variant="primary"
                size="sm"
                icon={<Plus size={16} />}
                title="Small"
              />
              <IconButton
                variant="primary"
                size="md"
                icon={<Plus size={20} />}
                title="Medium"
              />
              <IconButton
                variant="primary"
                size="lg"
                icon={<Plus size={24} />}
                title="Large"
              />
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Button Group Variants */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Button Groups</h2>

        <div className="space-y-8">
          {/* Horizontal Group */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Horizontal Layout</h3>
            <ButtonGroup variant="horizontal" spacing="md">
              <Button variant="primary">
                <Save size={16} />
                Save
              </Button>
              <Button variant="outline">
                <X size={16} />
                Cancel
              </Button>
              <Button variant="danger">
                <Trash2 size={16} />
                Delete
              </Button>
            </ButtonGroup>
          </div>

          {/* Vertical Group */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-xs">
            <h3 className="text-lg font-semibold mb-4">Vertical Layout</h3>
            <ButtonGroup variant="vertical" spacing="md" fullWidth>
              <Button variant="primary" fullWidth>
                <Plus size={16} />
                Add Item
              </Button>
              <Button variant="secondary" fullWidth>
                <Edit size={16} />
                Edit
              </Button>
              <Button variant="outline" fullWidth>
                <ChevronDown size={16} />
                More Options
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Link Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Link Buttons</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div>
            <LinkButton variant="primary" href="/">
              <ChevronDown size={16} />
              Primary Link Button
            </LinkButton>
          </div>
          <div>
            <LinkButton variant="outline" href="/">
              <ChevronDown size={16} />
              Outline Link Button
            </LinkButton>
          </div>
          <div>
            <LinkButton variant="ghost" href="/">
              <ChevronDown size={16} />
              Ghost Link Button
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Usage Examples</h2>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-700">
          <pre className="text-sm font-mono">
{`// Import buttons and lucide icons
import { Button, IconButton, ButtonGroup, LinkButton } from '@/components/common/Button';
import { Save, Trash2, Edit, Plus } from 'lucide-react';

// Basic button with icon
<Button variant="primary" onClick={handleClick}>
  <Save size={18} />
  Save
</Button>

// Loading state
<Button variant="primary" isLoading>
  Processing...
</Button>

// Icon button with lucide-react
<IconButton 
  variant="primary" 
  icon={<Save size={20} />}
  onClick={handleSave}
  title="Save"
/>

// Button group with icons
<ButtonGroup spacing="md">
  <Button>
    <Save size={16} />
    Save
  </Button>
  <Button variant="outline">
    <X size={16} />
    Cancel
  </Button>
</ButtonGroup>

// Full width button
<Button variant="primary" fullWidth>
  <Plus size={18} />
  Submit Form
</Button>

// Link button with icon
<LinkButton variant="primary" href="/dashboard">
  <ChevronRight size={16} />
  Go to Dashboard
</LinkButton>`}
          </pre>
        </div>
      </section>

      {/* Props Reference */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Props Reference</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="font-semibold pb-3 text-gray-900">Property</th>
                <th className="font-semibold pb-3 text-gray-900">Type</th>
                <th className="font-semibold pb-3 text-gray-900">Default</th>
                <th className="font-semibold pb-3 text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 font-mono text-gray-800">variant</td>
                <td className="text-gray-600">string</td>
                <td className="text-gray-600 font-mono">'primary'</td>
                <td>primary, secondary, danger, success, warning, outline, ghost</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 font-mono text-gray-800">size</td>
                <td className="text-gray-600">string</td>
                <td className="text-gray-600 font-mono">'md'</td>
                <td>xs, sm, md, lg, xl</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 font-mono text-gray-800">isLoading</td>
                <td className="text-gray-600">boolean</td>
                <td className="text-gray-600 font-mono">false</td>
                <td>Shows loading spinner</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 font-mono text-gray-800">fullWidth</td>
                <td className="text-gray-600">boolean</td>
                <td className="text-gray-600 font-mono">false</td>
                <td>Make button full width</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 font-mono text-gray-800">disabled</td>
                <td className="text-gray-600">boolean</td>
                <td className="text-gray-600 font-mono">false</td>
                <td>Disable button interaction</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ButtonDemo;
