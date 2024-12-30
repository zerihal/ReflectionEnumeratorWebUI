import React, { useState } from "react"
import { Header } from "./components/Header";
import { FileSection } from "./components/FileSection";
import { ReflectedAssemblySection } from "./components/ReflectedAssemblySection";
import { InterrogatedAssembly } from "./interfaces/ReflectionModels";
import './App.css';

const App: React.FC = () => {

    const [assemblyData, setAssemblyData] = useState<InterrogatedAssembly | null>(null);

    const updateAssemblyData = (data: InterrogatedAssembly) => {
        setAssemblyData(data);
    }

    return (
        <div className="parent-container">
            <Header />
            <FileSection updateAssemblyData={updateAssemblyData} />
            <ReflectedAssemblySection data={assemblyData} />        
        </div>
    );
};

export default App;