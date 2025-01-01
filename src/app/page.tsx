'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UpdateIcon } from "@radix-ui/react-icons"
import Image from 'next/image'
import { ChangeEvent, useState } from "react"

export default function Home() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<{ name: string; description: string }[]>([])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(selectedFiles)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      })

      if (response.ok) {
        window.location.reload() // Force a full page reload to trigger middleware
      }
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleConvert = async () => {
    setLoading(true);
    console.log('Processing files:', files);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Response from server:', result);
      setResults(result.results);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col p-8">
      <div className="flex justify-end mb-8">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-24"
        >
          Logout
        </Button>
      </div>

      <main className="flex flex-col items-center justify-center gap-6 w-full max-w-md mx-auto flex-grow">
        <h1 className="text-3xl font-bold">Image to Text Converter</h1>

        <div className="grid w-full gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
            multiple
            disabled={loading}
          />

          {files.length > 0 && (
            <p className="text-gray-600">{files.map(file => file.name).join(', ')}</p>
          )}

          <Button
            disabled={files.length === 0 || loading}
            onClick={handleConvert}
          >
            {loading ? <UpdateIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? 'Converting...' : 'Convert Images'}
          </Button>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative w-20 h-20">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 p-0"
                    onClick={() => {
                      setFiles(files.filter((_, i) => i !== index));
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid w-full gap-4">
          {results.map((result, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{result.name}</h2>
              <p className="text-gray-700">
                {result.description.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < result.description.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
