import React from "react";
import * as Interfaces from '../interfaces/ReflectionModels';
import { ObjectType, ElementType } from '../enums/ReflectionEnums';
import "./components.css"

interface interrogatedAssemblyProps {
    data: Interfaces.InterrogatedAssembly | null;
}

interface ReflectedElementListProps {
    label: string;
    elements: Interfaces.ReflectedElementBase[] | undefined;
}

// Creates a context to manage the selected assembly object and the setter function for it.
// The context provides `selectedAssemblyObject`, which can be either a `ReflectedAssemblyObject` or `null`,
// and `setSelectedAO`, a function to update the selected assembly object.
const SelectionContext = React.createContext<{
    selectedAssemblyObject: Interfaces.ReflectedAssemblyObject | null;
    setSelectedAO: (item: Interfaces.ReflectedAssemblyObject) => void;
}>({
    selectedAssemblyObject: null,
    setSelectedAO: () => { },
});

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
                        <li>Visibility: {reflectedElement.isPublic ? "Public" : "Non-public"}</li>

                        {/* ToDo: Add other element specific properties */}

                        {isReflectedField(reflectedElement) && (
                            <li>Field Type: {reflectedElement.fieldType}</li>
                        )}

                        {isReflectedProperty(reflectedElement) && (
                            <ul className="sub-element-list">
                                <li>Property Type: {reflectedElement.propertyType}</li>
                                <li>Access Level: {reflectedElement.access}</li>
                            </ul>
                        )}

                        {isReflectedMethod(reflectedElement) && (
                            <ul className="sub-element-list">
                                <li>Return Type: {reflectedElement.returnType}</li>
                                <li className="arguments-list">
                                    <span>Arguments:</span>
                                    <ul className="sub-element-list">
                                        {reflectedElement.args?.length ? (
                                            reflectedElement.args.map((arg, index) => (
                                                <li key={index}>{arg}</li>
                                            ))) : (
                                                <li>None</li>
                                            )
                                        }
                                    </ul>
                                </li>
                            </ul>
                        )}

                        {/* Placeholder for reflected event if additional properties added in future (at present just reflected element base) */}
                    </ul>
                </div>
            )}
        </li>
    );
}

const ReflectedElementList: React.FC<ReflectedElementListProps> = ({ label, elements }) => {
    return (
        <div>
            <h4>{label}</h4>
            {elements?.length ? (
                <ul className="element-list">
                    {elements.map((element, index) => (
                        <ReflectedElementNode key={index} reflectedElement={element} />
                    ))}
                </ul>
            ) : (
                <p>No {label.toLowerCase()} available</p>
            )}
        </div>
    );
};

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
                        {/* ToDo: This could do with being displayed better - maybe a sticky section with type, namespace, and access modifier? */}
                        {selectedAssemblyObject ? <h4>{selectedAssemblyObject.name} ({selectedAssemblyObject.namespace})</h4> : <p>No item selected</p>}

                        <ReflectedElementList label="Fields" elements={fields} />
                        <ReflectedElementList label="Properties" elements={properties} />
                        <ReflectedElementList label="Methods" elements={methods} />
                        <ReflectedElementList label="Events" elements={events} />
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

    // Sort each group alphabetically by name
    Object.keys(grouped).forEach(type => {
        grouped[type as ObjectType].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
};

// Append string with "s" or "es"
const pluraliseName = (name: string): string => {
    return name.endsWith("s") ? `${name}es` : `${name}s`;
};

//const sortByProperty = <T>(data: T[], key: keyof T): T[] => {
//    return [...data].sort((a, b) => {
//        const aValue = a[key];
//    const bValue = b[key];
//    if (typeof aValue === 'string' && typeof bValue === 'string') {
//            return aValue.localeCompare(bValue);
//        }
//    return 0; // No sorting for non-string properties
//    });
//};

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isReflectedEvent = (element: Interfaces.ReflectedElementBase): element is Interfaces.ReflectedEvent => {
    return (element as Interfaces.ReflectedEvent).elementType == ElementType.Event;
}