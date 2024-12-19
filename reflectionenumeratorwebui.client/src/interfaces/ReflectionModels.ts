import { ObjectType, ElementType } from '../enums/ReflectionEnums';

export interface interrogatedAssembly {
    name: string;
    version: string;
    assemblyObjects: reflectedAssemblyObject[];
}

export interface reflectedAssemblyObject {
    objectType: ObjectType;
    name: string;
    accessModifier: string;
    properties: reflectedProperty[];
    methods: reflectedMethod[];
    fields: reflectedField[];
    events: reflectedEvent[];
}

export interface reflectedElementBase {
    elementType: ElementType;
    name: string;
    isPublic: boolean;
}

export interface reflectedProperty extends reflectedElementBase {
    propertyType: string;
    access: string;
}

export interface reflectedMethod extends reflectedElementBase {
    args: string[];
    returnType: string;
}

export interface reflectedField extends reflectedElementBase {
    fieldType: string;
}

// ReflectedEvent does not have any additional members from the base class at present,
// so technically the base interface could be used, but have added this anyway for 
// clarity and in case the model is updated in future.
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface reflectedEvent extends reflectedElementBase {

}