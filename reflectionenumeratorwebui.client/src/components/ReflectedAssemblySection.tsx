import React from "react";
import * as Interfaces from '../interfaces/ReflectionModels';
import { ObjectType } from '../enums/ReflectionEnums';

interface interrogatedAssemblyProps {
    data: Interfaces.InterrogatedAssembly | null;
}

// ToDo: Styles below are to be moved to a CSS file (i.e. component.css)

const TreeNode: React.FC<{ name: string, children: Interfaces.ReflectedAssemblyObject[] }> = ({ name, children }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div style={{ margin: "0px 20px" }}>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: "pointer", fontWeight: "bold", textAlign: "left" }}
            >
                {isExpanded ? "▼ " : "▶ "} {name}
            </div>
            {isExpanded && (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {children.map((child, index) => (
                        <li key={index} style={{ marginLeft: "20px", textAlign: "left" }}>
                            {child.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

}

export const ReflectedAssemblySection: React.FC<interrogatedAssemblyProps> = ({ data }) => {
    const groupedData = groupByType(data?.assemblyObjects);

    return (
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <div>
                <h3 style={{ borderStyle: "solid", margin: "0px" }}>{data?.name}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "row", flexGrow: 1 }}>
                <div style={{ borderStyle: "none solid solid solid", flexShrink: 0, width: "auto", overflowX: "auto" }}>
                    {/* Tree - This needs some styling! */}
                    {Object.entries(groupedData).map(([type, items]) => (
                        <TreeNode key={type} name={type} children={items} />
                    ))}
                </div>
                <div style={{ borderStyle: "none solid solid none", flexGrow: 1 }}>
                    <p>Test</p>
                    {/* Add reflection properties, methods, etc here */}
                </div>
            </div>
        </div>
    );
};

export default ReflectedAssemblySection;

// Helpers
const groupByType = (data: Interfaces.ReflectedAssemblyObject[] | undefined) => {
    const grouped: Record<ObjectType, Interfaces.ReflectedAssemblyObject[]> = {
        Class: [],
        Interface: [],
        Enum: []
    };

    data?.forEach(obj => {
        if (grouped[obj.assemblyObjectType]) {
            grouped[obj.assemblyObjectType].push(obj);
        }
    });

    return grouped;
};