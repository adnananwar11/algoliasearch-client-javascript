import { shuffle, Transporter } from '@algolia/client-common';
import type {
  Headers,
  Requester,
  Host,
  Request,
  RequestOptions,
} from '@algolia/client-common';

import type { AddApiKeyResponse } from '../model/addApiKeyResponse';
import type { ApiKey } from '../model/apiKey';
import type { AssignUserIdParams } from '../model/assignUserIdParams';
import type { BatchAssignUserIdsParams } from '../model/batchAssignUserIdsParams';
import type { BatchDictionaryEntries } from '../model/batchDictionaryEntries';
import type { BatchParams } from '../model/batchParams';
import type { BatchResponse } from '../model/batchResponse';
import type { BatchWriteParams } from '../model/batchWriteParams';
import type { BrowseRequest } from '../model/browseRequest';
import type { BrowseResponse } from '../model/browseResponse';
import type { BuiltInOperation } from '../model/builtInOperation';
import type { CreatedAtResponse } from '../model/createdAtResponse';
import type { DeleteApiKeyResponse } from '../model/deleteApiKeyResponse';
import type { DeleteSourceResponse } from '../model/deleteSourceResponse';
import type { DeletedAtResponse } from '../model/deletedAtResponse';
import type { DictionarySettingsRequest } from '../model/dictionarySettingsRequest';
import type { GetDictionarySettingsResponse } from '../model/getDictionarySettingsResponse';
import type { GetLogsResponse } from '../model/getLogsResponse';
import type { GetObjectsParams } from '../model/getObjectsParams';
import type { GetObjectsResponse } from '../model/getObjectsResponse';
import type { GetTaskResponse } from '../model/getTaskResponse';
import type { GetTopUserIdsResponse } from '../model/getTopUserIdsResponse';
import type { IndexSettings } from '../model/indexSettings';
import type { Key } from '../model/key';
import type { Languages } from '../model/languages';
import type { ListApiKeysResponse } from '../model/listApiKeysResponse';
import type { ListClustersResponse } from '../model/listClustersResponse';
import type { ListIndicesResponse } from '../model/listIndicesResponse';
import type { ListUserIdsResponse } from '../model/listUserIdsResponse';
import type { MultipleBatchResponse } from '../model/multipleBatchResponse';
import type { MultipleQueriesParams } from '../model/multipleQueriesParams';
import type { MultipleQueriesResponse } from '../model/multipleQueriesResponse';
import type { OperationIndexParams } from '../model/operationIndexParams';
import type { RemoveUserIdResponse } from '../model/removeUserIdResponse';
import type { ReplaceSourceResponse } from '../model/replaceSourceResponse';
import type { Rule } from '../model/rule';
import type { SaveObjectResponse } from '../model/saveObjectResponse';
import type { SaveSynonymResponse } from '../model/saveSynonymResponse';
import type { SearchDictionaryEntries } from '../model/searchDictionaryEntries';
import type { SearchForFacetValuesRequest } from '../model/searchForFacetValuesRequest';
import type { SearchForFacetValuesResponse } from '../model/searchForFacetValuesResponse';
import type { SearchParams } from '../model/searchParams';
import type { SearchResponse } from '../model/searchResponse';
import type { SearchRulesParams } from '../model/searchRulesParams';
import type { SearchRulesResponse } from '../model/searchRulesResponse';
import type { SearchSynonymsResponse } from '../model/searchSynonymsResponse';
import type { SearchUserIdsParams } from '../model/searchUserIdsParams';
import type { SearchUserIdsResponse } from '../model/searchUserIdsResponse';
import type { Source } from '../model/source';
import type { SynonymHit } from '../model/synonymHit';
import type { SynonymType } from '../model/synonymType';
import type { UpdateApiKeyResponse } from '../model/updateApiKeyResponse';
import type { UpdatedAtResponse } from '../model/updatedAtResponse';
import type { UpdatedAtWithObjectIdResponse } from '../model/updatedAtWithObjectIdResponse';
import type { UpdatedRuleResponse } from '../model/updatedRuleResponse';
import type { UserId } from '../model/userId';

export class SearchApi {
  protected authentications = {
    apiKey: 'Algolia-API-Key',
    appId: 'Algolia-Application-Id',
  };

  private transporter: Transporter;

  private applyAuthenticationHeaders(
    requestOptions: RequestOptions
  ): RequestOptions {
    if (requestOptions?.headers) {
      return {
        ...requestOptions,
        headers: {
          ...requestOptions.headers,
          'X-Algolia-API-Key': this.authentications.apiKey,
          'X-Algolia-Application-Id': this.authentications.appId,
        },
      };
    }

    return requestOptions;
  }

  private sendRequest<TResponse>(
    request: Request,
    requestOptions: RequestOptions
  ): Promise<TResponse> {
    return this.transporter.request(
      request,
      this.applyAuthenticationHeaders(requestOptions)
    );
  }

  constructor(
    appId: string,
    apiKey: string,
    options?: { requester?: Requester; hosts?: Host[] }
  ) {
    this.setAuthentication({ appId, apiKey });

    this.transporter = new Transporter({
      hosts: options?.hosts ?? this.getDefaultHosts(appId),
      baseHeaders: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      userAgent: 'Algolia for Javascript',
      timeouts: {
        connect: 2,
        read: 5,
        write: 30,
      },
      requester: options?.requester,
    });
  }

  getDefaultHosts(appId: string): Host[] {
    return (
      [
        { url: `${appId}-dsn.algolia.net`, accept: 'read', protocol: 'https' },
        { url: `${appId}.algolia.net`, accept: 'write', protocol: 'https' },
      ] as Host[]
    ).concat(
      shuffle([
        {
          url: `${appId}-1.algolianet.com`,
          accept: 'readWrite',
          protocol: 'https',
        },
        {
          url: `${appId}-2.algolianet.com`,
          accept: 'readWrite',
          protocol: 'https',
        },
        {
          url: `${appId}-3.algolianet.com`,
          accept: 'readWrite',
          protocol: 'https',
        },
      ])
    );
  }

  setRequest(requester: Requester): void {
    this.transporter.setRequester(requester);
  }

  setHosts(hosts: Host[]): void {
    this.transporter.setHosts(hosts);
  }

  setAuthentication({ appId, apiKey }): void {
    this.authentications = {
      apiKey,
      appId,
    };
  }

