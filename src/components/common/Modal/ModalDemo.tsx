import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from '../Button';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Modal Demo Component - Showcases all modal variants and features
 */
const ModalDemo: React.FC = () => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [sizeSmOpen, setSizeSmOpen] = useState(false);
  const [sizeLgOpen, setSizeLgOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [customHeaderOpen, setCustomHeaderOpen] = useState(false);

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Modal Component</h1>

      {/* Basic Modal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Modal</h2>
        <Button onClick={() => setBasicOpen(true)}>Open Basic Modal</Button>
        <Modal
          isOpen={basicOpen}
          title="Welcome"
          onClose={() => setBasicOpen(false)}
        >
          <p className="text-gray-700 mb-4">
            This is a basic modal dialog with a title, content, and close button.
          </p>
          <p className="text-gray-600">
            You can close this modal by clicking the X button, clicking outside the modal, or pressing Escape.
          </p>
        </Modal>
      </section>

      {/* Modal Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Modal Sizes</h2>
        <div className="flex gap-4">
          <Button onClick={() => setSizeSmOpen(true)} variant="secondary">
            Small Modal
          </Button>
          <Button onClick={() => setSizeLgOpen(true)} variant="secondary">
            Large Modal
          </Button>
        </div>

        <Modal
          isOpen={sizeSmOpen}
          title="Small Modal"
          onClose={() => setSizeSmOpen(false)}
          size="sm"
        >
          <p className="text-gray-700">
            This is a small modal with limited width. Perfect for simple dialogs and confirmations.
          </p>
        </Modal>

        <Modal
          isOpen={sizeLgOpen}
          title="Large Modal"
          onClose={() => setSizeLgOpen(false)}
          size="lg"
        >
          <p className="text-gray-700 mb-4">
            This is a large modal with more width. Great for forms and detailed content.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Feature 1</p>
              <p className="text-xs text-gray-600">Description</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Feature 2</p>
              <p className="text-xs text-gray-600">Description</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Feature 3</p>
              <p className="text-xs text-gray-600">Description</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Feature 4</p>
              <p className="text-xs text-gray-600">Description</p>
            </div>
          </div>
        </Modal>
      </section>

      {/* Confirmation Modal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Confirmation Modal</h2>
        <Button onClick={() => setConfirmOpen(true)} variant="danger">
          Show Confirmation
        </Button>

        <Modal
          isOpen={confirmOpen}
          title="Delete Item"
          onClose={() => setConfirmOpen(false)}
          size="sm"
          footer={
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setConfirmOpen(false);
                  alert('Item deleted!');
                }}
              >
                Delete
              </Button>
            </div>
          }
        >
          <div className="flex gap-4">
            <AlertCircle size={24} className="text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium text-gray-900 mb-2">
                Are you sure you want to delete this item?
              </p>
              <p className="text-sm text-gray-600">
                This action cannot be undone. The item will be permanently removed.
              </p>
            </div>
          </div>
        </Modal>
      </section>

      {/* Form Modal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Modal with Form</h2>
        <Button onClick={() => setFormOpen(true)} variant="secondary">
          Open Form Modal
        </Button>

        <Modal
          isOpen={formOpen}
          title="Edit Profile"
          onClose={() => setFormOpen(false)}
          size="md"
          footer={
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setFormOpen(false);
                  alert('Profile updated!');
                }}
              >
                Save Changes
              </Button>
            </div>
          }
        >
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bio
              </label>
              <textarea
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-5"
              />
            </div>
          </form>
        </Modal>
      </section>

      {/* Custom Header Modal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Custom Header Modal</h2>
        <Button onClick={() => setCustomHeaderOpen(true)} variant="secondary">
          Open Custom Modal
        </Button>

        <Modal
          isOpen={customHeaderOpen}
          onClose={() => setCustomHeaderOpen(false)}
          header={
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Success!</h2>
                <p className="text-sm text-gray-600">Your action was completed</p>
              </div>
            </div>
          }
        >
          <div className="py-2">
            <p className="text-gray-700">
              Your changes have been saved successfully. You can safely close this modal now.
            </p>
          </div>
        </Modal>
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
                <td className="py-3 text-gray-700">isOpen</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Control modal visibility</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">title</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Modal header title</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">onClose</td>
                <td className="py-3 text-gray-700">() =&gt; void</td>
                <td className="py-3 text-gray-700">Callback when modal should close</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">children</td>
                <td className="py-3 text-gray-700">ReactNode</td>
                <td className="py-3 text-gray-700">Modal body content</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">size</td>
                <td className="py-3 text-gray-700">'sm' | 'md' | 'lg'</td>
                <td className="py-3 text-gray-700">Modal width size (default: 'md')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">closeButton</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Show close button (default: true)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">closeOnBackdropClick</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Close on backdrop click (default: true)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">closeOnEscape</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Close on Escape key (default: true)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">header</td>
                <td className="py-3 text-gray-700">ReactNode</td>
                <td className="py-3 text-gray-700">Custom header node (overrides title)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">footer</td>
                <td className="py-3 text-gray-700">ReactNode</td>
                <td className="py-3 text-gray-700">Footer content section</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ModalDemo;
