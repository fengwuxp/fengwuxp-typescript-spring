import {TypeDefinition} from "../model/TypeDefinition";
import {createLanguageTypeDefinition} from "../util/TypeDefinitionUtils";


export const VOID: TypeDefinition = createLanguageTypeDefinition("void");

export const NUMBER: TypeDefinition = createLanguageTypeDefinition("number");

export const BOOLEAN: TypeDefinition = createLanguageTypeDefinition("boolean");

export const STRING: TypeDefinition = createLanguageTypeDefinition("string");

export const DATE: TypeDefinition = createLanguageTypeDefinition("date");