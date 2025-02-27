from datetime import date
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Date, Enum, create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import enum
import os

base_dir = os.path.dirname(os.path.abspath(__file__))

db_path = os.path.join(base_dir, "database", "dbactivity.db")

if not os.path.exists(os.path.dirname(db_path)):
    os.makedirs(os.path.dirname(db_path))

DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class StatusEnum(str, enum.Enum):
    pendente = "Pendente"
    em_progresso = "Em progresso"
    concluida = "Concluída"

class Atividade(Base):
    __tablename__ = "atividades"

    id = Column(Integer, primary_key=True, index=True)
    nome_pessoa = Column(String, nullable=False)
    atividade = Column(String, nullable=False)
    status = Column(Enum(StatusEnum), nullable=False)
    data_inicial = Column(Date, nullable=False, default=date.today)
    data_final = Column(Date, nullable=True)

# Criar tabelas
Base.metadata.create_all(bind=engine)

# Modelo Pydantic
from pydantic import BaseModel

class AtividadeCreate(BaseModel):
    nome_pessoa: str
    atividade: str
    status: StatusEnum
    data_inicial: Optional[date] = None
    data_final: Optional[date] = None

class AtividadeResponse(AtividadeCreate):
    id: int

    class Config:
        from_attributes = True

class AtividadeUpdate(BaseModel):
    nome_pessoa: Optional[str] = None
    atividade: Optional[str] = None
    status: Optional[StatusEnum] = None
    data_inicial: Optional[date] = None
    data_final: Optional[date] = None

# Dependência do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/atividades/", response_model=AtividadeResponse)
def criar_atividade(atividade: AtividadeCreate, db: Session = Depends(get_db)):
    if atividade.data_inicial is None:
        atividade.data_inicial = date.today()
    
    db_atividade = Atividade(**atividade.model_dump())
    db.add(db_atividade)
    db.commit()
    db.refresh(db_atividade)
    return db_atividade

@app.get("/atividades/", response_model=List[AtividadeResponse])
def listar_atividades(db: Session = Depends(get_db)):
    return db.query(Atividade).all()

@app.get("/atividades/{atividade_id}", response_model=AtividadeResponse)
def obter_atividade(atividade_id: int, db: Session = Depends(get_db)):
    atividade = db.query(Atividade).filter(Atividade.id == atividade_id).first()
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    return atividade

@app.put("/atividades/{atividade_id}", response_model=AtividadeResponse)
def atualizar_atividade(atividade_id: int, atividade_update: AtividadeUpdate, db: Session = Depends(get_db)):
    atividade = db.query(Atividade).filter(Atividade.id == atividade_id).first()
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    for key, value in atividade_update.dict(exclude_unset=True).items():
        setattr(atividade, key, value)
    
    db.commit()
    db.refresh(atividade)
    return atividade

@app.delete("/atividades/{atividade_id}")
def deletar_atividade(atividade_id: int, db: Session = Depends(get_db)):
    atividade = db.query(Atividade).filter(Atividade.id == atividade_id).first()
    if not atividade:
        raise HTTPException(status_code=404, detail="Atividade não encontrada")
    
    db.delete(atividade)
    db.commit()
    return {"message": "Atividade deletada com sucesso"}
