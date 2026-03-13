import React, { useState } from 'react';
import Slider from './Slider';

/**
 * Slider Demo Component - Showcases slider variants and features
 */
const SliderDemo: React.FC = () => {
  const [price, setPrice] = useState(50);
  const [volume, setVolume] = useState(60);
  const [brightness, setBrightness] = useState(75);
  const [temperature, setTemperature] = useState(20);
  const [discount, setDiscount] = useState(30);

  return (
    <div className="w-full bg-white p-8 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Slider Component</h1>

      {/* Basic Slider */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Slider</h2>
        <div className="max-w-md">
          <Slider
            label="Price Range"
            value={price}
            onChange={setPrice}
            min={0}
            max={100}
            showValue
            unit="$"
          />
        </div>
      </section>

      {/* Slider Sizes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sizes</h2>
        <div className="space-y-8 max-w-md">
          <Slider
            label="Small Slider"
            size="sm"
            value={price}
            onChange={setPrice}
            min={0}
            max={100}
            showValue
          />
          <Slider
            label="Medium Slider"
            size="md"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            showValue
            unit="%"
          />
          <Slider
            label="Large Slider"
            size="lg"
            value={brightness}
            onChange={setBrightness}
            min={0}
            max={100}
            showValue
            unit="%"
          />
        </div>
      </section>

      {/* Slider with Helper Text */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">With Helper & Error</h2>
        <div className="space-y-8 max-w-md">
          <Slider
            label="Volume"
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
            showValue
            helperText="Adjust audio volume"
            unit="%"
          />
          <Slider
            label="Invalid Range"
            value={10}
            onChange={() => {}}
            min={0}
            max={100}
            error="Value must be between 20 and 80"
          />
        </div>
      </section>

      {/* Slider with Custom Range */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Custom Ranges</h2>
        <div className="space-y-8 max-w-md">
          <Slider
            label="Temperature"
            value={temperature}
            onChange={setTemperature}
            min={-20}
            max={50}
            step={1}
            showValue
            unit="°C"
          />
          <Slider
            label="Discount"
            value={discount}
            onChange={setDiscount}
            min={0}
            max={100}
            step={5}
            showValue
            unit="%"
          />
        </div>
      </section>

      {/* Slider without Value Display */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Without Value Display</h2>
        <div className="max-w-md">
          <Slider
            label="Opacity"
            value={price}
            onChange={setPrice}
            min={0}
            max={100}
            showValue={false}
            helperText="Drag to adjust opacity"
          />
        </div>
      </section>

      {/* Disabled Slider */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Disabled State</h2>
        <div className="max-w-md">
          <Slider
            label="Disabled Slider"
            value={50}
            onChange={() => {}}
            disabled
            showValue
          />
        </div>
      </section>

      {/* Real-World Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Real-World Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audio Player */}
          <div className="max-w-md bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Audio Player</h3>
            <div className="space-y-6">
              <Slider
                label="Progress"
                value={volume}
                onChange={setVolume}
                min={0}
                max={100}
                showValue={false}
                helperText="1:30 / 3:45"
              />
              <Slider
                label="Volume"
                value={volume}
                onChange={setVolume}
                min={0}
                max={100}
                showValue
                unit="%"
              />
            </div>
          </div>

          {/* Image Editor */}
          <div className="max-w-md bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Image Editor</h3>
            <div className="space-y-6">
              <Slider
                label="Brightness"
                value={brightness}
                onChange={setBrightness}
                min={0}
                max={100}
                showValue
                unit="%"
              />
              <Slider
                label="Contrast"
                value={60}
                onChange={() => {}}
                min={0}
                max={100}
                showValue
                unit="%"
              />
              <Slider
                label="Saturation"
                value={80}
                onChange={() => {}}
                min={0}
                max={100}
                showValue
                unit="%"
              />
            </div>
          </div>

          {/* Price Filter */}
          <div className="max-w-md bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Filter</h3>
            <Slider
              label="Max Price"
              value={price}
              onChange={setPrice}
              min={0}
              max={1000}
              step={10}
              showValue
              unit="$"
              helperText="Filter products by maximum price"
            />
          </div>

          {/* Temperature Control */}
          <div className="max-w-md bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Temperature Control</h3>
            <Slider
              label="Thermostat"
              value={temperature}
              onChange={setTemperature}
              min={15}
              max={30}
              step={0.5}
              showValue
              unit="°C"
              helperText="Set your preferred temperature"
            />
          </div>
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
                <td className="py-3 text-gray-700">Slider label text</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">value</td>
                <td className="py-3 text-gray-700">number</td>
                <td className="py-3 text-gray-700">Current slider value</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">onChange</td>
                <td className="py-3 text-gray-700">(value: number) =&gt; void</td>
                <td className="py-3 text-gray-700">Change callback function</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">min</td>
                <td className="py-3 text-gray-700">number</td>
                <td className="py-3 text-gray-700">Minimum value (default: 0)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">max</td>
                <td className="py-3 text-gray-700">number</td>
                <td className="py-3 text-gray-700">Maximum value (default: 100)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">step</td>
                <td className="py-3 text-gray-700">number</td>
                <td className="py-3 text-gray-700">Step increment (default: 1)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">size</td>
                <td className="py-3 text-gray-700">'sm' | 'md' | 'lg'</td>
                <td className="py-3 text-gray-700">Slider size (default: 'md')</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">showValue</td>
                <td className="py-3 text-gray-700">boolean</td>
                <td className="py-3 text-gray-700">Show current value (default: true)</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">error</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Error message</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-700">helperText</td>
                <td className="py-3 text-gray-700">string</td>
                <td className="py-3 text-gray-700">Helper text below slider</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SliderDemo;
