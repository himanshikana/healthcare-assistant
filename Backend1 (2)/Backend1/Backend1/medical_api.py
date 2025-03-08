import requests

def get_drug_info(drug_name):
    """Fetch drug information from OpenFDA API."""
    url = f"https://api.fda.gov/drug/label.json?search={drug_name}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Drug not found"}

def get_disease_info(disease_name):
    """Fetch disease symptoms from a public health API (e.g., WHO, CDC)."""
    url = f"https://disease-api.example.com/search?q={disease_name}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return {"error": "Disease info not found"}
