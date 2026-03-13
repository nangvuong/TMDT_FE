import React, { useState } from 'react';
import Checkbox from './Checkbox';

/**
 * Checkbox Demo Component - Showcases checkbox variants and features
 */
const CheckboxDemo: React.FC = () => {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [preferences, setPreferences] = useState({
    email: false,
    sms: false,
    push: false,
  });

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkbox Component</h1>

      {/* Basic Checkbox */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Checkbox</h2>
        <div className="space-y-4 max-w-md">
          <Checkbox
            label="Remember me"
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
          />
          <Checkbox
            label="I agree to the terms"
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
          />
        </div>
      </section>

      {/* Checkbox Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sizes</h2>
        <div className="space-y-4 max-w-md">
          <Checkbox
            size="sm"
            label="Small checkbox"
            checked={checked1}
            onChange={(e) => setChecked1(e.target.checked)}
          />
          <Checkbox
            size="md"
            label="Medium checkbox (default)"
            checked={checked2}
            onChange={(e) => setChecked2(e.target.checked)}
          />
          <Checkbox
            size="lg"
            label="Large checkbox"
            checked={checked3}
            onChange={(e) => setChecked3(e.target.checked)}
          />
        </div>
      </section>

      {/* Checkbox with Helper Text */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">With Helper & Error Text</h2>
        <div className="space-y-6 max-w-md">
          <Checkbox
            label="Subscribe to newsletter"
            helperText="Get updates about new products and features"
          />
          <Checkbox
            label="Accept terms and conditions"
            error="You must accept the terms to continue"
          />
        </div>
      </section>

      {/* Disabled Checkbox */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disabled State</h2>
        <div className="space-y-4 max-w-md">
          <Checkbox
            label="Disabled unchecked"
            disabled
          />
          <Checkbox
            label="Disabled checked"
            checked
            disabled
            onChange={() => {}}
          />
        </div>
      </section>

      {/* Checkbox Group */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Checkbox Group</h2>
        <div className="max-w-md">
          <p className="text-sm font-medium text-gray-900 mb-4">Select your preferences:</p>
          <div className="space-y-3">
            <Checkbox
              label="Email notifications"
              checked={preferences.email}
              onChange={(e) =>
                setPreferences({ ...preferences, email: e.target.checked })
              }
            />
            <Checkbox
              label="SMS notifications"
              checked={preferences.sms}
              onChange={(e) =>
                setPreferences({ ...preferences, sms: e.target.checked })
              }
            />
            <Checkbox
              label="Push notifications"
              checked={preferences.push}
              onChange={(e) =>
                setPreferences({ ...preferences, push: e.target.checked })
              }
            />
          </div>
        </div>
      </section>

      {/* Form Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Form Example</h2>
        <div className="max-w-md bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Registration</h3>
          <form className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Interests:</p>
              <div className="space-y-3">
                <Checkbox label="Technology" />
                <Checkbox label="Business" />
                <Checkbox label="Sports" />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-3">Communication:</p>
              <div className="space-y-3">
                <Checkbox
                  label="Subscribe to newsletter"
                  helperText="Weekly updates"
                />
                <Checkbox
                  label="Marketing emails"
                  helperText="Promotions and offers"
                />
              </div>
            </div>

            <Checkbox
              label="I agree to terms and conditions"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              error={!termsAccepted ? 'Please accept terms to continue' : ''}
            />

            <button
              type="submit"
              disabled={!termsAccepted}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Register
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
                <td className="py-3 text-gray-700">Checkbox label text</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">error</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Error message to display</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">size</td>
                <td className="py-3 text-gray-700">'sm' | 'md' | 'lg'</td>
                <td className="py-3 text-gray-700">Checkbox size (default: 'md')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">helperText</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Helper text below checkbox</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">checked</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Checkbox checked state</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">disabled</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Disable checkbox</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default CheckboxDemo;
