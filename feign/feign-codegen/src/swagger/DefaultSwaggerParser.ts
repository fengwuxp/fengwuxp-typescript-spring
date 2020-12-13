import {AbstractSwaggerParser} from './AbstractSwaggerParser';
import SwaggerParser from '@apidevtools/swagger-parser';
import {OpenAPI, OpenAPIV2, OpenAPIV3} from "openapi-types";
import {TypeDefinition} from 'model/TypeDefinition';
import {HttpMethod} from "fengwuxp-typescript-feign";
import {DEFAULT_TYPE_DEFINITION_TAG} from '../constant/ConstantVariables';
import {ApiMethodItem, getSwaggerTypeTransformer, SwaggerTypeTransformer} from "./SwaggerTypeTransformer";
import {getUrlPrefix} from "../util/ApiUtils";


const HTTP_METHODS = [HttpMethod.GET, HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.TRACE, HttpMethod.PATCH, HttpMethod.PATCH, HttpMethod.HEAD];

export default class DefaultSwaggerParser extends AbstractSwaggerParser {

    constructor(api: string | OpenAPI.Document,
                options: SwaggerParser.Options = {parse: {json: true}}) {
        super(api, options);
    }


    /**
     * 将swagger v2版本的文档转换为 类型定义数组用于生成 sdk
     * @param document
     * @return 用于生成FeignClient的类型描述
     */
    protected transformV2 = (document: OpenAPIV2.Document): TypeDefinition[] => {

        return [];
    }

    /**
     * 将swagger v3版本的文档转换为 类型定义数组用于生成 sdk
     * @param document
     * @return 用于生成FeignClient的类型描述
     */
    protected transformV3 = (document: OpenAPIV3.Document): TypeDefinition[] => {
        const {paths, tags} = document;
        const apis = this.groupPathsByTag(paths);
        const {getFeignClientName, output} = this.parseOptions;
        const swagger3TypeTransformer: SwaggerTypeTransformer = getSwaggerTypeTransformer(output.language);
        return Object.keys(apis).map((tagName) => {
            const apiMethods = apis[tagName];
            const tagObject = tags.find(tag => {
                return tag.name === tagName;
            }) || {name: tagName, description: tagName};
            const urlPrefix = getUrlPrefix(apiMethods.map(item => item.uri));
            return swagger3TypeTransformer.transform(apiMethods, {
                tag: tagObject,
                feignClientName: getFeignClientName(tagObject.name, tagObject.description, urlPrefix)
            });
        });
    }

    /**
     * 通过 api tag 进行分组
     * @param paths
     * @return {
     *     key: "tag",
     *     value: ApiMethodItem
     * }
     */
    protected groupPathsByTag = (paths: OpenAPIV2.PathsObject | OpenAPIV3.PathsObject): Record<string, Array<ApiMethodItem>> => {
        const results: Record<string, Array<ApiMethodItem>> = {};
        Object.keys(paths).forEach(key => {
            const apiMethodItem = this.getApiMethodItem(key, paths[key]);
            const tags = apiMethodItem.tags;
            const name = tags[0];
            const result = results[name] || [];
            if (result.length === 0) {
                results[name] = result;
            }
            result.push(apiMethodItem);
        })
        return results
    }

    /**
     * 获取api方法描述对象
     * @param uri
     * @param itemObject
     */
    protected getApiMethodItem = (uri: string, itemObject: OpenAPIV2.PathItemObject | OpenAPIV3.PathItemObject): ApiMethodItem => {
        const operations = HTTP_METHODS.map(key => {
            const value = itemObject[key.toLowerCase()];
            if (value == null) {
                return null;
            }
            return {[key]: value};
        }).filter(value => value != null)
            .reduce((previousValue, currentValue) => {
                return {
                    ...previousValue,
                    ...currentValue
                }
            }, {}) as Record<HttpMethod, OpenAPIV2.OperationObject | OpenAPIV3.OperationObject>;
        const httpMethods = Object.keys(operations) as HttpMethod[];
        return {
            uri,
            operations,
            httpMethods,
            tags: operations[httpMethods[0]].tags || [DEFAULT_TYPE_DEFINITION_TAG]
        }
    }


}