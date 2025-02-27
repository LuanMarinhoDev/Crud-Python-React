import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Listing from 'pages/AddActivities';
import ActivitiesList from 'pages/ListActivities';
import Navbar from "components/Navbar";
import EditActivity from "pages/EditActivities";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Listing />} />
        <Route path="/atividades" element={<ActivitiesList />} />
        <Route path="/editar/:id" element={<EditActivity />} />
        <Route path="/form">
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;