# Utiliser une image Python
FROM python:3.11

# Créer un dossier de travail
WORKDIR /app

# Copier requirements et installer dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le code (y compris app/)
COPY . .

# Lancer l’API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
