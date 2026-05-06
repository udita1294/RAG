import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';


// Function to load and index the PDF document
async function indexDocument() {
    const PDF_PATH = './dsa.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    // console.log('Raw Documents:', rawDocs.length);


    // Chunking the document
    const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    // console.log('Chunked Documents:', chunkedDocs.length);

}

indexDocument();