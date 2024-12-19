import React from "react";
import * as Interfaces from '../interfaces/ReflectionModels';

interface interrogatedAssemblyProps {
    data: Interfaces.interrogatedAssembly | null;
}

export const ReflectedAssemblySection: React.FC<interrogatedAssemblyProps> = ({ data }) => {
    return (
        <div>
            <p>Placeholder for assembly detail</p>
            <p>Name: {data?.name}</p>
        </div>
    );
};

export default ReflectedAssemblySection;

//export const RefelctedAssemblySection = () => {
//    return <main><p>Placeholder for reflected assembly results.</p></main>;
//};