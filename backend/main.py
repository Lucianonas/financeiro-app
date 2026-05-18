from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from dotenv import load_dotenv

load_dotenv()

# Importa os models
from app.models import usuario, operacao, lancamento, darf

# Importa as rotas
from app.routes import auth, lancamentos, operacoes, dashboard

# Cria as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Financeiro App",
    description="Sistema completo de gestão financeira e IR",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas
app.include_router(auth.router)
app.include_router(lancamentos.router)
app.include_router(operacoes.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"status": "ok", "mensagem": "Backend funcionando!"}