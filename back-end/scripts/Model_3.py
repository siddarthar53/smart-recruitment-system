#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import sys
import glob
import docx
import json
import PyPDF2
import pytesseract
import pdfplumber
from PIL import Image
from sentence_transformers import SentenceTransformer, util
import spacy
from rake_nltk import Rake
from keybert import KeyBERT
import re

# Load NLP models
nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT()
model = SentenceTransformer('all-MiniLM-L6-v2')

# Function to extract text from scanned PDFs (OCR)
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
                else:
                    img = page.to_image()
                    ocr_text = pytesseract.image_to_string(img)
                    text += ocr_text + "\n"
    except Exception as e:
        print(f"Error reading PDF {pdf_path}: {e}")
    return text.strip()

# Function to extract text from DOCX files
def extract_text_from_docx(docx_path):
    try:
        doc = docx.Document(docx_path)
        return "\n".join([para.text for para in doc.paragraphs]).strip()
    except Exception as e:
        print(f"Error reading DOCX {docx_path}: {e}")
        return ""

# Unified function to read files
def read_text_from_file(file_path):
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.lower().endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        print(f"Unsupported file format: {file_path}")
        return ""

# Function to process all resumes in a folder
def process_resumes_folder(folder_path):
    texts = {}
    for file_path in glob.glob(os.path.join(folder_path, "*")):
        text = read_text_from_file(file_path)
        if text:
            texts[file_path] = text
    return texts

# Extract key skills from job description using NLP methods
def extract_skills_from_job_desc(job_text):
    # Using Spacy NER
    doc = nlp(job_text)
    skills_ner = set(ent.text for ent in doc.ents if ent.label_ in ["ORG", "PRODUCT", "GPE"])

    # Using RAKE
    rake = Rake()
    rake.extract_keywords_from_text(job_text)
    skills_rake = set(rake.get_ranked_phrases()[:10])

    # Using KeyBERT
    skills_bert = set(kw[0] for kw in kw_model.extract_keywords(job_text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=10))

    # Combine results
    return skills_ner.union(skills_rake).union(skills_bert)

# Function to extract years of experience from text
def extract_years_of_experience(text):
    match = re.search(r'(\d+)\+?\s*years?', text, re.IGNORECASE)
    return int(match.group(1)) if match else 0

# Load job description & extract key skills


# Get file paths from command-line arguments
job_desc_file = sys.argv[1]  # Job description file path
resumes_folder = sys.argv[2]  # Resumes folder path


# job_desc_file = r"C:\Users\siddu\OneDrive\Desktop\Job Recruitment System\resume\job_desciption.docx"
# job_desc_file=r"C:\Users\siddu\OneDrive\Desktop\job_desciption.docx"
# resumes_folder = r"C:\Users\siddu\OneDrive\Desktop\sample-testing"

# print(f"Reading job description file: {job_desc_file}")
job_desc_text = read_text_from_file(job_desc_file)

if not job_desc_text:
    # print("Error: No valid job description text found.")
    exit(1)

# Extract required skills from job description
REQUIRED_SKILLS = extract_skills_from_job_desc(job_desc_text)
# print("\nExtracted Key Skills:", REQUIRED_SKILLS)

# Process resumes
resumes_texts = process_resumes_folder(resumes_folder)

if not resumes_texts:
    # print("Error: No valid resumes found in the folder.")
    exit(1)

# Encode job description
# print("\nEncoding job description...")
job_desc_embedding = model.encode(job_desc_text, convert_to_tensor=True)

# Compute similarity scores
resume_scores = {}

# print("\nProcessing resumes and calculating scores...")
for file, text in resumes_texts.items():
    resume_embedding = model.encode(text, convert_to_tensor=True)
    cosine_sim = util.cos_sim(job_desc_embedding, resume_embedding).item()

    # Match skills
    matched_skills = len(set(text.lower().split()).intersection(REQUIRED_SKILLS)) / len(REQUIRED_SKILLS)

    # Extract years of experience
    years_experience = extract_years_of_experience(text)

    # Final weighted score
    final_score = (0.6 * cosine_sim) + (0.3 * matched_skills) + (0.1 * years_experience / 10)
    file_name = os.path.basename(file)  # Extract just the filename
    resume_scores[file_name] = final_score

# Rank resumes
ranked_resumes = sorted(resume_scores.items(), key=lambda x: x[1], reverse=True)
# --- Final output only ---
print(json.dumps(resume_scores))  # No indent, no extra prints


# # Print results
# print("\nFinal Ranked Resumes:")
# for rank, (file, score) in enumerate(ranked_resumes, start=1):
#     print(f"{rank}. {file}: {score:.4f}")

# # Best match 
# best_match = ranked_resumes[0]
# print(f"\nMost Suitable Resume: {best_match[0]} with a similarity score of {best_match[1]:.4f}")


# In[ ]:




