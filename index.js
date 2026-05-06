import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';


// Function to load and index the PDF document
async function indexDocument() {
    const PDF_PATH = './dsa.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    // console.log('Raw Documents:', rawDocs.length);
    console.log("Document loaded");



    // Chunking the document
    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    // console.log('Chunked Documents:', chunkedDocs.length);
    console.log("Chunking completed");




    /* Vector embedding model (chunks to vectors)
    This is where you would typically initialize your vector store and add the chunked documents
    */
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004",
    });
    console.log("Embedding model configured")



    /* Database configuration and storing the vectors
    Intialize Pinecone Client*/
    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    console.log("Pinecone configured")




    // Store the chunked documents in Pinecone
    await PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log("Data stored in Pinecone successfully");



}

indexDocument();