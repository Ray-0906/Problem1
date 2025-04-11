//import { LogPlantForm } from "../../components/LogPLant";
import LogPlantForm from "../../components/LogPLant";
import  PlantMap  from "../../components/PlantMap";
import  SuggestionPanel  from "../../components/Suggest";



export default function RangerDashboard() {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🌿 Smart Plant Identifier Dashboard</h1>
        <PlantMap />
        <LogPlantForm />
      </div>
    );
  }
  