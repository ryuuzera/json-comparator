'use client';
import { Button } from '@/components/ui';
import { useState } from 'react';

export default function HomeClient() {
  const [json1, setJson1] = useState<string>('');
  const [json2, setJson2] = useState<string>('');
  const [differences, setDifferences] = useState<any>({
    missing: [],
    types: [],
    values: [],
  });

  const handleFileUpload = (event, setJson) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      setJson(e.target.result);
    };

    reader.readAsText(file);
  };

  const compareJSON = (obj1, obj2, path = '') => {
    let differences: any = {
      missing: [],
      types: [],
      values: [],
    };

    for (let key in obj2) {
      if (!obj1.hasOwnProperty(key)) {
        differences.missing.push(<p key={`missing-${path}${key}`}>{`${path}${key}`}</p>);
      } else if (typeof obj2[key] === 'object' && obj2[key] !== null) {
        if (typeof obj1[key] !== 'object' || obj1[key] === null) {
          differences.types.push(<p key={`types-${path}${key}`}>{`${path}${key}`}</p>);
        } else {
          const nestedDifferences = compareJSON(obj1[key], obj2[key], `${path}${key}.`);
          differences.missing = differences.missing.concat(nestedDifferences.missing);
          differences.types = differences.types.concat(nestedDifferences.types);
          differences.values = differences.values.concat(nestedDifferences.values);
        }
      } else if (obj1[key] !== obj2[key]) {
        differences.values.push(
          <p key={`values-${path}${key}`}>{`${path}${key}: Primeiro JSON: ${obj1[key]}, Segundo JSON: ${obj2[key]}`}</p>
        );
      }
    }

    return differences;
  };

  const handleCompare = () => {
    if (!json1 || !json2) {
      alert('obrigatorio carregar os dois arquivos');
      return;
    }
    const obj1 = JSON.parse(json1);
    const obj2 = JSON.parse(json2);
    const diffs = compareJSON(obj1, obj2);
    setDifferences(diffs);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>JSON Comparator</h1>
      <div className='mb-4'>
        <label className='block text-gray-700'>Upload JSON 1:</label>
        <input
          type='file'
          accept='.json'
          onChange={(e) => handleFileUpload(e, setJson1)}
          className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700'>Upload JSON 2:</label>
        <input
          type='file'
          accept='.json'
          onChange={(e) => handleFileUpload(e, setJson2)}
          className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none'
        />
      </div>
      <Button onClick={handleCompare} className='bg-purple-800 text-white'>
        Compare
      </Button>

      {(differences.missing.length > 0 || differences.types.length > 0 || differences.values.length > 0) && (
        <div className='mt-4 max-h-[600px] overflow-x-auto bg-gray-950 text-white rounded-sm p-3 font-mono'>
          {/* <h1 className='text-sm font-bold text-white'>Differences:</h1> */}
          <ul className='list-none pl-5 '>
            {differences.missing.length > 0 && (
              <li>
                <h3 className='text-sm font-bold text-red-500'>Propriedades Ausentes no primeiro JSON:</h3>
                {differences.missing.map((diff, index) => (
                  <div key={index} className='flex items-start'>
                    {`❌ `}
                    {diff}
                  </div>
                ))}
              </li>
            )}
            {differences.types.length > 0 && (
              <li>
                <h3 className='text-sm font-bold  text-red-500'>Tipos Diferentes:</h3>
                {differences.types.map((diff, index) => (
                  <div key={index} className='flex items-start'>
                    {`❌ `}
                    {diff}
                  </div>
                ))}
              </li>
            )}
            {differences.values.length > 0 && (
              <li>
                <h3 className='text-sm font-bold  text-red-500'>Valores Divergentes:</h3>
                {differences.values.map((diff, index) => (
                  <div key={index} className='flex items-start'>
                    {`❌ `}
                    {diff}
                  </div>
                ))}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
