import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './styles.css';

const API_URL = "http://localhost:8000/atividades/";

const Activities = () => {
    const [name, setName] = useState("");
    const [activity, setActivity] = useState("");
    const [status, setStatus] = useState("");
    const [endDate, setEndDate] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate(); // Hook para navegação

    const currentDate = new Date().toISOString().split('T')[0];

    const handleAddActivity = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (name.trim() !== "" && activity.trim() !== "" && status.trim() !== "") {
            if (endDate && endDate < currentDate) {
                setMessage("A data final não pode ser anterior à data atual!");
            } else {
                try {
                    const response = await axios.post(API_URL, {
                        nome_pessoa: name,
                        atividade: activity,
                        status: status,
                        data_inicial: currentDate,
                        data_final: endDate || null
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    setMessage("Atividade adicionada com sucesso!");
                    setName("");
                    setActivity("");
                    setStatus("");
                    setEndDate("");

                    console.log("Atividade adicionada:", response.data);
                } catch (error) {
                    console.error("Erro ao adicionar atividade:", error);
                    setMessage("Erro ao adicionar atividade!");
                }
            }
        } else {
            setMessage("Por favor, preencha todos os campos!");
        }
    };

    return (
        <center>
            <div className="login-box">
                <img src={require('assets/img/activities.png')} alt="activities Logo" className='logo-data-login' />
                <h2 className="login">Lista de Atividades</h2>
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleAddActivity} className='login-form'>
                    <div className='input-group'>
                        <label htmlFor="name">Nome da pessoa:</label>
                        <input id="name" type="text" placeholder="Nome da pessoa" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="activity">Atividade</label>
                        <input id="activity" type="text" placeholder="Atividade" value={activity} onChange={(e) => setActivity(e.target.value)} />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="status">Status</label>
                        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">Selecione o status</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Em progresso">Em progresso</option>
                            <option value="Concluída">Concluída</option>
                        </select>
                    </div>
                    <div className='input-group'>
                        <label htmlFor="endDate">Data Final</label>
                        <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <button type="submit" className='btn btn-primary'>Adicionar Atividade</button>
                </form>

                <button onClick={() => navigate("/atividades")} className="btn btn-primary">
                    Consultar Atividades
                </button>
            </div>
        </center>
    );
};

export default Activities;
