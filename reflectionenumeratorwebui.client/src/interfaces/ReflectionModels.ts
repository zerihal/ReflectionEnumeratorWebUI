import { ObjectType, ElementType } from '../enums/ReflectionEnums';

export interface InterrogatedAssembly {
    name: string;
    version: string;
    assemblyObjects: ReflectedAssemblyObject[];
}

export interface ReflectedAssemblyObject {
    assemblyObjectType: ObjectType;
    name: string;
    accessModifier: string;
    properties: ReflectedProperty[];
    methods: ReflectedMethod[];
    fields: ReflectedField[];
    events: ReflectedEvent[];
}

export interface ReflectedElementBase {
    elementType: ElementType;
    name: string;
    isPublic: boolean;
}

export interface ReflectedProperty extends ReflectedElementBase {
    propertyType: string;
    access: string;
}

export interface ReflectedMethod extends ReflectedElementBase {
    args: string[];
    returnType: string;
}

export interface ReflectedField extends ReflectedElementBase {
    fieldType: string;
}

// ReflectedEvent does not have any additional members from the base class at present,
// so technically the base interface could be used, but have added this anyway for 
// clarity and in case the model is updated in future.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ReflectedEvent extends ReflectedElementBase {

}