  /**
   * Add a new API Key with specific permissions/restrictions.
   *
   * @summary Create a new API key.
   * @param apiKey - The apiKey object.
   */
  addApiKey(apiKey: ApiKey): Promise<AddApiKeyResponse> {
    const path = '/1/keys';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!apiKey) {
      throw new Error(
        'Parameter `apiKey` is required when calling `addApiKey`.'
      );
    }

    if (!apiKey.acl) {
      throw new Error(
        'Parameter `apiKey.acl` is required when calling `addApiKey`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: apiKey,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Add or replace an object with a given object ID. If the object does not exist, it will be created. If it already exists, it will be replaced.
   *
   * @summary Add or replace an object with a given object ID.
   * @param addOrUpdateObject - The addOrUpdateObject object.
   * @param addOrUpdateObject.indexName - The index in which to perform the request.
   * @param addOrUpdateObject.objectID - Unique identifier of an object.
   * @param addOrUpdateObject.body - The Algolia object.
   */
  addOrUpdateObject({
    indexName,
    objectID,
    body,
  }: AddOrUpdateObjectProps): Promise<UpdatedAtWithObjectIdResponse> {
    const path = '/1/indexes/{indexName}/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `addOrUpdateObject`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `addOrUpdateObject`.'
      );
    }

    if (!body) {
      throw new Error(
        'Parameter `body` is required when calling `addOrUpdateObject`.'
      );
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: body,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Add a single source to the list of allowed sources.
   *
   * @summary Add a single source.
   * @param source - The source to add.
   */
  appendSource(source: Source): Promise<CreatedAtResponse> {
    const path = '/1/security/sources/append';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!source) {
      throw new Error(
        'Parameter `source` is required when calling `appendSource`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: source,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Assign or Move a userID to a cluster. The time it takes to migrate (move) a user is proportional to the amount of data linked to the userID. Upon success, the response is 200 OK. A successful response indicates that the operation has been taken into account, and the userID is directly usable.
   *
   * @summary Assign or Move userID.
   * @param assignUserId - The assignUserId object.
   * @param assignUserId.xAlgoliaUserID - UserID to assign.
   * @param assignUserId.assignUserIdParams - The assignUserIdParams object.
   */
  assignUserId({
    xAlgoliaUserID,
    assignUserIdParams,
  }: AssignUserIdProps): Promise<CreatedAtResponse> {
    const path = '/1/clusters/mapping';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!xAlgoliaUserID) {
      throw new Error(
        'Parameter `xAlgoliaUserID` is required when calling `assignUserId`.'
      );
    }

    if (!assignUserIdParams) {
      throw new Error(
        'Parameter `assignUserIdParams` is required when calling `assignUserId`.'
      );
    }

    if (!assignUserIdParams.cluster) {
      throw new Error(
        'Parameter `assignUserIdParams.cluster` is required when calling `assignUserId`.'
      );
    }

    if (xAlgoliaUserID !== undefined) {
      queryParameters['X-Algolia-User-ID'] = xAlgoliaUserID.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
      data: assignUserIdParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Performs multiple write operations in a single API call.
   *
   * @summary Performs multiple write operations in a single API call.
   * @param batch - The batch object.
   * @param batch.indexName - The index in which to perform the request.
   * @param batch.batchWriteParams - The batchWriteParams object.
   */
  batch({ indexName, batchWriteParams }: BatchProps): Promise<BatchResponse> {
    const path = '/1/indexes/{indexName}/batch'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `batch`.'
      );
    }

    if (!batchWriteParams) {
      throw new Error(
        'Parameter `batchWriteParams` is required when calling `batch`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: batchWriteParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Assign multiple userIDs to a cluster. Upon success, the response is 200 OK. A successful response indicates that the operation has been taken into account, and the userIDs are directly usable.
   *
   * @summary Batch assign userIDs.
   * @param batchAssignUserIds - The batchAssignUserIds object.
   * @param batchAssignUserIds.xAlgoliaUserID - UserID to assign.
   * @param batchAssignUserIds.batchAssignUserIdsParams - The batchAssignUserIdsParams object.
   */
  batchAssignUserIds({
    xAlgoliaUserID,
    batchAssignUserIdsParams,
  }: BatchAssignUserIdsProps): Promise<CreatedAtResponse> {
    const path = '/1/clusters/mapping/batch';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!xAlgoliaUserID) {
      throw new Error(
        'Parameter `xAlgoliaUserID` is required when calling `batchAssignUserIds`.'
      );
    }

    if (!batchAssignUserIdsParams) {
      throw new Error(
        'Parameter `batchAssignUserIdsParams` is required when calling `batchAssignUserIds`.'
      );
    }

    if (!batchAssignUserIdsParams.cluster) {
      throw new Error(
        'Parameter `batchAssignUserIdsParams.cluster` is required when calling `batchAssignUserIds`.'
      );
    }
    if (!batchAssignUserIdsParams.users) {
      throw new Error(
        'Parameter `batchAssignUserIdsParams.users` is required when calling `batchAssignUserIds`.'
      );
    }

    if (xAlgoliaUserID !== undefined) {
      queryParameters['X-Algolia-User-ID'] = xAlgoliaUserID.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
      data: batchAssignUserIdsParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Send a batch of dictionary entries.
   *
   * @summary Send a batch of dictionary entries.
   * @param batchDictionaryEntries - The batchDictionaryEntries object.
   * @param batchDictionaryEntries.dictionaryName - The dictionary to search in.
   * @param batchDictionaryEntries.batchDictionaryEntries - The batchDictionaryEntries object.
   */
  batchDictionaryEntries({
    dictionaryName,
    batchDictionaryEntries,
  }: BatchDictionaryEntriesProps): Promise<UpdatedAtResponse> {
    const path = '/1/dictionaries/{dictionaryName}/batch'.replace(
      '{dictionaryName}',
      encodeURIComponent(String(dictionaryName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!dictionaryName) {
      throw new Error(
        'Parameter `dictionaryName` is required when calling `batchDictionaryEntries`.'
      );
    }

    if (!batchDictionaryEntries) {
      throw new Error(
        'Parameter `batchDictionaryEntries` is required when calling `batchDictionaryEntries`.'
      );
    }

    if (!batchDictionaryEntries.requests) {
      throw new Error(
        'Parameter `batchDictionaryEntries.requests` is required when calling `batchDictionaryEntries`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: batchDictionaryEntries,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Create or update a batch of Rules.
   *
   * @summary Batch Rules.
   * @param batchRules - The batchRules object.
   * @param batchRules.indexName - The index in which to perform the request.
   * @param batchRules.rule - The rule object.
   * @param batchRules.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   * @param batchRules.clearExistingRules - When true, existing Rules are cleared before adding this batch. When false, existing Rules are kept.
   */
  batchRules({
    indexName,
    rule,
    forwardToReplicas,
    clearExistingRules,
  }: BatchRulesProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/rules/batch'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `batchRules`.'
      );
    }

    if (!rule) {
      throw new Error(
        'Parameter `rule` is required when calling `batchRules`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    if (clearExistingRules !== undefined) {
      queryParameters.clearExistingRules = clearExistingRules.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
      data: rule,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * This method allows you to retrieve all index content. It can retrieve up to 1,000 records per call and supports full text search and filters. For performance reasons, some features are not supported, including `distinct`, sorting by `typos`, `words` or `geo distance`. When there is more content to be browsed, the response contains a cursor field. This cursor has to be passed to the subsequent call to browse in order to get the next page of results. When the end of the index has been reached, the cursor field is absent from the response.
   *
   * @summary Retrieve all index content.
   * @param browse - The browse object.
   * @param browse.indexName - The index in which to perform the request.
   * @param browse.browseRequest - The browseRequest object.
   */
  browse({ indexName, browseRequest }: BrowseProps): Promise<BrowseResponse> {
    const path = '/1/indexes/{indexName}/browse'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `browse`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: browseRequest,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Remove all synonyms from an index.
   *
   * @summary Clear all synonyms.
   * @param clearAllSynonyms - The clearAllSynonyms object.
   * @param clearAllSynonyms.indexName - The index in which to perform the request.
   * @param clearAllSynonyms.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  clearAllSynonyms({
    indexName,
    forwardToReplicas,
  }: ClearAllSynonymsProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/synonyms/clear'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `clearAllSynonyms`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete an index\'s content, but leave settings and index-specific API keys untouched.
   *
   * @summary Clear all objects from an index.
   * @param clearObjects - The clearObjects object.
   * @param clearObjects.indexName - The index in which to perform the request.
   */
  clearObjects({ indexName }: ClearObjectsProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/clear'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `clearObjects`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete all Rules in the index.
   *
   * @summary Clear Rules.
   * @param clearRules - The clearRules object.
   * @param clearRules.indexName - The index in which to perform the request.
   * @param clearRules.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  clearRules({
    indexName,
    forwardToReplicas,
  }: ClearRulesProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/rules/clear'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `clearRules`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete an existing API Key.
   *
   * @summary Delete an API key.
   * @param deleteApiKey - The deleteApiKey object.
   * @param deleteApiKey.key - API Key string.
   */
  deleteApiKey({ key }: DeleteApiKeyProps): Promise<DeleteApiKeyResponse> {
    const path = '/1/keys/{key}'.replace(
      '{key}',
      encodeURIComponent(String(key))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!key) {
      throw new Error(
        'Parameter `key` is required when calling `deleteApiKey`.'
      );
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Remove all objects matching a filter (including geo filters). This method enables you to delete one or more objects based on filters (numeric, facet, tag or geo queries). It doesn\'t accept empty filters or a query.
   *
   * @summary Delete all records matching the query.
   * @param deleteBy - The deleteBy object.
   * @param deleteBy.indexName - The index in which to perform the request.
   * @param deleteBy.searchParams - The searchParams object.
   */
  deleteBy({
    indexName,
    searchParams,
  }: DeleteByProps): Promise<DeletedAtResponse> {
    const path = '/1/indexes/{indexName}/deleteByQuery'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `deleteBy`.'
      );
    }

    if (!searchParams) {
      throw new Error(
        'Parameter `searchParams` is required when calling `deleteBy`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete an existing index.
   *
   * @summary Delete index.
   * @param deleteIndex - The deleteIndex object.
   * @param deleteIndex.indexName - The index in which to perform the request.
   */
  deleteIndex({ indexName }: DeleteIndexProps): Promise<DeletedAtResponse> {
    const path = '/1/indexes/{indexName}'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `deleteIndex`.'
      );
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete an existing object.
   *
   * @summary Delete object.
   * @param deleteObject - The deleteObject object.
   * @param deleteObject.indexName - The index in which to perform the request.
   * @param deleteObject.objectID - Unique identifier of an object.
   */
  deleteObject({
    indexName,
    objectID,
  }: DeleteObjectProps): Promise<DeletedAtResponse> {
    const path = '/1/indexes/{indexName}/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `deleteObject`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `deleteObject`.'
      );
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete the Rule with the specified objectID.
   *
   * @summary Delete a rule.
   * @param deleteRule - The deleteRule object.
   * @param deleteRule.indexName - The index in which to perform the request.
   * @param deleteRule.objectID - Unique identifier of an object.
   * @param deleteRule.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  deleteRule({
    indexName,
    objectID,
    forwardToReplicas,
  }: DeleteRuleProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/rules/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `deleteRule`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `deleteRule`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Remove a single source from the list of allowed sources.
   *
   * @summary Remove a single source.
   * @param deleteSource - The deleteSource object.
   * @param deleteSource.source - The IP range of the source.
   */
  deleteSource({ source }: DeleteSourceProps): Promise<DeleteSourceResponse> {
    const path = '/1/security/sources/{source}'.replace(
      '{source}',
      encodeURIComponent(String(source))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!source) {
      throw new Error(
        'Parameter `source` is required when calling `deleteSource`.'
      );
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Delete a single synonyms set, identified by the given objectID.
   *
   * @summary Delete synonym.
   * @param deleteSynonym - The deleteSynonym object.
   * @param deleteSynonym.indexName - The index in which to perform the request.
   * @param deleteSynonym.objectID - Unique identifier of an object.
   * @param deleteSynonym.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  deleteSynonym({
    indexName,
    objectID,
    forwardToReplicas,
  }: DeleteSynonymProps): Promise<DeletedAtResponse> {
    const path = '/1/indexes/{indexName}/synonyms/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `deleteSynonym`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `deleteSynonym`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Get the permissions of an API key.
   *
   * @summary Get an API key.
   * @param getApiKey - The getApiKey object.
   * @param getApiKey.key - API Key string.
   */
  getApiKey({ key }: GetApiKeyProps): Promise<Key> {
    const path = '/1/keys/{key}'.replace(
      '{key}',
      encodeURIComponent(String(key))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!key) {
      throw new Error('Parameter `key` is required when calling `getApiKey`.');
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List dictionaries supported per language.
   *
   * @summary List dictionaries supported per language.
   */
  getDictionaryLanguages(): Promise<{ [key: string]: Languages }> {
    const path = '/1/dictionaries/*/languages';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Retrieve dictionaries settings.
   *
   * @summary Retrieve dictionaries settings. The API stores languages whose standard entries are disabled. Fetch settings does not return false values.
   */
  getDictionarySettings(): Promise<GetDictionarySettingsResponse> {
    const path = '/1/dictionaries/*/settings';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Return the lastest log entries.
   *
   * @summary Return the lastest log entries.
   * @param getLogs - The getLogs object.
   * @param getLogs.offset - First entry to retrieve (zero-based). Log entries are sorted by decreasing date, therefore 0 designates the most recent log entry.
   * @param getLogs.length - Maximum number of entries to retrieve. The maximum allowed value is 1000.
   * @param getLogs.indexName - Index for which log entries should be retrieved. When omitted, log entries are retrieved across all indices.
   * @param getLogs.type - Type of log entries to retrieve. When omitted, all log entries are retrieved.
   */
  getLogs({
    offset,
    length,
    indexName,
    type,
  }: GetLogsProps): Promise<GetLogsResponse> {
    const path = '/1/logs';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (offset !== undefined) {
      queryParameters.offset = offset.toString();
    }

    if (length !== undefined) {
      queryParameters.length = length.toString();
    }

    if (indexName !== undefined) {
      queryParameters.indexName = indexName.toString();
    }

    if (type !== undefined) {
      queryParameters.type = type.toString();
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Retrieve one object from the index.
   *
   * @summary Retrieve one object from the index.
   * @param getObject - The getObject object.
   * @param getObject.indexName - The index in which to perform the request.
   * @param getObject.objectID - Unique identifier of an object.
   * @param getObject.attributesToRetrieve - List of attributes to retrieve. If not specified, all retrievable attributes are returned.
   */
  getObject({
    indexName,
    objectID,
    attributesToRetrieve,
  }: GetObjectProps): Promise<{ [key: string]: string }> {
    const path = '/1/indexes/{indexName}/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `getObject`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `getObject`.'
      );
    }

    if (attributesToRetrieve !== undefined) {
      queryParameters.attributesToRetrieve = attributesToRetrieve.toString();
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Retrieve one or more objects, potentially from different indices, in a single API call.
   *
   * @summary Retrieve one or more objects.
   * @param getObjectsParams - The getObjectsParams object.
   */
  getObjects(getObjectsParams: GetObjectsParams): Promise<GetObjectsResponse> {
    const path = '/1/indexes/*/objects';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!getObjectsParams) {
      throw new Error(
        'Parameter `getObjectsParams` is required when calling `getObjects`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: getObjectsParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Retrieve the Rule with the specified objectID.
   *
   * @summary Get a rule.
   * @param getRule - The getRule object.
   * @param getRule.indexName - The index in which to perform the request.
   * @param getRule.objectID - Unique identifier of an object.
   */
  getRule({ indexName, objectID }: GetRuleProps): Promise<Rule> {
    const path = '/1/indexes/{indexName}/rules/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `getRule`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `getRule`.'
      );
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Retrieve settings of a given indexName.
   *
   * @summary Retrieve settings of a given indexName.
   * @param getSettings - The getSettings object.
   * @param getSettings.indexName - The index in which to perform the request.
   */
  getSettings({ indexName }: GetSettingsProps): Promise<IndexSettings> {
    const path = '/1/indexes/{indexName}/settings'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `getSettings`.'
      );
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List all allowed sources.
   *
   * @summary List all allowed sources.
   */
  getSources(): Promise<Source[]> {
    const path = '/1/security/sources';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Fetch a synonym object identified by its objectID.
   *
   * @summary Get synonym.
   * @param getSynonym - The getSynonym object.
   * @param getSynonym.indexName - The index in which to perform the request.
   * @param getSynonym.objectID - Unique identifier of an object.
   */
  getSynonym({ indexName, objectID }: GetSynonymProps): Promise<SynonymHit> {
    const path = '/1/indexes/{indexName}/synonyms/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `getSynonym`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `getSynonym`.'
      );
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Check the current status of a given task.
   *
   * @summary Check the current status of a given task.
   * @param getTask - The getTask object.
   * @param getTask.indexName - The index in which to perform the request.
   * @param getTask.taskID - Unique identifier of an task. Numeric value (up to 64bits).
   */
  getTask({ indexName, taskID }: GetTaskProps): Promise<GetTaskResponse> {
    const path = '/1/indexes/{indexName}/task/{taskID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{taskID}', encodeURIComponent(String(taskID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `getTask`.'
      );
    }

    if (!taskID) {
      throw new Error('Parameter `taskID` is required when calling `getTask`.');
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Get the top 10 userIDs with the highest number of records per cluster. The data returned will usually be a few seconds behind real time, because userID usage may take up to a few seconds to propagate to the different clusters. Upon success, the response is 200 OK and contains the following array of userIDs and clusters.
   *
   * @summary Get top userID.
   */
  getTopUserIds(): Promise<GetTopUserIdsResponse> {
    const path = '/1/clusters/mapping/top';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Returns the userID data stored in the mapping. The data returned will usually be a few seconds behind real time, because userID usage may take up to a few seconds to propagate to the different clusters. Upon success, the response is 200 OK and contains the following userID data.
   *
   * @summary Get userID.
   * @param getUserId - The getUserId object.
   * @param getUserId.userID - UserID to assign.
   */
  getUserId({ userID }: GetUserIdProps): Promise<UserId> {
    const path = '/1/clusters/mapping/{userID}'.replace(
      '{userID}',
      encodeURIComponent(String(userID))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!userID) {
      throw new Error(
        'Parameter `userID` is required when calling `getUserId`.'
      );
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Get the status of your clusters\' migrations or user creations. Creating a large batch of users or migrating your multi-cluster may take quite some time. This method lets you retrieve the status of the migration, so you can know when it\'s done. Upon success, the response is 200 OK. A successful response indicates that the operation has been taken into account, and the userIDs are directly usable.
   *
   * @summary Has pending mappings.
   * @param hasPendingMappings - The hasPendingMappings object.
   * @param hasPendingMappings.getClusters - Whether to get clusters or not.
   */
  hasPendingMappings({
    getClusters,
  }: HasPendingMappingsProps): Promise<CreatedAtResponse> {
    const path = '/1/clusters/mapping/pending';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (getClusters !== undefined) {
      queryParameters.getClusters = getClusters.toString();
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List API keys, along with their associated rights.
   *
   * @summary Get the full list of API Keys.
   */
  listApiKeys(): Promise<ListApiKeysResponse> {
    const path = '/1/keys';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List the clusters available in a multi-clusters setup for a single appID. Upon success, the response is 200 OK and contains the following clusters.
   *
   * @summary List clusters.
   */
  listClusters(): Promise<ListClustersResponse> {
    const path = '/1/clusters';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List existing indexes from an application.
   *
   * @summary List existing indexes.
   * @param listIndices - The listIndices object.
   * @param listIndices.page - Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   */
  listIndices({ page }: ListIndicesProps): Promise<ListIndicesResponse> {
    const path = '/1/indexes';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (page !== undefined) {
      queryParameters.page = page.toString();
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * List the userIDs assigned to a multi-clusters appID. The data returned will usually be a few seconds behind real time, because userID usage may take up to a few seconds to propagate to the different clusters. Upon success, the response is 200 OK and contains the following userIDs data.
   *
   * @summary List userIDs.
   * @param listUserIds - The listUserIds object.
   * @param listUserIds.page - Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   * @param listUserIds.hitsPerPage - Maximum number of objects to retrieve.
   */
  listUserIds({
    page,
    hitsPerPage,
  }: ListUserIdsProps): Promise<ListUserIdsResponse> {
    const path = '/1/clusters/mapping';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (page !== undefined) {
      queryParameters.page = page.toString();
    }

    if (hitsPerPage !== undefined) {
      queryParameters.hitsPerPage = hitsPerPage.toString();
    }

    const request: Request = {
      method: 'GET',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Perform multiple write operations, potentially targeting multiple indices, in a single API call.
   *
   * @summary Perform multiple write operations.
   * @param batchParams - The batchParams object.
   */
  multipleBatch(batchParams: BatchParams): Promise<MultipleBatchResponse> {
    const path = '/1/indexes/*/batch';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!batchParams) {
      throw new Error(
        'Parameter `batchParams` is required when calling `multipleBatch`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: batchParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Get search results for the given requests.
   *
   * @summary Get search results for the given requests.
   * @param multipleQueriesParams - The multipleQueriesParams object.
   */
  multipleQueries(
    multipleQueriesParams: MultipleQueriesParams
  ): Promise<MultipleQueriesResponse> {
    const path = '/1/indexes/*/queries';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!multipleQueriesParams) {
      throw new Error(
        'Parameter `multipleQueriesParams` is required when calling `multipleQueries`.'
      );
    }

    if (!multipleQueriesParams.requests) {
      throw new Error(
        'Parameter `multipleQueriesParams.requests` is required when calling `multipleQueries`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: multipleQueriesParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Peforms a copy or a move operation on a index.
   *
   * @summary Copy/move index.
   * @param operationIndex - The operationIndex object.
   * @param operationIndex.indexName - The index in which to perform the request.
   * @param operationIndex.operationIndexParams - The operationIndexParams object.
   */
  operationIndex({
    indexName,
    operationIndexParams,
  }: OperationIndexProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/operation'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `operationIndex`.'
      );
    }

    if (!operationIndexParams) {
      throw new Error(
        'Parameter `operationIndexParams` is required when calling `operationIndex`.'
      );
    }

    if (!operationIndexParams.operation) {
      throw new Error(
        'Parameter `operationIndexParams.operation` is required when calling `operationIndex`.'
      );
    }
    if (!operationIndexParams.destination) {
      throw new Error(
        'Parameter `operationIndexParams.destination` is required when calling `operationIndex`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: operationIndexParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Update one or more attributes of an existing object. This method lets you update only a part of an existing object, either by adding new attributes or updating existing ones. You can partially update several objects in a single method call. If the index targeted by this operation doesn\'t exist yet, it\'s automatically created.
   *
   * @summary Partially update an object.
   * @param partialUpdateObject - The partialUpdateObject object.
   * @param partialUpdateObject.indexName - The index in which to perform the request.
   * @param partialUpdateObject.objectID - Unique identifier of an object.
   * @param partialUpdateObject.stringBuiltInOperation - List of attributes to update.
   * @param partialUpdateObject.createIfNotExists - Creates the record if it does not exist yet.
   */
  partialUpdateObject({
    indexName,
    objectID,
    stringBuiltInOperation,
    createIfNotExists,
  }: PartialUpdateObjectProps): Promise<UpdatedAtWithObjectIdResponse> {
    const path = '/1/indexes/{indexName}/{objectID}/partial'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `partialUpdateObject`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `partialUpdateObject`.'
      );
    }

    if (!stringBuiltInOperation) {
      throw new Error(
        'Parameter `stringBuiltInOperation` is required when calling `partialUpdateObject`.'
      );
    }

    if (createIfNotExists !== undefined) {
      queryParameters.createIfNotExists = createIfNotExists.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
      data: stringBuiltInOperation,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Remove a userID and its associated data from the multi-clusters. Upon success, the response is 200 OK and a task is created to remove the userID data and mapping.
   *
   * @summary Remove userID.
   * @param removeUserId - The removeUserId object.
   * @param removeUserId.userID - UserID to assign.
   */
  removeUserId({ userID }: RemoveUserIdProps): Promise<RemoveUserIdResponse> {
    const path = '/1/clusters/mapping/{userID}'.replace(
      '{userID}',
      encodeURIComponent(String(userID))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!userID) {
      throw new Error(
        'Parameter `userID` is required when calling `removeUserId`.'
      );
    }

    const request: Request = {
      method: 'DELETE',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Replace all allowed sources.
   *
   * @summary Replace all allowed sources.
   * @param replaceSources - The replaceSources object.
   * @param replaceSources.source - The sources to allow.
   */
  replaceSources({
    source,
  }: ReplaceSourcesProps): Promise<ReplaceSourceResponse> {
    const path = '/1/security/sources';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!source) {
      throw new Error(
        'Parameter `source` is required when calling `replaceSources`.'
      );
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: source,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Restore a deleted API key, along with its associated rights.
   *
   * @summary Restore an API key.
   * @param restoreApiKey - The restoreApiKey object.
   * @param restoreApiKey.key - API Key string.
   */
  restoreApiKey({ key }: RestoreApiKeyProps): Promise<AddApiKeyResponse> {
    const path = '/1/keys/{key}/restore'.replace(
      '{key}',
      encodeURIComponent(String(key))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!key) {
      throw new Error(
        'Parameter `key` is required when calling `restoreApiKey`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Add an object to the index, automatically assigning it an object ID.
   *
   * @summary Add an object to the index.
   * @param saveObject - The saveObject object.
   * @param saveObject.indexName - The index in which to perform the request.
   * @param saveObject.body - The Algolia record.
   */
  saveObject({
    indexName,
    body,
  }: SaveObjectProps): Promise<SaveObjectResponse> {
    const path = '/1/indexes/{indexName}'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `saveObject`.'
      );
    }

    if (!body) {
      throw new Error(
        'Parameter `body` is required when calling `saveObject`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: body,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Create or update the Rule with the specified objectID.
   *
   * @summary Save/Update a rule.
   * @param saveRule - The saveRule object.
   * @param saveRule.indexName - The index in which to perform the request.
   * @param saveRule.objectID - Unique identifier of an object.
   * @param saveRule.rule - The rule object.
   * @param saveRule.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  saveRule({
    indexName,
    objectID,
    rule,
    forwardToReplicas,
  }: SaveRuleProps): Promise<UpdatedRuleResponse> {
    const path = '/1/indexes/{indexName}/rules/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `saveRule`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `saveRule`.'
      );
    }

    if (!rule) {
      throw new Error('Parameter `rule` is required when calling `saveRule`.');
    }

    if (!rule.objectID) {
      throw new Error(
        'Parameter `rule.objectID` is required when calling `saveRule`.'
      );
    }
    if (!rule.consequence) {
      throw new Error(
        'Parameter `rule.consequence` is required when calling `saveRule`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: rule,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Create a new synonym object or update the existing synonym object with the given object ID.
   *
   * @summary Save synonym.
   * @param saveSynonym - The saveSynonym object.
   * @param saveSynonym.indexName - The index in which to perform the request.
   * @param saveSynonym.objectID - Unique identifier of an object.
   * @param saveSynonym.synonymHit - The synonymHit object.
   * @param saveSynonym.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  saveSynonym({
    indexName,
    objectID,
    synonymHit,
    forwardToReplicas,
  }: SaveSynonymProps): Promise<SaveSynonymResponse> {
    const path = '/1/indexes/{indexName}/synonyms/{objectID}'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{objectID}', encodeURIComponent(String(objectID)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `saveSynonym`.'
      );
    }

    if (!objectID) {
      throw new Error(
        'Parameter `objectID` is required when calling `saveSynonym`.'
      );
    }

    if (!synonymHit) {
      throw new Error(
        'Parameter `synonymHit` is required when calling `saveSynonym`.'
      );
    }

    if (!synonymHit.objectID) {
      throw new Error(
        'Parameter `synonymHit.objectID` is required when calling `saveSynonym`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: synonymHit,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Create/update multiple synonym objects at once, potentially replacing the entire list of synonyms if replaceExistingSynonyms is true.
   *
   * @summary Save a batch of synonyms.
   * @param saveSynonyms - The saveSynonyms object.
   * @param saveSynonyms.indexName - The index in which to perform the request.
   * @param saveSynonyms.synonymHit - The synonymHit object.
   * @param saveSynonyms.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   * @param saveSynonyms.replaceExistingSynonyms - Replace all synonyms of the index with the ones sent with this request.
   */
  saveSynonyms({
    indexName,
    synonymHit,
    forwardToReplicas,
    replaceExistingSynonyms,
  }: SaveSynonymsProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/synonyms/batch'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `saveSynonyms`.'
      );
    }

    if (!synonymHit) {
      throw new Error(
        'Parameter `synonymHit` is required when calling `saveSynonyms`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    if (replaceExistingSynonyms !== undefined) {
      queryParameters.replaceExistingSynonyms =
        replaceExistingSynonyms.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
      data: synonymHit,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Get search results.
   *
   * @summary Get search results.
   * @param search - The search object.
   * @param search.indexName - The index in which to perform the request.
   * @param search.searchParams - The searchParams object.
   */
  search({ indexName, searchParams }: SearchProps): Promise<SearchResponse> {
    const path = '/1/indexes/{indexName}/query'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `search`.'
      );
    }

    if (!searchParams) {
      throw new Error(
        'Parameter `searchParams` is required when calling `search`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Search the dictionary entries.
   *
   * @summary Search the dictionary entries.
   * @param searchDictionaryEntries - The searchDictionaryEntries object.
   * @param searchDictionaryEntries.dictionaryName - The dictionary to search in.
   * @param searchDictionaryEntries.searchDictionaryEntries - The searchDictionaryEntries object.
   */
  searchDictionaryEntries({
    dictionaryName,
    searchDictionaryEntries,
  }: SearchDictionaryEntriesProps): Promise<UpdatedAtResponse> {
    const path = '/1/dictionaries/{dictionaryName}/search'.replace(
      '{dictionaryName}',
      encodeURIComponent(String(dictionaryName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!dictionaryName) {
      throw new Error(
        'Parameter `dictionaryName` is required when calling `searchDictionaryEntries`.'
      );
    }

    if (!searchDictionaryEntries) {
      throw new Error(
        'Parameter `searchDictionaryEntries` is required when calling `searchDictionaryEntries`.'
      );
    }

    if (!searchDictionaryEntries.query) {
      throw new Error(
        'Parameter `searchDictionaryEntries.query` is required when calling `searchDictionaryEntries`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchDictionaryEntries,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Search for values of a given facet, optionally restricting the returned values to those contained in objects matching other search criteria.
   *
   * @summary Search for values of a given facet.
   * @param searchForFacetValues - The searchForFacetValues object.
   * @param searchForFacetValues.indexName - The index in which to perform the request.
   * @param searchForFacetValues.facetName - The facet name.
   * @param searchForFacetValues.searchForFacetValuesRequest - The searchForFacetValuesRequest object.
   */
  searchForFacetValues({
    indexName,
    facetName,
    searchForFacetValuesRequest,
  }: SearchForFacetValuesProps): Promise<SearchForFacetValuesResponse> {
    const path = '/1/indexes/{indexName}/facets/{facetName}/query'
      .replace('{indexName}', encodeURIComponent(String(indexName)))
      .replace('{facetName}', encodeURIComponent(String(facetName)));
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `searchForFacetValues`.'
      );
    }

    if (!facetName) {
      throw new Error(
        'Parameter `facetName` is required when calling `searchForFacetValues`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchForFacetValuesRequest,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Search for rules matching various criteria.
   *
   * @summary Search for rules.
   * @param searchRules - The searchRules object.
   * @param searchRules.indexName - The index in which to perform the request.
   * @param searchRules.searchRulesParams - The searchRulesParams object.
   */
  searchRules({
    indexName,
    searchRulesParams,
  }: SearchRulesProps): Promise<SearchRulesResponse> {
    const path = '/1/indexes/{indexName}/rules/search'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `searchRules`.'
      );
    }

    if (!searchRulesParams) {
      throw new Error(
        'Parameter `searchRulesParams` is required when calling `searchRules`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchRulesParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Search or browse all synonyms, optionally filtering them by type.
   *
   * @summary Get all synonyms that match a query.
   * @param searchSynonyms - The searchSynonyms object.
   * @param searchSynonyms.indexName - The index in which to perform the request.
   * @param searchSynonyms.query - Search for specific synonyms matching this string.
   * @param searchSynonyms.type - Only search for specific types of synonyms.
   * @param searchSynonyms.page - Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   * @param searchSynonyms.hitsPerPage - Maximum number of objects to retrieve.
   */
  searchSynonyms({
    indexName,
    query,
    type,
    page,
    hitsPerPage,
  }: SearchSynonymsProps): Promise<SearchSynonymsResponse> {
    const path = '/1/indexes/{indexName}/synonyms/search'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `searchSynonyms`.'
      );
    }

    if (query !== undefined) {
      queryParameters.query = query.toString();
    }

    if (type !== undefined) {
      queryParameters.type = type.toString();
    }

    if (page !== undefined) {
      queryParameters.page = page.toString();
    }

    if (hitsPerPage !== undefined) {
      queryParameters.hitsPerPage = hitsPerPage.toString();
    }

    const request: Request = {
      method: 'POST',
      path,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Search for userIDs. The data returned will usually be a few seconds behind real time, because userID usage may take up to a few seconds propagate to the different clusters. To keep updates moving quickly, the index of userIDs isn\'t built synchronously with the mapping. Instead, the index is built once every 12h, at the same time as the update of userID usage. For example, when you perform a modification like adding or moving a userID, the search will report an outdated value until the next rebuild of the mapping, which takes place every 12h. Upon success, the response is 200 OK and contains the following userIDs data.
   *
   * @summary Search userID.
   * @param searchUserIdsParams - The searchUserIdsParams object.
   */
  searchUserIds(
    searchUserIdsParams: SearchUserIdsParams
  ): Promise<SearchUserIdsResponse> {
    const path = '/1/clusters/mapping/search';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!searchUserIdsParams) {
      throw new Error(
        'Parameter `searchUserIdsParams` is required when calling `searchUserIds`.'
      );
    }

    if (!searchUserIdsParams.query) {
      throw new Error(
        'Parameter `searchUserIdsParams.query` is required when calling `searchUserIds`.'
      );
    }

    const request: Request = {
      method: 'POST',
      path,
      data: searchUserIdsParams,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Set dictionary settings.
   *
   * @summary Set dictionary settings.
   * @param dictionarySettingsRequest - The dictionarySettingsRequest object.
   */
  setDictionarySettings(
    dictionarySettingsRequest: DictionarySettingsRequest
  ): Promise<UpdatedAtResponse> {
    const path = '/1/dictionaries/*/settings';
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!dictionarySettingsRequest) {
      throw new Error(
        'Parameter `dictionarySettingsRequest` is required when calling `setDictionarySettings`.'
      );
    }

    if (!dictionarySettingsRequest.disableStandardEntries) {
      throw new Error(
        'Parameter `dictionarySettingsRequest.disableStandardEntries` is required when calling `setDictionarySettings`.'
      );
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: dictionarySettingsRequest,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Update settings of a given indexName. Only specified settings are overridden; unspecified settings are left unchanged. Specifying null for a setting resets it to its default value.
   *
   * @summary Update settings of a given indexName.
   * @param setSettings - The setSettings object.
   * @param setSettings.indexName - The index in which to perform the request.
   * @param setSettings.indexSettings - The indexSettings object.
   * @param setSettings.forwardToReplicas - When true, changes are also propagated to replicas of the given indexName.
   */
  setSettings({
    indexName,
    indexSettings,
    forwardToReplicas,
  }: SetSettingsProps): Promise<UpdatedAtResponse> {
    const path = '/1/indexes/{indexName}/settings'.replace(
      '{indexName}',
      encodeURIComponent(String(indexName))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!indexName) {
      throw new Error(
        'Parameter `indexName` is required when calling `setSettings`.'
      );
    }

    if (!indexSettings) {
      throw new Error(
        'Parameter `indexSettings` is required when calling `setSettings`.'
      );
    }

    if (forwardToReplicas !== undefined) {
      queryParameters.forwardToReplicas = forwardToReplicas.toString();
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: indexSettings,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
  /**
   * Replace every permission of an existing API key.
   *
   * @summary Update an API key.
   * @param updateApiKey - The updateApiKey object.
   * @param updateApiKey.key - API Key string.
   * @param updateApiKey.apiKey - The apiKey object.
   */
  updateApiKey({
    key,
    apiKey,
  }: UpdateApiKeyProps): Promise<UpdateApiKeyResponse> {
    const path = '/1/keys/{key}'.replace(
      '{key}',
      encodeURIComponent(String(key))
    );
    const headers: Headers = { Accept: 'application/json' };
    const queryParameters: Record<string, string> = {};

    if (!key) {
      throw new Error(
        'Parameter `key` is required when calling `updateApiKey`.'
      );
    }

    if (!apiKey) {
      throw new Error(
        'Parameter `apiKey` is required when calling `updateApiKey`.'
      );
    }

    if (!apiKey.acl) {
      throw new Error(
        'Parameter `apiKey.acl` is required when calling `updateApiKey`.'
      );
    }

    const request: Request = {
      method: 'PUT',
      path,
      data: apiKey,
    };

    const requestOptions: RequestOptions = {
      headers,
      queryParameters,
    };

    return this.sendRequest(request, requestOptions);
  }
}

export type AddOrUpdateObjectProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  /**
   * The Algolia object.
   */
  body: Record<string, any>;
};

export type AssignUserIdProps = {
  /**
   * UserID to assign.
   */
  xAlgoliaUserID: string;
  assignUserIdParams: AssignUserIdParams;
};

export type BatchProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  batchWriteParams: BatchWriteParams;
};

export type BatchAssignUserIdsProps = {
  /**
   * UserID to assign.
   */
  xAlgoliaUserID: string;
  batchAssignUserIdsParams: BatchAssignUserIdsParams;
};

export type BatchDictionaryEntriesProps = {
  /**
   * The dictionary to search in.
   */
  dictionaryName: 'compounds' | 'plurals' | 'stopwords';
  batchDictionaryEntries: BatchDictionaryEntries;
};

export type BatchRulesProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  rule: Rule[];
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
  /**
   * When true, existing Rules are cleared before adding this batch. When false, existing Rules are kept.
   */
  clearExistingRules?: boolean;
};

export type BrowseProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  browseRequest?: BrowseRequest;
};

export type ClearAllSynonymsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type ClearObjectsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
};

export type ClearRulesProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type DeleteApiKeyProps = {
  /**
   * API Key string.
   */
  key: string;
};

export type DeleteByProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  searchParams: SearchParams;
};

export type DeleteIndexProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
};

export type DeleteObjectProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
};

export type DeleteRuleProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type DeleteSourceProps = {
  /**
   * The IP range of the source.
   */
  source: string;
};

export type DeleteSynonymProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type GetApiKeyProps = {
  /**
   * API Key string.
   */
  key: string;
};

export type GetLogsProps = {
  /**
   * First entry to retrieve (zero-based). Log entries are sorted by decreasing date, therefore 0 designates the most recent log entry.
   */
  offset?: number;
  /**
   * Maximum number of entries to retrieve. The maximum allowed value is 1000.
   */
  length?: number;
  /**
   * Index for which log entries should be retrieved. When omitted, log entries are retrieved across all indices.
   */
  indexName?: string;
  /**
   * Type of log entries to retrieve. When omitted, all log entries are retrieved.
   */
  type?: 'all' | 'build' | 'error' | 'query';
};

export type GetObjectProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  /**
   * List of attributes to retrieve. If not specified, all retrievable attributes are returned.
   */
  attributesToRetrieve?: string[];
};

export type GetRuleProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
};

export type GetSettingsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
};

export type GetSynonymProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
};

export type GetTaskProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an task. Numeric value (up to 64bits).
   */
  taskID: number;
};

export type GetUserIdProps = {
  /**
   * UserID to assign.
   */
  userID: string;
};

export type HasPendingMappingsProps = {
  /**
   * Whether to get clusters or not.
   */
  getClusters?: boolean;
};

export type ListIndicesProps = {
  /**
   * Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   */
  page?: number;
};

export type ListUserIdsProps = {
  /**
   * Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   */
  page?: number;
  /**
   * Maximum number of objects to retrieve.
   */
  hitsPerPage?: number;
};

export type OperationIndexProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  operationIndexParams: OperationIndexParams;
};

export type PartialUpdateObjectProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  /**
   * List of attributes to update.
   */
  stringBuiltInOperation: Array<{ [key: string]: BuiltInOperation | string }>;
  /**
   * Creates the record if it does not exist yet.
   */
  createIfNotExists?: boolean;
};

export type RemoveUserIdProps = {
  /**
   * UserID to assign.
   */
  userID: string;
};

export type ReplaceSourcesProps = {
  /**
   * The sources to allow.
   */
  source: Source[];
};

export type RestoreApiKeyProps = {
  /**
   * API Key string.
   */
  key: string;
};

export type SaveObjectProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * The Algolia record.
   */
  body: Record<string, any>;
};

export type SaveRuleProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  rule: Rule;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type SaveSynonymProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Unique identifier of an object.
   */
  objectID: string;
  synonymHit: SynonymHit;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type SaveSynonymsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  synonymHit: SynonymHit[];
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
  /**
   * Replace all synonyms of the index with the ones sent with this request.
   */
  replaceExistingSynonyms?: boolean;
};

export type SearchProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  searchParams: SearchParams;
};

export type SearchDictionaryEntriesProps = {
  /**
   * The dictionary to search in.
   */
  dictionaryName: 'compounds' | 'plurals' | 'stopwords';
  searchDictionaryEntries: SearchDictionaryEntries;
};

export type SearchForFacetValuesProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * The facet name.
   */
  facetName: string;
  searchForFacetValuesRequest?: SearchForFacetValuesRequest;
};

export type SearchRulesProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  searchRulesParams: SearchRulesParams;
};

export type SearchSynonymsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  /**
   * Search for specific synonyms matching this string.
   */
  query?: string;
  /**
   * Only search for specific types of synonyms.
   */
  type?: SynonymType;
  /**
   * Requested page (zero-based). When specified, will retrieve a specific page; the page size is implicitly set to 100. When null, will retrieve all indices (no pagination).
   */
  page?: number;
  /**
   * Maximum number of objects to retrieve.
   */
  hitsPerPage?: number;
};

export type SetSettingsProps = {
  /**
   * The index in which to perform the request.
   */
  indexName: string;
  indexSettings: IndexSettings;
  /**
   * When true, changes are also propagated to replicas of the given indexName.
   */
  forwardToReplicas?: boolean;
};

export type UpdateApiKeyProps = {
  /**
   * API Key string.
   */
  key: string;
  apiKey: ApiKey;
};
