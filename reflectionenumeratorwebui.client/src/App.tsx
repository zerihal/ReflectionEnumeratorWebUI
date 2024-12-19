import React, { useState } from "react"
import { Header } from "./components/Header";
import { FileSection } from "./components/FileSection";
import { ReflectedAssemblySection } from "./components/ReflectedAssemblySection";
import { InterrogatedAssembly } from "./interfaces/ReflectionModels";
import './App.css';

// ToDo - Replace the default / sample code below with the following:
// Initially, a basic page title bar and maybe menu button or two
// An input field for entering or selecting (perhaps better) for the assembly to reflect
// A simple output to just show basic information on the reflected assembly to start
// Replace the output to show a tree structure for the reflected assembly with a view pane
// Optional - ability to execute assembly methods

const App: React.FC = () => {
    const [assemblyData, setAssemblyData] = useState<InterrogatedAssembly | null>(null);

    const updateAssemblyData = (data: InterrogatedAssembly) => {
        setAssemblyData(data);
    }

    return (
        <div>
            <Header />
            <FileSection updateAssemblyData={updateAssemblyData} />
            <ReflectedAssemblySection data ={assemblyData} />
        </div>
    );
};

export default App;