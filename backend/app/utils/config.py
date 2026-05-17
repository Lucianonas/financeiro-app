from datetime import timedelta

# Chave secreta para gerar os tokens JWT
SECRET_KEY = "financeiro-app-chave-secreta-2024-mude-em-producao"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 horas