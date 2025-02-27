import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './styles.css';

const API_URL = "http://localhost:8000/atividades/";

const EditActivity = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [name, setName] = useState<string>("");
    const [activity, setActivity] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const currentDate = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (id) {
            axios.get(`${API_URL}${id}`)
                .then((response) => {
                    const data = response.data;
                    setName(data.nome_pessoa);
                    setActivity(data.atividade);
                    setStatus(data.status);
                    setEndDate(data.data_final || "");
                })
                .catch((error) => {
                    console.error("Erro ao buscar atividade:", error);
                    setMessage("Erro ao carregar a atividade.");
                });
        }
    }, [id]);

    const handleEditActivity = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (name.trim() !== "" && activity.trim() !== "" && status.trim() !== "") {
            if (endDate && endDate < currentDate) {
                setMessage("A data final não pode ser anterior à data atual!");
            } else {
                try {
                    const response = await axios.put(`${API_URL}${id}`, {
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

                    setMessage("Atividade editada com sucesso!");
                    setName("");
                    setActivity("");
                    setStatus("");
                    setEndDate("");
                    console.log("Atividade editada:", response.data);

                    navigate("/atividades");
                } catch (error) {
                    console.error("Erro ao editar atividade:", error);
                    setMessage("Erro ao editar atividade!");
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
                <h2 className="login">Editar Atividade</h2>
                {message && <p className="message">{message}</p>}
                <form onSubmit={handleEditActivity} className='login-form'>
                    <div className='input-group'>
                        <label htmlFor="name">Nome da pessoa:</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nome da pessoa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="activity">Atividade</label>
                        <input
                            id="activity"
                            type="text"
                            placeholder="Atividade"
                            value={activity}
                            onChange={(e) => setActivity(e.target.value)}
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Pendente">Pendente</option>
                            <option value="Em progresso">Em progresso</option>
                            <option value="Concluída">Concluída</option>
                        </select>
                    </div>
                    <div className='input-group'>
                        <label htmlFor="endDate">Data Final</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button type="submit" className='btn btn-primary'>Salvar Alterações</button>
                    <button type="button" onClick={() => navigate("/atividades")} className="btn btn-secondary">Cancelar</button>
                </form>
            </div>
        </center>
    );
};

export default EditActivity;
