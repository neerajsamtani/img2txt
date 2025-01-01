import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

if (!process.env.OPENAI_API_KEY) {
    console.error('Missing OpenAI API key')
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const images = formData.getAll('images')

        if (!images || images.length === 0) {
            return NextResponse.json(
                { error: 'No images provided' },
                { status: 400 }
            )
        }

        // Verify each file is an image
        const imageFiles = images.filter((file): file is File =>
            file instanceof File && file.type.startsWith('image/')
        )

        if (imageFiles.length === 0) {
            return NextResponse.json(
                { error: 'No valid image files found' },
                { status: 400 }
            )
        }

        // Process each image with OpenAI
        const results = await Promise.all(imageFiles.map(async (file) => {
            // Convert file to base64
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            const base64Image = buffer.toString('base64')

            // Call OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Transcribe the text in this image. Respect formatting and new lines. If it is a table, format it as a CSV. Do not include any other text or formatting like backticks or code blocks. Do not respond with anything else."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${file.type};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500
            })

            return {
                name: file.name,
                description: response.choices[0].message.content
            }
        }))

        return NextResponse.json({
            message: 'Analysis completed successfully',
            results
        })

    } catch (error) {
        console.error('Error processing the request:', error)
        return NextResponse.json(
            { error: 'Error processing the request: ' + error },
            { status: 500 }
        )
    }
}
