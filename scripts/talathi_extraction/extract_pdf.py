import PyPDF2
import json

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
            
    with open('extracted_questions.txt', 'w', encoding='utf-8') as out:
        out.write(text)

extract_text_from_pdf('talathi_paper_1.pdf')
print("Extraction complete.")
