'use client'
import { useState } from 'react'
export default function ImageUploader() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploadStatus, setUploadStatus] = useState<string>('')

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const fileReader = new FileReader()
            fileReader.onload = () => {
                setPreviewUrl(fileReader.result as string)
            }
            fileReader.readAsDataURL(file)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('Please select an image first.')
            return
        }

        const formData = new FormData()
        formData.append('image', selectedFile)

        try {
            setUploadStatus('Uploading...')
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                setUploadStatus('Image uploaded successfully!')
            } else {
                setUploadStatus('Failed to upload image. Please try again.')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            setUploadStatus('An error occurred while uploading the image.')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4  text-black">Image Uploader</h2>
            <div className="mb-4">
                <label htmlFor="image-upload" className="block mb-2 text-black">Select an image:</label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                />
            </div>
            {previewUrl && (
                <div className="mb-4">
                    <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
                </div>
            )}
            <button onClick={handleUpload} className="w-full text-black">
                Upload Image
            </button>
            {uploadStatus && (
                <p className="mt-4 text-center text-sm font-medium text-green-600">
                    {uploadStatus}
                </p>
            )}
        </div>
    )
}
