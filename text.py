import cv2
import easyocr
import os
import time
import sys
import json
import google.generativeai as genai

sys.stdout.reconfigure(encoding='utf-8')

DOWNLOADS_FOLDER = r"C:\Users\HP\Downloads"
PRESCRIPTION_FILE = r"C:\Users\HP\OneDrive\Desktop\h\medicine-delivery\public\prescriptionList.json"  # Stores extracted medicine details

def get_latest_image(folder):
    """Gets the most recently added image in the folder."""
    files = [f for f in os.listdir(folder) if f.endswith((".jpg", ".png", ".jpeg"))]
    if not files:
        return None
    latest_file = max(files, key=lambda f: os.path.getctime(os.path.join(folder, f)))
    return os.path.join(folder, latest_file)

def perform_ocr(image_path):
    """Extracts text from the given image using EasyOCR."""
    reader = easyocr.Reader(['en'], gpu=False)
    image = cv2.imread(image_path)
    
    if image is None:
        print("Error: Failed to load image.")
        return ""

    results = reader.readtext(image)
    extracted_text = " ".join([text for (_, text, _) in results])
    print(extracted_text)
    return extracted_text

def extract_medicine_details(text, api_key):
    """Uses Gemini AI to extract medicine details from the extracted text."""
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = (
    "Extract only the medicine names and their dosages from the given text. "
    "Output each medicine in this exact format: Medicine - Dosage (Timing). "
    "Do not include any additional explanations, disclaimers, or unnecessary text. "
    "Strictly return only the medicine list without extra sentences.\n\n"
    f"Text: {text}"
)

    
    response = model.generate_content(prompt)
    return response.text.split("\n")  # Convert response into list format

def save_to_json(data, filename):
    """Clears the existing JSON file and writes new medicine details."""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)  # Overwrite file with new data
        print("✅ Prescription list updated successfully.")
    except Exception as e:
        print("❌ Error saving JSON:", e)


if __name__ == "__main__":
    print("Watching for new prescription images...")

    last_processed = None  # Stores the last processed image

    while True:
        latest_image = get_latest_image(DOWNLOADS_FOLDER)

        if latest_image and latest_image != last_processed:
            print(f"New prescription detected: {latest_image}")
            
            extracted_text = perform_ocr(latest_image)
            if extracted_text:
                api_key = "AIzaSyCfSG8HLebBXbXjMGye-KHshkaR7dwHLmo"
                medicine_details = extract_medicine_details(extracted_text, api_key)

                print("\nExtracted Medicine Details:")
                print(medicine_details)

                # Save extracted medicine details to JSON (React will use this)
                save_to_json(medicine_details, PRESCRIPTION_FILE)

            last_processed = latest_image  # Update last processed image

        time.sleep(5)  # Check for new images every 5 seconds
