import React from "react";
import * as Interfaces from '../interfaces/ReflectionModels';
import { ObjectType, ElementType } from '../enums/ReflectionEnums';
import "./components.css"

interface interrogatedAssemblyProps {
    data: Interfaces.InterrogatedAssembly | null;
}

const SelectionContext = React.createContext<{
    selectedAssemblyObject: Interfaces.ReflectedAssemblyObject | null;
    setSelectedAO: (item: Interfaces.ReflectedAssemblyObject) => void;
}>({
    selectedAssemblyObject: null,
    setSelectedAO: () => { },
});

// ToDo: Styles below are to be moved to a CSS file (i.e. component.css)

const TreeNode: React.FC<{ name: string, children: Interfaces.ReflectedAssemblyObject[] }> = ({ name, children }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { setSelectedAO } = React.useContext(SelectionContext)!;

    return (
        <div className="tree-content">
            <div className="expandable-item" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "▼ " : "▶ "} {pluraliseName(name)}
            </div>
            {isExpanded && (
                <ul className="tree-list">
                    {children.map((child, index) => (
                        <li className="tree-item tree-indentation"
                            key={index}
                            onClick={() => setSelectedAO(child)}
                        >
                            {child.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const ReflectedElementNode: React.FC<{ reflectedElement: Interfaces.ReflectedElementBase }> = ({ reflectedElement }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    return (
        <li className="reflected-element" key={reflectedElement.name}>
            <div className="reflected-element-header">
                <div className="expandable-item expandable-item-box" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? "- " : "+ "}
                </div>
                <div>{reflectedElement.name}</div>
            </div>

            {isExpanded && (
                <div className="reflected-element-detail">
                    <ul className="element-list">
                        <li>Public: {reflectedElement.isPublic ? "True" : "False"}</li>

                        {/* ToDo: Add other element specific properties */}

                        {isReflectedField(reflectedElement) && (
                            <li>Field Type: {reflectedElement.fieldType}</li>
                        )}
                    </ul>
                </div>
            )}
        </li>
    );
}

export const ReflectedAssemblySection: React.FC<interrogatedAssemblyProps> = ({ data }) => {
    const groupedData = groupByType(data?.assemblyObjects);
    const [selectedAssemblyObject, setSelectedAO] = React.useState<Interfaces.ReflectedAssemblyObject | null>(null);

    // Deconstruct the relevant properties from selectedAssemblyObject
    const { fields, properties, methods, events } = selectedAssemblyObject ?? {};

    return (
        <SelectionContext.Provider value={{ selectedAssemblyObject, setSelectedAO }}>
            <div className="assembly-section content-container">
                <div className="assembly-summary-section">
                    <h3 className="box-section">{data?.name}</h3>
                    {/* ToDo - This should show basic assembly info - name, version, and number of reflected objects, so size should be pretty static for this */}
                </div>
                <div className="box-section assembly-detail-section">
                    <div className="tree-container">
                        {/* Tree - This needs some styling! */}
                        <p className="tree-indentation tree-header">Components</p>
                        {Object.entries(groupedData).map(([type, items]) => (
                            <TreeNode key={type} name={type} children={items} />
                        ))}
                    </div>
                    {/* ToDo: Need to fix this div to remain in view if scrolled, or maybe even consider doing something different with vertical expansion */}
                    <div style={{ flexGrow: 1, overflow: "auto" }}>
                        {selectedAssemblyObject ? <p>{selectedAssemblyObject.name}</p> : <p>No item selected</p>}
                        {/* The below is a sample of what we will do for all objects in reflected assembly object, but this needs some styling! */}

                        <h4>Fields</h4>
                        {fields?.length ? (
                            <ul className="element-list">
                                {fields.map((field) => (
                                    <ReflectedElementNode reflectedElement={field}/>
                                    //<li className="reflected-element" key={field.name}>
                                    //    <div></div>
                                    //    <div>{field.name}</div>
                                    //</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No fields available</p>
                        )}
                    </div>
                </div>
            </div>
        </SelectionContext.Provider>
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

// Checks whether reflected element is a field, casting to ReflectedField if so.
const isReflectedField = (element: Interfaces.ReflectedElementBase): element is Interfaces.ReflectedField => {
    return (element as Interfaces.ReflectedField).fieldType !== undefined;
}

// Checks whether reflected element is a property, casting to ReflectedProperty if so.
const isReflectedProperty = (element: Interfaces.ReflectedElementBase): element is Interfaces.ReflectedProperty => {
    return (element as Interfaces.ReflectedProperty).propertyType !== undefined;
}

// Checks whether reflected element is a method, casting to ReflectedMethod if so.
const isReflectedMethod = (element: Interfaces.ReflectedElementBase): element is Interfaces.ReflectedMethod => {
    return (element as Interfaces.ReflectedMethod).returnType !== undefined;
}

// Checks whether reflected element is a event, casting to ReflectedEvent if so.
const isReflectedEvent = (element: Interfaces.ReflectedElementBase): element is Interfaces.ReflectedEvent => {
    return (element as Interfaces.ReflectedEvent).elementType == ElementType.Event;
}