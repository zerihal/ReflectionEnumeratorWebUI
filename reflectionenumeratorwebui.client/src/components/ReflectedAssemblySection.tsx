import React from "react";
import * as Interfaces from '../interfaces/ReflectionModels';
import { ObjectType } from '../enums/ReflectionEnums';
import "./components.css"

interface interrogatedAssemblyProps {
    data: Interfaces.InterrogatedAssembly | null;
}

// ToDo: Styles below are to be moved to a CSS file (i.e. component.css)

const TreeNode: React.FC<{ name: string, children: Interfaces.ReflectedAssemblyObject[] }> = ({ name, children }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <div className="tree-content">
            <div className="tree-expandable-item" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "▼ " : "▶ "} {pluraliseName(name)}
            </div>
            {isExpanded && (
                <ul className="tree-list">
                    {children.map((child, index) => (
                        <li className="tree-item tree-indentation" key={index}>
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
        <div className="assembly-section content-container">
            <div>
                <h3 className="box-section">{data?.name}</h3>
            </div>
            <div className="box-section assembly-detail-section">
                <div className="tree-container">
                    {/* Tree - This needs some styling! */}
                    <p className="tree-indentation tree-header">Components</p>
                    {Object.entries(groupedData).map(([type, items]) => (
                        <TreeNode key={type} name={type} children={items} />
                    ))}
                </div>
                <div style={{ flexGrow: 1 }}>
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

// Append string with "s" or "es"
const pluraliseName = (name: string): string => {
    return name.endsWith("s") ? `${name}es` : `${name}s`;
};