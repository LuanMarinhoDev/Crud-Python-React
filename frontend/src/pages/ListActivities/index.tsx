import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const API_URL = "http://localhost:8000/atividades/";

interface Activity {
    id: number;
    nome_pessoa: string;
    atividade: string;
    status: string;
    data_inicial: string;
    data_final?: string;
}

const ActivitiesList = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get<Activity[]>(API_URL)
            .then((response) => setActivities(response.data))
            .catch((error: unknown) => console.error("Erro ao buscar atividades:", error));
    }, []);

    const handleRemoveActivity = async (id: number) => {
        try {
            await axios.delete(`${API_URL}${id}`);
            setActivities((prevActivities) => prevActivities.filter(activity => activity.id !== id));
        } catch (error: unknown) {
            console.error("Erro ao remover atividade:", error);
        }
    };

    return (
        <div className="activities-container">
            <h2>Atividades Registradas</h2>
            {activities.length > 0 ? (
                <ul className="activities-list">
                    {activities.map((item) => (
                        <li key={item.id} className="activity-item">
                            <div>
                                <span className="activity-name">{item.nome_pessoa}</span>
                                <span><b>Atividade:{' '}</b>{item.atividade}</span>
                                <span className={`status ${item.status.replace(/\s+/g, '')}`}>{item.status}</span>
                                <span className="activity-dates"><b>Início:{" "}</b>{item.data_inicial} - <b>Término:{" "}</b>{item.data_final || "Não definida"}</span>
                            </div>
                            <button onClick={() => navigate(`/editar/${item.id}`)} className="btn-edit">Editar</button>
                            <button onClick={() => handleRemoveActivity(item.id)} className="btn-remove">Remover</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Não há atividades registradas.</p>
            )}
            <button onClick={() => navigate("/")} className="btn-secondary">Voltar</button>
        </div>
    );
};

export default ActivitiesList;
