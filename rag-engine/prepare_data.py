import pandas as pd
import os

# Load all 5 Excel files
files = {
    "symptoms": "../datasets/dataset.csv.xlsx",
    "severity": "../datasets/Symptom-severity.csv.xlsx", 
    "description": "../datasets/symptom_Description.csv.xlsx",
    "precaution": "../datasets/symptom_precaution.csv.xlsx",
    "layman": "../datasets/indian_symptom_dataset_layman_50plus_with_doctor.csv.xlsx"
}

all_text = []

for name, path in files.items():
    try:
        df = pd.read_excel(path)
        print(f"✅ Loaded {name}: {len(df)} rows")
        
        # Convert each row to text
        for _, row in df.iterrows():
            text = " | ".join(
                [f"{col}: {str(val)}" for col, val in row.items() if pd.notna(val)]
            )

            if text.strip():
                all_text.append(text)

    except Exception as e:
        print(f"❌ Error loading {name}: {e}")

# Create data folder
os.makedirs("data", exist_ok=True)

# Save everything into one text file
with open("data/health_knowledge.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(all_text))

print(f"\n✅ Total records processed: {len(all_text)}")
print("Saved to data/health_knowledge.txt")