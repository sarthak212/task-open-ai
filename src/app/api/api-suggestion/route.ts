// pages/api/getSuggestions.js
import { NextResponse } from 'next/server';
import {  OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    const body = await req.json();
  const { title, description } = body;

  try {
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `Based on the following task title and description, suggest appropriate tags, and project only if perfectly alligned with text or description else leave it empty:
      
Title: ${title}
Description: ${description}
Available tags: frontend, backend, design, marketing, bug,
Available projects: crm, dashboard, api-integration

Provide the response in the following JSON format:
{
  "tags": ["...", "...", "..."],
  "project": "..."
}`,
      max_tokens: 150,
    });

    const suggestions = JSON.parse(completion.choices[0].text);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Error processing your request' });
  }
}