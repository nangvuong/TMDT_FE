import React from 'react';
import { Button, IconButton, ButtonGroup, LinkButton } from '../Button';
import {
  Home,
  Settings,
  Edit,
  Trash2,
  Heart,
  Search,
  Menu,
  X,
  ShoppingCart,
  User,
  LogOut,
  Plus,
  Check,
  AlertCircle,
  Download,
  Upload,
  Save,
  Eye,
  Lock,
  Bell,
} from 'lucide-react';

/**
 * Lucide React Icons Demo with Button Components
 * Shows how to integrate lucide-react icons with buttons
 */
export const IconsDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-2 text-black">Lucide React Icons + Buttons</h1>
      <p className="text-gray-600 mb-12">
        Complete integration guide for using lucide-react icons with button components
      </p>

      {/* Navigation Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Navigation Icons</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <ButtonGroup spacing="md">
            <Button variant="ghost">
              <Home size={18} />
              Home
            </Button>
            <Button variant="ghost">
              <Menu size={18} />
              Menu
            </Button>
            <Button variant="ghost">
              <Search size={18} />
              Search
            </Button>
            <Button variant="ghost">
              <Bell size={18} />
              Notifications
            </Button>
            <Button variant="ghost">
              <User size={18} />
              Profile
            </Button>
          </ButtonGroup>
        </div>
      </section>

      {/* Action Icons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Action Icons</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary">
                <Save size={16} />
                Save Changes
              </Button>
              <Button variant="primary">
                <Upload size={16} />
                Upload File
              </Button>
              <Button variant="primary">
                <Download size={16} />
                Download
              </Button>
              <Button variant="primary">
                <Plus size={16} />
                Add New
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-200">
              <Button variant="secondary">
                <Edit size={16} />
                Edit
              </Button>
              <Button variant="secondary">
                <Eye size={16} />
                View
              </Button>
              <Button variant="outline">
                <Lock size={16} />
                Secure
              </Button>
            </div>

            <div className="flex gap-3 flex-wrap pt-4 border-t border-gray-200">
              <Button variant="danger">
                <Trash2 size={16} />
                Delete
              </Button>
              <Button variant="outline">
                <X size={16} />
                Cancel
              </Button>
              <Button variant="primary">
                <Check size={16} />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Icon Button Showcase */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Icon Buttons (Toolbars)</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-4">Perfect for toolbars and compact layouts</p>
          <div className="space-y-4">
            {/* Toolbar 1 */}
            <div className="flex gap-2 p-3 bg-gray-50 rounded border border-gray-200">
              <IconButton variant="ghost" size="md" icon={<Home size={20} />} title="Home" />
              <IconButton variant="ghost" size="md" icon={<Search size={20} />} title="Search" />
              <IconButton variant="ghost" size="md" icon={<Edit size={20} />} title="Edit" />
              <IconButton variant="ghost" size="md" icon={<Save size={20} />} title="Save" />
              <div className="border-l border-gray-300 mx-1" />
              <IconButton variant="ghost" size="md" icon={<Settings size={20} />} title="Settings" />
              <IconButton variant="ghost" size="md" icon={<User size={20} />} title="Profile" />
              <IconButton variant="ghost" size="md" icon={<LogOut size={20} />} title="Logout" />
            </div>

            {/* Toolbar 2 - Dark */}
            <div className="flex gap-2 p-3 bg-gray-900 rounded">
              <IconButton variant="primary" size="md" icon={<Plus size={20} />} title="Add" />
              <IconButton variant="primary" size="md" icon={<Edit size={20} />} title="Edit" />
              <IconButton variant="primary" size="md" icon={<Trash2 size={20} />} title="Delete" />
              <div className="border-l border-gray-600 mx-1" />
              <IconButton variant="danger" size="md" icon={<AlertCircle size={20} />} title="Alert" />
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">E-commerce Example</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-4">
            {/* Product Card Actions */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Product Name</h3>
                  <p className="text-gray-600 text-sm">Product Description</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" fullWidth>
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
                <IconButton variant="ghost" size="md" icon={<Heart size={20} />} title="Like" />
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Checkout</h3>
              <ButtonGroup variant="vertical" spacing="md" fullWidth>
                <Button variant="primary" fullWidth>
                  <ShoppingCart size={16} />
                  Review Cart
                </Button>
                <Button variant="primary" fullWidth>
                  <Lock size={16} />
                  Proceed to Payment
                </Button>
                <Button variant="outline" fullWidth>
                  <X size={16} />
                  Continue Shopping
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Code */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Usage Code</h2>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-700">
          <pre className="text-sm font-mono">
{`// Import Button Components
import { Button, IconButton, ButtonGroup, LinkButton } from '@/components/common/Button';

// Import Icons from lucide-react
import { 
  Save, 
  Edit, 
  Trash2,
  ShoppingCart,
  Plus,
  Settings,
  Home,
  Search,
  User,
  LogOut
} from 'lucide-react';

// Button with Icon
<Button variant="primary">
  <Save size={16} />
  Save Changes
</Button>

// Icon Button (Toolbar)
<IconButton 
  variant="ghost"
  size="md"
  icon={<Settings size={20} />}
  title="Settings"
/>

// Button Group with Icons
<ButtonGroup spacing="md">
  <Button variant="primary">
    <Plus size={16} />
    Add Item
  </Button>
  <Button variant="outline">
    <Edit size={16} />
    Edit
  </Button>
  <Button variant="danger">
    <Trash2 size={16} />
    Delete
  </Button>
</ButtonGroup>

// Available Icon Sizes
<IconButton icon={<Save size={16} />} /> {/* Small */}
<IconButton icon={<Save size={20} />} /> {/* Medium */}
<IconButton icon={<Save size={24} />} /> {/* Large */}

// Icon List
// Home, Settings, Edit, Trash2, Heart, Search, Menu, X
// ShoppingCart, User, LogOut, Plus, Check, AlertCircle
// Download, Upload, Save, Eye, Lock, Bell, and 20+ more

// Full list: src/components/icons/index.ts`}
          </pre>
        </div>
      </section>

      {/* Icons List */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Available Lucide Icons</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Home', icon: Home },
            { name: 'Settings', icon: Settings },
            { name: 'Edit', icon: Edit },
            { name: 'Trash2', icon: Trash2 },
            { name: 'Heart', icon: Heart },
            { name: 'Search', icon: Search },
            { name: 'Menu', icon: Menu },
            { name: 'X', icon: X },
            { name: 'ShoppingCart', icon: ShoppingCart },
            { name: 'User', icon: User },
            { name: 'LogOut', icon: LogOut },
            { name: 'Plus', icon: Plus },
            { name: 'Check', icon: Check },
            { name: 'AlertCircle', icon: AlertCircle },
            { name: 'Download', icon: Download },
            { name: 'Upload', icon: Upload },
            { name: 'Save', icon: Save },
            { name: 'Eye', icon: Eye },
            { name: 'Lock', icon: Lock },
            { name: 'Bell', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 border border-gray-100">
                <Icon size={24} className="text-gray-900" />
                <span className="text-sm font-mono text-gray-600">{item.name}</span>
              </div>
            );
          })}
        </div>
        <p className="text-gray-600 text-sm mt-4">
          More icons available at{' '}
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 underline hover:text-gray-700"
          >
            lucide.dev
          </a>
        </p>
      </section>
    </div>
  );
};

export default IconsDemo;
